

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToFeaturephone.PageManager');
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.PageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.PageManager.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_editor								: null

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(dataManager, editor) {
			var thisObj = this;
			this._instances = {
				'DataManager'		: dataManager
			};
			this._editor = editor;
			_.bindAll(
				this
				,'onClickSaveBtnHandler'
				,'setEvent'
			);
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	void
		 * @return	void
		 */
		,onClickSaveBtnHandler: function(event) {
			var thisObj = this;
			var source = $("iframe").contents().find("body").html();
			thisObj._instances['DataManager'].setPageSource(source);
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEventEnabled === false) {
				thisObj._isEventEnabled = true;
				$('#container')
					.on('click', '#saveBtn', thisObj.onClickSaveBtnHandler);

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;
				$('#container')
					.on('click', '#saveBtn', thisObj.onClickSaveBtnHandler);
			}
		}
	}
});
