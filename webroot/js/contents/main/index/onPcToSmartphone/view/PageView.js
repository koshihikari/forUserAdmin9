

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ページエレメント管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.view.PageView');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.PageView = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.PageView.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_deviceType					: ''
		,_residenceId					: -1
		,_status						: ''
		,_instances						: {}
		,_wasActivatedTab				: false

		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}

		/*
		 * コンストラクタ
		 * @param	AppModel			AppModelインスタンス
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @param	residenceId			このクラスで管理するページが属する物件のID
		 * @return	void
		 */
		,initialize: function(AppModel, deviceType, residenceId) {
			var thisObj = this;
			_.bindAll(
				this
				,'setStatus'
				,'getStatus'
				,'setElement'
				,'onChangeCurrentInfo'
				,'render'
				,'onResizeWindow'
				,'onClickSwitchBtnHandler'
				,'onClickAddPageBtnHandler'
				,'onClickDelPageBtnHandler'
				,'onClickDuplicatePageBtnHandler'
				,'onUpdateOrderHandler'
				,'onChangeTextHandler'
				,'onClickCheckboxHandler'
				,'onClickTabBtnHandler'
				,'onChangeCheckedBtnHandler'
				,'onClickBulkPublishBtnHandler'
				// ,'onClickBulkEditTagBtnHandler'
				,'onClickEditTagBtnHandler'
				,'setBulkBtnState'
				,'setOnceEvent'
				,'setEvent'
			);

			this._instances = {
				'AppModel'				: AppModel,
				'ConfirmModalManager'	: new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager(),
				'TextInputManager'		: new MYNAMESPACE.modules.helper.TextInputManager()
			};
			this._deviceType = deviceType;
			this._residenceId = residenceId;
		}

		/*
		 * このクラスのステータスをセットするメソッド
		 * @param	status		ステータス
		 * @return	void
		 */
		,setStatus: function(status) {
			var thisObj = this;
			if (thisObj._status !== status) {
				thisObj._status = status;
				$(thisObj).trigger('onChangeStatus');
			}
		}

		/*
		 * このクラスのステータスを返すメソッド
		 * @param	void
		 * @return	ステータス
		 */
		,getStatus: function() {
			var thisObj = this;
			return thisObj._status;
		}

		/*
		 * エレメントを画面に配置するメソッド
		 * @param	data		リエレメントデータ
		 * @return	void
		 */
		,setElement: function() {
			var thisObj = this;
			var dataName = thisObj._deviceType === 'sp' ? 'SpPageDataOf' : 'FpPageDataOf';
			var data = thisObj._instances['AppModel'].getData(dataName + thisObj._residenceId);
			var prop = thisObj._instances['AppModel'].getProp();
			var residenceInfo = thisObj._instances['AppModel'].getResidenceData(thisObj._residenceId);
			var pageUrl = prop['concreteUrl'] + residenceInfo['path'];
			var $targetElem = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId);
			var key = thisObj._deviceType === 'sp' ? 'smartphone_pages' : 'featurephone_pages';
			var templateName = thisObj._deviceType === 'sp' ? '#smartphone-page-item-template' : '#featurephone-page-item-template';
			var time =  new Date().getTime();
			var qrApiUrl = 'http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=';
			var existenceLiNames = {};

			$targetElem.find('> ul.page-list > li').each(function(i) {
				existenceLiNames[$(this).attr('id')] = true;
			});

			for (var i=0,len=data.length; i<len; i++) {
				var listElementId = thisObj._deviceType + '-page-item_' + data[i][key]['id'];
				var $liElem = $('#' + listElementId);
				var editUrl = prop['currentUrl'] + 'Page/edit/' + (thisObj._deviceType === 'sp' ? 's/' : 'f/') + data[i][key]['id'];
				var previewUrl = prop['currentUrl'].replace('https://', 'http://') + 'Page/preview/' + (thisObj._deviceType === 'sp' ? 's/' : 'f/') + thisObj._residenceId + '/' + data[i][key]['id']+ '/?' + time;
				// var previewUrl = prop['currentUrl'] + 'Page/preview/' + (thisObj._deviceType === 'sp' ? 's/' : 'f/') + thisObj._residenceId + '/' + data[i][key]['id']+ '/?' + time;
				var editor = data[i]['editedUser']['name'] ? data[i]['editedUser']['name'] : '-----';
				var edited = data[i][key]['edited'] ? data[i][key]['edited'] : '-----';
				var publisher = data[i]['publishedUser']['name'] ? data[i]['publishedUser']['name'] : '-----';
				var published = data[i][key]['published'] ? data[i][key]['published'] : '-----';

				if (0 < $liElem.length) {	// 既にエレメントが存在する場合は修正
					if (existenceLiNames[listElementId] === true) {
						delete existenceLiNames[listElementId];
					}
					if (data[i][key]['is_latest_page'] === true) {
						$liElem
							.removeClass('not-latest')
							.find('.caution').addClass('empty');
					} else {
						$liElem
							.addClass('not-latest')
							.find('.caution').removeClass('empty');
					}
					if ($liElem.find('.title > input[type="text"]').val() !== data[i][key]['title']) {
						$liElem.find('.title > input[type="text"]').val(data[i][key]['title']);
					}
					if ($liElem.find('.path > span').html() !== pageUrl) {
						$liElem.find('.path > span').html(pageUrl);
					}
					if ($liElem.find('.path > input[type="text"]').val() !== data[i][key]['path']) {
						$liElem.find('.path > input[type="text"]').val(data[i][key]['path']);
					}
					if ($liElem.find('.editor').html() !== editor) {
						$liElem.find('.editor').html(editor);
					}
					if ($liElem.find('.edited').html() !== edited) {
						$liElem.find('.edited').html(edited);
					}
					if ($liElem.find('.publisher').html() !== publisher) {
						$liElem.find('.publisher').html(publisher);
					}
					if ($liElem.find('.published').html() !== published) {
						$liElem.find('.published').html(published);
					}

					// プレビューページ用ページタイトルとURL、QRコードの更新チェック
					var $dropDownForPreviewElem = $liElem.find('.dropdown-menu-for-preview');
					if (
						$dropDownForPreviewElem.attr('data-title') !== data[i][key]['title'] ||
						$dropDownForPreviewElem.attr('data-path') !== data[i][key]['path']
					) {
						$dropDownForPreviewElem.attr('data-title', data[i][key]['title']);
						$dropDownForPreviewElem.attr('data-path', data[i][key]['path']);
						$dropDownForPreviewElem
							.find(' > li:first-child > a')
								.attr('href', pageUrl + data[i][key]['path'])
								.html(data[i][key]['title'])
						.end()
							.find(' > li:last-child')
								.find('> img')
									.remove()
								.end()
								.append($('<img>', {
									'src'		: qrApiUrl + pageUrl + data[i][key]['path'],
									'width'		: 100,
									'height'	: 100,
									'alt'		: data[i][key]['title']
								}));
					}

					// 本番ページ用ページタイトルとURL、QRコードの更新チェック
					var $dropDownForConcreteElem = $liElem.find('.dropdown-menu-for-concrete');
					if (
						$dropDownForConcreteElem.attr('data-title') !== data[i][key]['title'] ||
						$dropDownForConcreteElem.attr('data-path') !== data[i][key]['path']
					) {
						$dropDownForConcreteElem.attr('data-title', data[i][key]['title']);
						$dropDownForConcreteElem.attr('data-path', data[i][key]['path']);
						$dropDownForConcreteElem
							.find(' > li:first-child > a')
								.attr('href', pageUrl + data[i][key]['path'])
								.html(data[i][key]['title'])
						.end()
							.find(' > li:last-child')
								.find('> img')
									.remove()
								.end()
								.append($('<img>', {
									'src'		: qrApiUrl + pageUrl + data[i][key]['path'],
									'width'		: 100,
									'height'	: 100,
									'alt'		: data[i][key]['title']
								}));
					}

				} else {	// エレメントが存在しない場合は作成
					var forTemplateData = {
						'pageId'				: data[i][key]['id'],
						'isShow'				: +data[i][key]['is_show'],
						'pageTitle'				: data[i][key]['title'],
						'pagePath'				: data[i][key]['path'],
						'pageUrl'				: pageUrl,
						'editUrl'				: editUrl,
						'previewUrl'			: previewUrl,
						'concreteUrl'			: pageUrl + data[i][key]['path'],
						'editor'				: editor,
						'edited'				: edited,
						'publisher'				: publisher,
						'published'				: published,
						'isLatest'				: data[i][key]['is_latest_page']
					}
					$targetElem.find('> ul.page-list').append($(_.template($(templateName).text(), forTemplateData)));
				}
			}

			// 前回描画したが、最新のデータでは存在しないエレメントを削除する
			for (var idName in existenceLiNames) {
				$('#' + idName).remove();
			}

			// 作成/修正したエレメントの並び順をdataと一致させる
			var $ul = $targetElem.find('> ul.page-list');
			for (var i=0,len=data.length; i<len; i++) {
				var listElementId = thisObj._deviceType + '-page-item_' + data[i][key]['id'];
				var $li = $('#' + listElementId);
					$ul.append($li);
			}
		}

		/*
		 * カレントな物件ID、デバイスタイプが変わった際にコールされるメソッド
		 * @param	void
		 * @return	void
		 */
		,onChangeCurrentInfo: function() {
			var thisObj = this;
			var currentInfo = thisObj._instances['AppModel'].getCurrentInfo();

			if (currentInfo['residenceId'] === thisObj._residenceId && currentInfo['deviceType'] === thisObj._deviceType) {
				var $tabs = $('#page-wrapper-in-residence-id_' + thisObj._residenceId + '> .nav-tabs');
				var $li = thisObj._deviceType === 'sp' ? $tabs.find('>li:first') : $tabs.find('>li:last');
				$li.find('>a').tab('show');
			}
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		,render: function() {
			var thisObj = this;

			thisObj.setStatus('onInitRender');
			$(thisObj).trigger('onInitRender');

			thisObj.setEvent(false);
			thisObj.setElement();
			thisObj.onChangeCurrentInfo();
			thisObj.setEvent(true);
			if (thisObj._isOnceEventEnabled === false) {
				thisObj.setOnceEvent();
			}
			this.onResizeWindow();
			thisObj.setStatus('onCompleteRender');
			$(thisObj).trigger('onCompleteRender');
		}

		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var prop = thisObj._instances['AppModel'].getProp();
			var height = $(window).height() - (prop['isCustomer'] === true ? 136 : 161);
			// var height = $(window).height() - 161;
			var $ul = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId + ' ul.page-list');
			$ul.height(height);
		}

		/*
		 * 表示切り替えボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickSwitchBtnHandler: function(event) {
			event.stopPropagation();
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var pageLiElem = currentTarget.closest('li');
			var replaceWord = thisObj._deviceType === 'sp' ? 'sp-tab-content-in-residence-id_' : 'fp-tab-content-in-residence-id_';
			// var tabPaneElem = pageLiElem.closest('.sp-tab-pane');
			var tabPaneElem = pageLiElem.closest('.tab-pane');
			var residenceId = tabPaneElem.attr('id').replace(replaceWord, '');
			// var residenceId = tabPaneElem.attr('id').replace('sp-tab-content-in-residence-id_', '');
			var pageId = pageLiElem.attr('id').replace((thisObj._deviceType + '-page-item_'), '');
			var isVisible = pageLiElem.attr('data-is-visible') === '1' ? true : false;
			pageLiElem.attr('data-is-visible', isVisible === true ? '0' : '1');
			// if (isVisible === true) {
			// 	pageLiElem.find('.btn-edit, .btn-duplicate-page, .btn-del-page, .btn-edit-tag').addClass('disabled');
			// } else {
			// 	pageLiElem.find('.btn-edit, .btn-duplicate-page, .btn-del-page, .btn-edit-tag').removeClass('disabled');
			// }
			console.log('onClickSwitchBtnHandler :: residenceId = ' + residenceId + ', pageId = ' + pageId + ', isVisible = ' + isVisible);
			$(thisObj).trigger('onSwitchPageVisible', residenceId);
		}

		/*
		 * ページ追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAddPageBtnHandler: function(event) {
			var thisObj = this;
			thisObj._instances['AppModel'].addPage(thisObj._residenceId, thisObj._deviceType);
		}

		/*
		 * ページ削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDelPageBtnHandler: function(event) {
			var thisObj = this;
			var $liElem = $(event.currentTarget).closest('li');
			var pageId = $liElem.attr('id').replace((thisObj._deviceType + '-page-item_'), '');
			var pageTitle = $liElem.find('.title input[type="text"]').val();
			var message = '「' + pageTitle + '」を削除しますか？';

			thisObj._instances['ConfirmModalManager'].open(
				{
					'title'									: '削除確認',
					'message'								: message,
					'close-btn-text'						: 'キャンセル',
					'agree-btn-text'						: '削除する'
				},
				function() {
					thisObj._instances['AppModel'].delPage(pageId, thisObj._deviceType);
				}
			);
		}

		/*
		 * ページ複製ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDuplicatePageBtnHandler: function(event) {
			var thisObj = this;
			var $liElem = $(event.currentTarget).closest('li');
			var pageId = $liElem.attr('id').replace((thisObj._deviceType + '-page-item_'), '');
			thisObj._instances['AppModel'].duplicatePage(pageId, thisObj._deviceType);
		}

		/*
		 * ページリストの並び替え完了時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @return	void
		 */
		,onUpdateOrderHandler: function(event, ui) {
			var thisObj = this;
			var updateElem = $(ui.item);
			var id = updateElem.attr('id').replace((thisObj._deviceType + '-page-item_'), '');
			var order = updateElem.parent().children().index(updateElem) + 1;
			if (0 < order) {
				thisObj._instances['AppModel'].reorderPage(id, thisObj._deviceType, order);
			}
		}

		/*
		 * input[type="text"]のvalue変更時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	$targetElem		valueが変更されたInputエレメント
		 * @param	val				変更後のvalue
		 * @return	void
		 */
		,onChangeTextHandler: function(event, $targetElem, val) {
			var thisObj = this;
			var $liElem = $targetElem.closest('li');
			var key = $targetElem.attr('name');
			var id = +($liElem.attr('id').replace(thisObj._deviceType + '-page-item_', ''));
			thisObj._instances['AppModel'].changePageString(id, thisObj._deviceType, key, val);
		}

		/*
		 * チェックボックス押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickCheckboxHandler: function(event) {
			var thisObj = this;
			var $currentTarget = $(event.currentTarget);
			var $liElem = $currentTarget.closest('li');
			var isChecked = $currentTarget.attr('checked') === 'checked' ? true : false;

			if (isChecked === true) {
				$liElem.addClass('active');
			} else {
				$liElem.removeClass('active');
			}
			thisObj.setBulkBtnState();
		}

		/*
		 * タブボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickTabBtnHandler: function(event) {
			var thisObj = this;
			event.preventDefault();
			if (thisObj._isEnabled === true) {
				$(event.currentTarget).tab('show');
			}
		}

		/*
		 * 全てチェックする/全てのチェックを外す/最新版でないページを全てチェックするボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onChangeCheckedBtnHandler: function(event) {
			var thisObj = this;
			var $clickedElem = $(event.currentTarget);
			var $li = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId + ' > ul > li');
			if ($clickedElem.hasClass('btn-checkd-all-not-latest') === true) {
				$li
					.find('.checkbox input[type="checkbox"]').attr('checked', false)
					.end()
					.filter('.not-latest').find('.checkbox input[type="checkbox"]').attr('checked', true)
			} else {
				var isChekced = $clickedElem.hasClass('btn-checked-all') ? true : false;
				$li.find('.checkbox input[type="checkbox"]').attr('checked', isChekced);
			}
			thisObj.setBulkBtnState();
		}

		/*
		 * 一括書き出しボタンのステートをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setBulkBtnState: function() {
			var thisObj = this;
			var $tabPane = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId);
			var $bulkPublishBtn = $tabPane.find(' .btn-bulk-publish');
			var $bulkTagEditBtn = $tabPane.find(' .btn-bulk-edit-tag');
			var checkedCount = $tabPane.find('> ul > li .checkbox input[type="checkbox"]:checked').length;
			0 < checkedCount ? $bulkPublishBtn.removeClass('disabled') : $bulkPublishBtn.addClass('disabled');
			0 < checkedCount ? $bulkTagEditBtn.removeClass('disabled') : $bulkTagEditBtn.addClass('disabled');
			// 0 < $tabPane.find('> ul > li .checkbox input[type="checkbox"]:checked').length ? $bulkBtn.removeClass('disabled') : $bulkBtn.addClass('disabled');
		}

		/*
		 * チェックしたページを一括書き出しボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickBulkPublishBtnHandler: function(event) {
			var thisObj = this;
			// var pageIdArr = [];
			var pageInfoArr = [];
			var $li = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId + ' > ul > li');
			$li.find('.checkbox input[type="checkbox"]:checked').each(function(i) {
				// pageIdArr.push(+$(this).closest('li').attr('id').replace((thisObj._deviceType + '-page-item_'), ''));
				pageInfoArr.push(
					{
						'residenceId'		: thisObj._residenceId,
						'pageId'			: +$(this).closest('li').attr('id').replace((thisObj._deviceType + '-page-item_'), ''),
						'deviceType'		: thisObj._deviceType
					}
				);
			});
			// console.log('pageInfoArr');
			// console.log(pageInfoArr);
			if (0 < pageInfoArr.length) {
				$(thisObj).trigger('onClickBulkPublishBtn', [pageInfoArr]);
			}
		}

		/*
		 * チェックしたページのタグ一括編集ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickBulkEditTagBtnHandler: function(event) {
			var thisObj = this;
			var data = {
				'residenceInfo'		: {
					'id'		: thisObj._residenceId,
					'name'		: $('#residence-id_' + thisObj._residenceId + ' input[type="text"][name="name"]').val()
				},
				'pageInfo'			: []
			};
			var $li = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId + ' > ul > li');
			$li.find('.checkbox input[type="checkbox"]:checked').each(function(i) {
				$pageLi = $(this).closest('li');
				data['pageInfo'].push(
					{
						'id'		: +$pageLi.attr('id').replace((thisObj._deviceType + '-page-item_'), ''),
						'name'		: $pageLi.find('.title > input[type="text"]').val()
					}
				);
			});
			console.log('PageView :: onClickBulkEditTagBtnHandler');
			console.log(data);
			if (0 < data['pageInfo'].length) {
				$(thisObj).trigger('onClickBulkEditTagBtn', [data]);
			}
		}

		/*
		 * タグ編集ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickEditTagBtnHandler: function(event) {
			var thisObj = this;
			var $pageLi = $(event.currentTarget).closest('li');
			var pageId = +$pageLi.attr('id').replace('sp-page-item_', '');
			var pageName = $pageLi.find('input[type="text"][name="title"]').val();
			var data = {
				'id'				: pageId,
				'name'				: pageName,
				'residenceId'		: thisObj._residenceId
			}
			console.log(data);
			$(thisObj).trigger('onClickEditTagBtn', [data]);
		}

		/*
		 * このクラス内で1度だけ有効にするイベントをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				thisObj._isOnceEventEnabled = true;
				$(thisObj._instances['AppModel'])
					.on('onChangeCurrentInfo', thisObj.onChangeCurrentInfo);
				$(thisObj._instances['TextInputManager'])
					.on('onChangeValue', thisObj.onChangeTextHandler);
				$(window)
					.on('resize',thisObj.onResizeWindow);
			}
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var $baseElem = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId);
			var prop = thisObj._instances['AppModel'].getProp();

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$baseElem
					.on('click', '.btn-add-page', thisObj.onClickAddPageBtnHandler)		// ページ追加ボタン
					.on('click', '.btn-duplicate-page', thisObj.onClickDuplicatePageBtnHandler)		// ページ複製ボタン
					.on('click', '.btn-del-page', thisObj.onClickDelPageBtnHandler)		// ページ削除ボタン
					.on('click', '.btn-edit-tag', thisObj.onClickEditTagBtnHandler)		// タグ編集
					.on('click', ':checkbox', thisObj.onClickCheckboxHandler)	// チェックボックス
					.on('click', '.btn-checked-all', thisObj.onChangeCheckedBtnHandler)	// 全てチェックする
					.on('click', '.btn-released-all', thisObj.onChangeCheckedBtnHandler)	// 全てのチェックを外す
					.on('click', '.btn-checkd-all-not-latest', thisObj.onChangeCheckedBtnHandler)	// 最新版でないページを全てチェックする
					.on('click', '.btn-bulk-publish', thisObj.onClickBulkPublishBtnHandler)	// チェックしたページを一括書き出し
					.on('click', '.btn-switch-page', thisObj.onClickSwitchBtnHandler)	// 表示切り替え

				// ログインユーザが顧客でなければ、ページリストのドラッグイベントを有効にする
				if (prop['isCustomer'] === false) {
					$baseElem
						.find('ul.page-list')
							.attr('data-is-sortable', 1)
							.sortable(
								{
									'placeholder'				: 'placeholder',
									'tolerance'					: 'pointer',
									'forcePlaceholderSize'		: true,
									'opacity'					: 0.5,
									'update'					: thisObj.onUpdateOrderHandler
								}
							);
				}

				if (thisObj._deviceType === 'sp') {
					var $tab = $('#page-wrapper-in-residence-id_' + thisObj._residenceId + '> .nav-tabs > li');
					if (1 < $tab.length) {
						$tab.on('click', 'a', thisObj.onClickTabBtnHandler);
					}
				}

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$baseElem
					.off('click', '.btn-add-page')		// ページ追加ボタン
					.off('click', '.btn-duplicate-page')		// ページ複製ボタン
					.off('click', '.btn-del-page')		// ページ削除ボタン
					.off('click', ':btn-edit-tag')	// タグ編集
					.off('click', ':checkbox')	// チェックボックス
					.off('click', '.btn-checked-all')	// 全てチェックする
					.off('click', '.btn-released-all')	// 全てのチェックを外す
					.off('click', '.btn-checkd-all-not-latest')	// 最新版でないページを全てチェックする
					.off('click', '.btn-bulk-publish')	// チェックしたページを一括書き出し
					.off('click', '.btn-switch-page')	// 表示切り替え
				// ログインユーザが顧客でなければ、物件リストのドラッグイベントを無効にする
				if (prop['isCustomer'] === false) {
					$baseElem
						.find('ul.page-list[data-is-sortable="1"]')
							.sortable('destroy')
							.attr('data-is-sortable', 0);
				}

				if (thisObj._deviceType === 'sp') {
					var $tab = $('#page-wrapper-in-residence-id_' + thisObj._residenceId + '> .nav-tabs > li');
					if (1 < $tab.length) {
						$tab.off('click', 'a');
					}
				}
			}

			thisObj._instances['TextInputManager'].setEvent($baseElem.find('input[type="text"]'), isEnabled);
		}
	}
});
