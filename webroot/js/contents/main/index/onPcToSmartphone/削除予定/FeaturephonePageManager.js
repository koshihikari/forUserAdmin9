

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ライブラリエレメント管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.FeaturephonePageManager');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.FeaturephonePageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.FeaturephonePageManager.prototype = $.extend({}, MYNAMESPACE.modules.main.index.onPcToSmartphone.BaseRightElementManager.prototype, {
	// MYNAMESPACE.modules.main.index.onPcToSmartphone.FeaturephonePageManager.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_status						: ''
		,_instances						: {}
		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				// ,'setStatus'
				// ,'getStatus'
				,'setElement'
				,'onChangeCurrentElement'
				,'render'
				,'onResizeWindow'
				,'onUpdateOrderHandler'
				,'onClickAddLibraryBtnHandler'
				,'onClickDuplicateLibraryBtnHandler'
				,'onClickDelLibraryBtnHandler'
				,'onChangeLibraryNameHandler'

				,'onClickTabBtnHandler'
				,'setOnceEvent'
				,'setEvent'
			);

			this._instances = {
				'DataManager'			: DataManager,
				'ConfirmModalManager'	: new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager(),
				'TextInputManager'		: new MYNAMESPACE.modules.helper.TextInputManager()
			};

			this.setOnceEvent();
			$('#pageContents .nav-tabs a:first').tab('show');
		}

		/*
		 * このクラスのステータスをセットするメソッド
		 * @param	status		ステータス
		 * @return	void
		 */
		// ,setStatus: function(status) {
		// 	var thisObj = this;
		// 	if (thisObj._status !== status) {
		// 		thisObj._status = status;
		// 		$(thisObj).trigger('onChangeStatus');
		// 	}
		// }

		/*
		 * このクラスのステータスを返すメソッド
		 * @param	void
		 * @return	ステータス
		 */
		// ,getStatus: function() {
		// 	var thisObj = this;
		// 	return thisObj._status;
		// }

		/*
		 * エレメントを画面に配置するメソッド
		 * @param	data		リエレメントデータ
		 * @return	void
		 */
		,setElement: function(data, id) {
			// console.log('FeaturephonePageManager :: setElement :: id = ' + id);
			// console.log(data);
			var thisObj = this;
			var prop = thisObj._instances['DataManager'].getProp();
			var residenceInfo = thisObj._instances['DataManager'].getResidenceData(id);
			var pageUrl = prop['concreteUrl'] + residenceInfo['path'];
			var $targetElem = $('#fp-tab-content-in-residence-id_' + id);

			for (var i=0,len=data.length; i<len; i++) {
				var forTemplateData = {
					'pageId'				: data[i]['featurephone_pages']['id'],
					'pageTitle'				: data[i]['featurephone_pages']['title'],
					'pagePath'				: data[i]['featurephone_pages']['path'],
					'pageUrl'				: pageUrl,
					'editer'				: data[i]['editedUser']['name'] ? data[i]['editedUser']['name'] : '-----',
					'edited'				: data[i]['featurephone_pages']['edited'] ? data[i]['featurephone_pages']['edited'] : '-----',
					'publisher'				: data[i]['publishedUser']['name'] ? data[i]['publishedUser']['name'] : '-----',
					'published'				: data[i]['featurephone_pages']['published'] ? data[i]['featurephone_pages']['published'] : '-----',
					'isLatest'				: data[i]['featurephone_pages']['is_latest_page']
				}
				$targetElem.find('> ul.page-list').append($(_.template($('#featurephone-page-item-template').text(), forTemplateData)));
			}
		}

		/*
		 * カレントなIDのディレクトリコンテナをアクティブにするメソッド
		 * @param	event			Eventオブジェクト
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		,onChangeCurrentElement: function(event, id) {
			var thisObj = this;
			var liElem = $('#libraries > ul > li');
			if (0 < liElem.length) {
				thisObj.setEvent(false);
				liElem.removeClass('current');
				$('#directory-container-id_' + id).addClass('current');
				thisObj.setEvent(true);
			}
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		 /*
		,render: function(data, id) {
			var thisObj = this;

			thisObj.setStatus('onInitRender');
			$(thisObj).trigger('onInitRender');

			thisObj.setEvent(false);
			// $('#libraries > ul > li').remove();
			thisObj.setElement(data, id);
			// thisObj.onChangeCurrentElement({}, id);
			thisObj.setEvent(true);

			thisObj.setStatus('onCompleteRender');
			$(thisObj).trigger('onCompleteRender');
		}
		*/

		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var height = $(window).height() - 96;
			$('#libraries > ul').height(height);
		}

		/*
		 * ライブラリ追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAddLibraryBtnHandler: function(event) {
			var thisObj = this;
			$(thisObj).trigger('onClickAddLibraryBtn');
		}

		/*
		 * ライブラリ複製ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDuplicateLibraryBtnHandler: function(event) {
			var thisObj = this;
			var id = $(event.currentTarget).closest('li').attr('id').replace('library-id_', '');
			$(thisObj).trigger('onClickDuplicateLibraryBtn', id);
		}

		/*
		 * ライブラリ削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDelLibraryBtnHandler: function(event) {
			var thisObj = this;
			var libraryElem = $(event.currentTarget).closest('li');
			var libraryId = libraryElem.attr('id').replace('library-id_', '');
			var libraryName = libraryElem.find('.name input[type="text"]').val();
			var message = '「' + libraryName + '」を削除しますか？';

			thisObj._instances['ConfirmModalManager'].open(
				{
					'title'									: '削除確認',
					'message'								: message,
					'close-btn-text'						: '<i data-icon=""></i>キャンセル',
					'agree-btn-text'						: '<i data-icon=""></i>削除する'
				},
				function() {
					$(thisObj).trigger('onClickDelDirectoryBtn', libraryId);
				}
			);
		}

		/*
		 * ライブラリパーツの並び替え完了時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @return	void
		 */
		,onUpdateOrderHandler: function(event, ui) {
			var thisObj = this;
			var updateElem = $(ui.item);
			var id = updateElem.attr('id').replace('library-id_', '');
			var order = updateElem.parent().children().index(updateElem) + 1;
			if (0 < order) {
				$(thisObj).trigger('onUpdateOrder', [id, order]);
			}
		}

		/*
		 * ライブラリ名変更時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	targetElem		ライブラリ名が変更されたInputエレメント
		 * @param	val				変更後のライブラリ名
		 * @return	void
		 */
		,onChangeLibraryNameHandler: function(event, targetElem, val) {
			var thisObj = this;
			var libraryElem = targetElem.closest('li');
			var id = libraryElem.attr('id').replace('library-id_', '');
			console.log('id = ' + id + ', val = ' + val);
			$(thisObj).trigger('onChangeLibraryName', [id, val]);
		}

		/*
		 * タブボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickTabBtnHandler: function(event) {
			event.preventDefault();
			$(event.currentTarget).tab('show');
		}

		/*
		 * このクラス内で1度だけ有効にするイベントをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(thisObj._instances['TextInputManager'])
					.on('onChangeValue', thisObj.onChangeLibraryNameHandler)
			}
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var $baseElem = $('#pages .fp-tab-pane');
			// var id = thisObj._instances['DataManager'].getDirectoryId();
			// var sortableElem = $('#directory-container-id_' + id + ' > ul');

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$baseElem
					.on('click', ':checkbox', thisObj.onClickCheckboxHandler)
				// $baseElem
				// 	.on('click', '.nav-tabs a', thisObj.onClickTabBtnHandler)
				// sortableElem.attr('data-is-sortable', 1).sortable(
				// 	{
				// 		'placeholder'				: 'placeholder',
				// 		'tolerance'					: 'pointer',
				// 		'forcePlaceholderSize'		: true,
				// 		'opacity'					: 0.5,
				// 		'update'					: thisObj.onUpdateOrderHandler
				// 	}
				// );
				// baseElem
				// 	.on('click', '.btn-add-library', thisObj.onClickAddLibraryBtnHandler)	// ライブラリ追加
				// 	.on('click', '.btn-duplicate-library', thisObj.onClickDuplicateLibraryBtnHandler)	// ライブラリ複製
				// 	.on('click', '.btn-del-library', thisObj.onClickDelLibraryBtnHandler)	// ライブラリ削除


				// $('.dropdown-toggle').dropdown();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				// baseElem
				// 	.off('click', '.btn-add-library')	// ライブラリ追加
				// 	.off('click', '.btn-duplicate-library')	// ライブラリ複製
				// 	.off('click', '.btn-del-library')	// ライブラリ削除
				// 	.find('ul[data-is-sortable="1"]')
				// 		.sortable('destroy')
				// 		.attr('data-is-sortable', 0);

				// $('[data-placement][data-original-title]').tooltip('destroy');
			}

			// thisObj._instances['TextInputManager'].setEvent(baseElem.find('.name input[type="text"]'), isEnabled);
		}
	})
});
