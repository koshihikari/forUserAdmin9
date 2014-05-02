

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.catalog.onPcToFeaturephone.DataManager');
	MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.DataManager.prototype = {
		_instances						: {}
		,_isEnabled						: false
		,_prop							: {}
		,_data							: {}
		,_isAccess						: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'setProp'
				,'getProp'
				,'request'
				,'insert'
				,'delete'
			);

			this._instances = instances;
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
				// 'isLibraryElementPage'		: $('input[type="hidden"][name="isLibraryElementPage"]').val() === "1" ? true : false,
				'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'residencePath'				: $('input[type="hidden"][name="residencePath"]').val(),
				'companyId'					: $('input[type="hidden"][name="companyId"]').val(),
				'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val()
				// 'previewUrl'				: $('input[type="hidden"][name="previewUrl"]').val()
			}
		}

		/*
		 * このクラスの保持するプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getProp: function() {
			var thisObj = this;
			var cloneElementData = $.extend(true, {}, thisObj._prop);
			return cloneElementData;
		}

		/*
		 * ページデータをセットするメソッド
		 * @param	data		ページデータ
		 * @return	void
		 */
		 /*
		,setPagesData: function(data) {
			var thisObj = this;
			thisObj._data['pages'] = data;
		}
		*/

		/*
		 * ページデータを追加するメソッド
		 * @param	data		追加するデータ
		 * @param	index		インデックス(-1で先頭に追加、undefinedで末尾に追加)
		 * @return	void
		 */
		 /*
		,addPagesData: function(data, index) {
			var thisObj = this;
			if (index === -1 || index === 0) {
				thisObj._data['pages'].unshift(data);
			} else if (index === undefined || index === thisObj._data['pages'].length) {
				thisObj._data['pages'].push(data);
			} else if (!isNaN(index) === true) {
				thisObj._data['pages'].slice(index, 0, data);
			}
		}
		*/

		/*
		 * ページデータを更新するメソッド
		 * @param	recordId		削除するデータのレコードID
		 * @return	void
		 */
		 /*
		,refreshPagesData: function(data) {
			var thisObj = this;
			var index = -1;
			for (var i=0,len=thisObj._data['pages'].length; i<len; i++) {
				if (+thisObj._data['pages'][i]['featurephone_pages']['id'] === recordId) {
					index = i;
					break;
				}
			}
			if (0 < index) {
				thisObj._data['pages'].splice(index, 1);
			}
		}
		*/

		/*
		 * ページデータを削除するメソッド
		 * @param	recordId		削除するデータのレコードID
		 * @return	void
		 */
		 /*
		,delPagesData: function(recordId) {
			var thisObj = this;
			var index = -1;
			for (var i=0,len=thisObj._data['pages'].length; i<len; i++) {
				if (+thisObj._data['pages'][i]['featurephone_pages']['id'] === recordId) {
					index = i;
					break;
				}
			}
			if (0 < index) {
				thisObj._data['pages'].splice(index, 1);
			}
		}
		*/

		/*
		 * ページデータを返すメソッド
		 * @param	void
		 * @return	データ
		 */
		 /*
		,getPagesData: function() {
			var thisObj = this;
			var cloneData = $.extend(true, {}, thisObj._data['pages']);
			var fixedClone = [];
			for (var index in cloneData) {
				if (!isNaN(index) === true) {
					fixedClone[+index] = cloneData[index];
				}
			}
			return fixedClone;
		}
		*/

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

				// var url, elemnetModelName;
				var prop = thisObj.getProp();
				// var prop = thisObj._prop;
				// if (prop['isLibraryElementPage'] === true) {
				// 	url = prop['currentUrl'] + 'Library/getLibraryList/';
				// 	elemnetModelName = 'smartphone_library_elements';

				// } else {
					var url = prop['currentUrl'] + 'Page/getPageList/';
					// elemnetModelName = 'smartphone_page_elements';
				// }
					var sendData = {
						'device_name'		: 'featurephone',
						'device_num'		: 8,
						'residence_id'		: prop['residenceId']
					}
				// var url = thisObj._prop['currentUrl'] + 'Page/requestPage/';
				// thisObj._instances['Util'].setStatus(true, 'データリクエスト中・・・');
				$.ajax({
					type: "POST",
					url: url,
					data: sendData,
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log(obj);
						thisObj._isAccess = false;
						/*
						thisObj._instances['Util'].setStatus(false);
						// thisObj._instances['Util'].setStatus(false);
						*/
						// thisObj.setPagesData(obj['data']);
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

			console.log('LibraryPageCopyModalManager :: insert');
			console.log('	isAccessable = ' + thisObj._instances['Gateway'].isAccessable());

			if (thisObj._instances['Gateway'].isAccessable() === true) {
				var url = thisObj._prop['currentUrl'] + 'Page/insertPage/';
				var sendData = {
					'residence_id'				: thisObj._prop['residenceId'],
					'device_name'				: 'featurephone',
					'device_num'				: 8,
					'user_id'					: thisObj._prop['userId']
				}
				var initEventName = 'onInitInsert';
				var completeEventName = 'onCompleteInsert';
				var errorEventName = 'onErrorInsert';

				$(thisObj._instances['Gateway'])
					.on(initEventName, function(event) {
						console.log('ページ追加開始');
						$(thisObj).trigger(initEventName);
					})
					.on(completeEventName, function(event, data) {
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						if (data['result'] === true) {
							console.log('ページ追加完了');
							console.log(data);
							// thisObj.addPagesData(obj['data']);
							$(thisObj).trigger(completeEventName, [data['data']]);
						} else {
							console.log('ページ追加失敗');
							$(thisObj).trigger(errorEventName);
						}
					})
					.on(errorEventName, function(event, data) {
						console.log('ページ追加失敗');
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						$(thisObj).trigger(errorEventName);
					});

				thisObj._instances['Gateway'].access(url, sendData, initEventName, completeEventName, errorEventName);
			}

			/*
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				var url = thisObj._prop['currentUrl'] + 'Page/insertPage/';
				// thisObj._instances['Util'].setStatus(true, 'ページ追加中・・・');
				// var url;
				// if (thisObj._prop['isLibraryElementPage'] === true) {
				// 	url = thisObj._prop['currentUrl'] + 'Library/insertLibrary/';

				// } else {
				// 	url = thisObj._prop['currentUrl'] + 'Page/insertPage/';
				// }
				$(thisObj).trigger('onInitInsert');
				$.ajax({
					type: "POST",
					url: url,
					data: {
						'residence_id'				: thisObj._prop['residenceId'],
						'device_num'				: 8,
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
			*/
		}

		/*
		 * ページを削除するメソッド
		 * @param	recordId		削除するレコードのID
		 * @return	void
		 */
		,delete: function(recordId) {
			var thisObj = this;

			console.log('LibraryPageCopyModalManager :: delete');
			console.log('	isAccessable = ' + thisObj._instances['Gateway'].isAccessable());

			if (thisObj._instances['Gateway'].isAccessable() === true) {
				var url = thisObj._prop['currentUrl'] + 'Page/deletePage/';
				var sendData = {
					'device_num'				: 8,
					'residence_id'				: thisObj._prop['residenceId'],
					'record_id'					: recordId
				}
				var initEventName = 'onInitDelete';
				var completeEventName = 'onCompleteDelete';
				var errorEventName = 'onErrorDelete';

				$(thisObj._instances['Gateway'])
					.on(initEventName, function(event) {
						console.log('ページ削除開始');
						$(thisObj).trigger(initEventName, recordId);
					})
					.on(completeEventName, function(event, data) {
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						if (data['result'] === true) {
							console.log('ページ削除完了');
							$(thisObj).trigger(completeEventName);
						} else {
							console.log('ページ削除失敗');
							$(thisObj).trigger(errorEventName);
						}
					})
					.on(errorEventName, function(event, data) {
						console.log('ページ削除失敗');
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						$(thisObj).trigger(errorEventName);
					});

				thisObj._instances['Gateway'].access(url, sendData, initEventName, completeEventName, errorEventName);
			}

			/*
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				// var url = thisObj._prop['currentUrl'] + 'Page/deletePage/';
				var url = thisObj._prop['currentUrl'] + 'Page/deletePage/';
				var sendData = {
					'device_num'				: 8,
					'residence_id'				: thisObj._prop['residenceId'],
					'record_id'					: recordId
				}
				// console.log(sendData);
				// return;
				$(thisObj).trigger('onInitDelete', recordId);
				// thisObj._instances['Util'].setStatus(true, 'ページ削除中・・・');
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
			*/
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
				var url = thisObj._prop['currentUrl'] + 'Page/updatePage/';
				var sendData = {
					'device_num'				: 8,
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
	}
});
