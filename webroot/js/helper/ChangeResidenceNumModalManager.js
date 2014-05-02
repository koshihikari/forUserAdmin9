

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * Web上の画像挿入Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.ChangeResidenceNumModalManager');
	MYNAMESPACE.modules.ChangeResidenceNumModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.ChangeResidenceNumModalManager.prototype = {
		_isEnabled						: false
		,_targetId						: 'residenceNumModal'
		,_elems							: {}
		,_currentResidenceNum			: ''
		
		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			
			_.bindAll(
				this
				,'getElem'
				,'createElement'
				,'open'
				,'close'
				,'changeResidenceNum'
				,'setEvent'
			);
			
			this._elems		= {
				'modal'		: this.createElement()
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
		 * @param	void
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function() {
			var thisObj				= this;

			var source = '\
				<div id="' + thisObj._targetId + '" class="modal hide fade">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3>物件番号変更</h3>\
					</div>\
					<div class="modal-body">\
						<p>変更後の物件番号を入力して「変更」ボタンをクリックして下さい。</p>\
						<div class="control-group">\
							<label class="control-label">現在の物件番号</label>\
							<div class="controls">\
								<span class="currentResidenceNum">123456789</span>\
							</div>\
						</div>\
						<div class="control-group">\
							<label class="control-label">変更後の物件番号</label>\
							<div class="controls">\
								<input type="text" name="newResidenceNum" value="" />\
							</div>\
						</div>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-test cancelBtn" data-placement="bottom" data-original-title="何もせず、このモーダルを閉じます。"><span><i data-icon=""></i>閉じる</span></button>\
						<button type="button" class="btn btn-test btn-primary changeBtn" data-placement="bottom" data-original-title="入力された物件番号に変更します。"><span><i data-icon=""></i>変更</span></button>\
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
		,open: function(residenceNum) {
			var thisObj = this;
			thisObj._prevResidenceNum = residenceNum;

			if ($('#' + thisObj._targetId).length < 1) {
				$("body").append(thisObj._elems['modal']);
			}

			thisObj._elems['modal']
				.find('.currentResidenceNum').text(residenceNum)
			.end()
				.find('input[type="text"][name="newResidenceNum"]').val('');
			// if (option && option['imagePath']) {
			// 	thisObj._elems['mainModal'].find('.modal-body input[type="text"]').val(option['imagePath']);
			// }

			thisObj._elems['modal'].modal('show');
			thisObj.setEvent(true);
			$(thisObj).trigger('onOpenModal');
		}
		
		/*
		 * Web上の画像挿入Modalを閉じるメソッド
		 * @param	void
		 * @return	void
		 */
		,close: function(event) {
			var thisObj = this;
			thisObj._elems['modal'].modal('hide');
			thisObj.setEvent(false);
			$(thisObj).trigger('onCloseModal');
		}

		/*
		 * Web上の画像を挿入するメソッド
		 * @param	void
		 * @return	void
		 */
		,changeResidenceNum: function(event) {
			var thisObj = this;
			var newResidenceNum = thisObj._elems['modal'].find('input[type="text"][name="newResidenceNum"]').val();
			if (thisObj._currentResidenceNum !== newResidenceNum) {
				$(thisObj).trigger('onChangeResidenceNum', newResidenceNum);
			}
			thisObj.close();
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
					.on('click', '.changeBtn', thisObj.changeResidenceNum)
					.on('click', '.cancelBtn', thisObj.close)
					
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['modal']
					.off('click', '.changeBtn', thisObj.changeResidenceNum)
					.off('click', '.cancelBtn', thisObj.close)
			}
		}
	}
});
