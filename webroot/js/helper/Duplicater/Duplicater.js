/**
 * ライブラリ/パーツ複製クラス
 * @author DefaultUser
 * 必要クラス
 	modules.helper.Gateway
 */
jQuery.noConflict();
jQuery(document).ready(function($){
	MYNAMESPACE.namespace('modules.helper.Duplicater.Duplicater');
	MYNAMESPACE.modules.helper.Duplicater.Duplicater = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Duplicater.Duplicater.prototype = {
		_instances						: {}
		,_prop							: {}
		,_isAccess						: false

		// コンストラクタ
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'duplicatePage'
				// ,'duplicatePage'
			);
			this._instances = instances;
		}

		/*
		 * プロパティセットメソッド
		 * @param	userId 		ユーザID
		 * @param	userId	 	カレントURL
		 * @param	deviceNum 	デバイス番号
		 * @return	void
		 */
		,setProp: function(userId, currentUrl, deviceNum) {
			var thisObj = this;
			thisObj._prop = {
				'userId'			: userId,
				'currentUrl'		: currentUrl,
				'deviceNum'			: deviceNum
			}
		}

		/*
		 * 物件ページ複製メソッド
		 * @param	userId 				コピーしようとしているユーザのユーザID
		 * @param	fromCompanyId 		複製元企業ID
		 * @param	fromResidenceId		複製元物件ID
		 * @param	fromPageId 			複製元ページID
		 * @param	toCompanyId 		複製先企業ID
		 * @param	toResidenceId	 	複製先物件ID
		 * @return	void
		 */
		,duplicatePage: function(fromCompanyId, fromResidenceId, fromPageId, toCompanyId, toResidenceId) {
			var thisObj = this;

			console.log('LibraryPageCopyModalManager :: duplicatePage');
			console.log('	isAccessable = ' + thisObj._instances['Gateway'].isAccessable());

			if (thisObj._instances['Gateway'].isAccessable() === true) {
				var sendData = {
					'device_num'				: thisObj._prop['deviceNum'],
					'user_id'					: thisObj._prop['userId'],
					'is_library_copy'			: false,
					'from_company_id'			: fromCompanyId,
					'from_residence_id'			: fromResidenceId,
					'from_page_id'				: fromPageId,
					'to_company_id'				: toCompanyId,
					'to_residence_id'			: toResidenceId
				}
				var url = thisObj._prop['currentUrl'] + 'Util/duplicate/';
				var initEventName = 'onInitDuplicatePage';
				var completeEventName = 'onCompleteDuplicatePage';
				var errorEventName = 'onErrorDuplicatePage';

				$(thisObj._instances['Gateway'])
					.on(initEventName, function(event) {
						console.log('物件ページ複製開始');
						$(thisObj).trigger(initEventName);
					})
					.on(completeEventName, function(event, data) {
						console.log('物件ページ複製完了');
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						$(thisObj).trigger(completeEventName);
					})
					.on(errorEventName, function(event, data) {
						console.log('物件ページ複製失敗');
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						$(thisObj).trigger(errorEventName);
					});

				thisObj._instances['Gateway'].access(url, sendData, initEventName, completeEventName, errorEventName);
			}
		}
	}
});
