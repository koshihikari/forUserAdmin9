


jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
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
		,_hasPages						: false
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
			_.bindAll(
				this
				,'getElem'
				,'createElement'
				,'open'
				,'onClickReleaseBtnHandler'
				,'close'
				,'onClickLinkBtnHandler'
				,'setEvent'
			);

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
				<div id="' + id + '" class="modal container hide fade selectLinkPageModal">\
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
			// console.log('SelectLinkPageModalManager :: open');
			// console.log('option');
			// console.log(option);

			console.log('option[linkPageId] = ' + option['linkPageId']);
			if (thisObj._hasPages === false) {
				$(thisObj._option['dataManager'])
					.on('onCompleteRequestPageList', function(event, data) {
						$(thisObj._option['dataManager']).off('onCompleteRequestPageList');
						thisObj._pageListData = data;
						if (thisObj._pageListData.length < 1) {
							$(thisObj).trigger('noPage');
							return;
						}
						var sourceArr = [];
						var prop = thisObj._option['dataManager'].getProp();
						for (var i=0,len=data.length; i<len; i++) {
							var url = data[i]['smartphone_pages']['url'];
							if (url === null || url === '') {
								continue;
							}
							// console.log('linkUrl = ' + option['linkUrl']);
							// console.log('		linkUrl === url =  ' + (option['linkUrl'] === url));
							// console.log('		url =  ' + url);
							var source = '\
								<li data-page-id="' + data[i]['smartphone_pages']['id'] + '" data-placement="bottom" data-original-title="' + data[i]['smartphone_pages']['title'] + '">\
									<input type="hidden" name="index" value="' + i + '" />\
									<div>\
										<span class="thumb">';
							// if (url !== null) {
							// 	source += '\
							// 				<iframe src="' + url + '" scrolling="no"></iframe>';
							// } else {
								source += '\
											<div class="no_source"></div>';
							// }
								source += '\
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

						if (option && option['linkPageId']) {
							thisObj._elems['mainModal']
								.find('.releaseBtn')
									.removeClass('btn-disable')
							.end()
								.find('.linkBtn')
									.removeClass('btn-disable')
							.end()
								.find('.pageList > li')
									.removeClass('current')
							.end()
								.find('.pageList > li[data-page-id="' + option['linkPageId'] + '"]')
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
						thisObj._hasPages = true;
					});
				thisObj._option['dataManager'].requestPageList();
			} else {
				if (option && option['linkPageId']) {
					thisObj._elems['mainModal']
						.find('.releaseBtn')
							.removeClass('btn-disable')
					.end()
						.find('.linkBtn')
							.removeClass('btn-disable')
					.end()
						.find('.pageList > li')
							.removeClass('current')
					.end()
						.find('.pageList > li[data-page-id="' + option['linkPageId'] + '"]')
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
			}
		}

		/*
		 * リンク解除ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickReleaseBtnHandler: function() {
			var thisObj = this;
			thisObj._elems['mainModal'].find('.pageList > li').removeClass('current');
			var data = {url:'', id:'', title:''};
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
			$(thisObj._option['dataManager']).off('onCompleteRequestPageList');
			// thisObj._elems['mainModal']
			// 	.find('.pageList')
			// 		.find('> *')
			// 			.remove();
			thisObj._elems['mainModal'].modal('hide');
			thisObj.setEvent(false);
		}

		/*
		 * リンク先ページ決定ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		// ,linkPage: function() {
		,onClickLinkBtnHandler: function(event) {
			var thisObj = this;
			var index = thisObj._elems['mainModal'].find('.pageList > li.current input[type="hidden"][name="index"]').val();
			if (index !== undefined) {
				var data = {
					url			: thisObj._pageListData[index]['smartphone_pages']['url'],
					id			: thisObj._pageListData[index]['smartphone_pages']['id'],
					title		: thisObj._pageListData[index]['smartphone_pages']['title']
				};
				$(thisObj).trigger('onSelectLinkPage', data);
				thisObj.close();
			} else {
				var data = {url:'', id:'', title:''};
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
					.on('click', '.pageList > li', function(event) {
						thisObj._elems['mainModal']
							.find('.releaseBtn')
								.removeClass('btn-disable')
						.end()
							.find('.linkBtn')
								.removeClass('btn-disable')
						.end()
							.find('.pageList > li')
								.removeClass('current');
						$(this).addClass('current');
					});

					$('[data-placement][data-original-title]').tooltip();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['mainModal']
					.on('click', '.releaseBtn')
					.on('click', '.linkBtn')
					.on('click', '.cancelBtn')
					.off('click', '.pageList > li');

				$('[data-placement][data-original-title]').tooltip('destroy');
				$("div.tooltip").remove();
			}
		}
	}
});
