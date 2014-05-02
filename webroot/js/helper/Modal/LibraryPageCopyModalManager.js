

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Confirmダイアログ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.helper.Modal.LibraryPageCopyModalManager');
	MYNAMESPACE.modules.helper.Modal.LibraryPageCopyModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Modal.LibraryPageCopyModalManager.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_isAccess						: false
		,_callback						: null
		,_targetId						: 'libraryPageCopyModalManagerModal'
		,_elems							: {}
		// ,_option						: {}

		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			this._instances = instances;

			// this._option = option;
			_.bindAll(
				this
				,'createElement'
				,'open'
				,'copy'
				,'onClickCloseBtnHandler'
				,'onClickAgreeBtnHandler'
				,'setEvent'
			);

			// $("body").append(rootElement);
			this._elems		= {
				'modal'		: this.createElement()
			}
		}

		/*
		 * このクラスが管理するエレメントを作成し、作成したエレメントを返すメソッド
		 * @param	id 		このクラスが管理するエレメントのコンてナのIDp
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function() {
			var thisObj	= this;

			var source = '\
				<div id="' + thisObj._targetId + '" class="modal hide fade">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3></h3>\
					</div>\
					<div class="modal-body">\
						<p>〇〇のコピー先サイトを選択してください。</p>\
						<div class="controls">\
							<div class="group">\
								<button type="button" class="btn btn-primary switchBtn current-site-btn" data-item-name="linkUrlBtn" data-placement="bottom" data-original-title="リンク先URLを直接入力します。"><span><i data-icon=""></i>リンク先URLを指定</span></button>\
							</div>\
							<div class="group">\
								<button type="button" class="btn btn-primary switchBtn other-site-btn" data-item-name="linkUrlBtn" data-placement="bottom" data-original-title="リンク先URLを直接入力します。"><span><i data-icon=""></i>リンク先URLを指定</span></button>\
								<div class="site-list-wrapper">\
									<ul>\
										<li>\
											<div>日神不動産株式会社</div>\
										</li>\
										<li>\
											<div>TOKYO TWINKLE PROJECT</div>\
										</li>\
										<li>\
											<div>パレステージ浅草橋</div>\
										</li>\
									</ul>\
								</div>\
							</div>\
						</div>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn close-btn"><span><i data-icon=""></i>キャンセル</span></button>\
						<button type="button" class="btn btn-primary agree-btn"><span><i data-icon=""></i>コピー</span></button>\
					</div>\
				</div>\
			';

			return $(source);
		}

		/*
		 * Web上の画像挿入Modalを開くメソッド
		 * @param	option		オプションオブジェクト
		 * @return	void
		 */
		,open: function(options, callback) {
			var thisObj = this;

			$(thisObj._instances['DataManager'])
				.on('onCompleteRequestSiteList', function(event, data) {
					$(thisObj._instances['DataManager']).off('onCompleteRequestSiteList');
					console.log('LibraryPageCopyModalManager');
					console.log(data);

					// var source = '';
					// source += '<ul>';
					// for (var i=0,len=data['residences'].length; i<len; i++) {
					// 	source += '
					// 		<li>
					// 	';
					// }
					// source += '</ul>';
					thisObj._elems['modal'].modal('show');
				});
			var prop = thisObj._instances['DataManager'].getProp();
			thisObj._instances['DataManager'].requestSiteList(prop['companyId'], prop['isLibraryElementPage']);



			/*
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
					var hasLinkedPage = false;
					for (var i=0,len=data.length; i<len; i++) {
						var url = data[i]['smartphone_pages']['url'];
						if (url === null || url === '') {
							continue;
						}
						console.log('linkUrl = ' + option['linkUrl']);
						console.log('		linkUrl === url =  ' + (option['linkUrl'] === url));
						var className = option['linkUrl'] === url ? ' current' : '';
						hasLinkedPage = option['linkUrl'] === url ? true : hasLinkedPage;
						var source = '\
							<li class="' + className  +'" data-page-id="' + data[i]['smartphone_pages']['id'] + '" data-placement="bottom" data-original-title="' + data[i]['smartphone_pages']['title'] + '">\
								<input type="hidden" name="index" value="' + i + '" />\
								<div>\
									<span class="thumb">';
						if (url !== null) {
							source += '\
										<iframe src="' + url + '" scrolling="no"></iframe>';
						} else {
							source += '\
										<div class="no_source"></div>';
						}
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

					// if (option && option['currentPageId']) {
					if (hasLinkedPage === true) {
						thisObj._elems['mainModal']
							.find('.releaseBtn')
								.removeClass('btn-disable')
						.end()
							.find('.linkBtn')
								.removeClass('btn-disable')
						// .end()
						// 	.find('.pageList > li[data-page-id="' + option['currentPageId'] + '"]')
						// 		.addClass('current');
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
			*/
		}

		/*
		 * closeButtonがクリックされた際にコールされるメソッドハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,copy: function() {
			var thisObj = this;
			var fromCompanyId = 3;
			var fromResidenceId = 15;
			var fromPageId = 306;
			var toCompanyId = 3;
			var toResidenceId = 13;
			var initEventName = 'onInitDuplicatePage';
			var completeEventName = 'onCompleteDuplicatePage';
			var errorEventName = 'onErrorDuplicatePage';

			console.log('LibraryPageCopyModalManager :: copy');

			$(thisObj._instances['Duplicater'])
				.on(initEventName, function(event) {
					console.log('ページコピー開始');
				})
				.on(completeEventName, function(event) {
					$(thisObj._instances['Duplicater'])
						.off(initEventName)
						.off(completeEventName)
						.off(errorEventName);
					console.log('ページコピー完了');
				})
				.on(errorEventName, function(event) {
					$(thisObj._instances['Duplicater'])
						.off(initEventName)
						.off(completeEventName)
						.off(errorEventName);
					console.log('ページコピー失敗');
				});
			thisObj._instances['Duplicater'].duplicatePage(fromCompanyId, fromResidenceId, fromPageId, toCompanyId, toResidenceId);
		}

		/*
		 * closeButtonがクリックされた際にコールされるメソッドハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickCloseBtnHandler: function(event) {
			var thisObj = this;
			thisObj._elems['modal'].modal('hide');
			thisObj.setEvent(false);
		}

		/*
		 * agreeButtonがクリックされた際にコールされるメソッドハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAgreeBtnHandler: function(event) {
			var thisObj = this;
			thisObj.onClickCloseBtnHandler();
			if (thisObj._callback) {
				thisObj._callback();
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

				thisObj._elems['modal']
					.on('click', '.close-btn', thisObj.onClickCloseBtnHandler)
					.on('click', '.agree-btn', thisObj.onClickAgreeBtnHandler)

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['modal']
					.off('click', '.close-btn')
					.off('click', '.agree-btn')
			}
		}
	}
});
