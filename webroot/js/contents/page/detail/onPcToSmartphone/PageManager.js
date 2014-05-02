

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.outline.edit.PageManager');
	MYNAMESPACE.modules.outline.edit.PageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.outline.edit.PageManager.prototype = {
		_isEnabled						: false
		// ,_instances						: {}
		,_timers						: {}
		// ,_pageTitle						: {}
		,_hasSaveData					: false
		,_timerObj						: {}
		,_templateElements				: {}
		,_sortedElementObj				: {}
		,_currentVal					: {}
		,_isSortable					: false
		,_hasSaveData					: false
		,_isUpdateThrough				: false
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'setCurrentVal'
				,'onInitSortHandler'
				,'onCompleteSortHandler'
				,'setSortableInstance'
				,'getResidenceNum'
				,'onChangeResidenceText'
				,'onChangeCategoryNameText'
				,'onChangeItemText'
				,'onChangeFocus'
				,'onChangeFocusInputArea'
				,'releaseUpdateTask'
				,'onClickAddCategoryBtnHandler'
				,'onClickDelCategoryBtnHandler'
				,'onClickAddItemBtnHandler'
				,'onClickDelItemBtnHandler'
				,'setEmptyItem'
				,'setBtnState'
				,'checkDeletableCategory'
				,'checkDeletableItem'
				// ,'showFRK'
				// ,'showXML'
				,'replaceAllData'
				,'setEvent'



				/*
				,'insert'
				,'delete'
				,'update'
				,'onSortField'
				,'onClickVisibilityButton'
				,'onClickControllButton'
				,'onChangeText'
				,'onClickChangeResidenceNumBtn'
				*/

			);

			this._instances = {
				'DataManager'						: DataManager,
				'ChangeResidenceNumModalManager'	: new MYNAMESPACE.modules.ChangeResidenceNumModalManager()
			};
			this._currentVal = this.setCurrentVal(null, true);
			this._timerObj = {
				'forUpdate'		: {
					'timerId'		: null,
					'id'			: null,
					'eventType'		: null,
					'data'			: null
				},
				'forCheck'		: null
			}
			this._templateElements['emptyItem'] = _.template($('#empty-item-template').text());

			this.setEmptyItem($('dl.category > dd > ul'));
			this.setBtnState();
			this.setSortableInstance(true);
		}

		/*
		 * 並べ替え対象のエレメントがドラッグされた際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @param	ui			UIオブジェクト
		 * @return	void
		 */
		,onInitSortHandler: function(event, ui) {
			var thisObj = this;
			// if (thisObj._isSortable === false) {
			// 	return false;
			// }
		}

		/*
		 * 並べ替え対象のエレメントが並べ替えられた際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @param	ui			UIオブジェクト
		 * @return	void
		 */
		,onCompleteSortHandler: function(event, ui) {
			var thisObj = this;
			// if (thisObj._isSortable === false) {
			// 	return false;
			// }
			// console.log('並べ替えられた');
			// console.log(event.type);
			// console.log(ui.item);
			// console.log($(ui.item).find('input[type="hidden"][name="id"]').val());
			var targetElem = $(ui.item);
			var id = targetElem.find('input[type="hidden"][name="id"]').val();
			var parentUlElement = targetElem.closest('ul.connected-sortable');
			var categoryId = targetElem.closest('dl.category').attr('data-category-id');
			var order = parentUlElement.children().index(targetElem);
			if (thisObj._sortedElementObj['id_'+id] === undefined) {
				thisObj._sortedElementObj['id_'+id] = {
					'categoryId'		: undefined,
					'order'				: undefined
				}
			}
			console.log('並び替え開始');
			console.log('thisObj._sortedElementObj[id_' + id + '] =' + thisObj._sortedElementObj['id_'+id]);
			console.log('order =' + order);
			console.log('categoryId =' + categoryId);
			if (thisObj._sortedElementObj['id_'+id]['categoryId'] !== categoryId || thisObj._sortedElementObj['id_'+id]['order'] !== order) {
			// if (thisObj._sortedElementObj['id_'+id] !== order) {
				thisObj.setEvent(false);
				// thisObj._sortedElementObj['id_'+id] = order;
				thisObj._sortedElementObj['id_'+id] = {
					'categoryId'		: categoryId,
					'order'				: order
				}
				thisObj.setEmptyItem(parentUlElement);
				var data = [];
				console.log('id = ' + id + ', order = ' + order);
				$('#outline-container > .category').each(function(i) {
					var categoryElem = $(this);
					if (categoryElem.attr('data-category-id')) {
						data.push(
							{
								'id'						: categoryElem.attr('data-category-id'),
								'order'						: i + 1,
								'parent_category_id'		: 0,
							}
						);
						categoryElem.find('> dd > ul.connected-sortable > li').each(function(j) {
							var itemElem = $(this);
							if (itemElem.find('input[type="hidden"][name="id"]').val()) {
								data.push(
									{
										'id'						: itemElem.find('input[type="hidden"][name="id"]').val(),
										'order'						: j + 1,
										'parent_category_id'		: categoryElem.attr('data-category-id'),
									}
								);
							}
						});
					}
				});
				$(thisObj).trigger('onChangeOrder',
					[
						data,
						function(data) {
							console.log('並び替え完了');
							thisObj.setBtnState();
							thisObj.setEmptyItem($('dl.category > dd > ul'));
							thisObj.setEvent(true);
						}
					]
				);
			}
		}
		
		/*
		 * sortableクラスのインスタンス作成メソッド
		 * @param	void
		 * @return	void
		 */
		,setSortableInstance: function(isEnabled) {
		// ,setSortableInstance: function() {
			var thisObj = this;
			if (isEnabled === true) {
				$("#outline-container")
					.sortable ({
						cancel						: ".residence-title, .residence-title>*, .btn, input, textarea, .connected-soratble > li",
						placeholder					: "category-placeholder",
						tolerance					: "pointer",
						forcePlaceholderSize		: true,
						// start						: function(event, ui) {
						// 	var elem = $(ui.item);
						// },
						start						: thisObj.onInitSortHandler,
						update						: thisObj.onCompleteSortHandler
					})
				$("#outline-container .connected-sortable")
					.sortable({
						cancel						: "input, textarea, .empty-item",
						placeholder					: "placeholder",
						connectWith					: ".connected-sortable",
						forcePlaceholderSize		: true,
						// start						: function(event, ui) {
						// 	var elem = $(ui.item);
						// },
						start						: thisObj.onInitSortHandler,
						update						: thisObj.onCompleteSortHandler
					})
			} else {
				$("#outline-container").sortable("destroy");
				$("#outline-container .connected-sortable").sortable("destroy");
			}
		}
		
		/*
		 * 各アイテムのデフォルト値を保持しておくメソッド
		 * @param	element		アイテムのliエレメント
		 * @param	isFirst		true===初期値としてhiddenの値をセット。false===入力値をセット。
		 * @return	各アイテムのデフォルト値を保持したオブジェクト
		 */
		,setCurrentVal: function(element, isFirst) {
			var thisObj = this;
			var retObj = {};
			if (isFirst === true) {
				retObj['residence'] = {
					'name'		: $('input[type="hidden"][name="residenceName"]').val(),
					'num'		: $('input[type="hidden"][name="frkNum"]').val()
				}
				$('#outline-container dl.category').each(function(i) {
					var id				= $(this).attr('data-category-id');
					var categoryName	= $(this).find('input[name="category-name"]').val();
					var currentValKey	= 'id-' + id;
					retObj[currentValKey] = {
						'id'			: id,
						'key'			: categoryName
					}
				});
				$('#outline-container .category ul.connected-sortable > li').each(function(i) {
					var id				= $(this).find('input[type="hidden"][name="id"]').val();
					var isRequired		= $(this).find('input[type="hidden"][name="is-required"]').val();
					var frkIndex		= $(this).find('input[type="hidden"][name="frk-index"]').val();
					var key				= $(this).find('input[type="hidden"][name="key"]').val();
					var val				= $(this).find('input[type="hidden"][name="val"]').val();
					var currentValKey	= 'id-' + id;
					retObj[currentValKey] = {
						'id'			: id,
						'is_required'	: isRequired,
						'frk_index'		: frkIndex !== undefined ? frkIndex : '',
						'key'			: key,
						'val'			: val
					}
				});
			} else {
				element.each(function(i) {
					var id				= $(this).find('input[type="hidden"][name="id"]').val();
					var isRequired		= $(this).find('input[type="hidden"][name="is-required"]').val();
					var frkIndex		= $(this).find('input[type="text"][name="frk-index"]').val() ? $(this).find('input[type="text"][name="frk-index"]').val() : $(this).find('input[type="hidden"][name="frk-index"]').val();
					// var frkIndex		= 0 < $(this).find('input[type="text"][name="frk-index"]').length ? $(this).find('input[type="text"][name="frk_index"]').val() : $(this).find('input[type="hidden"][name="frk_index"]').val();
					var key				= $(this).find('textarea.key').val();
					var val				= $(this).find('textarea.val').val();
					var currentValKey	= 'id-' + id;
					retObj[currentValKey] = {
						'id'			: id,
						'is_required'	: isRequired,
						'frk_index'		: frkIndex !== undefined ? frkIndex : '',
						'key'			: key,
						'val'			: val
					}
				});
			}
			return retObj;
		}
		
		/*
		 * 物件番号を返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getResidenceNum: function() {
			var thisObj = this;
			return thisObj._currentVal['residence']['num'];
		}
		
		/*
		 * 物件番号が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeResidenceText: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var residenceName = $('input[type="text"][name="residence-name"]').val();
			var residenceNum = $('input[type="text"][name="frk-num"]').val();
			if (
				residenceName !== thisObj._currentVal['residence']['name'] ||
				residenceNum !== thisObj._currentVal['residence']['num']
			) {
				thisObj._currentVal['residence'] = {'name':residenceName, 'num':residenceNum};
				thisObj._hasSaveData = true;
			} else {
				return;
			}
			if (thisObj._hasSaveData === true) {
				thisObj.releaseUpdateTask('residence');
				thisObj._timerObj['forUpdate']['id'] = 'residence';
				thisObj._timerObj['forUpdate']['eventType'] = 'residence';
				thisObj._timerObj['forUpdate']['data'] = thisObj._currentVal['residence'];
				thisObj._timerObj['forUpdate']['timerId'] = setTimeout(
					function(event2) {
						clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
						thisObj._timerObj['forUpdate']['timerId'] = null;;
						$(thisObj).trigger('onChangeData', ['residence', thisObj._timerObj['forUpdate']['data']]);
						thisObj._hasSaveData = false;
					},
					3000
				);
			}
		}
		
		/*
		 * カテゴリ名が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeCategoryNameText: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var currentTarget = $(event.currentTarget);
			var id = currentTarget.parent().parent().attr('data-category-id');
			var categoryName = currentTarget.val();
			var currentValKey	= 'id-' + id;
			// console.log('id = ' + id + ', categoryName = ' + categoryName + ', currentValKey = ' + currentValKey);
			// console.log('thisObj._currentVal[currentValKey][key] = ' + thisObj._currentVal[currentValKey]['key']);
			// console.log('');
			if (
				thisObj._currentVal[currentValKey] &&
				thisObj._currentVal[currentValKey]['key'] !== categoryName
			) {
				thisObj._currentVal[currentValKey] = {'id':id, 'key':categoryName};
				thisObj._hasSaveData = true;
			} else {
				return;
			}
			if (thisObj._hasSaveData === true) {
				thisObj.releaseUpdateTask(id);
				thisObj._timerObj['forUpdate']['id'] = id;
				thisObj._timerObj['forUpdate']['eventType'] = 'category';
				thisObj._timerObj['forUpdate']['data'] = [thisObj._currentVal[currentValKey]];
				thisObj._timerObj['forUpdate']['timerId'] = setTimeout(
					function(event2) {
						clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
						thisObj._timerObj['forUpdate']['timerId'] = null;;
						$(thisObj).trigger('onChangeData', ['category', thisObj._timerObj['forUpdate']['data']]);
						thisObj._hasSaveData = false;
					},
					3000
				);
			}
		}
		
		/*
		 * アイテムのデータ(FRKインデックス、項目名、値)が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeItemText: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);
			var parentLiElement = element.closest('li');
			var id = parentLiElement.find('input[type="hidden"][name="id"]').val();
			var currentValObj = thisObj.setCurrentVal(parentLiElement);
			var currentValKey	= 'id-' + id;
			console.log('currentValKey = ' + currentValKey);

			if ($('input[type="hidden"][name="id"][value="' + id + '"]').length === 0) {
				clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
				thisObj._hasSaveData = false;
				if (thisObj._timerObj['forCheck']) {
					clearInterval(thisObj._timerObj['forCheck']);
					thisObj._timerObj['forCheck'] = null;
				}
				console.log('タイマー強制解除');
				return;
			}
			if (
				thisObj._currentVal[currentValKey] &&
				(
					element.hasClass('key') || element.hasClass('val')
				)
			) {
				if (
					thisObj._currentVal[currentValKey]['id'] !== currentValObj[currentValKey]['id'] ||
					thisObj._currentVal[currentValKey]['is_required'] !== currentValObj[currentValKey]['is_required'] ||
					thisObj._currentVal[currentValKey]['frk_index'] !== currentValObj[currentValKey]['frk_index'] ||
					thisObj._currentVal[currentValKey]['key'] !== currentValObj[currentValKey]['key'] ||
					thisObj._currentVal[currentValKey]['val'] !== currentValObj[currentValKey]['val']
				) {
					console.log(parentLiElement.find('input[type="text"][name="frk-index"]').val());
					console.log(parentLiElement.find('input[type="hidden"][name="frk-index"]').val());

					thisObj._currentVal[currentValKey] = currentValObj[currentValKey];
					thisObj._currentVal[currentValKey]['frk_index'] = thisObj._currentVal[currentValKey]['frk_index'] !== undefined ? thisObj._currentVal[currentValKey]['frk_index'] : '';
					thisObj._hasSaveData = true;
				} else {
					return;
				}
			}
			console.log('thisObj._hasSaveData = ' + thisObj._hasSaveData);
			if (thisObj._hasSaveData === true) {
				thisObj.releaseUpdateTask(id);
				thisObj._timerObj['forUpdate']['id'] = id;
				thisObj._timerObj['forUpdate']['eventType'] = 'item';
				thisObj._timerObj['forUpdate']['data'] = [thisObj._currentVal[currentValKey]];
				thisObj._timerObj['forUpdate']['timerId'] = setTimeout(
					function(event2) {
						console.log('データ送信');
						clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
						thisObj._timerObj['forUpdate']['timerId'] = null;;
						$(thisObj).trigger('onChangeData', ['item', thisObj._timerObj['forUpdate']['data']]);
						thisObj._hasSaveData = false;
					},
					3000
				);
				console.log('タイマーセット');
			}
		}
		
		/*
		 * Formエレメントにフォーカスがあたった/外れた時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	elementType		エレメントのタイプ
		 * @return	void
		 */
		,onChangeFocus: function(event, elementType) {
			// console.log('onChangeFocus');
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			if (elementType === 'item') {
				var currentTarget = $(event.currentTarget);
				var liElement = currentTarget.parents('ul.connected-sortable').find('> li');
				var parentLiElement = currentTarget.closest('li');
				var index = liElement.parent('ul.connected-sortable').children().index(parentLiElement);
				liElement.removeClass('current').eq(index).addClass(event.type === 'focusin' ? 'current' : '');
			}
			if (event.type === 'focusout' && thisObj._timerObj['forUpdate']['id']) {
				console.log('登録済みキュー実行');
				thisObj.releaseUpdateTask();
			}
		}

		/*
		 * Text/TextAreaにフォーカスがあたった際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeFocusInputArea: function(event) {
			// console.log('onChangeFocusInputArea');
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var tagName = currentTarget[0].nodeName;
			var elementType = '';
			var method = null;
			switch (currentTarget.attr('name')) {
				case 'residence-name':
					elementType = 'residenceName';
					method = thisObj.onChangeResidenceText;
					break;
					
				case 'frk-num':
					elementType = 'frkNum';
					method = thisObj.onChangeResidenceText;
					break;
					
				case 'category-name':
					elementType = 'categoryName';
					method = thisObj.onChangeCategoryNameText;
					break;

				default:
					if (tagName === 'TEXTAREA') {
						elementType = 'item';
						method = thisObj.onChangeItemText;
					} else {
						return;
					}
					break;
			}
			thisObj.onChangeFocus(event, elementType);
			if (thisObj._timerObj['forCheck']) {
				clearInterval(thisObj._timerObj['forCheck']);
				thisObj._timerObj['forCheck'] = null;
			}
			thisObj._timerObj['forCheck'] = setInterval(function(event2) {method(event);}, 100);
		}

		/*
		 * タスクに残っている保存処理を開放するメソッド
		 * @param	void
		 * @return	void
		 */
		,releaseUpdateTask: function(id) {
			var thisObj = this;
			console.log('------------');
			console.log('releaseUpdateTask');
			console.log(thisObj._timerObj['forUpdate']['timerId']);
			if (thisObj._timerObj['forUpdate']['timerId']) {
				if (thisObj._timerObj['forUpdate']['id'] !== id) {
					$(thisObj).trigger('onChangeData', [thisObj._timerObj['forUpdate']['eventType'], thisObj._timerObj['forUpdate']['data']]);
				}
				clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
				thisObj._timerObj['forUpdate'] = {
					'timerId'		: null,
					'id'			: null,
					'eventType'		: null,
					'data'			: null
				};
				console.log('タイマークリア');
			}
			console.log('------------');
		}

		/*
		 * カテゴリ追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickAddCategoryBtnHandler: function(event) {
			var thisObj = this;
			thisObj.setEvent(false);
			var currentTarget = $(event.currentTarget);
			var currentCategoryElement = currentTarget.closest('.category');
			var order = currentCategoryElement.parent().children().index(currentCategoryElement) + 1;	// 挿入するエレメントの順番を取得
			var data = {
				'categoryId'		: '',
				'categoryName'		: ''
			}
			var categoryElement = $(_.template($('#category-template').text(), data));
			// var data = {
			// 	'categoryId'		: '',
			// 	'categoryName'		: ''
			// }
			currentCategoryElement.after(categoryElement);
			$(thisObj).trigger('onAddCategory',
				[
					{'order':order},
					function(data) {
						categoryElement.attr('data-category-id', data['id']);
						thisObj.setEmptyItem(categoryElement.find('dd > ul.connected-sortable'));
						thisObj.setBtnState();
						thisObj._currentVal = thisObj.setCurrentVal(null, true);
						thisObj.setEvent(true);
					}
				]
			);
		}

		/*
		 * カテゴリ削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickDelCategoryBtnHandler: function(event) {
			var thisObj = this;
			var targetCategoryElement = $(event.currentTarget).closest('.category');
			var id = targetCategoryElement.attr('data-category-id');
			console.log('id = ' + id);
			if (id && thisObj.checkDeletableCategory(targetCategoryElement)) {
				thisObj.setEvent(false);
				targetCategoryElement.remove();
				delete thisObj._currentVal['id-' + id];
				$(thisObj).trigger('onDelCategory', id);
				thisObj.setEvent(true);
			} else {
				console.log('必須アイテムがあるので削除不可');
			}
		}

		/*
		 * アイテム追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickAddItemBtnHandler: function(event) {
			var thisObj = this;
			// console.log('onClickAddItemBtnHanadler');
			thisObj.setEvent(false);
			var currentTarget = $(event.currentTarget);
			var currentItemsElement = currentTarget.closest('.connected-sortable');
			var currentItemElement = currentTarget.closest('li');
			var order = currentItemsElement.children().index(currentItemElement) + 2;	// 挿入するエレメントの順番を取得
			var data = {
				'itemId'		: '',
				'mtrOutlineId'	: '',
				'isRequired'	: false,
				'frkIndex'		: '',
				'itemKey'		: '',
				'itemVal'		: '',
				'itemTypeLabel'	: '任意'
			}
			var itemElement = $(_.template($('#item-template').text(), data));
			currentItemElement.after(itemElement);

			var sendData = {
				'key'					: '',
				'val'					: '',
				'is_required'			: 0,
				'frk_index'				: '',
				'order'					: order,
				'parent_category_id'	: currentItemsElement.closest('.category').attr('data-category-id')
			}
			$(thisObj).trigger('onAddItem',
				[
					sendData,
					function(data) {
						console.log('アイテム追加完了');
						itemElement.find('input[type="hidden"][name="id"]').val(data['id']);
						// thisObj.setEmptyItem(categoryElement.find('dd > ul.connected-sortable'));
						// thisObj.setBtnState();
						// var tmpObj = $.extend(true, {}, thisObj._currentVal)
						// console.log('更新前');
						// console.log(tmpObj);
						var currentValObj = thisObj.setCurrentVal(itemElement);
						var currentValKey	= 'id-' + data['id'];
						thisObj._currentVal[currentValKey] = currentValObj[currentValKey];
						// thisObj._currentVal = thisObj.setCurrentVal(itemElement);
						// console.log('更新後');
						// console.log(thisObj._currentVal);
						thisObj.setEvent(true);
					}
				]
			);
		}

		/*
		 * アイテム削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickDelItemBtnHandler: function(event) {
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var categoryElement = currentTarget.closest('.category');
			var currentItemElement = currentTarget.closest('li');
			// var currentItemsElement = currentTarget.closest('.connected-sortable');
			// var targetCategoryElement = $(event.currentTarget).closest('.category');
			var id = currentItemElement.find('input[type="hidden"][name="id"]').val();
			// console.log(categoryElement);
			// console.log('id = ' + id);
			if (id && thisObj.checkDeletableItem(currentItemElement)) {
				thisObj.setEvent(false);
				currentItemElement.remove();
				delete thisObj._currentVal['id-' + id];
				$(thisObj).trigger('onDelItem', {'id':id, 'parent_category_id':categoryElement.attr('data-category-id')});
				thisObj.setEvent(true);
			} else {
				console.log('必須アイテムなので削除不可');
			}
		}
		
		/*
		 * ボタンの状態ををセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setBtnState: function() {
			var thisObj = this;
			console.log('setBtnState');
			// <input type="hidden" name="is-required" value="1">のノードを持つカテゴリエレメントは削除ボタンを押下不可にする
			$('#outline-container > .category').each(function(i) {
				var categoryElement = $(this);
				var requiredElement = categoryElement.find('input[type="hidden"][name="is-required"][value="1"]');
				if (0 < requiredElement.length) {
					categoryElement.find('.del-category-btn').addClass('disable');
				} else {
					categoryElement.find('.del-category-btn').removeClass('disable');
				}
			});
		}
		
		/*
		 * 空のアイテムをセットするメソッド
		 * @param	targetElement		空のアイテムの親エレメント
		 * @return	void
		 */
		,setEmptyItem: function(targetElement) {
			var thisObj = this;
			targetElement.find('.empty-item').remove();
			console.log('');
			console.log('----------');
			console.log('setEmptyItem');
			targetElement.each(function(i) {
				console.log('	$(this).find(> li).length = ' + $(this).find('> li').length);
				if ($(this).find('> li').length < 1) {
					console.log('		追加');
					$(this).append(thisObj._templateElements['emptyItem']);
				}
			})
			console.log('----------');
			console.log('');
		}
		
		/*
		 * 指定されたカテゴリエレメントが削除可能かを返すメソッド
		 * @param	targetCategoryElement		削除可能かどうかを判定するカテゴリエレメント
		 * @return	true===削除可能、false===削除不可能
		 */
		,checkDeletableCategory: function(targetCategoryElement) {
			var thisObj = this;
			return 0 === targetCategoryElement.find('input[type="hidden"][name="is-required"][value="1"]').length;
		}
		
		/*
		 * 指定されたアイテムエレメントが削除可能かを返すメソッド
		 * @param	targetElement		削除しようとするアイテムエレメント
		 * @return	true===削除可能、false===削除不可能
		 */
		,checkDeletableItem: function(targetElement) {
			var thisObj = this;
			return targetElement.find('input[type="hidden"][name="is-required"]').val() === '0' ? true : false;
		}
		
		/*
		 * FRKデータを画面に表示するメソッド
		 * @param	frkDataArr		FRKデータ配列
		 * @return	void
		 */
		 /*
		,showFRK: function(frkDataArr) {
			// console.log('showFRKData');
			// console.log(frkDataArr);
			var thisObj = this;
			thisObj.setEvent(false);
			$(thisObj).trigger('onInitShowFRK');

			// 画面上のデータとマスタを比較し、内容が同じ場合にtrueを返す
			var compareMasterData = function(mtrOutlines) {
				// var baseElement = $('dl.category:eq(0)');
				var categoryElement = $('dl.category:eq(0) input[type="text"][name="category-name"]');
				var itemsElement = $('dl.category:eq(0) > dd > ul');
				var isSame = true;
				// console.log(mtrOutlines);
				for (var i=0,len=mtrOutlines.length; i<len; i++) {
					// console.log('	' + i + ' :: parent_category_id = ' + mtrOutlines[i]['parent_category_id']);
					if ((mtrOutlines[i]['parent_category_id']-0) === 0) {
						// カテゴリ名が一致するかチェック
						var categoryName = categoryElement.val();
						if (categoryName !== mtrOutlines[i]['key']) {
							isSame = false;
							// console.log('カテゴリ名が異なる');
							break;
						}
					} else {
						// アイテムの名前、順番、FRKインデックス、必須入力フラグが全て一致するかチェック
						var itemElement = itemsElement.find('> li:eq(' + (mtrOutlines[i]['order'] - 1) + ')');
						var itemName = itemElement.find('input[type="hidden"][name="key"]').val();
						var isRequired = itemElement.find('input[type="hidden"][name="is-required"]').val() - 0;
						var frkIndex = itemElement.find('input[type="hidden"][name="frk-index"]').val();
						if (
							itemName !== mtrOutlines[i]['key'] ||
							isRequired !== (mtrOutlines[i]['is_required']-0) ||
							frkIndex !== mtrOutlines[i]['frk_index']
						) {
							// console.log(itemName + 'か、' + isRequired + 'か、' + frkIndex + 'が異なる');
							isSame = false;
							break;
						}
					}
				}
				// $('dl.category:eq(0)')
				// console.log($('dl.category:eq(0)').html());
				return isSame;
			}

			// 画面上のデータとFRKを比較し、内容が同じ場合にtrueを返す
			var compareFRKData = function(dataArr) {
				var isSame = true;
				if (0 < $('li.empty-item').length) {
					isSame = false;
				} else {
					$('ul.items:eq(0)').find('> li').not('.empty-item').each(function(i) {
					// $('ul.items > li').each(function(i) {
						var itemElement = $(this);
						console.log(itemElement.html());
						// console.log(itemElement.find('input[type="hidden"][name="frk-index"]').html());
						var frkIndexArr = itemElement.find('input[type="hidden"][name="frk-index"]').val().split('_');
						// console.log(i);
						// console.log(frkIndexArr);
						var frkVal = '';
						if (0 < frkIndexArr.length) {
							for (var j=0,len=frkIndexArr.length; j<len; j++) {
								var index = parseInt(frkIndexArr[j]) - 1;
								frkVal += dataArr[index] ? dataArr[index] : '';
								// console.log('	dataArr[' + index + '] = ' + dataArr[index]);
							}
						}
						if (itemElement.find('td.item-val > textarea').val() !== frkVal) {
							isSame = false;
						}
					});
				}
				return isSame;
			}

			// マスタデータとFRKデータから更新後のデータを作成する
			var getRenewalData = function(mtrOutlines, dataArr) {
				var arr = [];
				var categoryCount = 0;
				var itemCount = 0;
				for (var i=0,len=mtrOutlines.length; i<len; i++) {
					console.log('	' + i + ' :: parent_category_id = ' + mtrOutlines[i]['parent_category_id']);
					// カテゴリデータを取得
					if ((mtrOutlines[i]['parent_category_id']-0) === 0) {
						var obj = {
							'id'					: '',
							'mtr_outline_id'		: 0,
							'key'					: mtrOutlines[i]['key'],
							'val'					: '',
							'is_required'			: 0,
							'frk_index'				: '',
							'order'					: ++categoryCount,
							'parent_category_id'	: '0'
						};
						arr.push(obj);

					// アイテムデータを取得
					} else {
						var frkIndexArr = mtrOutlines[i]['frk_index'].split('_');
						var frkVal = '';
						if (0 < frkIndexArr.length) {
							for (var j=0,len2=frkIndexArr.length; j<len2; j++) {
								var index = parseInt(frkIndexArr[j]) - 1;
								frkVal += dataArr[index] ? dataArr[index] : '';
							}
						}
						// categoryElement.find('.items > li').each(function(j) {
							var itemElement = $(this);
							var obj = {
								'id'					: '',
								'mtr_outline_id'		: mtrOutlines[i]['id'],
								'key'					: mtrOutlines[i]['key'],
								'val'					: frkVal,
								'is_required'			: (mtrOutlines[i]['is_required'] - 0),
								'frk_index'				: mtrOutlines[i]['frk_index'],
								'order'					: ++itemCount,
								'parent_category_id'	: ''
							};
							arr.push(obj);
						// });
					}
				}
				return arr;
			}

			// デフォルトの物件概要のデータと比較
			// 物件概要のvalの値はチェックせず、項目の並び順やデフォルトの項目以外の項目があればfalseを返す
			var isDifferent = false;
			var renewalData = [];
			if (compareMasterData(thisObj._instances['DataManager'].getProp()['mtrOutlines']) === true) {
				if (compareFRKData(frkDataArr) === false) {
					isDifferent = true;
					renewalData = getRenewalData(thisObj._instances['DataManager'].getProp()['mtrOutlines'], frkDataArr);
				}
			} else {
				isDifferent = true;
				renewalData = getRenewalData(thisObj._instances['DataManager'].getProp()['mtrOutlines'], frkDataArr);
			}
			thisObj.setEvent(true);
			$(thisObj).trigger('onCompleteShowFRK', [isDifferent, renewalData]);
		}
		*/

		/*
		 * XMLデータを画面に表示するメソッド
		 * @param	xmlData		XMLデータ
		 * @return	void
		 */
		 /*
		,showXML: function(xmlData) {
			// console.log('showFRKData');
			// console.log(frkDataArr);
			var thisObj = this;
			thisObj.setEvent(false);
			$(thisObj).trigger('onInitShowXML');

			// 画面上のデータとXMLを比較し、内容が同じ場合にtrueを返す
			var compareXMLData = function(baseXml) {
				var isSame = true;
				var categoriyNodes = baseXml.find('> residence > category');
				var categoriyElements = $('#outline-container > dl.category');
				if (categoriyNodes.length !== categoriyElements.length) {
					isSame = false;
				} else {
					categoriyNodes.each(function(i) {
						var categoryNode = $(this);
						var categoryElement = categoriyElements.eq(i).find('> dt > input[name="category-name"]');
						if (categoryNode.attr('name') !== categoryElement.val()) {
							isSame = false;
							return;
						} else if (categoryNode.find('> item').length !== categoriyElements.eq(i).find('> dd > ul.items > li').length) {
							isSame = false;
							return;
						} else {
							categoryNode.find('> item').each(function(j) {
								var itemNode = $(this);
								var itemElement = categoriyElements.eq(i).find('> dd > ul.items > li').eq(j);
								if (
									itemNode.attr('frk_column_num') !== itemElement.find('input[type="hidden"][name="frk-index"]').val()
									||
									itemNode.attr('is_required') !== ((itemElement.find('input[type="hidden"][name="is-required"]').val() - 0) === 1 ? 'true' : 'false')
									||
									itemNode.find('> key').val() !== itemElement.find('input[type="hidden"][name="item-key"]').val()
									||
									itemNode.find('> val').val() !== itemElement.find('input[type="hidden"][name="item-val"]').val()
								) {
									isSame = false;
									return;
								}
							});
							if (isSame === false) {
								return;
							}
						}
					});
				}
				return isSame;
			}

			// XMLから更新後のデータを作成する
			var getRenewalData = function(baseXml) {
				var arr = [];
				return arr;
			}

			// デフォルトの物件概要のデータと比較
			// 物件概要のvalの値はチェックせず、項目の並び順やデフォルトの項目以外の項目があればfalseを返す
			var isDifferent = false;
			var renewalData = [];
			if (compareXMLData(xmlData) === false) {
				isDifferent = true;
				renewalData = getRenewalData(xmlData);
			}
			thisObj.setEvent(true);
			$(thisObj).trigger('onCompleteShowXML', [isDifferent, renewalData]);
		}
		*/

		/*
		 * 画面上に配置されているカテゴリ/アイテムのデータをリプレイスするメソッド
		 * @param	outlineData		リプレイスするデータ
		 * @return	void
		 */
		,replaceAllData: function(outlineData) {
			var thisObj = this;
			thisObj.releaseUpdateTask();
			thisObj.setEvent(false);
			// 一旦、全てのカテゴリ、アイテムのエレメントを削除する
			$('dl.category').remove();

			$('#outline-container > .residence-name')
				.find('input[type="text"][name="residence-name"]').val(outlineData['residences']['name'])
				.find('input[type="text"][name="frk-num"]').val(outlineData['residences']['num']);

			for (var i=0,len=outlineData['outlines'].length; i<len; i++) {
				console.log('	' + i + ' :: parent_category_id = ' + outlineData['outlines'][i]['parent_category_id']);
				if ((outlineData['outlines'][i]['parent_category_id']-0) === 0) {
					var data = {
						'categoryId'		: outlineData['outlines'][i]['id'],
						'categoryName'		: outlineData['outlines'][i]['key']
					}
					var categoryElement = $(_.template($('#category-template').text(), data));
					$('.residence-name').after(categoryElement);
					itemsElement = categoryElement.find('> dd > ul.items')
				} else {
					var data = {
						'itemId'		: outlineData['outlines'][i]['id'],
						'mtrOutlineId'	: outlineData['outlines'][i]['mtr_outline_id'],
						'isRequired'	: (outlineData['outlines'][i]['is_required'] - 0) === 1 ? true : false,
						'frkIndex'		: outlineData['outlines'][i]['frk_index'],
						'itemKey'		: outlineData['outlines'][i]['key'],
						'itemVal'		: outlineData['outlines'][i]['val'],
						'itemTypeLabel'	: (outlineData['outlines'][i]['is_required'] - 0) === 1 ? '必須' : '任意'
					}
					var itemElement = $(_.template($('#item-template').text(), data));
					itemsElement.append(itemElement);
				}
			}
			thisObj._currentVal = null;
			thisObj._currentVal = thisObj.setCurrentVal(null, true);
			this.setBtnState();
			thisObj.setEvent(true);
		}

		/*
		 * このクラスで管理するページ/エレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				$('#outline-container')
					.on('click', '.add-category-btn', thisObj.onClickAddCategoryBtnHandler)
					.on('click', '.del-category-btn', thisObj.onClickDelCategoryBtnHandler)
					.on('click', '.toggle-btn', function(event) {
						$(this).parents('.category').find('> dd').slideToggle();
					})

					.on('click', '.add-item-btn', thisObj.onClickAddItemBtnHandler)
					.on('click', '.del-item-btn', thisObj.onClickDelItemBtnHandler)

					.on('focus', 'input[type="text"][name="residence-name"]', thisObj.onChangeFocusInputArea)
					.on('blur', 'input[type="text"][name="residence-name"]', thisObj.onChangeFocusInputArea)

					.on('focus', 'input[type="text"][name="frk-num"]', thisObj.onChangeFocusInputArea)
					.on('blur', 'input[type="text"][name="frk-num"]', thisObj.onChangeFocusInputArea)

					.on('focus', 'input[type="text"][name="category-name"]', thisObj.onChangeFocusInputArea)
					.on('blur', 'input[type="text"][name="category-name"]', thisObj.onChangeFocusInputArea)

					.on('focus', 'textarea.key, textarea.val', thisObj.onChangeFocusInputArea)
					.on('blur', 'textarea.key, textarea.val', thisObj.onChangeFocusInputArea)

					.find('input[type="text"], textarea').removeAttr('disabled')

				thisObj.setSortableInstance(true);

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				$('#outline-container')
					.off('click', '.add-category-btn')
					.off('click', '.del-category-btn')
					.off('click', '.toggle-btn')

					.off('click', '.add-item-btn')
					.off('click', '.del-item-btn')

					.off('focus', 'input[type="text"][name="residence-name"]')
					.off('blur', 'input[type="text"][name="residence-name"]')

					.off('focus', 'input[type="text"][name="frk-num"]')
					.off('blur', 'input[type="text"][name="frk-num"]')

					.off('focus', 'input[type="text"][name="category-name"]')
					.off('blur', 'input[type="text"][name="category-name"]')

					.off('focus', 'textarea.key, textarea.val')
					.off('blur', 'textarea.key, textarea.val')

					.find('input[type="text"], textarea').attr('disabled','disabled')

				thisObj.setSortableInstance(false);
			}
		}


























		/*
		 * Tooltip更新メソッド
		 * @param	void
		 * @return	void
		 */
		,refreshTooltip: function() {
			var thisObj = this;
			$(".tooltip").remove();
			$('[data-placement][data-original-title]').tooltip();
		}

		/*
		 * フィールド追加メソッド
		 * @param	targetOrder		フィールドを追加する位置
		 * @return	void
		 */
		,insert: function(tmpElementId, targetOrder) {
			var thisObj = this;
			// console.log('tmpElementId = ' + tmpElementId);
			// console.log('targetOrder = ' + targetOrder);
			var method = function(recordId) {
				// console.log('recordId = ' + recordId);
				var source = '\
					<li class="isShow" data-record-id="' + recordId + '" data-frk-index="-1">\
						<div class="statusWrapper">\
							<div class="btn-hole">\
								<div class="btn-group" data-toggle="buttons-radio">\
									<button type="button" class="btn btn-test showBtn active" data-placement="bottom" data-original-title="物件概要パーツにこのフィールドを表示します。"><span><i data-icon=""></i>表示</span></button>\
									<button type="button" class="btn btn-test hideBtn" data-item-name="isHide" data-placement="bottom" data-original-title="このフィールドを物件概要パーツでは表示しません。"><span><i data-icon=""></i>非表示</span></button>\
								</div>\
							</div>\
						</div>\
						<div class="dataWrapper">\
							<div class="fieldName"><input type="text"></div>\
							<div class="fieldVal">\
								<textarea></textarea>\
							</div>\
						</div>\
						<div class="isFrk">&nbsp;</div>\
						<div class="controller">\
							<button type="button" class="btn btn-primary btn-bright btn-test addBtn" data-placement="left" data-original-title="このフィールドの下に新しいフィールドを追加します。"><span><i data-icon=""></i></span></button>\
							<button type="button" class="btn btn-danger btn-bright btn-test delBtn" data-placement="left" data-original-title="このフィールドを削除します。"><span><i data-icon=""></i></span></button>\
						</div>\
					</li>\
				';
				thisObj.refreshTooltip();
				return $(source);
			}
			$('#fieldsWrapper ul.body > li').eq(targetOrder).after(method(tmpElementId));
			thisObj._currentVal[tmpElementId] = {
				'name'	: '',
				'val'	: ''
			}
		}
		
		/*
		 * フィールド削除メソッド
		 * @param	recordId		削除するフィールドエレメントのレコードID
		 * @return	void
		 */
		,delete: function(recordId) {
			var thisObj = this;
			$('li[data-record-id="' + recordId + '"]').remove();
			thisObj.refreshTooltip();
		}
		
		/*
		 * フィールド更新メソッド
		 * @param	recordId		更新するフィールドエレメントのレコードIID
		 * @param	data			更新後のフィールドエレメントのデータ
		 * @return	void
		 */
		,update: function(recordId, data) {
			var thisObj = this;
			if (thisObj._isUpdateThrough === true) {
				thisObj._isUpdateThrough = false;
				return;
			}
			var targetLiElem = $('li[data-record-id="' + recordId + '"]');

			if (data['recordId']) {
				delete thisObj._currentVal[recordId];
				targetLiElem.attr('data-record-id', data['recordId']);
				thisObj._currentVal['recordId_' + data['recordId']] = {
					'name'	: '',
					'val'	: ''
				}
			}
			if (data['name']) {
				if (data['name'] !== thisObj._currentVal['recordId_' + recordId]['name'])  {
					targetLiElem.find('.fieldName > input').val(data['name']);
					thisObj._currentVal['recordId_' + recordId] = thisObj._currentVal['recordId_' + recordId] || {};
					thisObj._currentVal['recordId_' + recordId]['name'] = data['name'];
				}
			}
			if (data['val']) {
				if (data['val'] !== thisObj._currentVal['recordId_' + recordId]['val'])  {
					var targetDiv = targetLiElem.find('.fieldVal');
					if (targetDiv.find('>input[type="text"]')) {
						targetDiv.find('>input[type="text"]').val(data['val']);
					} else if (targetDiv.find('>textarea')) {
						targetDiv.find('>textarea').html(data['val']);
					}
					thisObj._currentVal['recordId_' + recordId] = thisObj._currentVal['recordId_' + recordId] || {};
					thisObj._currentVal['recordId_' + recordId]['val'] = data['val'];
				}
			}
			if (data['visibility']) {
				targetLiElem.removeClass('isShow isHide').addClass(data['visibility']);
				var targetBtnClass = data['visibility'] === 'isShow' ? 'showBtn' : 'hideBtn';
				targetLiElem.find('.statusWrapper').find('button').removeClass('active').end().find('button.'+targetBtnClass).addClass('active');
			}
			thisObj.refreshTooltip();
		}
		
		/*
		 * 表示/非表示ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onSortField: function(event, ui) {
			var thisObj = this;
			var liElement = $(ui.item);
			var targetRecordId = liElement.attr('data-record-id');
			var targetOrder = liElement.parent().children().index(liElement[0]);
			$(thisObj).trigger('onChangeOrder', [targetRecordId, targetOrder]);
		}

		/*
		 * 表示/非表示ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickVisibilityButton: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);

			var liElement = element.parent().parent().parent().parent();
			var targetRecordId = liElement.attr('data-record-id')
			var data = {
				'visibility' 		: element.hasClass('showBtn') ? 'isShow' : 'isHide',
				'mtr_status_id'		: element.hasClass('showBtn') ? $('input[name="visibleId"]').val() : $('input[name="invisibleId"]').val()
			}
			$(thisObj).trigger('onChangeData', [targetRecordId, data]);
		}
		
		/*
		 * 追加/削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickControllButton: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);
			var liElement = element.parent().parent();

			if (element.hasClass('delBtn')) {
				if (element.hasClass('btn-disable') === false) {
					var targetRecordId = liElement.attr('data-record-id');
					$(thisObj).trigger('onClickDelBtn', targetRecordId);
				}
			} else {
				var targetOrder = liElement.parent().children().index(liElement[0]);
				$(thisObj).trigger('onClickAddBtn', targetOrder);
			}
		}

		/*
		 * 物件番号変更ボタンがクリックされた際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickChangeResidenceNumBtn: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			// var element = $(event.currentTarget);
			$(thisObj._instances['ChangeResidenceNumModalManager']).on('onOpenModal', function(event) {
				$(thisObj._instances['ChangeResidenceNumModalManager']).off('onOpenModal');
				thisObj.refreshTooltip();

				$(thisObj._instances['ChangeResidenceNumModalManager']).on('onChangeResidenceNum', function(event, newResidenceNum) {
					console.log('部県番号が変わった :: newResidenceNum = ' + newResidenceNum);
					thisObj._instances['DataManager'].setData('residenceNum', newResidenceNum);
					$(".residenceNum").text(newResidenceNum);
					$(thisObj).trigger('onChangeResidenceNum', newResidenceNum);
				});
				
				$(thisObj._instances['ChangeResidenceNumModalManager']).on('onCloseModal', function(event) {
					$(thisObj._instances['ChangeResidenceNumModalManager']).off('onCloseModal');
					$(thisObj._instances['ChangeResidenceNumModalManager']).off('onChangeResidenceNum');
					thisObj.refreshTooltip();
				});
			})
			thisObj._instances['ChangeResidenceNumModalManager'].open(thisObj._instances['DataManager'].getData()['residenceNum']);
		}
	}
});
