

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToFeaturephone.Gateway');
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.Gateway = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.Gateway.prototype = {
		_isEventEnabled							: false
		,_isAccess						: false
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'setPageSource'
			);
		}

		/*
		 * ページリストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,setPageSource: function(url, recordId, residenceId, userId, source) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// console.log('リクエスト開始');
				var sendData = {
					'id'				: recordId,
					'residence_id'		: residenceId,
					// 'page_id'			: pageId,
					'user_id'			: userId,
					'source'			: source,
					'device_name'		: 'Featurephone'
				}
				// console.log('--------------------------');
				// console.log('url = ' + url);
				// console.log(sendData);
				// console.log('--------------------------');
				$(thisObj).trigger('onInitSetPageSource');
				$.ajax({
					type: "POST",
					url: url,
					data: sendData,
					dataType: "json",
					success: function(obj){
						// console.log('ページソース書き込み完了');
						console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteSetPageSource', [obj['id']]);
						} else {
							$(thisObj).trigger('onErrorSetPageSource');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: setPageSource');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
					}
				});
			}
		}
	}
});
