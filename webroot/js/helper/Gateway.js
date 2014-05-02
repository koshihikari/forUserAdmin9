/**
 * ...
 * サーバアクセス制御クラス
 * @author DefaultUser
 */
jQuery.noConflict();
jQuery(document).ready(function($){
	MYNAMESPACE.namespace('modules.helper.Gateway');
	MYNAMESPACE.modules.helper.Gateway = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Gateway.prototype = {
		_isAccess						: false

		// コンストラクタ
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'isAccessable'
				,'access'
			);
		}

		/*
		 * サーバアクセス可能かどうかを返すメソッド
		 * @param	void
		 * @return	true===サーバアクセス可能、false===サーバアクセス不可能
		 */
		,isAccessable: function() {
			var thisObj = this;
			return !thisObj._isAccess;
		}

		/*
		 * サーバアクセスメソッド
		 * @param	url 					アクセス先URL
		 * @param	data					サーバに渡すデータ
		 * @param	initEventName 			処理開始時のイベント名
		 * @param	completeEventName 		処理完了時のイベント名
		 * @param	errorEventName	 		処理エラー時のイベント名
		 * @return	void
		 */
		,access: function(url, data, initEventName, completeEventName, errorEventName) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				$(thisObj).trigger(initEventName);

				$.ajax(
					{
						type		: "POST",
						url			: url,
						data		: data,
						dataType	: "json"
					})
					.done(function(obj) {
						console.log('成功');
						console.log(obj);
						thisObj._isAccess = false;
						$(thisObj).trigger(completeEventName, obj);
					})
					.fail(function(obj) {
						console.log('失敗');
						console.log(obj);
						$(thisObj).trigger(errorEventName, obj);
					});
			} else {
				// $(thisObj).trigger('');
			}
		}
	}
});
