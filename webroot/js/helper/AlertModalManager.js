

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * Web上の画像挿入Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.AlertModalManager');
	MYNAMESPACE.modules.AlertModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.AlertModalManager.prototype = {
		_isEnabled						: false
		,_targetId						: 'alertModal'
		,_elems							: {}
		,_option						: {}

		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(option) {
			var thisObj = this;

			this._option = option;
			_.bindAll(
				this
				,'createElement'
				,'open'
				,'close'
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
						<button type="button" class="btn btn-test btn-primary closeBtn" data-placement="bottom" data-original-title="このダイアログを閉じます。"><span><i data-icon=""></i>閉じる</span></button>\
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
		,open: function(title, message) {
			var thisObj = this;

			if ($('#' + thisObj._targetId).length < 1) {
				$("body").append(thisObj._elems['modal']);
			}

			thisObj._elems['modal']
				.find('.modal-header > h3').html(title)
			.end()
				.find('.modal-body > p').html(message);
			thisObj._elems['modal'].modal('show');
			thisObj.setEvent(true);
		}

		/*
		 * Web上の画像挿入Modalを閉じるメソッド
		 * @param	void
		 * @return	void
		 */
		,close: function() {
			var thisObj = this;
			thisObj._elems['modal'].modal('hide');
			thisObj.setEvent(false);
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
					.find('.closeBtn')
						.on('click', function(event) {
							thisObj.close();
						});

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['modal']
					.find('.closeBtn')
						.off('click');
			}
		}
	}
});
