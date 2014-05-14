

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.outline.edit.DataManager');
	MYNAMESPACE.modules.outline.edit.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.outline.edit.DataManager.prototype = {
		_isEnabled						: false
		,_prop							: {}
		,_isAccess						: false
		// ,_isAccesable					: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'sendData'
				,'getFieldList'


				// ,'setSeverAccessEnable'
				// ,'insertField'
				// ,'deleteField'
				// ,'update'
				// ,'reorder'
				// ,'saveFRK'



				,'setProp'
				,'getProp'
				// ,'setData'
				// ,'getData'
			);

			this.setProp();
			// this._isAccesable = true;
		}

		/*
		 * サーバアクセス可能/不可能セットメソッド
		 * @param	isEnable	true===サーバアクセス可能
		 * @return	void
		 */
		,sendData: function(action, updateData, callback) {
			var thisObj = this;
			var url = '', initEventName, successEventName, errorEventName;
			console.log('action = ' + action);
			switch (action) {
				case 'changeResidence':
					url = thisObj._prop['currentUrl'] + 'Outline/updateResidence/';
					initEventName = 'onInitUpdateResidence';
					successEventName = 'onCompleteUpdateResidence';
					errorEventName = 'onErrorUpdateResidence';
					break;

				case 'reorder':
					url = thisObj._prop['currentUrl'] + 'Outline/reorder/';
					initEventName = 'onInitReorder';
					successEventName = 'onCompleteReorder';
					errorEventName = 'onErrorReorder';
					break;

				case 'addCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/addCategory/';
					initEventName = 'onInitAddCategory';
					successEventName = 'onCompleteAddCategory';
					errorEventName = 'onErrorAddCategory';
					break;

				case 'delCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/delCategory/';
					initEventName = 'onInitDelCategory';
					successEventName = 'onCompleteDelCategory';
					errorEventName = 'onErrorDelCategory';
					break;

				case 'changeCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/updateCategory/';
					initEventName = 'onInitUpdateCategory';
					successEventName = 'onCompleteUpdateCategory';
					errorEventName = 'onErrorUpdateCategory';
					break;

				case 'addItem':
					url = thisObj._prop['currentUrl'] + 'Outline/addItem/';
					initEventName = 'onInitAddItem';
					successEventName = 'onCompleteAddItem';
					errorEventName = 'onErrorAddItem';
					break;

				case 'delItem':
					url = thisObj._prop['currentUrl'] + 'Outline/delItem/';
					initEventName = 'onInitDelItem';
					successEventName = 'onCompleteDelItem';
					errorEventName = 'onErrorDelItem';
					break;

				case 'changeItem':
					url = thisObj._prop['currentUrl'] + 'Outline/updateItem/';
					initEventName = 'onInitUpdateItem';
					successEventName = 'onCompleteUpdateItem';
					errorEventName = 'onErrorUpdateItem';
					break;

				case 'replaceData':
					url = thisObj._prop['currentUrl'] + 'Outline/replaceData/';
					initEventName = 'onInitReplaceData';
					successEventName = 'onCompleteReplaceData';
					errorEventName = 'onErrorReplaceData';
					break;

				default:
					return;
			}
			var postData = {
				'base_data'			: {
					'user_id'				: thisObj._prop['userId'],
					'residence_id'			: thisObj._prop['residenceId']
				},
				'update_data'		: updateData
			}
			console.log('postData');
			console.log(postData);
			// return;
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				$(thisObj).trigger(initEventName);
				$.ajax(
					{
						type		: "POST",
						url			: url,
						data		: postData,
						dataType	: "json"
					})
					.done(function(obj) {
						console.log('成功');
						console.log(obj);
						thisObj._isAccess = false;
						$(thisObj).trigger(successEventName);
						if (callback) {
							callback(obj);
						}
					})
					.fail(function(obj) {
						console.log('失敗');
						console.log(obj);
						$(thisObj).trigger(errorEventName);
					})
			}
		}

		/*
		 * 物件概要データを取得するメソッド
		 * @param	residenceId			option(取得する物件概要データの属する物件ID)
		 * @return	void
		 */
		,getFieldList: function(residenceId) {
			var thisObj = this;

			// if (thisObj._isAccesable === true && thisObj._isAccess === false) {
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				$(thisObj).trigger('onInitGetFieldList');
				var postData = {
					// 'residence_id'		: thisObj._prop['residenceId'],
					'residence_id'		: 0 < +thisObj._prop['residenceId'] ? thisObj._prop['residenceId'] : residenceId,
					'user_id'			: thisObj._prop['userId']
				}
				// console.log('Outline :: DataManager :: getFieldList');
				// console.log(postData);
				$.ajax({
					type: "POST",
					url	: thisObj._prop['currentUrl'] + 'Outline/getFieldList/',
					data: postData,
					dataType: "json",
					success: function(obj){
						// console.log('リクエスト完了');
						// console.log("\n");
						// console.log(obj);
						// console.log("\n");

						thisObj._isAccess = false;
						if (obj['result'] === true) {
							var newObj = $.extend(true,{},obj['data']);
							var fixedClone = [];
							for (var key in newObj) {
								// console.log(key + ' :: ' + newObj[key]['category'] + ', ' + newObj[key]['items']);
								// if (!isNaN(key) === true && newObj[key]['category']['key']) {
								if (!isNaN(key) === true && newObj[key]['category'] && newObj[key]['items']) {
									fixedClone.push(newObj[key]);
									// fixedClone[(key-0)] = newObj[key];
								}
							}
							// console.log(fixedClone);
							$(thisObj).trigger('onCompleteGetFieldList', [fixedClone]);
							/*
							$(thisObj).trigger('onCompleteGetFieldList', [obj['data']]);
							*/
						} else {
							$(thisObj).trigger('onErrorGetFieldList');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: getFieldList');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
							$(thisObj).trigger('onErrorGetFieldList');
					}
				});
			}
		}
		 /*
		*/

























		/*
		 * DBのデータを更新するメソッド
		 * @param	void
		 * @return	void
		 */
		 /*
		,update: function(targetRecordId, data) {
			var thisObj = this;
			if (thisObj._isAccesable === true && thisObj._isAccess === false) {
				thisObj._isAccess = true;

				var tmpElementId = 'tmp-' + new Date().getTime();
				$(thisObj).trigger('onInitUpdateField', [targetRecordId, data]);
				var sendData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'company_id'		: thisObj._prop['companyId'],
					'user_id'			: thisObj._prop['userId'],
					'id'				: targetRecordId,
					'property'			: data
				}
				// console.log(sendData);
				// return;
				$.ajax({
					type		: "POST",
					url			: thisObj._prop['currentUrl'] + 'Outline/updateField/',
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('更新完了');
						// console.log('obj');
						// console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteUpdateField', [targetRecordId, data]);
						} else {
							$(thisObj).trigger('onErrorUpdateField', [targetRecordId, data]);
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertField');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorUpdateField', [targetRecordId, data]);
					}
				});
			}
		}
		*/











		/*
		 * サーバアクセス可能/不可能セットメソッド
		 * @param	isEnable	true===サーバアクセス可能
		 * @return	void
		 */
		 /*
		,setSeverAccessEnable: function(isEnable) {
			var thisObj = this;
			thisObj._isAccesable = isEnable;
		}
		*/

		/*
		 * データをDBに保存するメソッド
		 * @param	void
		 * @return	void
		 */
		 /*
		,insertField: function(targetOrder) {
			var thisObj = this;
			// console.log('insertField');
			if (thisObj._isAccesable === true && thisObj._isAccess === false) {
				thisObj._isAccess = true;

				var tmpElementId = 'tmp-' + new Date().getTime();
				// thisObj._insertFieldHolder[tmpElementId] = -1;
				$(thisObj).trigger('onInitInsertField', [tmpElementId, targetOrder]);
				var sendData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'company_id'		: thisObj._prop['companyId'],
					'user_id'			: thisObj._prop['userId'],
					'order'				: targetOrder + 2,
					'is_deletable'		: 1,
					'mtr_status_id'		: thisObj._prop['visibleId']
				}
				// console.log(sendData);
				$.ajax({
					type		: "POST",
					url			: thisObj._prop['currentUrl'] + 'Outline/insertField/',
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('追加完了');
						// console.log('obj');
						// console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteInsertField', [tmpElementId, obj['data']['outlines']['id']]);
						} else {
							$(thisObj).trigger('onErroInsertField', tmpElementId);
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertField');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorInsertField', tmpElementId);
					}
				});
			}
		}
		*/

		/*
		 * DBからデータを削除するメソッド
		 * @param	void
		 * @return	void
		 */
		 /*
		,deleteField: function(targetRecordId) {
			var thisObj = this;
			if (thisObj._isAccesable === true && thisObj._isAccess === false) {
				thisObj._isAccess = true;

				var tmpElementId = 'tmp-' + new Date().getTime();
				// thisObj._insertFieldHolder[tmpElementId] = -1;
				$(thisObj).trigger('onInitDeleteField', targetRecordId);
				var sendData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'company_id'		: thisObj._prop['companyId'],
					'user_id'			: thisObj._prop['userId'],
					'id'				: targetRecordId
				}
				// console.log(sendData);
				$.ajax({
					type		: "POST",
					url			: thisObj._prop['currentUrl'] + 'Outline/deleteField/',
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('削除完了');
						// console.log('obj');
						// console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteDeleteField', targetRecordId);
						} else {
							$(thisObj).trigger('onErrorDeleteField', targetRecordId);
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertField');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorDeleteField', targetRecordId);
					}
				});
			}
		}
		*/

		/*
		 * DBのデータを更新するメソッド
		 * @param	void
		 * @return	void
		 */
		 /*
		,reorder: function(targetRecordId, targetOrder) {
			var thisObj = this;
			if (thisObj._isAccesable === true && thisObj._isAccess === false) {
				thisObj._isAccess = true;

				$(thisObj).trigger('onInitReorder', [targetRecordId, targetOrder]);
				var sendData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'company_id'		: thisObj._prop['companyId'],
					'user_id'			: thisObj._prop['userId'],
					'id'				: targetRecordId,
					'order'				: targetOrder + 1
				}
				// console.log(sendData);
				$.ajax({
					type		: "POST",
					url			: thisObj._prop['currentUrl'] + 'Outline/reorderField/',
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('更新完了');
						// console.log('obj');
						// console.log(obj);
						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteReorder', [targetRecordId, targetOrder]);
						} else {
							$(thisObj).trigger('onErrorReorder', [targetRecordId, targetOrder]);
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertField');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorReorder', [targetRecordId, targetOrder]);
					}
				});
			}
		}
		*/

		/*
		 * DropされたFRKデータを差分保存するメソッド
		 * @param	saveData	差分保存するFRKデータ
		 * @return	void
		 */
		 /*
		,saveFRK: function(saveData) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				$(thisObj).trigger('onInitSaveFRK');
				var sendData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'company_id'		: thisObj._prop['companyId'],
					'user_id'			: thisObj._prop['userId'],
					'save_data'			: saveData,
				}
				console.log(sendData);
				$.ajax({
					type: "POST",
					url	: thisObj._prop['currentUrl'] + 'Outline/saveFRK/',
					data: sendData,
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log("\n");
						console.log(obj);
						console.log("\n");

						thisObj._isAccess = false;
						if (obj['result'] === true) {
							$(thisObj).trigger('onCompleteSaveFRK');
						} else {
							$(thisObj).trigger('onErrorSaveFRK');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: getFieldList');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorSaveFRK');
					}
				});
			}
		}
		*/

		/*
		 * 物件番号を保存するメソッド
		 * @param	saveData	差分保存するFRKデータ
		 * @return	void
		 */
		 /*
		,saveResidenceNum: function(residenceNum) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				$(thisObj).trigger('onInitSaveResidenceNum');
				var sendData = {
					'id'			: thisObj._prop['residenceId'],
					'user_id'		: thisObj._prop['userId'],
					'num'			: residenceNum
				}
				console.log(sendData);
				$.ajax({
					type: "POST",
					url	: thisObj._prop['currentUrl'] + 'Residence/updateResidenceData/',
					data: sendData,
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log("\n");
						console.log(obj);
						console.log("\n");

						thisObj._isAccess = false;
						if (obj['result'] === true) {
							thisObj._prop['residenceNum'] = residenceNum;
							$(thisObj).trigger('onCompleteSaveResidenceNum');
						} else {
							$(thisObj).trigger('onErrorSaveResidenceNum');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: getFieldList');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorSaveResidenceNum');
					}
				});
			}
		}
		*/

		/*
		 * HTMLのhiddenデータ保持メソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;

			thisObj._prop = {
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]') ? $('input[type="hidden"][name="currentUrl"]').val() : '',
				'userId'					: $('input[type="hidden"][name="userOd"]') ? $('input[type="hidden"][name="userId"]').val() - 0: -1,
				'residenceId'				: $('input[type="hidden"][name="residenceOd"]') ? $('input[type="hidden"][name="residenceId"]').val() - 0 : -1,
				'mtrOutlines'				: $('input[type="hidden"][name="mtrOutlines"]') ? $.parseJSON(eval("(" + $('input[type="hidden"][name="mtrOutlines"]').val() + ")")) : {}
				/*
				'currentUrl'				: $('input[type="hidden"][name="current-url"]') ? $('input[type="hidden"][name="current-url"]').val() : '',
				'userId'					: $('input[type="hidden"][name="user-id"]') ? $('input[type="hidden"][name="user-id"]').val() - 0: -1,
				'residenceId'				: $('input[type="hidden"][name="residence-id"]') ? $('input[type="hidden"][name="residence-id"]').val() - 0 : -1,
				'mtrOutlines'				: $('input[type="hidden"][name="mtr-outlines"]') ? $.parseJSON(eval("(" + $('input[type="hidden"][name="mtr-outlines"]').val() + ")")) : {}
				*/
			}

			// console.log(thisObj._prop['mtrOutlines']);
		}

		/*
		 * データをDBに保存する際のプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		// ,setData: function(key, val) {
		// 	var thisObj = this;
		// 	thisObj._prop[key] = val;
		// }

		/*
		 * データをDBに保存する際のプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getProp: function() {
			var thisObj = this;
			var cloneElementData = $.extend(true, {}, thisObj._prop);
			return cloneElementData;
		}
	}
});
