

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.DataManager');
	MYNAMESPACE.modules.library_page.edit.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.DataManager.prototype = {
		_isEnabled						: true
		,_isAccess						: false
		,_data							: {}
		,_prop							: {}
		,_icons							: []
		,_instances						: []

		,_elementDataObj				: {}
		,_menuDataObj					: {}
		,_itemDataObj					: {}

		,_prevData						: {}
		,_FRKData						: []
		// ,_pool							: []
		,_queue							: []
		,_timers						: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'setFRK'
				,'getFRK'
				,'setElementDataObj'
				,'replaceElementDataObj'
				,'getElementDataObj'
				,'deleteElementDataObj'
				,'getAllElementDataObj'
				,'getChildElementDataObj'
				,'fixedProperty'
				,'fixedOrderOfElementDataObj'

				,'getMenuItemDataObj'

				,'getItemDataObj'

				,'requestElementList'
				,'updateLibraray_PageProperty'
				,'updateData'
				,'insertElement'
				,'addQueue'
				,'executeQueue'
				// ,'executePool'
				,'reOrderData'
				,'getRelationElementIdArr'
				,'getLeaveData'
				,'resetQueue'
				,'deleteElement'
				,'editTableElement'
				,'setEvent'
				,'setProp'
				,'getProp'
				,'createIconData'
				,'getIconData'
			);
			this._instances = {
				'Gateway'			: new MYNAMESPACE.modules.helper.Gateway()
			}
			this._prevData = {
				'update'						: {},
				'updateLibrary_PageProperty'	: {},
				'insert'						: {},
				'delete'						: {},
				'reorder'						: {}
			}
			this.setProp();
			this.createIconData();
		}

		,setFRK: function(frkData) {
			var thisObj = this;
			var cloneVal = $.extend(true, {}, frkData);
			var fixedClone = [];
			for (var key in cloneVal) {
				if (!isNaN(key) === true) {
					fixedClone[(key-0)] = cloneVal[key];
				}
			}
			thisObj._FRKData = fixedClone;
		}

		,getFRK: function() {
			var thisObj = this;
			var cloneVal = $.extend(true, {}, thisObj._FRKData);
			var fixedClone = [];
			for (var key in cloneVal) {
				if (!isNaN(key) === true) {
					fixedClone[(key-0)] = cloneVal[key];
				}
			}
			return fixedClone;
		}

		,setElementDataObj: function(elementId, key, val) {
			var thisObj = this;
			if (key === 'property') {
				var itemName = thisObj.getElementDataObj(elementId)['itemName'];
				val = thisObj.fixedProperty(itemName, val);
			}
			thisObj._elementDataObj[elementId][key] = val;
		}

		,replaceElementDataObj: function(elementId, val) {
			var thisObj = this;
			var cloneVal = $.extend(true, {}, val);
			var itemName = thisObj.getElementDataObj(elementId)['itemName'];
			var property = thisObj.fixedProperty(itemName, cloneVal['property'] || {});
			thisObj._elementDataObj[elementId] = {
				'smartphonePageElementId'			: cloneVal['smartphonePageElementId'] || 0,
				'smartphoneLibraryElementId'		: cloneVal['smartphoneLibraryElementId'] || 0,
				'smartphoneLibraryId'				: cloneVal['smartphoneLibraryId'] || 0,
				'order'								: cloneVal['order'] || 0,
				'parentId'							: cloneVal['parentId'] || '',
				'itemName'							: cloneVal['itemName'] || '',
				'isLibrary'							: cloneVal['isLibrary'] || false,
				'property'							: property
			}
		}

		,fixedProperty: function(itemName, property) {
			var thisObj = this;
			// console.log('itemName = ' + itemName);
			if (itemName) {
				var cloneProperty = $.extend(true, {}, property);
				var componentsObj = thisObj.getItemDataObj(itemName)['components'];
				for (var componentName in componentsObj) {
					if (!cloneProperty[componentName]) {
						cloneProperty[componentName] = $.extend(true, {}, componentsObj[componentName]);
					}
				}
				var retObj = {};
				for (var componentName in componentsObj) {
					// retObj[componentName] = eval(cloneProperty[componentName])
					retObj[componentName] = cloneProperty[componentName];
				}
				return retObj;
			} else {
				return property;
			}
		}

		/*
		 * 指定されたエレメントIDのデータを返すメソッド
		 * @param	elementId	エレメントID
		 * @return	エレメントのデータオブジェクト
		 */
		,getElementDataObj: function(elementId) {
			var thisObj = this;
			// console.log('-------------------');
			// console.log(thisObj._elementDataObj);
			// console.log('-------------------');
			return $.extend(true, {}, thisObj._elementDataObj[elementId]);
		}

		/*
		 * 指定されたエレメントIDのデータを削除するメソッド
		 * @param	elementId	エレメントID
		 * @return	void
		 */
		,deleteElementDataObj: function(elementId) {
			var thisObj = this;
			delete thisObj._elementDataObj[elementId];
		}

		/*
		 * 画面に配置され知恵ル全てのエレメントIDのデータを返すメソッド
		 * @param	void
		 * @return	画面に配置され知恵ル全てのエレメントのデータオブジェクト
		 */
		,getAllElementDataObj: function() {
			var thisObj = this;
			return $.extend(true, {}, thisObj._elementDataObj);
		}
		,getChildElementDataObj: function(parentId) {
			var thisObj = this;
			var tmpArr = [];
			var retArr = [];
			// console.log('parentId = ' + parentId);
			var cloneObj = $.extend(true, {}, thisObj._elementDataObj);
			for (var elementId in cloneObj) {
				var fixedParentId = cloneObj[elementId]['parentId'].split('_')[0];
				var fixedElementId = elementId.split('_')[0];
				// console.log('	parentId = ' + cloneObj[elementId]['parentId']);
				// console.log('	elementId = ' + elementId);
				if (
					cloneObj[elementId]['parentId'] === parentId ||
					(
						parentId === fixedElementId &&
						cloneObj[elementId]['itemName'] === 'Td'
					)
				) {
					/*
				if (
					fixedParentId === parentId ||
					(parentId === fixedElementId && cloneObj[elementId]['parentId'] === '' && cloneObj[elementId]['itemName'] === 'Td')
				) {
					*/
					// console.log('	挿入' + elementId);
					tmpArr.push(cloneObj[elementId]);
					var lastIndex = tmpArr.length - 1;
					tmpArr[lastIndex]['elementId'] = elementId;
				}
				// console.log('');
			}
			for (var i=0, len=tmpArr.length; i<len; i++) {
				if (tmpArr[i] && tmpArr[i]['itemName']) {
					retArr.push(tmpArr[i]);
				}
			}
			return retArr;
		}
		,fixedOrderOfElementDataObj: function(parentId) {
			var thisObj = this;
			var targetElementData = thisObj.getChildElementDataObj(parentId);
			var retObj = {};

			if (0 < targetElementData.length) {
				for (var index=0,len=targetElementData.length; index<len; index++) {
					targetElementData[index]['order'] = index + 1;
					var elementId = targetElementData[index]['elementId'];
					retObj[elementId] = targetElementData[index];
					var receiveObj = thisObj.fixedOrderOfElementDataObj(elementId);
					if (receiveObj) {
						for (var tmpElementId in receiveObj) {
							retObj[tmpElementId] = receiveObj[tmpElementId];
						}
					}
				}
			}
			return retObj;
		}

		/*
		 * 指定されたindexのメニューアイテムのデータを返すメソッド
		 * @param	index	メニューアイテムのINDEX
		 * @return	メニューアイテムのデータオブジェクト
		 */
		,getMenuItemDataObj: function(index) {
			var thisObj = this;
			return $.extend(true, {}, thisObj._menuDataObj[index]);
		}

		/*
		 * 指定されたアイテム名のアイテムのデータを返すメソッド
		 * @param	itemName	アイテム名
		 * @return	アイテムのデータオブジェクト
		 */
		,getItemDataObj: function(itemName) {
			var thisObj = this;
			return $.extend(true, {}, thisObj._itemDataObj[itemName]);
		}

		/*
		 * エレメントデータを取得するメソッド
		 * @param	ヴvoid
		 * @return	void
		 */
		,requestElementList: function(isLibraryElementPage, libraryId) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				var url, data, elemnetModelName;
				if (thisObj._prop['isLibraryElementPage'] === true || isLibraryElementPage === true) {
					url = thisObj._prop['currentUrl'] + 'Library/getElementList/';
					data = {
						'smartphone_library_id'		: !isNaN(libraryId) === true ? libraryId : thisObj._prop['smartphoneLibraryId'],
						'device_num'				: 2
					}
					elemnetModelName = 'smartphone_library_elements';

				} else {
					url = thisObj._prop['currentUrl'] + 'Page/getElementList/';
					data = {
						'page_id'		: thisObj._prop['pageId'],
						'device_num'	: 2
					}
					elemnetModelName = 'smartphone_page_elements';
				}
				$(thisObj).trigger('onInitRequestElement');

				$.ajax({
					type: "POST",
					url: url,
					data: data,
					dataType: "json",
					success: function(obj){
						// console.log('リクエスト完了');
						// console.log(obj);
						if (obj['result'] === true) {
							thisObj._isAccess = false;
							// console.log(obj['data']['elementData'].length);
							thisObj._elementDataObj = obj['data']['elementData'].length === undefined ? $.extend(true, {}, obj['data']['elementData']) : {};
							for (var elementId in thisObj._elementDataObj) {
								if (thisObj._elementDataObj[elementId]['itemName'] === 'Gallery') {
									thisObj._elementDataObj[elementId]['property']['Gallery']['contents'] = eval(thisObj._elementDataObj[elementId]['property']['Gallery']['contents']);
								}
							}
							var allElementDataObj = thisObj.getAllElementDataObj();
							// console.log(allElementDataObj);
							var childElementDataObj = thisObj.getChildElementDataObj('spContent');
							// console.log(childElementDataObj);

							// thisObj._elementDataObj = thisObj.fixedOrderOfElementDataObj('spContent');
							// console.log('--------');
							// console.log(thisObj._elementDataObj);
							var allElementDataObj = thisObj.getAllElementDataObj();
							// console.log(allElementDataObj);
							$(thisObj).trigger('onCompleteRequestElementList');
						} else {
							$(thisObj).trigger('onErrorRequestElementList');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						// console.log('Error :: requestElementList');
						// console.log('---------------------');
						// console.log(XMLHttpRequest);
						// console.log(textStatus);
						// console.log(errorThrown);
						// console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorRequestElementList');
					}
				});
			}
		}

		/*
		 * データ更新メソッド
		 * @param	elementId		データを更新するエレメントのID
		 * @param	categoryName	更新するデータのカテゴリ名(Image || Link || Text || Space...)
		 * @param	property		更新するデータ
		 * @return	void
		 */
		,updateLibraray_PageProperty: function(componentName, property) {
			var thisObj = this;
			// console.log('DataManager :: updateLibraray_PageProperty');
			// console.log('	componentName = ' + componentName);
			// console.log('	property');
			// console.log(property);
			if (typeof componentName === 'string') {
				// var url, recordId;
				var recordId;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					// url = thisObj._prop['currentUrl'] + 'Library/updateLibraryProperty/';
					recordId = thisObj._prop['smartphoneLibraryId'];
				} else {
					// url = thisObj._prop['currentUrl'] + 'Page/updatePageProperty/';
					recordId = thisObj._prop['pageId'];
				}
				var elementDataobj = thisObj.getElementDataObj('displayArea');
				elementDataobj['property'][componentName] = property
				thisObj.setElementDataObj('displayArea', 'property', elementDataobj['property']);
				var sendData = {
					'id'						: recordId,
					'user_id'					: thisObj._prop['userId'],
					'property'					: $.toJSON(elementDataobj['property'])
				}
				// console.log('	sendData');
				// console.log(sendData);
				// console.log('更新開始');
				$(thisObj).trigger('onInitUpdateLibraray_PageProperty', ['displayArea', componentName]);
				// return;
				if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
					thisObj.addQueue(thisObj.updateLibraray_PageProperty, sendData);
					return false;
				}
			} else if (typeof componentName === 'object') {
				var sendData = componentName;
			} else {
				return false;
			}

			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/updateLibraryProperty/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/updatePageProperty/';
			}
			thisObj._isAccess = true;
			// if (thisObj._isAccess === false) {
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('背景プロパティ更新完了');
						// console.log(obj);
						if (obj['result'] === true) {
							// setTimeout(function(event) {
							thisObj._isAccess = false;
							// }, 10000
							// );
							$(thisObj).trigger('onCompleteUpdateLibraray_PageProperty');
						} else {
							$(thisObj).trigger('onErrorUpdateLibraray_PageProperty');
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試/してみてください。');
						console.log('Error :: updateLibraray_PageProperty');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorUpdateLibraray_PageProperty');
					}
				});
			// }
		}

		/*
		 * データ更新メソッド
		 * @param	elementId		データを更新するエレメントのID
		 * @param	categoryName	更新するデータのカコンポーネント名(Image || Link || Text || Space...)
		 * @param	property		更新するデータ
		 * @return	void
		 */
		,updateData: function(elementId, componentName, property) {
			var thisObj = this;
			// console.log('--------------------');
			// console.log('DataManager :: updateData :: bigin');
			// console.log('elementId = ' + elementId);
			// console.log('componentName = ' + componentName);
			// console.log('property');
			// console.log(property);
			// console.log('前回のproperty');
			// console.log(thisObj._prevData['update']['property']);
			// console.log('thisObj._isEnabled = ' + thisObj._isEnabled + ', thisObj._isAccess = ' + thisObj._isAccess);
			if (typeof elementId === 'string') {
				if (
					thisObj._prevData['update']['elementId'] === elementId &&
					thisObj._prevData['update']['componentName'] === componentName &&
					thisObj._prevData['update']['property'] === property
				) {
					return;
				} else {
					thisObj._prevData['update']['elementId'] = elementId;
					thisObj._prevData['update']['componentName'] = componentName;
					thisObj._prevData['update']['property'] = $.extend(true, {}, property);
				}

				if (elementId === 'displayArea') {	// bodyの背景プロパティを更新した場合
					thisObj.updateLibraray_PageProperty(componentName, property);
					return;
				} else {	// エレメントのプロパティを更新した場合
	// var allElementDataObj = thisObj.getAllElementDataObj();
	// console.log('');
	// console.log('---------------------');
	// console.log('更新前');
	// console.log(allElementDataObj);

					var elementDataobj = thisObj.getElementDataObj(elementId);
					// console.log('elementDataobj');
					// console.log(elementDataobj);
					elementDataobj['property'][componentName] = property
					thisObj.setElementDataObj(elementId, 'property', elementDataobj['property']);
					var recordId;
					// var url, recordId;
					if (thisObj._prop['isLibraryElementPage'] === true) {
						// url = thisObj._prop['currentUrl'] + 'Library/updateElement/';
						recordId = elementDataobj['smartphoneLibraryElementId'];
					} else {
						// url = thisObj._prop['currentUrl'] + 'Page/updateElement/';
						recordId = elementDataobj['smartphonePageElementId'];
					}
					var baseData = {
						'user_id'							: thisObj._prop['userId'],
						'page_id'							: thisObj._prop['pageId'],
						'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId']
					}
					$(thisObj).trigger('onInitUpdateElement', [elementId, componentName, property]);
					var leaveDataArr = thisObj.getLeaveData();
					var updateData = {
						'id'			: recordId,
						'element_id'	: elementId,
						'parent_id'		: elementDataobj['parentId'],
						'item_name'		: elementDataobj['itemName'],
						// 'order'			: elementDataobj['order'],
						'property'		: $.toJSON(elementDataobj['property'])
					}
	// var allElementDataObj = thisObj.getAllElementDataObj();
	// console.log('更新後');
	// console.log(allElementDataObj);
	// console.log('---------------------');
	// console.log('');
					var sendData = {
						'device_num'					: 2,
						'base_data'						: baseData,
						'update_data'					: updateData,
						'leave_data_arr'				: leaveDataArr
					}
					if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
						thisObj.addQueue(thisObj.updateData, sendData);
						return false;
					}
					// console.log('	elementDataobj');
					// console.log(elementDataobj);
					// console.log('	sendData');
					// console.log(sendData);
					// console.log('更新開始');
				}
			} else if (typeof elementId === 'object') {
				var sendData = elementId;
				sendData['leave_data_arr'] = thisObj.getLeaveData();
			} else {
				return false;
			}
			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/updateElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/updateElement/';
			}
			// sendData['leave_data_arr'] = [
			// 	{
			// 		'smartphone_page_element_id'	: 4495,
			// 		'element_id'	: 'id-1371519641000_2-1',
			// 		'order'	: 2,
			// 	}
			// ];

			// console.log('	sendData');
			// console.log(sendData);
			// return false;
			// if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						if (obj['result'] === true) {
							// setTimeout(function(event) {
							thisObj._isAccess = false;
							// }, 10000
							// );
							$(thisObj).trigger('onCompleteUpdateElement');
						} else {
							$(thisObj).trigger('onErrorUpdateElement');
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: onErrorUpdateElement');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorUpdateElement');
					}
				});
			// }
		}

		/*
		 * Element追加メソッド
		 * @param	elementId		追加するElementのID
		 * @param	properties		追加するデータ
		 * @return	void
		 */
		,insertElement: function(elementId, parentId, libraryId, itemName, order) {
			var thisObj = this;
			// console.log('insertElement :: elementId = ' + elementId + ', thisObj._isEnabled = ' + thisObj._isEnabled + ', thisObj._isAccess = ' + thisObj._isAccess + ', thisObj._queue.length = ' + thisObj._queue.length);
			// console.log('insertElement :: elementId = ' + elementId + ', itemName = ' + itemName + ', thisObj._isEnabled = ' + thisObj._isEnabled + ', thisObj._isAccess = ' + thisObj._isAccess + ', thisObj._queue.length = ' + thisObj._queue.length);
			// console.log(elementId);
			// console.log(typeof elementId);
			if (typeof elementId === 'string') {
				if (
					thisObj._prevData['insert']['elementId'] === elementId
					&& thisObj._prevData['insert']['parentId'] === parentId
					&& thisObj._prevData['insert']['libraryId'] === libraryId
					&& thisObj._prevData['insert']['itemName'] === itemName
					&& thisObj._prevData['insert']['order'] === order
				) {
					return;
				} else {
					thisObj._prevData['insert']['elementId'] = elementId;
					thisObj._prevData['insert']['parentId'] = parentId;
					thisObj._prevData['insert']['libraryId'] = libraryId;
					thisObj._prevData['insert']['itemName'] = itemName;
					thisObj._prevData['insert']['order'] = order;
				}

				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('更新前');
				// console.log(allElementDataObj);
				var itemData = thisObj.getItemDataObj(itemName);
				// console.log('--------------------');
				// console.log('DataManager :: insertElement :: bigin');
				// console.log('	elementId = ' + elementId);
				// console.log('	parentId = ' + parentId);
				// console.log('	libraryId = ' + libraryId);
				// console.log('	itemName = ' + itemName);
				// console.log('	order = ' + order);
				// console.log('	itemData');
				// console.log(itemData);


				// if (itemName !== 'Library') {
				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、引数parentIdの子エレメントのorderを更新する
				//////////////////////////////////////////////////////////////////////////////////////
				var childElementDataArr = thisObj.getChildElementDataObj(parentId);
				// console.log('更新前');
				// console.log(childElementDataArr);
				for (var i=order, len=childElementDataArr.length; i<len; i++) {
					thisObj.setElementDataObj(childElementDataArr[i]['elementId'], 'order', i+1);
				}
				var childElementDataArr = thisObj.getChildElementDataObj(parentId);
				// console.log('更新後');
				// console.log(childElementDataArr);
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、引数parentIdの子エレメントのorderを更新する
				//////////////////////////////////////////////////////////////////////////////////////
				// }


				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、ドロップされたデータから仮のデータを作成しておく(この仮データはサーバで保存処理を行なっている間にローカルで描画処理を行ために必要。保存が行われたあとはサーバからのデータで上書きする)
				//////////////////////////////////////////////////////////////////////////////////////
				var tmpObj = {
					'order'				: order,
					'parentId'			: parentId,
					'itemName'			: itemName,
					'isLibrary'			: libraryId === undefined ? false : true,
					'property'			: itemData['components']
				};
				// console.log('tmpObj');
				// console.log(tmpObj);
				// console.log('	itemData');
				// console.log(itemData);
				thisObj.replaceElementDataObj(elementId, tmpObj);
				// console.log(thisObj._elementDataObj);
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、ドロップされたデータから仮のデータを作成しておく(この仮データはサーバで保存処理を行なっている間にローカルで描画処理を行うために必要。保存が行われたあとはサーバからのデータで上書きする)
				//////////////////////////////////////////////////////////////////////////////////////

				// var updateDataArr = thisObj.getLeaveData(parentId, order);

				var isLibrary = libraryId !== undefined ? true : false;
				var baseData = {
					'user_id'							: thisObj._prop['userId'],
					'page_id'							: thisObj._prop['pageId'],
					'smartphone_library_id'				: libraryId ? libraryId : 0
				}
				// if (itemName === 'Table') {
				// 	if (
				// 		itemData['components']['Border']['borderTopWidth'] - 0 === 0 &&
				// 		itemData['components']['Border']['borderRightWidth'] - 0 === 0 &&
				// 		itemData['components']['Border']['borderBottomWidth'] - 0 === 0 &&
				// 		itemData['components']['Border']['borderLeftWidth'] - 0 === 0
				// 	) {
				// 		itemData['components']['Border']['borderTopWidth'] = 1;
				// 		itemData['components']['Border']['borderRightWidth'] = 1;
				// 		itemData['components']['Border']['borderBottomWidth'] = 1;
				// 		itemData['components']['Border']['borderLeftWidth'] = 1;
				// 		itemData['components']['Border']['borderColor'] = '#999999';
				// 	}
				// }
				var insertData = {
					'element_id'						: elementId,
					'parent_id'							: parentId,
					'item_name'							: itemName,
					'order'								: order,
					'property'							: $.toJSON(itemData['components'])
				}

				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、ドロップされたのがテーブルの場合にtdのプロパティデータを作成しておく
				//////////////////////////////////////////////////////////////////////////////////////
				var relationDataArr = [];
				if (itemName === 'Table') {
					var tmpItemData = thisObj.getItemDataObj('Td');
					/*
					if ((tmpItemData['components']['Border']['borderWidth'] - 0) === 0) {
						tmpItemData['components']['Border']['borderWidth'] = 1;
					}
					if (tmpItemData['components']['Border']['borderWidth'] === '') {
						tmpItemData['components']['Border']['borderColor'] = '#999999';
					}
					*/
					if (
						tmpItemData['components']['Border']['borderTopWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderRightWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderBottomWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderLeftWidth'] - 0 === 0
					) {
						tmpItemData['components']['Border']['borderTopWidth'] = 1;
						tmpItemData['components']['Border']['borderRightWidth'] = 1;
						tmpItemData['components']['Border']['borderBottomWidth'] = 1;
						tmpItemData['components']['Border']['borderLeftWidth'] = 1;
						tmpItemData['components']['Border']['borderColor'] = '#999999';
					}
					// console.log('--------');
					// console.log('DataManager.js :: InsertElement :: テーブルのtmpItemData');
					// console.log(tmpItemData);
					// console.log('--------');
					for (var row=0,rowLen=itemData['components']['Table']['row']; row<rowLen; row++) {
						for (var col=0,colLen=itemData['components']['Table']['col']; col<colLen; col++) {
							var targetElementId = elementId + '_' + row + '-' + col;
							var relationData = {
								'order'								: 0,
								'element_id'						: targetElementId,
								'smartphone_library_id'				: libraryId ? libraryId : 0,
								'item_name'							: 'Td',
								'property'							: $.toJSON(tmpItemData['components'])
							};
							thisObj.replaceElementDataObj(targetElementId, relationData);
							relationDataArr.push(relationData);
						}
					}
					var allElementObj = thisObj.getAllElementDataObj();
					// console.log(allElementObj);
				} else if (itemName === 'About') {
					var tmpItemData = thisObj.getItemDataObj('AboutCategory');
					if ((tmpItemData['components']['Border']['borderWidth'] - 0) === 0) {
						tmpItemData['components']['Border']['borderWidth'] = 1;
					}
					if (tmpItemData['components']['Border']['borderWidth'] === '') {
						tmpItemData['components']['Border']['borderColor'] = '#999999';
					}
					var targetElementId = elementId + '_category';
					var relationData = {
						'order'								: 0,
						'element_id'						: targetElementId,
						'smartphone_library_id'				: 0,
						'item_name'							: 'AboutCategory',
						'property'							: $.toJSON(tmpItemData['components'])
					};
					thisObj.replaceElementDataObj(targetElementId, relationData);
					relationDataArr.push(relationData);


					var tmpItemData = thisObj.getItemDataObj('Td');
					/*
					if ((tmpItemData['components']['Border']['borderWidth'] - 0) === 0) {
						tmpItemData['components']['Border']['borderWidth'] = 1;
					}
					if (tmpItemData['components']['Border']['borderWidth'] === '') {
						tmpItemData['components']['Border']['borderColor'] = '#999999';
					}
					*/
					if (
						tmpItemData['components']['Border']['borderTopWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderRightWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderBottomWidth'] - 0 === 0 &&
						tmpItemData['components']['Border']['borderLeftWidth'] - 0 === 0
					) {
						tmpItemData['components']['Border']['borderTopWidth'] = 1;
						tmpItemData['components']['Border']['borderRightWidth'] = 1;
						tmpItemData['components']['Border']['borderBottomWidth'] = 1;
						tmpItemData['components']['Border']['borderLeftWidth'] = 1;
						tmpItemData['components']['Border']['borderColor'] = '#999999';
					}
					// console.log('--------');
					// console.log('DataManager.js :: InsertElement :: テーブルのtmpItemData2');
					// console.log(tmpItemData);
					// console.log('targetElementId = ' + targetElementId);
					// console.log('--------');
					for (var col=0; col<2; col++) {
						var targetElementId = elementId + '_0-' + col;
						var relationData = {
							'order'								: 0,
							'element_id'						: targetElementId,
							// 'element_id'						: elementId + '_0-' + col,
							'smartphone_library_id'				: 0,
							'item_name'							: 'Td',
							'property'							: $.toJSON(tmpItemData['components'])
						};
						thisObj.replaceElementDataObj(targetElementId, relationData);
						relationDataArr.push(relationData);
					}
				}
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、ドロップされたのがテーブルの場合にtdのプロパティデータを作成しておく
				//////////////////////////////////////////////////////////////////////////////////////


				// var url;
				// if (thisObj._prop['isLibraryElementPage'] === true) {
				// 	url = thisObj._prop['currentUrl'] + 'Library/insertElement/';
				// } else {
				// 	url = thisObj._prop['currentUrl'] + 'Page/insertElement/';
				// }
				if (itemName === 'Library') {
					// $(thisObj).trigger('onInitInsertElement', [elementId, parentId, itemName, order, itemData['components']]);
					$(thisObj).trigger('onInitInsertLibraryElementToPage', [elementId, parentId, itemName, order, itemData['components']]);
				} else {
					$(thisObj).trigger('onInitInsertElement', [elementId, parentId, itemName, order, itemData['components']]);
				}
				var sendData = {
					'device_num'			: 2,
					'base_data'				: baseData,
					'insert_data'			: insertData,
					'leave_data_arr'		: thisObj.getLeaveData(parentId, order),
					'relation_data_arr'		: relationDataArr
				}

				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('更新後');
				// console.log(allElementDataObj);
				// console.log('ツールバーからドロップされたデータで作成したsendData');
				// console.log(sendData);
				// console.log('isLibraryElementPage = ' + thisObj._prop['isLibraryElementPage']);
				// console.log('libraryId = ' + libraryId);
				// console.log('itemName = ' + itemName);
				// console.log('url = ' + url);
				// console.log('---------------------');
				if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
					thisObj.addQueue(thisObj.insertElement, sendData);
					// thisObj._pool.push(
					// 	{
					// 		'method'		: thisObj.insertElement,
					// 		'sendData'		: sendData
					// 	}
					// );
					// console.log('処理をプールする :: thisObj._pool.length = ' + thisObj._pool.length);
					return false;
				}
			} else if (typeof elementId === 'object') {
				var sendData = elementId;
				sendData['leave_data_arr'] = thisObj.getLeaveData(sendData['insert_data']['parent_id'], sendData['insert_data']['order']);
				// console.log('キューから受け取ったsendData');
				// console.log(sendData);
				// if (sendData['insert_data']['item_name'] === 'Library') {
				// 	$(thisObj).trigger('onInitInsertLibraryElementToPage', [sendData['insert_data']['elementId'], sendData['insert_data']['parentId'], sendData['insert_data']['item_name'], sendData['insert_data']['order'], itemData['components']]);
				// } else {
				// 	$(thisObj).trigger('onInitInsertElement', [sendData['insert_data']['elementId'], sendData['insert_data']['parentId'], sendData['insert_data']['item_name'], sendData['insert_data']['order'], itemData['components']]);
				// }
				// $(thisObj).trigger('onInitInsertLibraryElementToPage', [sendData['insertData']['element_d'], sendData['insertData']['parent_id'], sendData['insertData']['item_name'], sendData['insertData']['order']]);
			} else {
				return false;
			}
				var url;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/insertElement/';
				} else {
					url = thisObj._prop['currentUrl'] + 'Page/insertElement/';
				}
				// console.log('**********************');
				// console.log('	保存するsendData');
				// console.log(sendData);
				// console.log('**********************');
				// return false;
				thisObj._isAccess = true;
				// setTimeout(function(event) {
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('追加完了 :: sendData["insert_data"]["element_id"] = ' + sendData["insert_data"]["element_id"] + ', sendData["insert_data"]["item_name"] = ' + sendData["insert_data"]["item_name"]);
						// console.log('obj');
						// console.log(obj);


						if (obj['result'] === true) {
							// setTimeout(function(event) {
							thisObj._isAccess = false;
							// }, 10000
							// );
							var tmpObj = thisObj.getAllElementDataObj();
							// console.log('更新後pre');
							// console.log(tmpObj);
							if (itemName === 'Library') {
								var tmpObj = thisObj.getAllElementDataObj();
								for (var elementId in tmpObj) {
									// console.log('	' + elementId + ' is Library === ' + (tmpObj[elementId]['isLibrary'] === true));
									// console.log('	' + elementId + ' is droppedItem === ' + (tmpObj[elementId]['smartphoneLibraryId'] === libraryId));
									if (
										tmpObj[elementId]['isLibrary'] === true
										// tmpObj[elementId]['isLibrary'] === true &&
										// tmpObj[elementId]['smartphoneLibraryId'] === libraryId
									) {
										if (0 < $('#' + elementId).length) {
											// console.log('		' + elementId + 'のエレメントを削除');
											$('#' + elementId).remove();
										}
										// console.log('		' + elementId + 'のデータを削除');
										thisObj.deleteElementDataObj(elementId);
									}
								}
							}
							var tmpObj = thisObj.getAllElementDataObj();
							// console.log('更新前');
							// console.log(tmpObj);
							// var elementId = '';
							for (var elementId in obj['data']) {
								// elementId = key;
								// if (itemName === 'Library' && obj['data'][elementId]['itemName'] === 'Library') {
								// 	thisObj.deleteElementDataObj(elementId);

								// } else {
									if (obj['data'][elementId]['itemName'] === 'Gallery') {
										obj['data'][elementId]['property']['Gallery']['contents'] = eval(obj['data'][elementId]['property']['Gallery']['contents']);
									}
									thisObj.replaceElementDataObj(elementId, obj['data'][elementId]);
								// }
							}
							var tmpObj = thisObj.getAllElementDataObj();
							// console.log('更新後');
							// console.log(tmpObj);
							// console.log('thisObj._count = ' + thisObj._count);
							// if (thisObj._count === 0) {
							// thisObj._count ++;
							if (sendData['insert_data']['item_name'] === 'Library') {
								$(thisObj).trigger('onCompleteInsertLibraryElementToPage', obj['data']);
							} else {
								$(thisObj).trigger('onCompleteInsertElement', [elementId, obj]);
							}
							// }
							// thisObj.executePool();
								// $(thisObj).trigger('onCompleteInsertElement', [elementId, obj]);
						} else {
							$(thisObj).trigger('onErrorInsertElement', elementId);
						}
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertElement');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						// thisObj._isAccess = false;
						$(thisObj).trigger('onErrorInsertElement', elementId);
					}
				});
				// }, 3000);
		}
		// ,_count : 0

		,addQueue: function(method, data) {
			var thisObj = this;
			if (thisObj._timers['forList']) {
				clearInterval(thisObj._timers['forList']);
			}
			thisObj._queue.push(
				{
					'method'		: method,
					'data'			: data
				}
			);
			thisObj._timers['forList'] = setInterval(
				thisObj.executeQueue, 1000
			);
			// console.log('処理をプールする :: thisObj._queue.length = ' + thisObj._queue.length);
		}

		,executeQueue: function() {
			var thisObj = this;
			if (thisObj._isAccess === false) {
				if (thisObj._queue.length) {
					// console.log('削除前 :: thisObj._queue.length = ' + thisObj._queue.length);
					var targetData = thisObj._queue.shift();
					// console.log('削除後 :: thisObj._queue.length = ' + thisObj._queue.length);
					targetData['method'](targetData['data']);
				} else {
					// console.log('待機している処理はありません');
					if (thisObj._timers['forList']) {
						clearInterval(thisObj._timers['forList']);
					}
				}
			}
		}

		,resetQueue: function() {
			var thisObj = this;
			if (thisObj._timers['forList']) {
				clearInterval(thisObj._timers['forList']);
			}
			// console.log('');
			// console.log('-------------------');
			// console.log('エラーが発生したので、キューを消去しました。');
			// console.log('-------------------');
			// console.log('');
		}

		// ,executePool: function() {
		// 	var thisObj = this;
		// 	if (thisObj._pool.length) {
		// 		console.log('削除前 :: thisObj._pool.length = ' + thisObj._pool.length);
		// 		var targetData = thisObj._pool.shift();
		// 		console.log('削除後 :: thisObj._pool.length = ' + thisObj._pool.length);
		// 		targetData['method'](targetData['sendData']);
		// 	}
		// }

		/*
		 * 並び替えデータ保存メソッド
		 * @param	elementId		並び替えたエレメントのID
		 * @return	void
		 */
		,reOrderData: function(reorderElementId, newParentId, newOrder) {
			var thisObj = this;
			// console.log('reOrderData :: ')
			if (
				thisObj._prevData['reorder']['elementId'] === reorderElementId &&
				thisObj._prevData['reorder']['parentId'] === newParentId &&
				thisObj._prevData['reorder']['order'] === newOrder
			) {
				return;
			} else {
				thisObj._prevData['reorder']['elementId'] = reorderElementId;
				thisObj._prevData['reorder']['parentId'] = newParentId;
				thisObj._prevData['reorder']['order'] = newOrder;
			}
			if (typeof reorderElementId === 'string') {
				// console.log('--------------------');
				// console.log('DataManager :: reOrderData :: bigin');
				// console.log('	reorderElementId = ' + reorderElementId);
				// console.log('	newParentId = ' + newParentId);
				// console.log('	newOrder = ' + newOrder);
				// console.log('並べ替え開始');


				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('更新前');
				// console.log(allElementDataObj);
				var elementData = thisObj.getElementDataObj(reorderElementId);
				var beforeOrderdParentId = elementData['parentId'];
				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、reorderElementIdの変更前の親エレメントの子エレメントのorderを変更
				//////////////////////////////////////////////////////////////////////////////////////
				/*
				var elementData = thisObj.getElementDataObj(reorderElementId);
				var beforeOrderdParentId = elementData['parentId'];
				var beforeOrderdChildren = thisObj.getChildElementDataObj(beforeOrderdParentId);
				var biginIndex, endIndex, diffOrder;
				if (elementData['order'] < newOrder) {
					biginIndex = elementData['order']
					endIndex = newOrder + 1;
					diffOrder = -1;
				} else {
					biginIndex = newOrder;
					endIndex = elementData['order'] - 1;
					diffOrder = 1;
				}
				for (var i=biginIndex; i<endIndex; i++) {
					beforeOrderdChildren[i]['order'] += diffOrder;
					thisObj.replaceElementDataObj(beforeOrderdChildren[i]['elementId'], beforeOrderdChildren[i]);
				}
				*/
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、reorderElementIdの変更前の親エレメントの子エレメントのorderを変更
				//////////////////////////////////////////////////////////////////////////////////////


				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、reorderElementIdの変更後の親エレメントの子エレメントのorderを変更
				//////////////////////////////////////////////////////////////////////////////////////
				/*
				if (beforeOrderdParentId !== newParentId) {
					var afterOrderdChildren = thisObj.getChildElementDataObj(newParentId);
					var biginIndex = newOrder;
					var endIndex = afterOrderdChildren.length;
					var diffOrder = 1;
					for (var i=biginIndex; i<endIndex; i++) {
						afterOrderdChildren[i]['order'] += diffOrder;
						thisObj.replaceElementDataObj(afterOrderdChildren[i]['elementId'], afterOrderdChildren[i]);
					}
				}
				*/
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、reorderElementIdの変更後の親エレメントの子エレメントのorderを変更
				//////////////////////////////////////////////////////////////////////////////////////

				var allElementDataObj = thisObj.getAllElementDataObj();
				var oldParentId = allElementDataObj[reorderElementId]['parentId'];
				var oldOrder = allElementDataObj[reorderElementId]['order'];
				for (var tmpElementId in allElementDataObj) {
					if (tmpElementId !== 'displayArea' && tmpElementId !== reorderElementId && allElementDataObj[tmpElementId]['parentId'] === oldParentId) {
						if (oldOrder < newOrder && oldOrder < allElementDataObj[tmpElementId]['order'] && allElementDataObj[tmpElementId]['order'] <= newOrder) {
							thisObj.setElementDataObj(tmpElementId, 'order', allElementDataObj[tmpElementId]['order'] - 1);
							// console.log(tmpElementId + 'のorderを小さくする');
						}
						if (newOrder < oldOrder && newOrder <= allElementDataObj[tmpElementId]['order'] && allElementDataObj[tmpElementId]['order'] < oldOrder) {
							thisObj.setElementDataObj(tmpElementId, 'order', allElementDataObj[tmpElementId]['order'] + 1);
							// console.log(tmpElementId + 'のorderを大きくする');
						}
					}
				}

				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、reorderElementIdのparentIdとorderを変更
				//////////////////////////////////////////////////////////////////////////////////////
				var elementDataObj = thisObj.getElementDataObj(reorderElementId);
				var oldOrder = elementDataObj['order'];
				var targetId = thisObj._prop['isLibraryElementPage'] === true ? elementDataObj['smartphoneLibraryElementId'] : elementDataObj['smartphonePageElementId'];
				thisObj.setElementDataObj(reorderElementId, 'parentId', newParentId);
				// thisObj.setElementDataObj(reorderElementId, 'order', newOrder+1);
				thisObj.setElementDataObj(reorderElementId, 'order', newOrder);
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、reorderElementIdのparentIdとorderを変更
				//////////////////////////////////////////////////////////////////////////////////////


				// var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('更新後');
				// console.log(allElementDataObj);


				//////////////////////////////////////////////////////////////////////////////////////
				// ここから、エレメント並べ替え処理
				//////////////////////////////////////////////////////////////////////////////////////
				var element = $('#' + reorderElementId);
				var parentElement = element.parent();
				var parentId = parentElement.attr('id');
				var index = parentElement.children().index(element);
				// console.log('	(index + 1) = ' + (index+1) + ', newOrder = ' + newOrder);
				// console.log('	parentId = ' + parentId + ', newParentId = ' + newParentId);
				if ((index + 1) !== newOrder || parentId !== newParentId) {
					var newParentElement = $('#' + newParentId);
					var newParentChildren = newParentElement.children().length;
					if (newParentChildren === 0 || newParentChildren < newOrder) {
						newParentElement.append(element);
					} else if (newOrder === 1) {
						newParentElement.prepend(element);
					} else {
						$(newParentElement.children().get(newOrder - 1)).after(element);
					}
				}
				//////////////////////////////////////////////////////////////////////////////////////
				// ここまで、エレメント並べ替え処理
				//////////////////////////////////////////////////////////////////////////////////////

				$(thisObj).trigger('onInitReorderElement');


				// var baseData = {
				// 	'user_id'							: thisObj._prop['userId'],
				// 	'page_id'							: thisObj._prop['pageId'],
				// 	'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId']
				// }
				// var reorderData = {
				// 	'id'			: thisObj._prop['isLibraryElementPage'] === true ? elementData['smartphoneLibraryElementId'] : elementData['smartphonePageElementId'],
				// 	'element_id'	: reorderElementId,
				// 	'parent_id'		: newParentId,
				// 	'order'			: newOrder
				// }
				// var updateDataArr = thisObj.getLeaveData();
				var sendData = {
					'device_num'					: 2,
					'base_data'						: {
						'user_id'							: thisObj._prop['userId'],
						'page_id'							: thisObj._prop['pageId'],
						'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId']
					},
					'reorder_data'					: {
						'id'								: thisObj._prop['isLibraryElementPage'] === true ? elementData['smartphoneLibraryElementId'] : elementData['smartphonePageElementId'],
						'element_id'						: reorderElementId,
						'parent_id'							: newParentId,
						'order'								: newOrder
					},
					'leave_data_arr'				: thisObj.getLeaveData()
				}
				/*
				var sendData = {
					'user_id'						: thisObj._prop['userId'],
					'page_id'						: thisObj._prop['pageId'],
					'smartphone_library_id'			: thisObj._prop['smartphoneLibraryId'],
					'record_id'						: targetId,
					'reorder_element_id'			: reorderElementId,
					'new_parent_id'					: newParentId,
					'old_parent_id'					: beforeOrderdParentId,
					// 'new_order'						: newOrder + 1,
					'new_order'						: newOrder,
					'old_order'						: oldOrder
				}
				*/
				if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
					thisObj.addQueue(thisObj.reOrderData, sendData);
					return false;
				}
			} else if (typeof reorderElementId === 'object') {
				var sendData = reorderElementId;
				sendData['leave_data_arr'] = thisObj.getLeaveData();
			} else {
				return false;
			}
			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/reorderElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/reorderElement/';
			}
			// console.log('---------------------');
			// console.log('	sendData');
			// console.log(sendData);
			// console.log('---------------------');
			// return;
			thisObj._isAccess = true;
			$.ajax({
				type		: "POST",
				url			: url,
				data		: sendData,
				dataType	: "json",
				success		: function(obj){
					// console.log('並べ替え完了');
					// console.log(obj);
					// console.log('---------------------');
					// console.log('	_elementData');
					// console.log(thisObj._elementData);
					// console.log('---------------------');
					if (obj['result'] === true) {
						// setTimeout(function(event) {
						thisObj._isAccess = false;
						// }, 10000
						// );
						$(thisObj).trigger('onCompleteReorderElement');
					} else {
						$(thisObj).trigger('onErrorReorderElement');
					}
				},
				error		: function(XMLHttpRequest, textStatus, errorThrown) {
					// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
					console.log('Error :: reOrderData');
					console.log('---------------------');
					console.log(XMLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
					console.log('---------------------');
					thisObj._isAccess = false;
					$(thisObj).trigger('onErrorReorderElement');
				}
			});
		}

		,getRelationElementIdArr: function(parentId) {
			var thisObj = this;
			var targetElementData = thisObj.getChildElementDataObj(parentId);
			// console.log('--------');
			// console.log('PreviewAreaManager :: render');
			// console.log('parentId =' + parentId);
			// console.log(targetElementData);
			// console.log('--------');
			var arr = [];
			if (0 < targetElementData.length) {
				for (var order=0,len=targetElementData.length; order<len; order++) {
					arr.push(targetElementData[order]['elementId']);
					var tmpArr = thisObj.getRelationElementIdArr(targetElementData[order]['elementId']);
					arr.concat(tmpArr);
				}
			}
			return arr;
		}

		/*
		 * Element削除メソッド
		 * @param	elementId		削除するエレメントのID
		 * @param	recordId		削除するエレメントのレコードID
		 * @return	void
		 */
		,deleteElement: function(elementId) {
			var thisObj = this;
			if (typeof elementId === 'string') {
				if (
					thisObj._prevData['delete']['elementId'] === elementId
				) {
					return;
				} else {
					thisObj._prevData['delete']['elementId'] = elementId;
				}
				var relationDeleteElementIdArr = thisObj.getRelationElementIdArr(elementId);
				relationDeleteElementIdArr.push(elementId);
				// var deleteRecordIdArr = [];
				// for (var i=0, len=relationDeleteElementIdArr.length; i<len; i++) {
				// 	var elementDataObj = thisObj.getElementDataObj(relationDeleteElementIdArr[i]);
				// 	deleteRecordIdArr.push((elementDataObj['smartphoneLibraryElementId'] !== 0 && elementDataObj['smartphoneLibraryElementId'] !== '') ? elementDataObj['smartphoneLibraryElementId'] : elementDataObj['smartphonePageElementId']);
				// }
				// var elementDataObj = thisObj.getElementDataObj(elementId);
				// if (elementDataObj['itemName'] === 'Table') {
				// 	var allElementDataObj = thisObj.getAllElementDataObj();
				// 	for (var tmpElementId in allElementDataObj) {
				// 		if (tmpElementId.indexOf(elementId) !== -1) {
				// 			deleteRecordIdArr.push(allElementDataObj[tmpElementId]['smartphonePageElementId']);
				// 		}
				// 	}
				// }
				var elementDataObj = thisObj.getElementDataObj(elementId);
				// var deleteRecordId = thisObj._prop['isLibraryElementPage'] === true ? elementDataObj['smartphoneLibraryElementId'] : elementDataObj['smartphonePageElementId'];
				// deleteRecordIdArr.push(deleteRecordId);

				var tmpAllElementDataObj = thisObj.getAllElementDataObj();
				// console.log('	削除前');
				// console.log(tmpAllElementDataObj);
				for (var i=0,len=relationDeleteElementIdArr.length; i<len; i++) {
					thisObj.deleteElementDataObj(relationDeleteElementIdArr[i]);
				}
				// var tmpAllElementDataObj = thisObj.getAllElementDataObj();
				for (var tmpElementId in tmpAllElementDataObj) {
					if (tmpElementId !== 'displayArea' && elementDataObj['order'] < (tmpAllElementDataObj[tmpElementId]['order']-0)) {
						tmpAllElementDataObj[tmpElementId]['order'] = tmpAllElementDataObj[tmpElementId]['order'] - 1;
						thisObj.replaceElementDataObj(tmpElementId, tmpAllElementDataObj[tmpElementId]);
					}
				}
				var tmpAllElementDataObj = thisObj.getAllElementDataObj();
				// console.log('	削除後');
				// console.log(tmpAllElementDataObj);

				$(thisObj).trigger('onInitDeleteElement', elementId);

				// var updateDataArr = thisObj.getLeaveData();
					// var baseData = {
					// 	'user_id'							: thisObj._prop['userId'],
					// 	'page_id'							: thisObj._prop['pageId'],
					// 	'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId']
					// }
					// var deleteData = {
					// 	'id'				: deleteRecordId,
					// 	'parent_id'			: elementDataObj['parentId'],
					// 	'order'				: elementDataObj['order']
					// }
				var sendData = {
					'device_num'				: 2,
					'base_data'					: {
						'user_id'							: thisObj._prop['userId'],
						'page_id'							: thisObj._prop['pageId'],
						'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId']
					},
					// 'delete_data'				: deleteData,
					'leave_data_arr'						: thisObj.getLeaveData()
					// 'leave_data_arr'						: thisObj.getLeaveData2()
					// 'delete_id_arr'				: deleteRecordIdArr
				}
				// var sendData = {
				// 	'user_id'							: thisObj._prop['userId'],
				// 	'page_id'							: thisObj._prop['pageId'],
				// 	'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId'],
				// 	'delete_element_record_id'			: deleteRecordId,
				// 	'delete_element_parent_id'			: elementDataObj['parentId'],
				// 	'delete_element_order'				: elementDataObj['order'],
				// 	'delete_record_id_arr'				: relationDeleteRecordIdArr
				// }
				// console.log('---------------------');
				// console.log(sendData);
				// console.log('---------------------');
				// return;
				if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
					thisObj.addQueue(thisObj.deleteElement, sendData);
					// thisObj._pool.push(
					// 	{
					// 		'method'		: thisObj.insertElement,
					// 		'sendData'		: sendData
					// 	}
					// );
					// console.log('処理をプールする :: thisObj._pool.length = ' + thisObj._pool.length);
					return false;
				}
			} else if (typeof elementId === 'object') {
				var sendData = elementId;
				sendData['leave_data_arr'] = thisObj.getLeaveData();
			} else {
				return false;
			}

			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/deleteElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/deleteElement/';
			}
			// if (thisObj._isEnabled === true && thisObj._isAccess === false) {
				thisObj._isAccess = true;
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('パーツ削除完了');
						// console.log(obj);
						if (obj['result'] === true) {
							// var cloneElementData = thisObj.getElementData('all');
							// console.log('削除完了');
							// console.log('---------------------');
							// console.log('	_elementData');
							// console.log(cloneElementData);
							// console.log('	_elementData');
							// console.log(cloneElementData);
							// console.log('---------------------');
						// setTimeout(function(event) {
							thisObj._isAccess = false;
						// }, 10000
						// );
							$(thisObj).trigger('onCompleteDeleteElement', elementId);
						} else {
							$(thisObj).trigger('onErrorDeleteElement', elementId);
						}
						// $(thisObj).trigger('onCompleteDeleteElement', elementId);
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						// console.log('Error :: deleteElement');
						// console.log('---------------------');
						// console.log(XMLHttpRequest);
						// console.log(textStatus);
						// console.log(errorThrown);
						// console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorDeleteElement', elementId);
					}
				});
			// }
		}

		/*
		 * 現在プレビューエリアに配置されていて、smartphone_page_elementsに登録されるエレメントのデータを取得するメソッド
		 * @param	parentId	親エレメントのID
		 * @param	order		順番
		 * @return	void
		 */
		,getLeaveData2: function(parentId, order) {
			var thgetLeaveDataisObj = this;
			order = !isNaN(order) ? order : 1;
			//////////////////////////////////////////////////////////////////////////////////////
			// ここから、プレビューエリアに配置されている共通パーツ以外の全パーツの、並び順をはじめとするデータを取得
			//////////////////////////////////////////////////////////////////////////////////////
			var dataArr = [];
			$('#spContent [data-item-name][class!="not-editable"]').each(function(i) {
				var element = $(this);
				var parentElement = element.parent();
				var order2 = parentElement.children().index(element) + 1;
				// console.log('elementId = ' + element.attr('id') + ', order = ' + order);
				if (0 < order) {
					var elementId = element.attr('id');
					var elementDataObj = thisObj.getElementDataObj(elementId);
					if (
						elementDataObj['smartphonePageElementId'] !== undefined
						&&
						elementDataObj['smartphoneLibraryElementId'] !== undefined
						&&
						elementId !== undefined
					) {
						if (parentId && parentElement.attr('id') === parentId && order <= order2) {
							order2++;
						}
						dataArr.push(
							{
								'smartphone_page_element_id'			: elementDataObj['smartphonePageElementId'],
								'smartphone_library_element_id'			: elementDataObj['smartphoneLibraryElementId'],
								'element_id'							: elementId,
								'order'									: order2
							}
						);
					}
				}
				// console.log('elemntId = ' + element.attr('id') + ', order = ' + order);
			});
			// console.log(dataArr);
			//////////////////////////////////////////////////////////////////////////////////////
			// ここまで、プレビューエリアに配置されている共通パーツ以外の全パーツの、並び順をはじめとするデータを取得
			//////////////////////////////////////////////////////////////////////////////////////
			return dataArr;
		}

		/*
		 * 現在プレビューエリアに配置されていて、smartphone_page_elementsに登録されるエレメントのデータを取得するメソッド
		 * @param	parentId	親エレメントのID
		 * @param	order		順番
		 * @return	void
		 */
		,getLeaveData: function(parentId, order) {
			var thisObj = this;
			order = !isNaN(order) ? order : 1;
			//////////////////////////////////////////////////////////////////////////////////////
			// ここから、プレビューエリアに配置されている共通パーツ以外の全パーツの、並び順をはじめとするデータを取得
			//////////////////////////////////////////////////////////////////////////////////////
			var dataArr = [];
			// var elementArr = [];
			// var libraryArr = [];
			$('#spContent [data-item-name][class!="not-editable"]').each(function(i) {
				var element = $(this);
				var parentElement = element.parent();
				var order2 = parentElement.children().index(element) + 1;
				// console.log('elementId = ' + element.attr('id') + ', order = ' + order);
				if (0 < order) {
					var elementId = element.attr('id');
					var elementDataObj = thisObj.getElementDataObj(elementId);
					if (
						elementDataObj['smartphonePageElementId'] !== undefined
						&&
						elementDataObj['smartphoneLibraryElementId'] !== undefined
						&&
						elementId !== undefined
					) {
						if (parentId && parentElement.attr('id') === parentId && order <= order2) {
							order2++;
						}
						if (thisObj._prop['isLibraryElementPage'] === true) {
							if (elementDataObj['smartphonePageElementId'] === 0 && elementDataObj['smartphoneLibraryElementId'] !== 0) {
								dataArr.push(elementDataObj['smartphoneLibraryElementId'] + ':' + order2);
							}
						} else {
							if (elementDataObj['smartphonePageElementId'] !== 0 && elementDataObj['smartphoneLibraryElementId'] === 0) {
								dataArr.push(elementDataObj['smartphonePageElementId'] + ':' + order2);
							}
						}
						// if (elementDataObj['smartphonePageElementId'] !== 0 && elementDataObj['smartphoneLibraryElementId'] === 0) {
						// 	elementArr.push(elementDataObj['smartphonePageElementId'] + ':' + order2);
						// }
						// if (elementDataObj['smartphonePageElementId'] === 0 && elementDataObj['smartphoneLibraryElementId'] !== 0) {
						// 	libraryArr.push(elementDataObj['smartphoneLibraryElementId'] + ':' + order2);
						// }

						// dataArr.push(
						// 	{
						// 		'smartphone_page_element_id'			: elementDataObj['smartphonePageElementId'],
						// 		'smartphone_library_element_id'			: elementDataObj['smartphoneLibraryElementId'],
						// 		'element_id'							: elementId,
						// 		'order'									: order2
						// 	}
						// );
					}
				}
				// console.log('elemntId = ' + element.attr('id') + ', order = ' + order);
			});
			// console.log(dataArr);
			// console.log('-------------------------');
			// console.log('dataArr');
			// console.log(dataArr);
			// console.log('elementArr');
			// console.log(elementArr);
			// console.log('libraryArr');
			// console.log(libraryArr);
			// console.log('-------------------------');
			//////////////////////////////////////////////////////////////////////////////////////
			// ここまで、プレビューエリアに配置されている共通パーツ以外の全パーツの、並び順をはじめとするデータを取得
			//////////////////////////////////////////////////////////////////////////////////////
			// return {'elementArr':elementArr, 'libraryArr':libraryArr};
			return $.toJSON({'elements':dataArr});
			// return $.toJSON({'elementArr':elementArr, 'libraryArr':libraryArr});
			// return dataArr;
		}

		/*
		 * テーブルElement修正メソッド
		 * @param	elementId			削除するエレメントのID
		 * @param	order				テーブルの並び順
		 * @param	targetProperty		テーブルプロパティデータ
		 * @param	addElementIdArr		追加するエレメントID配列
		 * @param	delElementIdArr		削除するエレメントID配列
		 * @return	void
		 */
		,editTableElement: function(elementId, targetProperty, oldProperty) {
			var thisObj = this;
			if (typeof elementId === 'string') {
				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('');
				// console.log('---------------------');
				// console.log('更新前');
				// console.log(allElementDataObj);
				// console.log('targetProperty');
				// console.log(targetProperty);
				// console.log('oldProperty');
				// console.log(oldProperty);
				var addElementIdArr = [];
				var delElementIdArr = [];
				// console.log('変更前の行 = ' + oldProperty['row'] + ', 変更後の行 = ' + targetProperty['row']);
				// console.log('変更前の列 = ' + oldProperty['col'] + ', 変更後の列 = ' + targetProperty['col']);
				if (targetProperty['row'] < oldProperty['row'] || targetProperty['col'] < oldProperty['col']) {
					if (targetProperty['row'] < oldProperty['row'] && targetProperty['col'] < oldProperty['col']) {
						// console.log('行列、共に減った');
						for (var row=oldProperty['row']-1,rowLimit=targetProperty['row']; row>=rowLimit; row--) {
							for (var col=oldProperty['col'],colLimit=targetProperty['col']; col>=colLimit; col--) {
								var tdElementId = elementId + '_' + row + '-' + col;
								delElementIdArr.push(tdElementId);
							}
						}
					} else if (targetProperty['row'] < oldProperty['row']) {
						// console.log('行だけが減った');
						for (var row=oldProperty['row']-1,rowLimit=targetProperty['row']; row>=rowLimit; row--) {
							for (var col=0,colCount=targetProperty['col']; col<colCount; col++) {
								var tdElementId = elementId + '_' + row + '-' + col;
								delElementIdArr.push(tdElementId);
							}
						}

					} else if (targetProperty['col'] < oldProperty['col']) {
						// console.log('列だけが減った');
						for (var row=0,rowCount=targetProperty['row']; row<rowCount; row++) {
							for (var col=oldProperty['col'],colLimit=targetProperty['col']; col>=colLimit; col--) {
								var tdElementId = elementId + '_' + row + '-' + col;
								delElementIdArr.push(tdElementId);
							}
						}
					}
				}
				for (var row=0,rowCount=targetProperty['row']; row<rowCount; row++) {
					for (var col=0,colCount=targetProperty['col']; col<colCount; col++) {
						var tdElementId = elementId + '_' + row + '-' + col;
						var tmpDataObj = thisObj.getElementDataObj(tdElementId);
						if (tmpDataObj['itemName'] !== 'Td') {
							addElementIdArr.push(tdElementId);
						}
						var prop = {
							'smartphonePageElementId'			: tmpDataObj['smartphonePageElementId'] || '',
							'smartphoneLibraryElementId'		: tmpDataObj['smartphoneLibraryElementId'] || '',
							'smartphoneLibraryId'				: tmpDataObj['smartphoneLibraryId'] || '',
							'order'								: 0,
							'parentId'							: '',
							'itemName'							: 'Td',
							'isLibrary'							: thisObj._prop['isLibraryElementPage'],
							'property'							: thisObj.getItemDataObj('Td')['components']
						}
						thisObj.replaceElementDataObj(tdElementId, prop);
					}
				}
				if (delElementIdArr.length) {
					for (var i=0,len=delElementIdArr.length; i<len; i++) {
						thisObj.deleteElementDataObj(delElementIdArr[i]);
					}
				}
				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('更新後');
				// console.log(allElementDataObj);
				// console.log('---------------------');
				// console.log('');
				var elementDataobj = thisObj.getElementDataObj(elementId);
				elementDataobj['property']['Table'] = targetProperty
				thisObj.setElementDataObj(elementId, 'property', elementDataobj['property']);
				var recordId;
				// var url, recordId;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					// url = thisObj._prop['currentUrl'] + 'Library/editTableElement/';
					recordId = elementDataobj['smartphoneLibraryElementId'];
				} else {
					// url = thisObj._prop['currentUrl'] + 'Page/editTableElement/';
					recordId = elementDataobj['smartphonePageElementId'];
				}
				$(thisObj).trigger('onInitEditTableElement', elementId);

				var tdData = thisObj.getItemDataObj('Td');
				// if ((tdData['components']['Border']['borderWidth'] - 0) === 0) {
				// 	tdData['components']['Border']['borderWidth'] = 1;
				// }
				// if (tdData['components']['Border']['borderWidth'] === '') {
				// 	tdData['components']['Border']['borderColor'] = '#999999';
				// }
				if (
					tdData['components']['Border']['borderTopWidth'] - 0 === 0 &&
					tdData['components']['Border']['borderRightWidth'] - 0 === 0 &&
					tdData['components']['Border']['borderBottomWidth'] - 0 === 0 &&
					tdData['components']['Border']['borderLeftWidth'] - 0 === 0
				) {
					tdData['components']['Border']['borderTopWidth'] = 1;
					tdData['components']['Border']['borderRightWidth'] = 1;
					tdData['components']['Border']['borderBottomWidth'] = 1;
					tdData['components']['Border']['borderLeftWidth'] = 1;
					tdData['components']['Border']['borderColor'] = '#999999';
				}
				var sendData = {
					'device_num'						: 2,
					'base_data'							: {
						'user_id'						: thisObj._prop['userId'],
						'page_id'						: thisObj._prop['pageId'],
						'smartphone_library_id'			: thisObj._prop['smartphoneLibraryId']
					},
					'table_data'						: {
						'id'				: recordId,
						'element_id'		: elementId,
						'parent_id'			: elementDataobj['parentId'],
						'order'				: elementDataobj['order'],
						'property'			: $.toJSON(elementDataobj['property'])
					},
					// 'td_property'						: $.toJSON(thisObj.getItemDataObj('Td')['components']),
					'td_property'						: $.toJSON(tdData['components']),
					'add_td_data'						: addElementIdArr,
					'del_td_data'						: delElementIdArr,
					'leave_data_arr'					: thisObj.getLeaveData()
				}

				if (thisObj._isAccess === true || 0 < thisObj._queue.length) {
					thisObj.addQueue(thisObj.editTableElement, sendData);
					return false;
				}
				// console.log('	elementDataobj');
				// console.log(elementDataobj);
				// console.log('	sendData');
				// console.log(sendData);
				// console.log('更新開始');
			} else if (typeof elementId === 'object') {
				var sendData = elementId;
				// sendData['leave_data_arr'] = thisObj.getLeaveData();
				sendData['leave_data_arr'] = thisObj.getLeaveData();
			} else {
				return false;
			}

			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/editTableElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/editTableElement/';
			}
			thisObj._isAccess = true;

				// console.log('---------------------');
				// console.log('sendData');
				// console.log(sendData);
				var allElementDataObj = thisObj.getAllElementDataObj();
				// console.log('allElementDataObj');
				// console.log(allElementDataObj);
				// console.log('---------------------');
				// return;
				// console.log('sendData');
				// console.log(sendData);
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						// console.log('処理完了');
						// console.log(obj);
						if (obj['result'] === true) {
							var tmpObj = thisObj.getAllElementDataObj();
							// console.log('更新前');
							// console.log(tmpObj);
							var elementId = '';
							for (var key in obj['data']) {
								elementId = key;
								thisObj.replaceElementDataObj(elementId, obj['data'][elementId]);
							}
							// setTimeout(function(event) {
							thisObj._isAccess = false;
							// }, 10000
							// );
							var tmpObj = thisObj.getAllElementDataObj();
							// console.log('更新後');
							// console.log(tmpObj);
							// console.log('editTableElement :: thisObj._isEnabled = ' + thisObj._isEnabled + ', thisObj._isAccess = ' + thisObj._isAccess + ', thisObj._pool.length = ' + thisObj._pool.length);
							$(thisObj).trigger('onCompleteEditTableElement');
						} else {
							$(thisObj).trigger('onErrorEditTableElement', elementId);
						}
						// $(thisObj).trigger('onCompleteDeleteElement', elementId);
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('---------------------');
						console.log('Error :: editTableData');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
						$(thisObj).trigger('onErrorEditTableElement', elementId);
					}
				});
			// }
		}

		/*
		 * 本番ページ書き出しメソッド
		 * @param	residence_id		物件ID
		 * @param	recordId				ページID
		 * @param	userId				ユーザID
		 * @param	path				ページのパス
		 * @param	title				ページのタイトル
		 * @param	source				ページのソース
		 * @return	void
		 */
		,publishConcretePage: function(recordId, companyId, residenceId, userId, path, title, source) {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// console.log('リクエスト開始');
				var url = thisObj._prop['currentUrl'] + 'Page/publishConcretePage/';
				var sendData = {
					// 'residence_id'		: residenceId,
					'device_num'		: 2,
					'id'				: recordId,
					'user_id'			: userId,
					'company_id'		: companyId,
					'residence_id'		: residenceId,
					'path'				: path,
					'title'				: title,
					'source'			: source
				}
				// console.log('');
				// console.log('');
				// console.log('sendData');
				// console.log(sendData);
				// console.log('');
				// console.log('');
				// return;
				$(thisObj).trigger('onInitPublishConcretePage', recordId);
				$.ajax({
					type: "POST",
					url: url,
					data: sendData,
					dataType: "json",
					success: function(obj){
						// console.log('リクエスト完了');
						// console.log(obj);
						if (obj['result'] === true) {
							thisObj._isAccess = false;
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
						$(thisObj).trigger('onErrorPublishConcretePage', recordId);
						// thisObj._isAccess = false;
					}
				});
			}
		}

		/*
		 * このクラスの有効/無効切り替えメソッド
		 * @param	isEnabled		true===有効、false===無効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			thisObj._isEnabled = isEnabled;
		}

		/*
		 * データをDBに保存する際のプロパティをオブジェクトにセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;
			thisObj._menuDataObj = eval("(" + $('input[type="hidden"][name="menuData"]').val() + ")");
			thisObj._itemDataObj = eval("(" + $('input[type="hidden"][name="itemData"]').val() + ")");

			// var displayAreaProperty = $('input[type="hidden"][name="libraryPageProperty"]').val() ? eval("(" + $('input[type="hidden"][name="libraryPageProperty"]').val() + ")") : null;
			// if (displayAreaProperty === null) {
			// 	displayAreaProperty
			// }
			// console.log($('input[type="hidden"][name="libraryPageProperty"]').val());

			thisObj._prop = {
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
				'companyId'					: $('input[type="hidden"][name="companyId"]').val(),
				'isLibraryElementPage'		: $('input[type="hidden"][name="isLibraryElementPage"]').val() === "1" ? true : false,
				'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				'pageId'					: $('input[type="hidden"][name="pageId"]').val(),
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val() ? eval($('input[type="hidden"][name="libraryPageProperty"]').val()) : {},
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val() ? eval("(" + $('input[type="hidden"][name="libraryPageProperty"]').val() + ")") : {},
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val() ? $.parseJSON($('input[type="hidden"][name="libraryPageProperty"]').val()) : {},
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val() ? $.parseJSON($('input[type="hidden"][name="libraryPageProperty"]').val()) : {},
				'smartphonePageId'			: $('input[type="hidden"][name="smartphonePageId"]').val(),
				'smartphoneLibraryId'		: $('input[type="hidden"][name="smartphoneLibraryId"]').val()
			}
			thisObj._menuDataObj = $.parseJSON(thisObj._menuDataObj);
			thisObj._itemDataObj = $.parseJSON(thisObj._itemDataObj);
			// thisObj._prop['libraryPageProperty'] = $.parseJSON(thisObj._prop['libraryPageProperty']);

			// console.log(thisObj._menuDataObj);
			// console.log(thisObj._itemDataObj);
			// console.log(thisObj._prop['libraryPageProperty']);
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

		/*
		 * このクラスが保持しているプロパティを返すメソッド
		 * @param	void
		 * @return	このクラスが保持しているプロパティオブジェクト
		 */
		,replaceProp: function(key, val) {
			var thisObj = this;
			thisObj._prop[key] = val;
		}

		/*
		 * アイコンデータを作成するメソッド
		 * @param	void
		 * @return	void
		 */
		,createIconData: function(val) {
			var thisObj = this;
			thisObj._icons = [
				'#x0021;', '#x0022;', '#x0023;', '#x0024;', '#x0025;', '#x0026;', '#x0027;', '#x0028;', '#x0029;',
				'#x002a;', '#x002b;', '#x002c;', '#x002d;', '#x002e;', '#x002f;',
				'#x0031;', '#x0032;', '#x0033;', '#x0034;', '#x0035;', '#x0036;', '#x0037;', '#x0038;', '#x0039;',
				'#x003a;', '#x003b;', '#x003c;', '#x003d;', '#x003e;', '#x003f;',
				'#x0040;', '#x0042;', '#x0043;', '#x0044;', '#x0045;', '#x0046;', '#x0047;', '#x0048;', '#x0049;',
				'#x004a;', '#x004b;', '#x004c;', '#x004d;', '#x004e;', '#x004f;',
				'#x0050;', '#x0052;', '#x0053;', '#x0054;', '#x0055;', '#x0056;', '#x0057;', '#x0058;', '#x0059;',
				'#x005a;', '#x005b;', '#x005c;', '#x005d;', '#x005e;', '#x005f;',
				'#x0060;', '#x0062;', '#x0063;', '#x0064;', '#x0065;', '#x0066;', '#x0067;', '#x0068;', '#x0069;',
				'#x006a;', '#x006b;', '#x006c;', '#x006d;', '#x006e;', '#x006f;',
				'#x0070;', '#x0072;', '#x0073;', '#x0074;', '#x0075;', '#x0076;', '#x0077;', '#x0078;', '#x0079;',
				'#x007a;', '#x007b;', '#x007c;', '#x007d;',
				'#xe001;', '#xe002;', '#xe003;', '#xe004;', '#xe005;', '#xe006;', '#xe007;', '#xe008;', '#xe009;',
				'#xe00a;', '#xe00b;', '#xe00c;', '#xe00d;', '#xe00e;', '#xe00f;',
				'#xe010;', '#xe011;', '#xe012;', '#xe013;', '#xe014;', '#xe015;', '#xe016;', '#xe017;', '#xe018;', '#xe019;',
				'#xe01a;', '#xe01b;', '#xe01c;', '#xe01d;', '#xe01e;', '#xe01f;',
				'#xe020;', '#xe021;', '#xe022;', '#xe023;', '#xe024;', '#xe025;', '#xe026;', '#xe027;', '#xe028;', '#xe029;',
				'#xe02a;', '#xe02b;', '#xe02c;', '#xe02d;', '#xe02e;', '#xe02f;',
				'#xe030;', '#xe031;', '#xe032;', '#xe033;', '#xe034;', '#xe035;', '#xe036;', '#xe037;', '#xe038;', '#xe039;',
				'#xe03a;', '#xe03b;', '#xe03c;', '#xe03d;', '#xe03e;', '#xe03f;',
				'#xe050;', '#xe051;', '#xe052;', '#xe053;', '#xe054;', '#xe055;', '#xe056;', '#xe057;', '#xe058;', '#xe059;',
				'#xe05a;', '#xe05b;', '#xe05c;', '#xe05d;', '#xe05e;', '#xe05f;',
				'#xe060;', '#xe061;', '#xe062;', '#xe063;', '#xe064;', '#xe065;', '#xe066;', '#xe067;', '#xe068;', '#xe069;',
				'#xe06a;', '#xe06b;', '#xe06c;', '#xe06d;', '#xe06e;', '#xe06f;',
				'#xe070;', '#xe071;', '#xe072;', '#xe073;', '#xe074;', '#xe075;', '#xe076;', '#xe077;', '#xe078;', '#xe079;',
				'#xe07a;', '#xe07b;', '#xe07c;', '#xe07d;', '#xe07e;', '#xe07f;',
				'#xe080;', '#xe081;', '#xe082;', '#xe083;', '#xe084;', '#xe085;', '#xe086;', '#xe087;', '#xe088;', '#xe089;',
				'#xe08a;', '#xe08b;', '#xe08c;', '#xe08d;', '#xe08e;', '#xe08f;',
				'#xe090;', '#xe091;', '#xe092;', '#xe093;', '#xe094;', '#xe095;', '#xe096;', '#xe097;', '#xe098;', '#xe099;',
				'#xe09a;', '#xe09b;', '#xe09c;', '#xe09d;', '#xe09e;', '#xe09f;',
				'#xe0a0;', '#xe0a1;', '#xe0a2;', '#xe0a3;', '#xe0a4;', '#xe0a5;', '#xe0a6;', '#xe0a7;', '#xe0a8;', '#xe0a9;',
				'#xe0aa;', '#xe0ab;', '#xe0ac;', '#xe0ad;', '#xe0ae;', '#xe0af;',
				'#xe0b0;', '#xe0b1;', '#xe0b2;', '#xe0b3;', '#xe0b4;', '#xe0b5;', '#xe0b6;', '#xe0b7;', '#xe0b8;', '#xe0b9;',
				'#xe0ba;', '#xe0bb;', '#xe0bc;', '#xe0bd;', '#xe0be;', '#xe0bf;',
				'#xe0c0;', '#xe0c1;', '#xe0c2;', '#xe0c3;', '#xe0c4;', '#xe0c5;', '#xe0c6;', '#xe0c7;', '#xe0c8;', '#xe0c9;',
				'#xe0ca;', '#xe0cb;', '#xe0cc;', '#xe0cd;', '#xe0ce;', '#xe0cf;',
				'#xe0d0;', '#xe0d1;', '#xe0d2;', '#xe0d3;', '#xe0d4;', '#xe0d5;', '#xe0d6;', '#xe0d7;', '#xe0d8;', '#xe0d9;',
				'#xe0da;', '#xe0db;', '#xe0dc;', '#xe0dd;', '#xe0de;', '#xe0df;',
				'#xe0e0;', '#xe0e1;', '#xe0e2;', '#xe0e3;', '#xe0e4;', '#xe0e5;', '#xe0e6;', '#xe0e7;', '#xe0e8;', '#xe0e9;',
				'#xe0ea;', '#xe0eb;', '#xe0ec;', '#xe0ed;', '#xe0ee;', '#xe0ef;',
				'#xe0f0;', '#xe0f1;', '#xe0f2;', '#xe0f3;', '#xe0f4;', '#xe0f5;', '#xe0f6;', '#xe0f7;', '#xe0f8;', '#xe0f9;',
				'#xe0fa;', '#xe0fb;', '#xe0fc;', '#xe0fd;', '#xe0fe;', '#xe0ff;',
				'#xe100;', '#xe101;', '#xe102;', '#xe103;', '#xe104;', '#xe105;', '#xe106;', '#xe107;', '#xe108;', '#xe109;',
				'#xe10a;', '#xe10b;', '#xe10c;', '#xe10d;', '#xe10e;', '#xe10f;',
				'#xe110;', '#xe111;', '#xe112;', '#xe113;', '#xe114;', '#xe115;', '#xe116;', '#xe117;', '#xe118;', '#xe119;',
				'#xe11a;', '#xe11b;', '#xe11c;', '#xe11d;', '#xe11e;', '#xe11f;',
				'#xe120;', '#xe121;', '#xe122;', '#xe123;', '#xe124;', '#xe125;', '#xe126;', '#xe127;', '#xe128;', '#xe129;',
				'#xe12a;', '#xe12b;', '#xe12c;', '#xe12d;', '#xe12e;', '#xe12f;',
				'#xe130;', '#xe131;', '#xe132;', '#xe133;', '#xe134;', '#xe135;', '#xe136;', '#xe137;', '#xe138;', '#xe139;',
				'#xe13a;', '#xe13b;', '#xe13c;', '#xe13d;', '#xe13e;', '#xe13f;',
				'#xe140;', '#xe141;', '#xe142;', '#xe143;', '#xe144;', '#xe145;', '#xe146;', '#xe147;', '#xe148;', '#xe149;',
				'#xe14a;', '#xe14b;', '#xe14c;', '#xe14d;', '#xe14e;', '#xe14f;',
				'#xe150;', '#xe151;', '#xe152;', '#xe153;', '#xe154;', '#xe155;', '#xe156;', '#xe157;', '#xe158;', '#xe159;',
				'#xe15a;', '#xe15b;', '#xe15c;', '#xe15d;', '#xe15e;', '#xe15f;',
				'#xe160;', '#xe161;', '#xe162;', '#xe163;', '#xe164;', '#xe165;', '#xe166;', '#xe167;', '#xe168;', '#xe169;',
				'#xe16a;', '#xe16b;', '#xe16c;', '#xe16d;', '#xe16e;', '#xe16f;',
				'#xe170;', '#xe171;', '#xe172;', '#xe173;', '#xe174;', '#xe175;', '#xe176;', '#xe177;', '#xe178;', '#xe179;',
				'#xe17a;', '#xe17b;', '#xe17c;', '#xe17d;', '#xe17e;', '#xe17f;',
				'#xe180;', '#xe181;', '#xe182;', '#xe183;', '#xe184;', '#xe185;', '#xe186;', '#xe187;', '#xe188;', '#xe189;',
				'#xe18a;', '#xe18b;', '#xe18c;', '#xe18d;', '#xe18e;', '#xe18f;',
				'#xe190;', '#xe191;', '#xe192;', '#xe193;', '#xe194;', '#xe195;', '#xe196;', '#xe197;', '#xe198;', '#xe199;',
				'#xe19a;', '#xe19b;', '#xe19c;', '#xe19d;', '#xe19e;', '#xe19f;',
				'#xe1a0;', '#xe1a1;', '#xe1a2;', '#xe1a3;', '#xe1a4;', '#xe1a5;', '#xe1a6;', '#xe1a7;', '#xe1a8;', '#xe1a9;',
				'#xe1aa;', '#xe1ab;', '#xe1ac;', '#xe1ad;', '#xe1ae;', '#xe1af;',
				'#xe1b0;', '#xe1b1;', '#xe1b2;', '#xe1b3;', '#xe1b4;', '#xe1b5;', '#xe1b6;', '#xe1b7;', '#xe1b8;', '#xe1b9;',
				'#xe1ba;', '#xe1bb;', '#xe1bc;', '#xe1bd;', '#xe1be;', '#xe1bf;',
				'#xe1c0;', '#xe1c1;', '#xe1c2;', '#xe1c3;', '#xe1c4;', '#xe1c5;', '#xe1c6;', '#xe1c7;', '#xe1c8;', '#xe1c9;',
				'#xe1ca;', '#xe1cb;', '#xe1cc;', '#xe1cd;', '#xe1ce;', '#xe1cf;',
				'#xe1d0;', '#xe1d1;', '#xe1d2;', '#xe1d3;', '#xe1d4;', '#xe1d5;', '#xe1d6;', '#xe1d7;', '#xe1d8;', '#xe1d9;',
				'#xe1da;', '#xe1db;', '#xe1dc;', '#xe1dd;', '#xe1de;', '#xe1df;',
				'#xe1e0;', '#xe1e1;', '#xe1e2;', '#xe1e3;', '#xe1e4;', '#xe1e5;', '#xe1e6;', '#xe1e7;', '#xe1e8;', '#xe1e9;',
				'#xe1ea;', '#xe1eb;', '#xe1ec;', '#xe1ed;', '#xe1ee;', '#xe1ef;',
				'#xe1f0;', '#xe1f1;', '#xe1f2;', '#xe1f3;', '#xe1f4;', '#xe1f5;', '#xe1f6;', '#xe1f7;', '#xe1f8;', '#xe1f9;',
				'#xe1fa;', '#xe1fb;', '#xe1fc;', '#xe1fd;', '#xe1fe;', '#xe1ff;',
				'#xe200;', '#xe201;', '#xe202;', '#xe203;', '#xe204;', '#xe205;', '#xe206;', '#xe207;', '#xe208;', '#xe209;',
				'#xe20a;', '#xe20b;', '#xe20c;', '#xe20d;', '#xe20e;', '#xe20f;',
				'#xe210;', '#xe211;', '#xe212;', '#xe213;', '#xe214;', '#xe215;', '#xe216;', '#xe217;', '#xe218;', '#xe219;',
				'#xe21a;', '#xe21b;', '#xe21c;', '#xe21d;', '#xe21e;', '#xe21f;',
				'#xe220;', '#xe221;', '#xe222;', '#xe223;', '#xe224;', '#xe225;', '#xe226;', '#xe227;', '#xe228;', '#xe229;',
				'#xe22a;', '#xe22b;', '#xe22c;', '#xe22d;', '#xe22e;', '#xe22f;',
				'#xe230;', '#xe231;', '#xe232;', '#xe233;', '#xe234;', '#xe235;', '#xe236;', '#xe237;', '#xe238;', '#xe239;',
				'#xe23a;', '#xe23b;', '#xe23c;', '#xe23d;', '#xe23e;', '#xe23f;',
				'#xe240;', '#xe241;', '#xe242;', '#xe243;', '#xe244;'
			];
		}

		/*
		 * アイコンデータを返すメソッド
		 * @param	val		undefined === 全てのアイコンデータ配列を返す、typeof(string) === 指定された値のインデックスを返す、typeof(number) === 指定されたインデックスの値を返す
		 * @return	このクラスが保持しているプロパティオブジェクト
		 */
		,getIconData: function(val) {
			var thisObj = this;
			// console.log('typeof(' + val + ') = ' + typeof(val));
			if (val === undefined) {
				return thisObj._icons.slice(0);
				// return _.values($.extend(true, {}, thisObj._icons));
			} else if (typeof(val) === 'string') {
				return _.indexOf(thisObj._icons, val)
			} else if (typeof(val) === 'number') {
				return thisObj._icons[val];
			} else {
				return null;
			}
		}

		/*
		 * ページリストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,requestPageList: function() {
			var thisObj = this;
			var initEventName = 'onInitRequestPageList';
			var completeEventName = 'onCompleteRequestPageList';
			var errorEventName = 'onErrorRequestPageList';

			if (thisObj._data['pageList']) {	// 既にページリストのデータを保持しているなら、それを返す
				$(thisObj).trigger(completeEventName, [thisObj._data['pageList']]);

			} else {	// ページリストのデータがないなら、リクエスト
				var url = thisObj._prop['currentUrl'] + 'Page/getPageListOfCompany/';
				var data = {
					'deviceName'			: 'smartphone',
					'deviceNum'				: 2,
					'companyId'				: thisObj._prop['companyId']
				}

				$(thisObj._instances['Gateway'])
					.on(initEventName, function(event) {

					})
					.on(completeEventName, function(event, obj) {
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						// console.log('リクエスト完了');
						// console.log(obj);
						if (obj['result'] === true) {
							thisObj._data['pageList'] = obj['data'];
							$(thisObj).trigger(completeEventName, [thisObj._data['pageList']]);
						} else {

						}
					})
					.on(errorEventName, function(event, obj) {
						$(thisObj._instances['Gateway'])
							.off(initEventName)
							.off(completeEventName)
							.off(errorEventName);
						console.log('Error :: requestPageList');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
					});
				thisObj._instances['Gateway'].access(url, data, initEventName, completeEventName, errorEventName);
			}
		}
	}
});
