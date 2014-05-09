
jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToSmartphone.RenderingManager');
	MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_isPublishStaticPage			: false
		// ,_wasAccessed						: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		// ,initialize: function(instances) {
		,initialize: function() {
			var thisObj = this;
			// this._instances = instances;

			var DataManager = new MYNAMESPACE.modules.library_page.edit.DataManager();
			var AlertModalManager = new MYNAMESPACE.modules.AlertModalManager();
			this._instances = {
				'Util'									: new MYNAMESPACE.modules.helper.Util(),
				'DataManager'							: DataManager,
				'AlertModalManager'						: AlertModalManager,
				'PreviewAreaManager'					: new MYNAMESPACE.modules.library_page.edit.PreviewAreaManager(DataManager),
				'PropertyAreaManager'					: new MYNAMESPACE.modules.library_page.edit.PropertyAreaManager(DataManager, AlertModalManager),
				'LayoutManager'							: new MYNAMESPACE.modules.library_page.edit.LayoutManager(),
				'ToolbarManager'						: new MYNAMESPACE.modules.library_page.edit.ToolbarManager(),
				'OutlineDataManager' 					: new MYNAMESPACE.modules.outline.edit.DataManager()
			}
			_.bindAll(
				this
				,'render'
				,'onCompleteRenderHandler'
				,'publishConcretePage'
				,'onDropToolbarElemHandler'
				,'onDropPreviewAreaElemHandler'
				,'onCompleteRefreshAllElementStyleHandler'
				,'setEvent'
			);
		}

		// ,_tmpId : ''
		// ,_tmpFlg : false
		/*
		 * 本番ページを書きだすメソッド
		 * @param	pageId					書きだすページID
		 * @param	isPublishStaticPage		true===静的ページ書き出し
		 * @param	residenceId				option(書き出すページが属している物件ID)
		 * @return	void
		 */
		,render: function(pageId, isPublishStaticPage, residenceId) {
			// console.log('レンダリング :: pageId = ' + pageId);
			var thisObj = this;
			// thisObj._tmpId = pageId;
			thisObj._isPublishStaticPage = isPublishStaticPage;
			// if (thisObj._wasAccessed === true) {
			// 	thisObj._instances['PreviewAreaManager']					= new MYNAMESPACE.modules.library_page.edit.PreviewAreaManager(thisObj._instances['DataManager']);
			// }
			// thisObj._wasAccessed = true;

			if (pageId) {
				var prop = thisObj._instances['DataManager'].getProp();
				if (prop['isLibraryElementPage'] === true) {
					thisObj._instances['DataManager'].replaceProp('smartphoneLibraryId', pageId);
				} else {
					thisObj._instances['DataManager'].replaceProp('pageId', pageId);
				}
			}
			// $('#iphone5').tinyscrollbar();
			var compCount = 2;
			var count = 0;
			var compMethod = function(event) {
				// console.log('event.type = ' + event.type);
				if (++count === compCount) {
					thisObj._instances['Util'].setStatus(true, 'データ取得完了', 500);
					// console.log('初期データ取得完了');

					$(thisObj._instances['DataManager'])
						.off('onCompleteRequestElementList')	// エレメントデータ読み込み完了
						.off('onErrorRequestElementList')		// エレメントデータ読み込みエラー
					$(thisObj._instances['OutlineDataManager'])
						.off('onCompleteGetFieldList')	// エレメントデータ読み込み完了
						.off('onErrorGetFieldList')	// エレメントデータ読み込み完了

					var targetElementData = thisObj._instances['DataManager'].getChildElementDataObj('spContent');
					// console.log(targetElementData);
					if (0 < targetElementData.length) {
						// console.log('PreviewAreaManagerのレンダリング開始');
						thisObj._instances['PreviewAreaManager'].reset();
						thisObj._instances['PreviewAreaManager'].render('spContent', null, true);
					} else {
						// console.log('PreviewAreaManagerの全てのエレメントのスタイルセット開始');
						thisObj._instances['PreviewAreaManager'].refreshAllElementStyle();
						thisObj._instances['DataManager'].setEvent(true);
						thisObj.onCompleteRenderHandler();
					}
				}
			}
			// if (thisObj._tmpFlg === false) {
				// thisObj._tmpFlg = true;
				$(thisObj._instances['DataManager'])
					.on('onCompleteRequestElementList', compMethod)		// エレメントデータ読み込み完了
					.on('onErrorRequestElementList', compMethod)	// エレメントデータ読み込みエラー


				$(thisObj._instances['OutlineDataManager'])
					.on('onCompleteGetFieldList', function(event, data) {
						thisObj._instances['DataManager'].setFRK(data);
						compMethod(event);
					})
					.on('onErrorGetFieldList', compMethod)
			// }

			thisObj._instances['Util'].setStatus(true, 'データ取得中・・・');
			thisObj._instances['DataManager'].requestElementList();
			thisObj._instances['OutlineDataManager'].getFieldList(residenceId);
		}

		/*
		 * プレビューエリアのレンダリングがスタイルの適用を含めて完了した際にコールされるイベントハンドラ
		 * @param	void
		 * @return	void
		 */
		,onCompleteRenderHandler: function() {
			var thisObj = this;
			// console.log('初期処理完了 :: thisObj._tmpId = ' + thisObj._tmpId);
			thisObj._instances['LayoutManager'].onResizeWindow();
			$('#spContent').find('[data-item-name="Library"] *').removeClass('editable');
			$(thisObj).trigger('onCompleteRender');
			// console.log('プレビューエリアのレンダリングがスタイルの適用を含めて完了した');
			thisObj._instances['PreviewAreaManager'].setSortableInstance();
			// thisObj._instances['DataManager'].executelList();

			/*
			if (isTest === true) {
				$(TestInsert).on('onCompleteTestSerialInsert', function(event) {
					// TestDelete.testSerialDelete();
				});
				// TestInsert.testInsert();
				// TestInsert.testSerialInsert();
				// TestDelete.testDelete('id-1363858229158');
				// TestDelete.testSerialDelete();
				TestReorder.testReorder('id-1363861032105', 'spContent', 1);
			}
			*/
		}

		/*
		 * 本番ページ書き出しメソッド
		 * @param	recordId				ページID
		 * @param	source				ページのソース
		 * @return	void
		 */
		,publishConcretePage: function(recordId, companyId, residenceId, path, title, source, callback) {
			var thisObj = this;
			// console.log('RenderingManager :: publishConcretePage :: recordId = ' + recordId + ', companyId = ' + companyId + ', residenceId = ' + residenceId + ', path = ' + path + ', title = ' + title);
			var prop = thisObj._instances['DataManager'].getProp();
			$(thisObj._instances['DataManager'])
				.on('onCompletePublishConcretePage', function(event, data) {
				// $(thisObj._instances['DataManager']).on('onCompletePublishConcretePage', function(event, recordId) {
					$(thisObj._instances['DataManager'])
						.off('onCompletePublishConcretePage')
						.off('onErrorPublishConcretePage');
					// console.log('data');
					// console.log(data);
					callback(event, data);
					// callback(event, recordId);
				})
				.on('onErrorPublishConcretePage', function(event, data) {
				// $(thisObj._instances['DataManager']).on('onCompletePublishConcretePage', function(event, recordId) {
					$(thisObj._instances['DataManager'])
						.off('onCompletePublishConcretePage')
						.off('onErrorPublishConcretePage');
				});
			thisObj._instances['DataManager'].publishConcretePage(recordId, companyId, residenceId, prop['userId'], path, title, source);
		}

		/*
		 * ツールバーのエレメントがプレビューエリアにドロップされた際にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	itemName		プレビューエリアにドロップされたエレメント名
		 * @param	elem			プレビューエリアにドロップされたエレメント
		 * @return	void
		 */
		,onDropToolbarElemHandler: function(event, itemName, elem) {
			var thisObj = this;
			var droppedElement = elem;
			var elementId = 'id-' + new Date().getTime();
			var parent = elem.parent();
			var parentId = parent.attr('id');
			var order = 0;
			parent.find('>*').each(function(i) {
				if ($(this).get(0) === elem.get(0)) {
					order = i + 1;
					return false;
				}
			});
			// var smartphoneLibraryId = thisObj._instances['DataManager'].getProp()['smartphoneLibraryId'];
			droppedElement.remove()

			if (itemName === 'Library') {
				var libraryId = elem.attr('data-record-id') - 0;
				thisObj._instances['DataManager'].insertElement(elementId, parentId, libraryId, itemName, order);
			} else {
				var smartphoneLibraryId = thisObj._instances['DataManager'].getProp()['smartphoneLibraryId'];
				thisObj._instances['DataManager'].insertElement(elementId, parentId, (smartphoneLibraryId === '' ? undefined : smartphoneLibraryId), itemName, order);
			}
		}

		/*
		 * プレビューエリアに配置しているエレメントがプレビューエリアにドロップされた際にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	itemName		プレビューエリアにドロップされたエレメント名
		 * @param	elem			プレビューエリアにドロップされたエレメント
		 * @return	void
		 */
		,onDropPreviewAreaElemHandler: function(event, itemName, elem) {
			var thisObj = this;
			var reorderElementId = elem.attr('id');
			var newParent = elem.parent();
			var newParentId = newParent.attr('id');
			var newOrder = newParent.children().index(elem) + 1;
			$('#' + reorderElementId)
				.css(
					{
						'zIndex'	: 1,
						'left'		: 0,
						'top'		: 0
					}
				);
			thisObj._instances['DataManager'].reOrderData(reorderElementId, newParentId, newOrder);
		}

		/*
		 * プレビューエリアに配置した全てのエレメントのスタイルがセットされた際にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onCompleteRefreshAllElementStyleHandler: function(event) {
			var thisObj = this;
			// console.log('プレビューエリアに配置した全てのエレメントへのスタイルの適用が完了した');
			// thisObj._instances['PreviewAreaManager'].onCompleteRefreshStyle();
			thisObj._instances['LayoutManager'].onResizeWindow();

			setTimeout(
				function(event2) {
					$('#spContent').find('[data-item-name="Library"] *').removeClass('editable');
				},
				500
			);
			thisObj._instances['DataManager'].setEvent(true);
			thisObj.onCompleteRenderHandler();
		}

		,_count : 0
		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				$(thisObj._instances['PreviewAreaManager'])
					.on('onDropToolbarElem', thisObj.onDropToolbarElemHandler)	// ツールバーから新しいエレメントが追加された
					.on('onDropPreviewAreaElem', thisObj.onDropPreviewAreaElemHandler)	// プレビューエリア内のエレメントが並び替えられた
					.on('onClickEditableElement', function(event, event2, elementId) {	// エレメントがクリックされた
						thisObj._instances['PropertyAreaManager'].render(elementId);
					})
					.on('onCompleteAllAddElement', function(event) {	// 全てのエレメントをプレビューエリアに配置した
						console.log('全てのエレメントをプレビューエリアに配置した');
						thisObj._instances['PreviewAreaManager'].mergeElementData();
						thisObj._instances['PreviewAreaManager'].refreshAllElementStyle(thisObj._isPublishStaticPage);
					})
					.on('onCompleteRefreshAllElementStyle', thisObj.onCompleteRefreshAllElementStyleHandler)	// プレビューエリアに配置した全てのエレメントへのスタイルの適用が完了した
					.on('onClickBgBtn', function(event, event2) {	// 背景ボタンがクリックされた
						thisObj._instances['PropertyAreaManager'].render('displayArea');
					})
					.on('onCompleteAsyncMethod', function(event, elementId, categoryName, property) {	// プロパティエリアの「削除」ボタンがクリックされた
						thisObj._instances['PropertyAreaManager'].refreshCurrentVal(elementId, categoryName, property);
					});

				$(thisObj._instances['PropertyAreaManager'])
					.on('onClickDeleteBtn', function(event, elementId) {	// プロパティエリアの「削除」ボタンがクリックされた
						thisObj._instances['DataManager'].deleteElement(elementId);
					})
					.on('onCompleteRefreshStyle', function(event, elementId, componentName, property) {	// プロパティエリアの「削除」ボタンがクリックされた
						thisObj._instances['PreviewAreaManager'].refreshStyle(elementId, componentName);
					});

				// $(thisObj._instances['LayoutManager'])
				// 	.on('onCompleteResize', function(event) {
				// 		thisObj._instances['PreviewAreaManager'].onCompleteRefreshStyle(event);
				// 	});

				$(thisObj._instances['DataManager'])
					// Element編集
					.on('onInitUpdateElement', function(event, elementId, componentName, property) {
						thisObj._instances['Util'].setStatus(true, 'パーツ編集中・・・');
					})
					.on('onCompleteUpdateElement', function(event) {
						thisObj._instances['Util'].setStatus(true, 'パーツ編集完了', 500);
					})
					.on('onErrorUpdateElement', function(event) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'パーツ編集失敗');
						thisObj._instances['Util'].showCurtain('パーツの編集に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})

					// ページ編集
					.on('onInitUpdateLibraray_PageProperty', function(event, elementId, componentName) {
						thisObj._instances['Util'].setStatus(true, 'データ保存中・・・');
						thisObj._instances['PreviewAreaManager'].refreshStyle(elementId, componentName);
					})
					.on('onCompleteUpdateLibraray_PageProperty', function(event) {
						thisObj._instances['Util'].setStatus(true, 'データ保存完了', 500);
						thisObj._instances['PreviewAreaManager'].refreshStyle('displayArea');
						// thisObj._instances['PreviewAreaManager'].refreshStyle(elementId, componentName);
					})
					.on('onErrorUpdateLibraray_PageProperty', function(event) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'データ保存失敗');
						thisObj._instances['Util'].showCurtain('データの保存に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})

					// Element追加
					.on('onInitInsertElement', function(event, elementId, parentId, itemName, order, property) {
						thisObj._instances['Util'].setStatus(true, 'パーツ追加中・・・');
						// thisObj._instances['PreviewAreaManager'].insert(elementId, parentId, itemName, order, property);
						thisObj._instances['PreviewAreaManager'].insert(elementId, parentId, itemName, order);
					})
					.on('onInitInsertLibraryElementToPage', function(event, elementId, parentId, itemName, order, property) {
						thisObj._instances['Util'].setStatus(true, 'パーツ追加中・・・');
						console.log('ライブラリ追加')
						// thisObj._instances['PreviewAreaManager'].render('spContent');
					})
					.on('onCompleteInsertElement', function(event, elementId) {
						thisObj._instances['Util'].setStatus(true, 'パーツ追加完了', 500);
						// thisObj.onCompleteRenderHandler();
						thisObj._instances['PreviewAreaManager'].refreshAllElementStyle();
					})
					.on('onCompleteInsertLibraryElementToPage', function(event) {
						console.log('ライブラリがドロップされた');
						// thisObj._instances['Util'].hideCurtain();
			var targetElementData = thisObj._instances['DataManager'].getChildElementDataObj('spContent');
			console.log('--------');
			console.log('ライブラリがドロップされた');
			console.log(targetElementData);
			console.log(targetElementData.length);
			console.log('--------');
						thisObj._instances['Util'].setStatus(true, 'パーツ追加完了', 500);
						if (thisObj._count === 0) {
							// thisObj._count ++;
						thisObj._instances['PreviewAreaManager'].render('spContent', null, true);
						}
					})
					.on('onErrorInsertElement', function(event, elementId) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'データ保存失敗');
						thisObj._instances['Util'].showCurtain('パーツの追加に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})

					// Element並び替え
					.on('onInitReorderElement', function(event, elementId) {
						thisObj._instances['Util'].setStatus(true, 'パーツ並び替え中・・・');
					})
					.on('onCompleteReorderElement', function(event, elementId) {
						thisObj._instances['Util'].setStatus(true, 'パーツ並び替え完了', 500);
					})
					.on('onErrorReorderElement', function(event, elementId) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'パーツ並び替え失敗');
						thisObj._instances['Util'].showCurtain('パーツの並び替えに失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})

					// Element削除
					.on('onInitDeleteElement', function(event, elementId) {
						thisObj._instances['Util'].setStatus(true, 'データ削除中・・・');
						thisObj._instances['PreviewAreaManager'].deleteElem(elementId);
						thisObj._instances['PropertyAreaManager'].deleteElem(elementId);
					})
					.on('onCompleteDeleteElement', function(event, elementId) {
						thisObj._instances['Util'].setStatus(true, 'データ削除完了', 500);
						thisObj._instances['LayoutManager'].onResizeWindow();
					})
					.on('onErrorDeleteElement', function(event, elementId) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'データ削除失敗');
						thisObj._instances['Util'].showCurtain('パーツの削除に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})
					// .on('onCompleteRequestPageList', function(event) {
					// 	thisObj._instances['Util'].setStatus(true, 'データ取得完了', 500);
					// })

					// TableElement編集
					.on('onInitEditTableElement', function(event, elementId, componentName) {
						thisObj._instances['Util'].setStatus(true, 'テーブルデータ保存中・・・');
					})
					.on('onCompleteEditTableElement', function(event) {
						thisObj._instances['Util'].setStatus(true, 'テーブルデータ保存完了', 500);
						thisObj._instances['PreviewAreaManager'].refreshAllElementStyle();
					})
					.on('onErrorEditTableElement', function(event) {
						thisObj._instances['DataManager'].resetQueue();
						thisObj._instances['Util'].setStatus(true, 'テーブルデータ保存失敗');
						thisObj._instances['Util'].showCurtain('テーブルの編集に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
					})
				thisObj._instances['PreviewAreaManager'].setEvent(true);
				thisObj._instances['LayoutManager'].setOnceEvent();
				thisObj._instances['LayoutManager'].setEvent(true);
				thisObj._instances['PropertyAreaManager'].setEvent(true);
				thisObj._instances['ToolbarManager'].setEvent(true);

				// $('body').on('click', '#previewArea', function(event) {
				// 	$('#spContent *').removeClass('now-edit');
				// 	thisObj._instances['PreviewAreaManager'].onCompleteRefreshStyle();
				// });

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				$(thisObj._instances['PreviewAreaManager'])
					.off('onDropToolbarElem')	// ツールバーから新しいエレメントが追加された
					.off('onDropPreviewAreaElem')	// プレビューエリア内のエレメントが並び替えられた
					.off('onClickEditableElement')
					.off('onCompleteAllAddElement')
					.off('onCompleteRefreshAllElementStyle')
					.off('onCompleteAsyncMethod');

				$(thisObj._instances['PropertyAreaManager'])
					.off('onClickDeleteBtn')
					.off('onCompleteRefreshStyle');

				$(thisObj._instances['LayoutManager'])
					.off('onCompleteResize');

				$(thisObj._instances['DataManager'])
					// Element編集
					.off('onInitUpdateElement')
					.off('onCompleteUpdateElement')
					.off('onErrorUpdateElement')

					// Element編集
					.off('onInitUpdateLibraray_PageProperty')
					.off('onCompleteUpdateLibraray_PageProperty')

					// Element追加
					.off('onInitInsertElement')
					.off('onCompleteInsertElement')
					.off('onCompleteInsertLibraryElementToPage')
					.off('onErrorInsertElement')

					// Element並び替え
					.off('onInitReorderElement')
					.off('onCompleteReorderElement')
					.off('onErrorReorderElement')

					// Element削除
					.off('onInitDeleteElement')
					.off('onCompleteDeleteElement')
					.off('onErrorDeleteElement')
					.off('onCompleteRequestPageList')
				thisObj._instances['PreviewAreaManager'].setEvent(false);
				thisObj._instances['LayoutManager'].setEvent(false);
				thisObj._instances['PropertyAreaManager'].setEvent(false);
				thisObj._instances['ToolbarManager'].setEvent(false);

				// $('body').off('click', '#previewArea');
			}
		}
	}
});
