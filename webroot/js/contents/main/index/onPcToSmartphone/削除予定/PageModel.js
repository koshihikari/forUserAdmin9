

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.model.PageModel');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.model.PageModel = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.model.PageModel.prototype = {
		_isEnabled						: false
		,_prop							: {}
		,_residenceId					: []
		,_historyOfDirectoryIndex		: 2
		,_data							: {}
		,_instances						: {}
		,_isAccess						: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(residenceId, spPagesData, fpPagesData) {
			var thisObj = this;
			_.bindAll(
				this
				,'setProp'
				,'getProp'
				,'setResidenceId'
				,'getResidenceId'
				,'setData'
				,'getData'
				,'getResidenceData'

				,'requestResidence'
				// ,'request'

				,'addDirectory'
				,'duplicateDirectory'
				,'delDirectory'
				,'reorderDirectory'
				,'renameDirectory'

				,'addLibrary'
				,'duplicateLibrary'
				,'delLibrary'
				,'reorderLibrary'
				,'renameLibrary'

				,'moveLibrary'

				,'access'
			);

			this._instances = {
				'Gateway'	: new MYNAMESPACE.modules.helper.Gateway()
			};

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
				// 'residencePath'				: $('input[type="hidden"][name="residencePath"]').val(),
				'companyId'					: $('input[type="hidden"][name="companyId"]').val(),
				// 'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				// 'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
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
			return thisObj._prop;
		}

		/*
		 * カレントな物件IDをセットするメソッド
		 * @param	id			カレントな物件ID
		 * @return	void
		 */
		,setResidenceId: function(id) {
			var thisObj = this;
			console.log('DataManager :: setResidenceId');
			console.log('	id = ' + id);
			console.log('	thisObj._residenceId[0] = ' + thisObj._residenceId[0]);
			if (id && thisObj._residenceId[0] !== id) {
				console.log('	ID更新');
				thisObj._residenceId.unshift(id);
				if (thisObj._historyOfDirectoryIndex <= thisObj._residenceId.length) {
					thisObj._residenceId.pop();
				}
				$(thisObj).trigger('onChangeCurrentResidenceId', thisObj._residenceId[0])
			}
		}

		/*
		 * 物件IDを返すメソッド
		 * @param	index			0 or undefinedでカレントな物件ID、1以上の値でindex個前にカレントだった物件ID
		 * @return	物件ID
		 */
		,getResidenceId: function(index) {
			var thisObj = this;
			index = index === undefined ? 0 : index;
			iindex = thisObj._residenceId.length <= index ? thisObj._residenceId.length - 1 : index;

			return thisObj._residenceId[index] ? thisObj._residenceId[index] : -1;
		}

		/*
		 * データをセットするメソッド
		 * @param	key			データのキー
		 * @param	val			データ
		 * @return	void
		 */
		,setData: function(key, val) {
			var thisObj = this;
			if (key && thisObj._data[key] !== val) {
				thisObj._data[key] = val;
				// console.log('dirLib');
				// console.log(thisObj._data['dirLib']);
				$(thisObj).trigger('onSetData', key)
			}
		}

		/*
		 * データを返すメソッド
		 * @param	key			データのキー
		 * @return	データ
		 */
		,getData: function(key) {
			var thisObj = this;
			return thisObj._data[key];
		}

		/*
		 * 指定されたIDの物件データを返すメソッド
		 * @param	residenceID		物件ID
		 * @return	物件データオブジェクト
		 */
		,getResidenceData: function(residenceId) {
			var thisObj = this;
			var allResidenceData = thisObj.getData('residences');
			var retObj = {};
			for (var i=0,len=allResidenceData.length; i<len; i++) {
				if (+allResidenceData[i]['residences']['id'] === residenceId) {
					retObj = allResidenceData[i]['residences'];
					break;
				}
			}
			return retObj;
		}

		/*
		 * 物件リストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,requestResidence: function(residenceId) {
			console.log('DataManager :: requestResidence');
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/requestResidence/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0
			};
			if (0 < residenceId) {
				sendData['residence_id'] = residenceId;
			}
			var eventNames = {
				'initEventName'				: 'onInitGetResidence',
				'completeEventName'			: 'onCompleteGetResidence',
				'errorEventName'			: 'onErrorGetResidence'
			};
			var callback = function(data) {
				console.log('data');
				console.log(data);
				// if (0 < data['data'].length) {
				// 	if (thisObj.getDirectoryId() === -1) {
				// 		thisObj.setDirectoryId(data['data'][0]['smartphone_library_directories']['id']);
				// 	}
				// }
				// 	thisObj.setData('dirLib', data['data']);
					thisObj.setData('residences', data['residences']);
					var targetResidenceId = 0 < residenceId ? residenceId : data['smartphonePages'][0]['smartphone_pages']['residence_id'];

					thisObj.setData(('smartphonePagesOf-' + targetResidenceId), data['smartphonePages']);
					thisObj.setData(('featurephonePagesOf-' + targetResidenceId), data['featurephonePages']);
					// for (var i=0,len=data['smartphonePages'].length; i<len; i++) {
					console.log('DataManager :: requestResidence()のcallback()から代入');
					thisObj.setResidenceId(targetResidenceId);
					// 	var tmpTargetResidenceId = data['smartphonePages'][i]['smartphone_pages']['residence_id'];
					// 	thisObj.setData(('smartphonePagesOf-' + tmpTargetResidenceId), data['smartphonePages'][i]);
					// }
					// for (var i=0,len=data['featurephonePages'].length; i<len; i++) {
					// 	var tmpTargetResidenceId = data['featurephonePages'][i]['featurephone_pages']['residence_id'];
					// 	thisObj.setData(('featurephonePagesOf-' + targetResidenceId), data['featurephonePages'][i]);
					// }
			}
			thisObj.access(url, sendData, eventNames, callback);
			// thisObj.setData('dirLib', {});
		}

		/*
		 * ディレクトリを追加するメソッド
		 * @param	void
		 * @return	void
		 */
		,addDirectory: function() {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/addDirectory/';
			var sendData = {
				'device_num'				: 2,
				'user_id'					: prop['userId'],
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitAddDirectory',
				'completeEventName'			: 'onCompleteAddDirectory',
				'errorEventName'			: 'onErrorAddDirectory'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ディレクトリを複製するメソッド
		 * @param	directoryId			このIDのディレクトリを複製する
		 * @return	void
		 */
		,duplicateDirectory: function(directoryId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/duplicateDirectory/';
			var sendData = {
				'device_num'				: 2,
				'user_id'					: prop['userId'],
				'directory_id'				: directoryId,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitDuplicateDirectory',
				'completeEventName'			: 'onCompleteDuplicateDirectory',
				'errorEventName'			: 'onErrorDuplicateDirectory'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			// console.log('directoryId = ' + directoryId);
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ディレクトリを削除するメソッド
		 * @param	direcotyrId		削除するディレクトリのID
		 * @return	void
		 */
		,delDirectory: function(direcotyrId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/delDirectory/';
			var sendData = {
				'device_num'				: 2,
				'id'						: direcotyrId,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitDelDirectory',
				'completeEventName'			: 'onCompleteDelDirectory',
				'errorEventName'			: 'onErrorDelDirectory'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ディレクトリを並び替えるメソッド
		 * @param	directoryId		並び替えるディレクトリのID
		 * @param	order			並び替えた後のディレクトリのindex
		 * @return	void
		 */
		,reorderDirectory: function(directoryId, order) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/reorderDirectory/';
			var sendData = {
				'device_num'				: 2,
				'id'						: directoryId,
				'order'						: order,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitReorderDirectory',
				'completeEventName'			: 'onCompleteReorderDirectory',
				'errorEventName'			: 'onErrorReorderDirectory'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ディレクトリ名を変更するメソッド
		 * @param	directoryId			名前を変更するディレクトリのID
		 * @param	directoryName		変更後のディレクトリ名
		 * @return	void
		 */
		,renameDirectory: function(directoryId, directoryName) {
			var thisObj = this;
			var url = thisObj._prop['currentUrl'] + 'Library/renameDirectory/';
			var sendData = {
				'device_num'				: 2,
				'id'						: directoryId,
				'name'						: directoryName,
				'company_id'				: thisObj._prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitRenameDirectory',
				'completeEventName'			: 'onCompleteRenameDirectory',
				'errorEventName'			: 'onErrorRenameDirectory'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリを追加するメソッド
		 * @param	directoryId			このディレクトリIDにライブラリを追加する
		 * @return	void
		 */
		,addLibrary: function(directoryId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/addLibrary/';
			var sendData = {
				'device_num'				: 2,
				'user_id'					: prop['userId'],
				'directory_id'				: directoryId,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitAddLibrary',
				'completeEventName'			: 'onCompleteAddLibrary',
				'errorEventName'			: 'onErrorAddLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリを複製するメソッド
		 * @param	libraryId			このIDのライブラリを複製する
		 * @return	void
		 */
		,duplicateLibrary: function(libraryId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/duplicateLibrary/';
			var sendData = {
				'device_num'				: 2,
				'user_id'					: prop['userId'],
				'library_id'				: libraryId,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitDuplicateLibrary',
				'completeEventName'			: 'onCompleteDuplicateLibrary',
				'errorEventName'			: 'onErrorDuplicateLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリを削除するメソッド
		 * @param	libraryId		削除するライブラリのID
		 * @return	void
		 */
		,delLibrary: function(libraryId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/delLibrary/';
			var sendData = {
				'device_num'				: 2,
				'id'						: libraryId,
				'directory_id'				: thisObj.getDirectoryId(0),
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitDelLibrary',
				'completeEventName'			: 'onCompleteDelLibrary',
				'errorEventName'			: 'onErrorDelLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリを並び替えるメソッド
		 * @param	elementId		並び替えるライブラリのID
		 * @param	order			並び替えた後のライブラリのindex
		 * @return	void
		 */
		,reorderLibrary: function(elementId, order) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/reorderLibrary/';
			var sendData = {
				'device_num'				: 2,
				'id'						: elementId,
				'order'						: order,
				'directory_id'				: thisObj.getDirectoryId(0),
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitReorderLibrary',
				'completeEventName'			: 'onCompleteReorderLibrary',
				'errorEventName'			: 'onErrorReorderLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリ名を変更するメソッド
		 * @param	libraryId			名前を変更するライブラリのID
		 * @param	libraryName			変更後のライブラリ名
		 * @return	void
		 */
		,renameLibrary: function(libraryId, libraryName) {
			var thisObj = this;
			var url = thisObj._prop['currentUrl'] + 'Library/renameLibrary/';
			var sendData = {
				'device_num'				: 2,
				'id'						: libraryId,
				'title'						: libraryName,
				'company_id'				: thisObj._prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitRenameLibrary',
				'completeEventName'			: 'onCompleteRenameLibrary',
				'errorEventName'			: 'onErrorRenameLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ライブラリの親ディレクトリを変更するメソッド
		 * @param	libraryId				移動するライブラリのID
		 * @param	toDirectoryId			変更後の親ディレクトリID
		 * @return	void
		 */
		,moveLibrary: function(libraryId, toDirectoryId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Library/moveLibrary/';
			var sendData = {
				'device_num'				: 2,
				'id'						: libraryId,
				'directory_id'				: toDirectoryId,
				'company_id'				: prop['companyId']
			};
			var eventNames = {
				'initEventName'				: 'onInitMoveLibrary',
				'completeEventName'			: 'onCompleteMoveLibrary',
				'errorEventName'			: 'onErrorMoveLibrary'
			};
			var callback = function(data) {
				thisObj.setData('dirLib', data['data']);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * サーバにアクセスするメソッド
		 * @param	url					アクセスするURL
		 * @param	sendData			送信するデータ
		 * @param	evnetNames			角処理のイベント名保持オブジェクト
		 * @param	callback			処理完了時のコールバックメソッド
		 * @return	void
		 */
		,access: function(url, sendData, evnetNames, callback) {
			var thisObj = this;
			if (thisObj._instances['Gateway'].isAccessable() === true) {
				$(thisObj._instances['Gateway'])
					.on(evnetNames['initEventName'], function(event) {
						// console.log('アクセス開始');
						$(thisObj).trigger(evnetNames['initEventName']);
						$(thisObj).trigger('onInitAccess');
					})
					.on(evnetNames['completeEventName'], function(event, data) {
						$(thisObj._instances['Gateway'])
							.off(evnetNames['initEventName'])
							.off(evnetNames['completeEventName'])
							.off(evnetNames['errorEventName']);
						if (data['result'] === true) {
							// console.log('アクセス完了');
							$(thisObj).trigger(evnetNames['completeEventName']);
							$(thisObj).trigger('onCompleteAccess');
							if (callback) {
								callback(data);
							}
						} else {
							// console.log('アクセス失敗');
							$(thisObj).trigger(evnetNames['errorEventName']);
							$(thisObj).trigger('onErrorAccess');
						}
					})
					.on(evnetNames['errorEventName'], function(event, data) {
						// console.log('アクセス失敗');
						$(thisObj._instances['Gateway'])
							.off(evnetNames['initEventName'])
							.off(evnetNames['completeEventName'])
							.off(evnetNames['errorEventName']);
						$(thisObj).trigger(evnetNames['errorEventName']);
						$(thisObj).trigger('onErrorAccess');
					});

				thisObj._instances['Gateway'].access(url, sendData, evnetNames['initEventName'], evnetNames['completeEventName'], evnetNames['errorEventName']);
			}
		}
	}
});
