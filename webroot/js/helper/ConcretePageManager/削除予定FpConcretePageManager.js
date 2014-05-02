

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.helper.ConcretePageManager.FpConcretePageManager');
	MYNAMESPACE.modules.helper.ConcretePageManager.FpConcretePageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.ConcretePageManager.FpConcretePageManager.prototype = {
		_isAccess						: false
		,_instances						: {}
		// ,_libraryPageIds				: []

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'publish'
			);
			console.log('ConcretePageManager.FpConcretePageManager :: initialize');
			thisObj._instances = instances;
		}

		/*
		 * ページを更新するメソッド
		 * @param	updateData		更新するデータ
		 * @return	void
		 */
		,publish: function(userId, companyId, residenceId, recordId, title, path) {
		// ,publish: function(recordId, title, path, userId, compnayId, residenceId, url) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				var prop = thisObj._instances['DataManager'].getProp();
				var userId = prop['userId'];
				var compnayId = prop['companyId'];
				// var residenceId = prop['residenceId'];
				var url = prop['currentUrl'] + 'Page/publishConcretePage/';

				// var url = thisObj._prop['currentUrl'] + 'Page/publishConcretePage/';
				var sendData = {
					// 'residence_id'		: residenceId,
					'device_num'		: 8,
					'id'				: recordId,
					'user_id'			: userId,
					'title'				: title,
					'path'				: path,
					'company_id'		: compnayId,
					'residence_id'		: residenceId
					// 'path'				: path,
					// 'title'				: title,
					// 'source'			: source
				}
				console.log('');
				console.log('');
				console.log('url = ' + url);
				console.log('sendData');
				console.log(sendData);
				console.log('');
				console.log('');
				// return;
				$(thisObj).trigger('onInitPublishConcretePage', recordId);
				$.ajax({
					type: "POST",
					url: url,
					data: sendData,
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompletePublishConcretePage', [obj['data']]);
							// $(thisObj).trigger('onCompletePublishConcretePage', recordId);
						} else {
							$(thisObj).trigger('onErrorPublishConcretePage', recordId);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: publishConcretePage');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						$(thisObj).trigger('onErrorPublishConcretePage', [recordId, XMLHttpRequest, textStatus, errorThrown]);
						thisObj._isAccess = false;
					}
				});
			}
		}
	}
});
