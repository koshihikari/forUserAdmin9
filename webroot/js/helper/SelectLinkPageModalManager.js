

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * リンク先ページ選択Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.SelectLinkPageModalManager');
	MYNAMESPACE.modules.SelectLinkPageModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.SelectLinkPageModalManager.prototype = {
		_isEnabled						: false
		,_targetId						: null
		,_elems							: {}
		,_option						: {}
		,_pageListData					: {}
		
		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(id, option) {
			var thisObj = this;
			
			this._targetId = id;
			this._option = option;
			_.bindAll(this, 'getElem', 'createElement', 'open', 'close', 'linkPage', 'setEvent');
			
			var rootElement = this.createElement(id);
			$("body").append(rootElement);
			this._elems		= {
				'all'			: rootElement,
				'mainModal'		: $('#' + id)
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
				return thisObj._elems['all'];
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
				<div id="' + id + '" class="modal hide fade selectLinkPageModal">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3>リンク先ページを選択</h3>\
					</div>\
					<div class="modal-body">\
						<p>リンクさせたいページを選択し、「リンク」ボタンをクリックしてください。</p>\
						<ul class="pageList"></ul>\
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
		 * Web上の画像挿入Modalを開くメソッド
		 * @param	option		オプションオブジェクト
		 * @return	void
		 */
		,open: function(option) {
			var thisObj = this;
			console.log('SelectLinkPageModalManager :: open');
			console.log('option');
			console.log(option);

			$(thisObj._option['dataManager'])
				.on('onCompleteRequestPageList', function(event, data) {
					$(thisObj._option['dataManager']).off('onCompleteRequestPageList');
					thisObj._pageListData = data;
					var sourceArr = [];
					var prop = thisObj._option['dataManager'].getProp();
					for (var i=0,len=data.length; i<len; i++) {
						var url = prop['currentUrl'] + 'Page/preview/s/' + prop['residenceId'] + '/' + data[i]['smartphone_pages']['id'] + '/?' + new Date().getTime();
						var source = '\
							<li data-page-id="' + data[i]['smartphone_pages']['id'] + '" data-placement="bottom" data-original-title="' + data[i]['smartphone_pages']['title'] + '">\
								<input type="hidden" name="index" value="' + i + '" />\
								<div>\
									<span class="thumb">\
										<iframe src="' + url + '" scrolling="no" style="width:100%; height:100px; border:none"></iframe>\
										<div class="cover"></div>\
									</span>\
									<p class="pageTitle">' + data[i]['smartphone_pages']['title'] + '</p>\
								</div>\
							</li>\
						';
						sourceArr.push(source);
					}
					
					thisObj._elems['mainModal']
						.find('.pageList')
							.find('> *')
								.remove()
						.end()
							.append($(sourceArr.join('')));

					if (option && option['currentPageId']) {
						thisObj._elems['mainModal']
							.find('.releaseBtn')
								.removeClass('btn-disable')
						.end()
							.find('.linkBtn')
								.removeClass('btn-disable')
						.end()
							.find('.pageList > li[data-page-id="' + option['currentPageId'] + '"]')
								.addClass('current');
					} else {
						thisObj._elems['mainModal']
							.find('.releaseBtn')
								.addClass('btn-disable')
						.end()
							.find('.linkBtn')
								.addClass('btn-disable')
						.end()
							.find('.pageList > li')
								.removeClass('current');
					}

					thisObj._elems['mainModal'].modal('show');
					thisObj.setEvent(true);
				});
			thisObj._option['dataManager'].requestPageList();
		}
		
		/*
		 * Web上の画像挿入Modalを閉じるメソッド
		 * @param	void
		 * @return	void
		 */
		,close: function() {
			var thisObj = this;
			$(thisObj._option['dataManager']).off('onCompleteRequestPageList');
			thisObj._elems['mainModal']
				.find('.pageList')
					.find('> *')
						.remove();
			thisObj._elems['mainModal'].modal('hide');
			thisObj.setEvent(false);
		}

		/*
		 * Web上の画像を挿入するメソッド
		 * @param	void
		 * @return	void
		 */
		,linkPage: function() {
			var thisObj = this;
			var index = thisObj._elems['mainModal'].find('.pageList > li.current input[type="hidden"][name="index"]').val();
			console.log('index = ' + index);
			if (index !== undefined) {
				var data = {id:thisObj._pageListData[index]['smartphone_pages']['id'], title:thisObj._pageListData[index]['smartphone_pages']['title']};
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
					.find('.releaseBtn')
						.on('click', function(event) {
							$(thisObj).trigger('onSelectLinkPage', {id:'', title:''});
							thisObj.close();
						})
				.end()
					.find('.linkBtn')
						.on('click', function(event) {
							thisObj.linkPage();
						})
				.end()
					.find('.cancelBtn')
						.on('click', function(event) {
							thisObj.close();
						})
				.end()
					.find('.pageList > li')
						.on('click', function(event) {
							$('.selectLinkPageModal')
								.find('.releaseBtn')
									.removeClass('btn-disable')
							.end()
								.find('.linkBtn')
									.removeClass('btn-disable')
							.end()
								.find('.pageList > li')
									.removeClass('current');
							$(event.currentTarget).addClass('current');
						});
						
					$('[data-placement][data-original-title]').tooltip();
					
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['mainModal']
					.find('.linkBtn')
						.off('click')
				.end()
					.find('.cancelBtn')
						.off('click')
				.end()
					.find('.pageList > li')
						.off('click');
					$('[data-placement][data-original-title]').tooltip('destroy');
			}
		}
	}
});
