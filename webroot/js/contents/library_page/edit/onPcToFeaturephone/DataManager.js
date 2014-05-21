

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToFeaturephone.DataManager');
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.DataManager.prototype = {
		_isEventEnabled							: false
		,_instances						: {}
		,_isAccess						: false
		,_prop							: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			this._instances = {
				'Gateway'		: new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.Gateway(),
				'Util'			: new MYNAMESPACE.modules.helper.Util()
			}
			_.bindAll(
				this
				,'setPageSource'
				,'setProp'
				,'getProp'
			);
			this.setProp();
		}

		/*
		 * ページリストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,setPageSource: function(source) {
			var thisObj = this;
			var url = thisObj._prop['currentUrl'] + 'Page/setPageSource/';
			thisObj._instances['Util'].setStatus(true, 'データ保存中・・・');
			// console.log('setPageSource開始');
			$(thisObj._instances['Gateway'])
				.on('onCompleteSetPageSource', function(event, id) {
					$(thisObj._instances['Gateway'])
						.off('onCompleteSetPageSource')
						.off('onCompleteSetPageSource');
					thisObj._instances['Util'].setStatus(true, 'データ保存完了', 500);
					// console.log('ページソース保存完了 :: id = ' + id);
					if (id !== null) {
						thisObj._prop['pageSourceReacordId'] = id;
					}
				})
				.on('onErrorSetPageSource', function(event) {
					$(thisObj._instances['Gateway'])
						.off('onCompleteSetPageSource')
						.off('onCompleteSetPageSource');
					thisObj._instances['Util'].setStatus(true, 'データ保存失敗');
				});
			thisObj._instances['Gateway'].setPageSource(url, thisObj._prop['pageSourceReacordId'], thisObj._prop['residenceId'], thisObj._prop['userId'], source);
		}

		/*
		 * データをDBに保存する際のプロパティをオブジェクトにセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;
			thisObj._prop = {
				'pageSourceReacordId'		: $('input[type="hidden"][name="pageSourceReacordId"]').val(),
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				'pageId'					: $('input[type="hidden"][name="pageId"]').val(),
				'outlines'					: eval("(" + $('input[type="hidden"][name="outlines"]').val() + ")")
			}
			// console.log(thisObj._prop);
		}

		/*
		 * このクラスが保持しているプロパティを返すメソッド
		 * @param	void
		 * @return	このクラスが保持しているプロパティオブジェクト
		 */
		,getProp: function() {
			var thisObj = this;
			var cloneElementData = $.extend(true, {}, thisObj._prop);
			return cloneElementData;
		}
	}
});
