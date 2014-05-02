

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToFeaturephone.LayoutManager');
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.LayoutManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.LayoutManager.prototype = {
		_isEventEnabled							: false
		,_editor									: null
		,_isOnceEventEnabled					: false
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		// ,initialize: function(methodObj) {
		,initialize: function(editor) {
			var thisObj = this;
			this._editor = editor;
			_.bindAll(
				this
				,'onResizeWindow'
				,'setOnceEvent'
				,'setEvent'
			);
			
			this.onResizeWindow();
		}
		
		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var height = $("#contentForUserAdmin").height();
			$('.previewArea').height(height - 65);
			thisObj._editor.refresh();
			$(thisObj).trigger('onCompleteResize');
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(window)
					.on('resize', function(event) {
						thisObj.onResizeWindow(event);
					})
			}
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

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;
			}
		}
	}
});
