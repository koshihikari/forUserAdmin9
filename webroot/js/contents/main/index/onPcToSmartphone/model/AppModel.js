

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.model.AppModel');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.model.AppModel = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.model.AppModel.prototype = {
		_isEnabled						: false
		,_prop							: {}
		,_residenceId					: []
		,_currentResidence				: []
		,_historyOfDirectoryIndex		: 2
		,_data							: {}
		,_instances						: {}
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
				,'setProp'
				,'getProp'
				,'setCurrentInfo'
				,'getCurrentInfo'
				,'setData'
				,'getData'
				,'getResidenceData'

				,'callback'

				,'request'

				,'addResidence'
				,'delResidence'
				,'duplicateResidence'
				,'reorderResidence'
				,'changeResidenceString'

				,'addPage'
				,'delPage'
				,'duplicatePage'
				,'reorderPage'
				,'movePage'
				,'changePageString'
				,'publishFpPage'

				,'getPageTag'
				,'setPageTagData'
				// ,'setPageTag'
				// ,'delPageTag'
				// ,'reorderPageTag'

				,'access'
			);

			this._instances = {
				'Gateway'	: new MYNAMESPACE.modules.helper.Gateway()
			};
			this._currentResidence.unshift(
				{
					'residenceId'		: -1,
					'deviceType'		: '-'
				}
			);
			console.log(this._currentResidence);

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
				'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'companyId'					: $('input[type="hidden"][name="companyId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				'previewUrl'				: $('input[type="hidden"][name="previewUrl"]').val(),
				'isCustomer'				: $('input[type="hidden"][name="isCustomer"]').val() === '1' ? true : false
			}
		}

		/*
		 * データをDBに保存する際のプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getProp: function() {
			var thisObj = this;
			return thisObj._prop;
		}

		/*
		 * カレントな物件ID、デバイスタイプをセットするメソッド
		 * @param	residenceId			カレントにする物件ID
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @return	void
		 */
		,setCurrentInfo: function(residenceId, deviceType) {
			var thisObj = this;
			if (
				(
					0 < thisObj._currentResidence.length &&
					thisObj._currentResidence[0]['residenceId'] &&
					thisObj._currentResidence[0]['deviceType']
				) &&
				(
					residenceId !== thisObj._currentResidence[0]['residenceId'] ||
					deviceType !== thisObj._currentResidence[0]['deviceType']
				)
			) {
				console.log('	ID更新');
				thisObj._currentResidence.unshift(
					{
						'residenceId'		: residenceId,
						'deviceType'		: deviceType
					}
				);
				console.log('		.length = ' + thisObj._currentResidence.length);
				if (thisObj._historyOfDirectoryIndex < thisObj._currentResidence.length) {
					thisObj._currentResidence.pop();
					console.log('	削除');
				}
				console.log(thisObj._currentResidence);
				console.log('		.length = ' + thisObj._currentResidence.length);
				$(thisObj).trigger('onChangeCurrentInfo', thisObj._currentResidence[0])
			}
		}

		/*
		 * カレントな物件ID、デバイスタイプを返すメソッド
		 * @param	void
		 * @return	オブジェクト
		 */
		,getCurrentInfo: function(index) {
			var thisObj = this;
			index = index === undefined ? 0 : index;
			index = thisObj._currentResidence.length <= index ? thisObj._currentResidence.length - 1 : index;

			return thisObj._currentResidence[index] ? thisObj._currentResidence[index] : -1;
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
				var eventName = !thisObj._data[key] ? 'onSetData' : 'onUpdateData';
				thisObj._data[key] = val;
				console.log('AppModel :: setData :: key = ' + key + ', eventName = ' + eventName);
				$(thisObj).trigger(eventName, key)
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
			residenceId = +residenceId;
			var thisObj = this;
			var allResidenceData = thisObj.getData('ResidenceData');
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
		 * サーバアクセス後のコールバックメソッド
		 * @param	residenceId		カレントになる物件ID
		 * @param	data			サーバから返される物件/ページデータ
		 * @return	void
		 */
		,callback: function(residenceId, deviceType, data) {
			var thisObj = this;
			console.log('data');
			console.log(data);
			$(thisObj).trigger('onCallback', residenceId);

			thisObj.setData('ResidenceData', data['residences']);
			thisObj.setData(('SpPageDataOf' + residenceId), data['smartphonePages']);
			thisObj.setData(('FpPageDataOf' + residenceId), data['featurephonePages']);

			thisObj.setCurrentInfo(residenceId, deviceType);
		}

		/*
		 * 物件リストをリクエストするメソッド
		 * @param	residenceId		物件リスト共に、この物件IDに属するページリストも取得する。指定がなければ、物件リストの先頭の物件IDのページリストが返される。
		 * @return	void
		 */
		,request: function(residenceId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/request/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0
			};
			if (0 < residenceId) {
				sendData['residence_id'] = residenceId;
			}
			var eventNames = {
				'initEventName'				: 'onInitRequest',
				'completeEventName'			: 'onCompleteRequest',
				'errorEventName'			: 'onErrorRequest'
			};
			var callback = function(data) {
				var targetResidenceId = 0 < residenceId ? residenceId : data['residences'][0]['residences']['id'];
				var targetDeviceType = '-';
				thisObj.callback(targetResidenceId, targetDeviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}
		/*
		 * 物件を追加するメソッド
		 * @param	void
		 * @return	void
		 */
		,addResidence: function() {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/addResidence/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'user_id'					: prop['userId'],
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0
			};
			var eventNames = {
				'initEventName'				: 'onInitAddResidence',
				'completeEventName'			: 'onCompleteAddResidence',
				'errorEventName'			: 'onErrorAddResidence'
			};
			var callback = function(data) {
				var currentInfo = thisObj.getCurrentInfo();
				// console.log('currentInfo');
				// console.log(currentInfo);
				// thisObj.callback(currentInfo['residenceId'], currentInfo['deviceType'], data);
				thisObj.callback(data['residenceId'], currentInfo['deviceType'], data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * 物件を削除するメソッド
		 * @param	residenceId		削除する物件のID
		 * @return	void
		 */
		 /*
		*/
		,delResidence: function(residenceId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/delResidence/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'residence_id'				: residenceId,
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0
			};
			var eventNames = {
				'initEventName'				: 'onInitDelResidence',
				'completeEventName'			: 'onCompleteDelResidence',
				'errorEventName'			: 'onErrorDelResidence'
			};
			var callback = function(data) {
				thisObj.callback(data['targetResidenceId'], '-', data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * 物件を複製するメソッド
		 * @param	residenceId			このIDの物件を複製する
		 * @return	void
		 */
		 /*
		*/
		,duplicateResidence: function(residenceId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/duplicateResidence/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'user_id'					: prop['userId'],
				'is_company_site'			: 0,
				'residence_id'				: residenceId,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0
			};
			var eventNames = {
				'initEventName'				: 'onInitDuplicateResidence',
				'completeEventName'			: 'onCompleteDuplicateResidence',
				'errorEventName'			: 'onErrorDuplicateResidence'
			};
			var callback = function(data) {
				thisObj.callback(data['targetResidenceId'], '-', data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * 物件を並び替えるメソッド
		 * @param	residenceId		並び替える物件のID
		 * @param	order			並び替えた後の物件のindex
		 * @return	void
		 */
		,reorderResidence: function(residenceId, order) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/reorderResidence/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0,
				'user_id'					: prop['userId'],
				'residence_id'				: residenceId,
				'order'						: order
			};
			var eventNames = {
				'initEventName'				: 'onInitReorderResidence',
				'completeEventName'			: 'onCompleteReorderResidence',
				'errorEventName'			: 'onErrorReorderResidence'
			};
			var callback = function(data) {
				var currentInfo = thisObj.getCurrentInfo();
				thisObj.callback(residenceId, currentInfo['deviceType'], data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * 物件の名前/パスのどちらかを変更するメソッド
		 * @param	residenceId			物件ID
		 * @param	key					name===物件名が変更された、path===物件パスが変更された
		 * @param	val					変更後の文字列
		 * @return	void
		 */
		,changeResidenceString: function(residenceId, key, val) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/changeResidenceString/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0,
				'user_id'					: prop['userId'],
				'residence_id'				: residenceId,
				'key'						: key,
				'val'						: val
			};
			var eventNames = {
				'initEventName'				: 'onInitChangeResidenceString',
				'completeEventName'			: 'onCompleteChangeResidenceString',
				'errorEventName'			: 'onErrorChangeResidenceString'
			};
			var callback = function(data) {
				var currentInfo = thisObj.getCurrentInfo();
				thisObj.callback(residenceId, currentInfo['deviceType'], data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * 物件概要一括更新メソッド
		 * @param	residenceIdArr			物件概要を書き出す物件ID配列
		 * @param	modified				情報更新日
		 * @param	nextModified			自家更新日
		 * @param	isPublish				true===データ更新後、本番ページを書き出す。false===データ更新のみ
		 * @return	void
		 */
		,bulkUpdateOutlineData: function(residenceIdArr, modified, nextModified, isPublish) {
			var thisObj = this;
			var prop = thisObj._prop;
			var currentInfo = thisObj.getCurrentInfo();
			var url = thisObj._prop['currentUrl'] + 'Main/bulkUpdateOutlineData/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				// 'is_company_site'			: 0,
				'user_id'					: prop['userId'],
				'residence_id'				: currentInfo['residenceId'],
				'residence_ids'				: residenceIdArr,
				'modified'					: modified,
				'next_modified'				: nextModified,
				'is_publish'				: isPublish
			};
			console.log(sendData);
			var eventNames = {
				'initEventName'				: 'onInitBulkUpdateOutlineData',
				'completeEventName'			: 'onCompleteBulkUpdateOutlineData',
				'errorEventName'			: 'onErrorBulkUpdateOutlineData'
			};
			var callback = function(data) {
				if (data['result'] === true) {
					console.log('----------------------');
					console.log(data);
					$(thisObj).trigger('onCompleteUpdateOutlineData', [isPublish, 'sp', data['spOutlineInfo']]);
					/*
					if (isPublish === true) {
						console.log('SPページ書き出し完了');
					} else {
						console.log('SPプレビューページ更新完了')
						$(thisObj).trigger('onCompleteUpdateOutlineData');
					}
					*/
					// thisObj.callback(currentInfo['residenceId'], '-', data);
					// $(thisObj).trigger('doBulkPublish', ['sp', pageIdArr]);
				} else {
					$(thisObj).trigger(eventNames['errorEventName']);
				}
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページを追加するメソッド
		 * @param	residenceId			この物件IDにページを追加する
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @return	void
		 */
		,addPage: function(residenceId, deviceType) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/addPage/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'is_customer'				: prop['isCustomer'] === true ? 1 : 0,
				'user_id'					: prop['userId'],
				'residence_id'				: residenceId,
				'device_type'				: deviceType
			};
			var eventNames = {
				'initEventName'				: 'onInitAddPage',
				'completeEventName'			: 'onCompleteAddPage',
				'errorEventName'			: 'onErrorAddPage'
			};
			var callback = function(data) {
				thisObj.callback(residenceId, deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページを削除するメソッド
		 * @param	pageId				このページIDを削除する
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @return	void
		 */
		,delPage: function(pageId, deviceType) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/delPage/';
			var currentInfo = thisObj.getCurrentInfo();
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'residence_id'				: currentInfo['residenceId'],
				'page_id'					: pageId,
				'device_type'				: deviceType
			};
			var eventNames = {
				'initEventName'				: 'onInitDelPage',
				'completeEventName'			: 'onCompleteDelPage',
				'errorEventName'			: 'onErrorDelPage'
			};
			var callback = function(data) {
				thisObj.callback(currentInfo['residenceId'], deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページを複製するメソッド
		 * @param	pageId				このページIDを複製する
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @param	residenceId			複製先物件ID(undefinedで複製元ページと同じ物件のページになる)
		 * @return	void
		 */
		,duplicatePage: function(pageId, deviceType, residenceId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/duplicatePage/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'residence_id'				: residenceId ? residenceId : -1,
				'page_id'					: pageId,
				'user_id'					: prop['userId'],
				'device_type'				: deviceType
			};
			var eventNames = {
				'initEventName'				: 'onInitDuplicatePage',
				'completeEventName'			: 'onCompleteDuplicatePage',
				'errorEventName'			: 'onErrorDuplicatePage'
			};
			var callback = function(data) {
				var currentInfo = thisObj.getCurrentInfo();
				thisObj.callback(currentInfo['residenceId'], deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページを並び替えるメソッド
		 * @param	pageId				ページID
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @param	order				並び替えた後のページのindex
		 * @return	void
		 */
		,reorderPage: function(pageId, deviceType, order) {
			var thisObj = this;
			var prop = thisObj._prop;
			var currentInfo = thisObj.getCurrentInfo();
			var url = thisObj._prop['currentUrl'] + 'Main/reorderPage/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'user_id'					: prop['userId'],
				'residence_id'				: currentInfo['residenceId'],
				'page_id'					: pageId,
				'device_type'				: deviceType,
				'order'						: order
			};
			var eventNames = {
				'initEventName'				: 'onInitReorderPage',
				'completeEventName'			: 'onCompleteReorderPage',
				'errorEventName'			: 'onErrorReorderPage'
			};
			var callback = function(data) {
				thisObj.callback(currentInfo['residenceId'], deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページの名前/パスのどちらかを変更するメソッド
		 * @param	pageId				ページID
		 * @param	deviceType			デバイスタイプ(sp || fp)
		 * @param	key					title===ページ名が変更された、path===ページパスが変更された
		 * @param	val					変更後の文字列
		 * @return	void
		 */
		,changePageString: function(pageId, deviceType, key, val) {
			var thisObj = this;
			var prop = thisObj._prop;
			var currentInfo = thisObj.getCurrentInfo();
			var url = thisObj._prop['currentUrl'] + 'Main/changePageString/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'user_id'					: prop['userId'],
				'residence_id'				: currentInfo['residenceId'],
				'page_id'					: pageId,
				'device_type'				: deviceType,
				'key'						: key,
				'val'						: val
			};
			var eventNames = {
				'initEventName'				: 'onInitChangePageString',
				'completeEventName'			: 'onCompleteChangePageString',
				'errorEventName'			: 'onErrorChangePageString'
			};
			var callback = function(data) {
				thisObj.callback(currentInfo['residenceId'], deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページの登録先物件を変更するメソッド
		 * @param	pageId					移動するページのID
		 * @param	deviceType				デバイスタイプ(sp || fp)
		 * @param	toResidenceId			変更後の物件ID
		 * @return	void
		 */
		,movePage: function(pageId, deviceType, toResidenceId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/movePage/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'company_id'				: prop['companyId'],
				'is_company_site'			: 0,
				'user_id'					: prop['userId'],
				'residence_id'				: toResidenceId,
				'page_id'					: pageId,
				'device_type'				: deviceType
			};
			var eventNames = {
				'initEventName'				: 'onInitMovePage',
				'completeEventName'			: 'onCompleteMovePage',
				'errorEventName'			: 'onErrorMovePage'
			};
			var callback = function(data) {
				thisObj.callback(toResidenceId, deviceType, data);
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページを更新するメソッド
		 * @param	updateData		更新するデータ
		 * @return	void
		 */
		,publishFpPage: function(residenceId, pageId, title, path, concrete_source) {
			console.log('');
			console.log('----------');
			console.log('AppModel.js :: publishFpPageメソッド');
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/publishFpPage/';
			var sendData = {
				'device_name'				: 'featurephone',
				'device_num'				: 8,
				'company_id'				: prop['companyId'],
				'user_id'					: prop['userId'],
				'residence_id'				: residenceId,
				'page_id'					: pageId,
				'title'						: title,
				'path'						: path,
				'concrete_source'			: concrete_source
			};
			var eventNames = {
				'initEventName'				: 'onInitPublishConcretePageForFp',
				'completeEventName'			: 'onCompletePublishConcretePageForFp',
				'errorEventName'			: 'onErrorPublishConcretePageForFp'
			};
			var callback = function(data) {
				console.log('リクエスト完了');
				console.log(data);
				console.log('----------');
				if (data['result'] === true) {
					$(thisObj).trigger('onSuccessPublishConcretePageForFp');
					// $(thisObj).trigger(eventNames['completeEventName']);
				} else {
					$(thisObj).trigger(eventNames['errorEventName'], recordId);
				}
			}
			thisObj.access(url, sendData, eventNames, callback);
		}
		,DEL_publishFpPage: function(residenceId, pageId, title, path) {
			console.log('');
			console.log('----------');
			console.log('AppModel.js :: publishFpPageメソッド');
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/publishFpPage/';
			var sendData = {
				'device_name'				: 'featurephone',
				'device_num'				: 8,
				'company_id'				: prop['companyId'],
				'user_id'					: prop['userId'],
				'residence_id'				: residenceId,
				'page_id'					: pageId,
				'title'						: title,
				'path'						: path
			};
			var eventNames = {
				'initEventName'				: 'onInitPublishConcretePageForFp',
				'completeEventName'			: 'onCompletePublishConcretePageForFp',
				'errorEventName'			: 'onErrorPublishConcretePageForFp'
			};
			var callback = function(data) {
				console.log('リクエスト完了');
				console.log(data);
				console.log('----------');
				if (data['result'] === true) {
					$(thisObj).trigger('onSuccessPublishConcretePageForFp');
					// $(thisObj).trigger(eventNames['completeEventName']);
				} else {
					$(thisObj).trigger(eventNames['errorEventName'], recordId);
				}
			}
			thisObj.access(url, sendData, eventNames, callback);
		}




		/*
		 * ページタグを取得するメソッド
		 * @param	updateData		更新するデータ
		 * @return	void
		 */
		,getPageTag: function(pageId) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/getPageTag/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'page_id'					: pageId
			};
			var eventNames = {
				'initEventName'				: 'onInitGetPageTag',
				'completeEventName'			: 'onCompleteGetPageTag',
				'errorEventName'			: 'onErrorGetPageTag'
			};
			var callback = function(data) {
				if (data['result'] === true) {
					$(thisObj).trigger('onSuccessCompleteGetPageTag', [data]);
				} else {
					$(thisObj).trigger(eventNames['errorEventName'], pageId);
				}
			}
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ページタグを編集するメソッド
		 * @param	pageId			ページID
		 * @param	tagId			タグID
		 * @param	tagName			タグ名
		 * @param	tagCode			タグコード
		 * @param	order			並び順
		 * @param	callbackMethod	処理完了時のコールバックメソッド
		 * @return	void
		 */
		// ,setPageTag: function(pageId, tagId, tagName, tagCode, order, callbackMethod) {
		// 	var thisObj = this;
		// 	var prop = thisObj._prop;
		// 	var url = thisObj._prop['currentUrl'] + 'Main/setPageTag/';
		// 	var sendData = {
		// 		'device_name'				: 'smartphone',
		// 		'device_num'				: 2,
		// 		'user_id'					: prop['userId'],
		// 		'id'						: tagId,
		// 		'page_id'					: pageId,
		// 		'tag_name'					: tagName,
		// 		'tag_code'					: tagCode,
		// 		'order'						: order
		// 	};
		// 	var eventNames = {
		// 		'initEventName'				: 'onInitSetPageTag',
		// 		'completeEventName'			: 'onCompleteSetPageTag',
		// 		'errorEventName'			: 'onErrorSetPageTag'
		// 	};
		// 	var callback = function(data) {
		// 		console.log('リクエスト完了');
		// 		console.log(data);
		// 		console.log('is true === ' + (data['result'] === true));
		// 		if (data['result'] === true) {
		// 			// $(thisObj).trigger('onSuccessSetPageTag', [data['id']]);
		// 			callbackMethod(data['id']);
		// 		} else {
		// 			$(thisObj).trigger(eventNames['errorEventName']);
		// 		}
		// 	}
		// 	// console.log('sendData');
		// 	// console.log(sendData);
		// 	thisObj.access(url, sendData, eventNames, callback);
		// }

		/*
		 * ページタグを編集するメソッド
		 * @param	pageId			ページID
		 * @param	tagId			タグID
		 * @param	tagName			タグ名
		 * @param	tagCode			タグコード
		 * @param	order			並び順
		 * @param	callbackMethod	処理完了時のコールバックメソッド
		 * @return	void
		 */
		,setPageTagData: function(editTagData, delTagIds, publishPageInfo) {
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/setPageTagData/';
			var sendData = {
				'device_name'				: 'smartphone',
				'device_num'				: 2,
				'user_id'					: prop['userId'],
				'tag_data'					: {
					'edit'						: editTagData,
					'del'						: delTagIds
				}
			};
			var eventNames = {
				'initEventName'				: 'onInitSetPageTagData',
				'completeEventName'			: 'onCompleteSetPageTagData',
				'errorEventName'			: 'onErrorSetPageTagData'
			};
			var callback = function(data) {
				console.log('リクエスト完了');
				console.log(data);
				console.log('is true === ' + (data['result'] === true));
				if (data['result'] === true) {
					$(thisObj).trigger('onSuccessSetPageTagData', [publishPageInfo]);
					// $(thisObj).trigger('onSuccessSetPageTagDataData', [isPublish]);
					// callbackMethod();
				} else {
					$(thisObj).trigger(eventNames['errorEventName']);
				}
			}
			// console.log('sendData');
			// console.log(sendData);
			thisObj.access(url, sendData, eventNames, callback);
		}

		/*
		 * ガラケーページのデータを取得するメソッド
		 * @param	recordId	ページのレコードID
		 * @return	void
		 */
		,getPageData: function(recordId, deviceName) {
			console.log('');
			console.log('----------');
			console.log('AppModel.js :: getPageDataメソッド');
			console.log('recordId = ' + recordId);
			console.log('deviceName = ' + deviceName);
			console.log('----------');
			var thisObj = this;
			var prop = thisObj._prop;
			var url = thisObj._prop['currentUrl'] + 'Main/requestSinglePageData/';
			var sendData = {
				'device_num'				: 2,
				'device_name'				: deviceName,
				'page_id'					: recordId
			};
			var eventNames = {
				'initEventName'				: 'onInitGetPageData',
				'completeEventName'			: 'onCompleteGetPageData',
				'errorEventName'			: 'onErrorGetPageData'
			};
			var callback = function(data) {
				console.log('');
				console.log('----------');
				console.log('AppModel.js :: getPageDataメソッド :: handler');
				console.log('data');
				console.log(data);
				if (data['result'] === true) {
					$(thisObj).trigger('onSuccessGetPageData', [data['data']]);
				} else {
					$(thisObj).trigger(eventNames['errorEventName']);
				}
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
