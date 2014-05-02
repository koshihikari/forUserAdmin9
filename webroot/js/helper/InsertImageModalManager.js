

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Web上の画像挿入Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.InsertImageModalManager');
	MYNAMESPACE.modules.InsertImageModalManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.InsertImageModalManager.prototype = {
		_isEnabled						: false
		,_targetId						: null
		,_elems							: {}
		,_option						: {}

		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(id, option) {
			var thisObj = this;

			this._targetId = id;
			this._option = option;
			_.bindAll(this, 'getElem', 'createElement', 'open', 'close', 'insertImage', 'setEvent');

			var rootElement = this.createElement(id);
			$("body").append(rootElement);
			this._elems		= {
				'all'			: rootElement,
				'mainModal'		: $('#' + id),
				'subModal'		: $('#' + id + '-2')
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
				<div id="' + id + '" class="modal hide fade insertImageOnWebModal">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3>ウェブ上の画像のURLを指定</h3>\
					</div>\
					<div class="modal-body">\
						<p>表示させたい画像のURLを指定し、「挿入」ボタンをクリックしてください。</p>\
						<div class="control-group">\
							<label class="control-label">表示する画像のURL</label>\
							<div class="controls">\
								<input type="text" value="" />\
							</div>\
						</div>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-test cancelBtn" data-placement="bottom" data-original-title="何もせず、このモーダルを閉じます。"><span><i data-icon=""></i>キャンセル</span></button>\
						<button type="button" class="btn btn-test btn-primary insertBtn" data-placement="bottom" data-original-title="入力されたURLの画像を挿入します。"><span><i data-icon=""></i>挿入</span></button>\
					</div>\
				</div>\
				<div id="' + id + '-2" class="modal hide fade insertImageOnWebModal">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
						<h3>エラー</h3>\
					</div>\
					<div class="modal-body">\
						<p>表示させたい画像のURLを入力して下さい。</p>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-test btn-primary okBtn"><span><i data-icon=""></i>OK</span></button>\
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
			if (option && option['imagePath'] !== null) {
				thisObj._elems['mainModal'].find('.modal-body input[type="text"]').val(option['imagePath']);
			}
			if (option && option['currentImagePath']) {
				thisObj._elems['mainModal'].find('.modal-body .current-image-path').val(option['currentImagePath']);
			}

			thisObj._elems['mainModal'].modal('show');
			thisObj.setEvent(true);
		}

		/*
		 * Web上の画像挿入Modalを閉じるメソッド
		 * @param	void
		 * @return	void
		 */
		,close: function() {
			var thisObj = this;
			thisObj._elems['mainModal'].modal('hide');
			thisObj.setEvent(false);
		}

		/*
		 * Web上の画像を挿入するメソッド
		 * @param	void
		 * @return	void
		 */
		,insertImage: function() {
			var thisObj = this;
			var val = thisObj._elems['mainModal'].find('.modal-body input[type="text"]').val();
			if (thisObj._option['ignoreWhitespace'] !== true && val === '') {
				thisObj._elems['subModal'].modal('show');
			} else {
				thisObj.close();
				$(thisObj).trigger('onAssignmentImage', val);
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
						.on('click', '.insertBtn', function(event) {
							console.log('挿入');
							thisObj.insertImage();
						})
						.on('click', '.cancelBtn', function(event) {
							thisObj.close();
						});
				thisObj._elems['subModal']
						.on('click', '.okBtn', function(event) {
							thisObj._elems['subModal'].modal('hide');
						});

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['mainModal']
						.off('click', '.insertBtn')
						.off('click', '.cancelBtn');

				thisObj._elems['subModal']
						.on('click', '.okBtn');
			}
		}
	}
});
