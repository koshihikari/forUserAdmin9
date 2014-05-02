

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * リンク先ページ選択Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.helper.Modal.SelectLinkPageModalManager');
	MYNAMESPACE.modules.helper.Modal.SelectLinkPageModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Modal.SelectLinkPageModalManager.prototype = {
		_isEnabled						: false
		,_targetId						: null
		,_elems							: {}
		,_instances						: {}
		,_pageListData					: {}

		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(id, instances) {
			var thisObj = this;

			this._targetId = id;
			this._instances = instances;
			_.bindAll(
				this
				,'getElem'
				,'createElement'
				,'setPageList'
				,'open'
				,'onClickReleaseBtnHandler'
				,'close'
				,'onClickLinkBtnHandler'
				,'setEvent'
			);

			var rootElementSource = this.createElement(id);
			this._elems		= {
				'source'		: rootElementSource
			}
		}

		/*
		 * このクラスが管理するエレメント返すメソッド
		 * @param	key		このクラスが管理するエレメントのキー
		 * @return	このクラスが管理するエレメント
		 */
		,getElem: function(key) {
			var thisObj = this;
			if (key === undefined) {
				return false;
			}
			return thisObj._elems[key];
		}

		/*
		 * このクラスが管理するエレメントを作成し、作成したエレメントを返すメソッド
		 * @param	id 		このクラスが管理するエレメントのコンてナのIDp
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id) {
			var thisObj				= this;

			var source = '\
				<div id="' + id + '" class="modal container hide fade selectLinkPageModal">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3>リンク先ページを選択</h3>\
					</div>\
					<div class="modal-body">\
						<p>リンクさせたいページを選択し、「リンク」ボタンをクリックしてください。</p>\
						<dl class="pageList">\
						</dl>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-test btn-danger releaseBtn" data-placement="bottom" data-original-title="リンクを解除します。"><span><i data-icon=""></i>解除</span></button>\
						<button type="button" class="btn btn-test cancelBtn" data-placement="bottom" data-original-title="何もせず、このモーダルを閉じます。"><span><i data-icon=""></i>キャンセル</span></button>\
						<button type="button" class="btn btn-test btn-primary linkBtn" data-placement="bottom" data-original-title="選択されたページヘのリンクを作成します。"><span><i data-icon=""></i>リンク</span></button>\
					</div>\
				</div>\
			';
			var elem = $(source);

			return elem;
		}

		/*
		 * 物件別ページ一覧を表示するメソッド
		 * @param	pageList		物件別ページ一覧データ
		 * @return	void
		 */
		,setPageList: function(pageList) {
			var thisObj = this;

			var source = '';
			for(var i=0,len=pageList.length; i<len; i++) {
				source += '<dt>' + pageList[i]['residences']['name'] + '</dt>';
				for (var j=0,len2=pageList[i]['smartphone_pages'].length; j<len2; j++) {
					source += '<dd data-page-id="' + pageList[i]['smartphone_pages'][j]['id'] + '">' + pageList[i]['smartphone_pages'][j]['title'] + '</dd>';
				}
			}

			thisObj._elems['mainModal'].find('.pageList').append($(source));
		}

		/*
		 * Web上の画像挿入Modalを開くメソッド
		 * @param	option		オプションオブジェクト
		 * @return	void
		 */
		,open: function(option) {
			var thisObj = this;

			if (thisObj._elems['mainModal']) {	// モーダルが存在しているなら、表示
				thisObj._elems['mainModal'].find('.pageList').find('> dd').removeClass('current').end().find('>dd[data-page-id="' + option['linkPageId'] + '"]').addClass('current');
				var height = $("#contentForUserAdmin").height();
				thisObj._elems['mainModal'].find('.pageList').height(height / 2);
				thisObj._elems['mainModal'].modal('show');
				thisObj.setEvent(true);

			} else {	// モーダルが存在していないなら、モーダル作成 > データリクエスト > 表示
				$("body").append(thisObj._elems['source']);
				thisObj._elems['mainModal'] = $('#' + thisObj._targetId);
				var initEventName = 'onInitRequestPageList';
				var completeEventName = 'onCompleteRequestPageList';
				var errorEventName = 'onErrorRequestPageList';

				$(thisObj._instances['DataManager'])
					.on(initEventName, function(event) {
						// console.log('SelectLinkPageModalManager :: ' + initEventName);
					})
					.on(completeEventName, function(event, pageList) {
						$(thisObj._instances['DataManager'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						thisObj.setPageList(pageList);
						thisObj._elems['mainModal'].find('.pageList').find('> dd').removeClass('current').end().find('>dd[data-page-id="' + option['linkPageId'] + '"]').addClass('current');
						var height = $("#contentForUserAdmin").height();
						thisObj._elems['mainModal'].find('.pageList').height(height / 2);
						thisObj._elems['mainModal'].modal('show');
						thisObj.setEvent(true);
					})
					.on(errorEventName, function(event, obj) {
						console.log('SelectLinkPageModalManager :: ' + errorEventName);
						$(thisObj._instances['DataManager'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
					})
				thisObj._instances['DataManager'].requestPageList();
			}
		}

		/*
		 * リンク解除ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickReleaseBtnHandler: function() {
			var thisObj = this;
			thisObj._elems['mainModal'].find('.pageList > dd').removeClass('current');
			var data = {id:'', title:''};
			$(thisObj).trigger('onSelectLinkPage', data);
			thisObj.close();
		}

		/*
		 * このクラスで管理しているモーダルを閉じるメソッド
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,close: function() {
			var thisObj = this;
			thisObj._elems['mainModal'].modal('hide');
			thisObj.setEvent(false);
		}

		/*
		 * リンク先ページ決定ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickLinkBtnHandler: function(event) {
			var thisObj = this;
			var currentNode = thisObj._elems['mainModal'].find('.pageList > dd.current');
			if (currentNode.length === 1) {
				var data = {
					id			: currentNode.attr('data-page-id'),
					title		: currentNode.text()
				};
				$(thisObj).trigger('onSelectLinkPage', data);
				thisObj.close();
			} else {
				var data = {id:'', title:''};
				$(thisObj).trigger('onSelectLinkPage', data);
				thisObj.close();
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				thisObj._elems['mainModal']
					.on('click', '.releaseBtn', thisObj.onClickReleaseBtnHandler)
					.on('click', '.linkBtn', thisObj.onClickLinkBtnHandler)
					.on('click', '.cancelBtn', thisObj.close)
					.on('click', '.pageList > dd', function(event) {
						thisObj._elems['mainModal']
							.find('.pageList > dd.current')
								.removeClass('current');
						$(this).addClass('current');
					});

					$('[data-placement][data-original-title]').tooltip();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['mainModal']
					.off('click', '.releaseBtn')
					.off('click', '.linkBtn')
					.off('click', '.cancelBtn')
					.off('click', '.pageList > dd');

				$('[data-placement][data-original-title]').tooltip('destroy');
				$("div.tooltip").remove();
			}
		}
	}
});
