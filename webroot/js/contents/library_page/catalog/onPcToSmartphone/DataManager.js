

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.catalog.onPcToSmartphone.DataManager');
	MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.DataManager.prototype = {
		_isEnabled						: false
		,_prop							: {}
		,_data							: {}
		// ,_instances						: {}
		,_isAccess						: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		// ,initialize: function(DataManager) {
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'setProp'
				,'getProp'
				,'request'
				,'insert'
				,'delete'
				,'update'
				,'requestSiteList'
			);

			// this._instances = {
			// 	'DataManager'	: DataManager
			// };

			this.setProp();
		}

		/*
		 * データをDBに保存する際のプロパティをオブジェクトにセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;

			thisObj._prop = {
				'isLibraryElementPage'		: $('input[type="hidden"][name="isLibraryElementPage"]').val() === "1" ? true : false,
				'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'residencePath'				: $('input[type="hidden"][name="residencePath"]').val(),
				'companyId'					: $('input[type="hidden"][name="companyId"]').val(),
				'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				'previewUrl'				: $('input[type="hidden"][name="previewUrl"]').val()
			}
		}

		/*
		 * データをDBに保存する際のプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		// ,getData: function(key) {
		,getProp: function() {
			var thisObj = this;
			// return thisObj._data[key];
			return thisObj._prop;
		}
		,getData: function() {
			var thisObj = this;
			// return thisObj._data[key];
			return thisObj._prop;
		}

		/*
		 * ページリストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,request: function() {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// console.log('リクエスト開始');

				var url, elemnetModelName;
				// var prop = thisObj._instances['DataManager'].getData('prop');
				var prop = thisObj._prop;
				if (prop['isLibraryElementPage'] === true) {
					url = prop['currentUrl'] + 'Library/getLibraryList/';
					elemnetModelName = 'smartphone_library_elements';

				} else {
					url = prop['currentUrl'] + 'Page/getPageList/';
					elemnetModelName = 'smartphone_page_elements';
				}
				// var url = thisObj._prop['currentUrl'] + 'Page/requestPage/';
				// thisObj._instances['Util'].setStatus(true, 'データリクエスト中・・・');
				console.log('company_id = ' + prop['companyId']);
				$.ajax({
					type: "POST",
					url: url,
					data: {
						'device_name'				: 'smartphone',
						'device_num'				: 2,
						'company_id'				: prop['companyId'],
						'residence_id'				: prop['residenceId']
					},
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log(obj);
						thisObj._isAccess = false;
						/*
						thisObj._instances['Util'].setStatus(false);
						// thisObj._instances['Util'].setStatus(false);
						*/
						$(thisObj).trigger('onCompleteRequest', [obj['data']]);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: request');
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

		/*
		 * ページを追加するメソッド
		 * @param	void
		 * @return	void
		 */
		,insert: function() {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				var url = thisObj._prop['currentUrl'] + 'Page/insertPage/';
				// thisObj._instances['Util'].setStatus(true, 'ページ追加中・・・');
				var url;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/insertLibrary/';

				} else {
					url = thisObj._prop['currentUrl'] + 'Page/insertPage/';
				}
				$(thisObj).trigger('onInitInsert');
				$.ajax({
					type: "POST",
					url: url,
					data: {
						'residence_id'				: thisObj._prop['residenceId'],
						'device_num'				: 2,
						'user_id'					: thisObj._prop['userId']
					},
					dataType: "json",
					success: function(obj){
						console.log('追加完了');
						console.log(obj);
						// thisObj._instances['Util'].setStatus(false);
						thisObj._isAccess = false;
						// thisObj._instances['Util'].setStatus(false);
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteInsert', [obj['data']]);
						} else {
							$(thisObj).trigger('onErrorInsert');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insert');
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

		/*
		 * ページを削除するメソッド
		 * @param	recordId		削除するレコードのID
		 * @return	void
		 */
		,delete: function(recordId) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				// var url = thisObj._prop['currentUrl'] + 'Page/deletePage/';
				var url;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/deleteLibrary/';
				} else {
					url = thisObj._prop['currentUrl'] + 'Page/deletePage/';
				}
				$(thisObj).trigger('onInitDelete', recordId);
				// thisObj._instances['Util'].setStatus(true, 'ページ削除中・・・');
				$.ajax({
					type: "POST",
					url: url,
					data: {
						'residence_id'				: thisObj._prop['residenceId'],
						'device_num'				: 2,
						'record_id'					: recordId
					},
					dataType: "json",
					success: function(obj){
						// console.log(obj);
						// thisObj._instances['Util'].setStatus(false);
						thisObj._isAccess = false;
						// thisObj._instances['Util'].setStatus(false);
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteDelete');
						} else {
							$(thisObj).trigger('onCErrorDelete');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: delete');
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

		/*
		 * ページを更新するメソッド
		 * @param	updateData		更新するデータ
		 * @return	void
		 */
		,update: function(recordId, updateData) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				// console.log(updateData);
				// return;
				// var url = thisObj._prop['currentUrl'] + 'Page/updatePage/';
				var url;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/updateLibrary/';
				} else {
					url = thisObj._prop['currentUrl'] + 'Page/updatePage/';
				}
				var sendData = {
					'device_num'				: 2,
					'updateData'				: updateData
					// 'updateData'				: {
					// 	'id'						: recordId,
					// 	'title'						: pageTitle,
					// 	'user_id'					: thisObj._prop['userId']
					// }
				}
				$(thisObj).trigger('onInitUpdate');
				// thisObj._instances['Util'].setStatus(true, 'ページデータ更新中・・・');
				$.ajax({
					type: "POST",
					url: url,
					data: sendData,
					dataType: "json",
					success: function(obj){
						// console.log(obj);
						// thisObj._instances['Util'].setStatus(false);
						thisObj._isAccess = false;
						// thisObj._instances['Util'].setStatus(false);
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteUpdate');
						} else {
							$(thisObj).trigger('onErrorUpdate');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: update');
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

		/*
		 * サイトデータ取得メソッド
		 * @param	updateData		更新するデータ
		 * @return	void
		 */
		,requestSiteList: function(companyId, isLibrary) {
			var thisObj = this;

			if (thisObj._data['siteList']) {
				$(thisObj).trigger('onCompleteRequestSiteList', thisObj._data['siteList']);

			} else if (!thisObj._data['siteList'] && thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// thisObj._callback = callback;
				var postData = {
					// 'id'				: options['recordId'],
					'company-id'		: companyId,
					'is-library'		: isLibrary
				}
				$(thisObj).trigger('onInitRequestSiteList');

				setTimeout(
					function(event) {
						console.log('setTimeout成功');
						thisObj._isAccess = false;
						thisObj._data['siteList'] = {
							// 'result'		: true,
							// 'data'			: {
								'residences'	: [
									{
										'id'				: 5,
										'is_company_site'	: 1,
										'path'				: null,
										'name'				: '日神不動産株式会社'
									},
									{
										'id'				: 6,
										'is_company_site'	: 0,
										'path'				: null,
										'name'				: 'TOKYO TWINKLE PROJECT'
									},
									{
										'id'				: 7,
										'is_company_site'	: 0,
										'path'				: null,
										'name'				: 'パレステージ浅草橋'
									}
								]
							// }
						}
						$(thisObj).trigger('onCompleteRequestSiteList', thisObj._data['siteList']);
					},
					3000
				);
				// $.ajax(
				// 	{
				// 		type		: "POST",
				// 		url			: thisObj._prop['currentUrl'] + 'Site/getSiteList/',
				// 		data		: postData,
				// 		dataType	: "json"
				// 	})
				// 	.done(function(obj) {
				// 		console.log('成功');
				// 		console.log(obj);
				// 		thisObj._isAccess = false;
				// 		$(thisObj).trigger('onCompleteRequestSiteList', obj);
				// 		// if (callback) {
				// 		// 	callback(obj);
				// 		// }
				// 	})
				// 	.fail(function(obj) {
				// 		console.log('失敗');
				// 		console.log(obj);
				// 		$(thisObj).trigger('onErrorRequestSiteList');
				// 	})
			}
		}
	}
});
