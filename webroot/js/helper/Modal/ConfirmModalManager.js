

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Confirmダイアログ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.helper.Modal.ConfirmModalManager');
	MYNAMESPACE.modules.helper.Modal.ConfirmModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Modal.ConfirmModalManager.prototype = {
		_isEnabled						: false
		,_callback						: null
		,_targetId						: 'confirmModal'
		,_elems							: {}
		// ,_option						: {}

		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;

			// this._option = option;
			_.bindAll(
				this
				,'createElement'
				,'open'
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
						<p></p>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn close-btn"><span><i data-icon=""></i>キャンセル</span></button>\
						<button type="button" class="btn btn-primary agree-btn"><span><i data-icon=""></i>確認</span></button>\
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
			thisObj._callback = callback;

			if ($('#' + thisObj._targetId).length < 1) {
				$("body").append(thisObj._elems['modal']);
			}

			thisObj._elems['modal']
				.find('.modal-header > h3').html(options['title'])
			.end()
				.find('.close-btn > span')
					.html(options['close-btn-text'])
			.end()
				.find('.agree-btn > span')
					.html(options['agree-btn-text'])
			.end()
				.find('.modal-body > p').html(options['message'])
			.end()
				.modal('show');
			thisObj.setEvent(true);
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
