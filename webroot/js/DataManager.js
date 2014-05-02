

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.DataManager');
	MYNAMESPACE.modules.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.DataManager.prototype = {
		_isEnabled						: false
		,_isAccess						: false
		,_prop							: {}
		,_elementData					: {}
		,_libraryPageData				: {}
		,_prevData						: {}
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			// _.bindAll(this, 'requestElementList', 'updateData', 'insertElement', 'deleteElement', 'setProp', 'getProp', 'getElementData', 'extractionData', 'setElementData');
			_.bindAll(this, 'requestElementList', 'updateData', 'insertElement', 'deleteElement', 'setProp', 'getProp', 'getElementData', 'setElementData');

			this._prevData = {
				'update'						: {},
				'updateLibrary_PageProperty'	: {},
				'insert'						: {},
				'delete'						: {},
				'reorder'						: {}
			}
			this.setProp();
			this._libraryPageData = {'element_id':'displayArea', 'property':thisObj.getProp()['libraryPageProperty']};
			console.log('_libraryPageData');
			console.log(this._libraryPageData);
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
						'smartphone_library_id'		: !isNaN(libraryId) === true ? libraryId : thisObj._prop['smartphoneLibraryId']
					}
					elemnetModelName = 'smartphone_library_elements';

				} else {
					url = thisObj._prop['currentUrl'] + 'Page/getElementList/';
					data = {
						'page_id'		: thisObj._prop['pageId']
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
						console.log('リクエスト完了');
						console.log("\n");
						console.log(obj);
						console.log("\n");

						var elementData = eval(obj['json_data']);
						var newObj = $.extend(true,{},elementData);
						var fixedClone = [];
						for (var key in newObj) {
							if (!isNaN(key) === true) {
								fixedClone[(key-0)] = newObj[key];
							}
						}
						var dataObj = thisObj.setElementData(fixedClone, thisObj._prop['isLibraryElementPage']);

						thisObj._elementData = dataObj;
						// thisObj._elementData['displayArea'] = {'element_id':'displayArea', 'property':thisObj.getProp()['libraryPageProperty']};
						// console.log("\n");
						console.log(thisObj._elementData);
						console.log("\n");
						thisObj._isAccess = false;
						$(thisObj).trigger('onCompleteRequestElement');
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: requestElementList');
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
		 * データ更新メソッド
		 * @param	elementId		データを更新するエレメントのID
		 * @param	categoryName	更新するデータのカテゴリ名(Image || Link || Text || Space...)
		 * @param	property		更新するデータ
		 * @return	void
		 */
		,updateLibraray_PageProperty: function(categoryName, property) {
			var thisObj = this;
			console.log('DataManager :: updateLibraray_PageProperty');
			console.log('	categoryName = ' + categoryName);
			console.log('	property');
			console.log(property);
			// return;
			// if (
			// 	thisObj._prevData['updateLibrary_PageProperty']['categoryName'] === categoryName &&
			// 	thisObj._prevData['updateLibrary_PageProperty']['property'] === property
			// ) {
			// 	console.log('同じデータ');
			// 	return;
			// } else {
			// 	thisObj._prevData['updateLibrary_PageProperty']['categoryName'] = categoryName;
			// 	thisObj._prevData['updateLibrary_PageProperty']['property'] = $.extend(true, {}, property);
			// }
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				var url, recordId;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/updateLibraryProperty/';
					recordId = thisObj._prop['smartphoneLibraryId'];
				} else {
					url = thisObj._prop['currentUrl'] + 'Page/updatePageProperty/';
					recordId = thisObj._prop['pageId'];
				}
				// elementData['property'][categoryName] = property;
				thisObj.refreshElementProperty('fromDataManager', 'displayArea', categoryName, property)
				var elementData = thisObj.getElementData('element_id', 'displayArea');
				var sendData = {
					'id'						: recordId,
					'user_id'					: thisObj._prop['userId'],
					// 'property'					: $.toJSON(property)
					'property'					: $.toJSON(elementData['property'])
				}
				console.log('	sendData');
				console.log(sendData);
				console.log('更新開始');
				$(thisObj).trigger('onInitUpdateLibraray_PageProperty');
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						console.log('更新完了');
						console.log(obj);
						thisObj._isAccess = false;
						$(thisObj).trigger('onCompleteUpdateLibraray_PageProperty');
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
		,updateData: function(elementId, categoryName, property) {
			var thisObj = this;
			// console.log('--------------------');
			// console.log('DataManager :: updateData :: bigin');
			// console.log('property');
			// console.log(property);
			// console.log('前回のproperty');
			// console.log(thisObj._prevData['update']['property']);
			if (
				thisObj._prevData['update']['elementId'] === elementId &&
				thisObj._prevData['update']['categoryName'] === categoryName &&
				thisObj._prevData['update']['property'] === property
			) {
				console.log('同じデータ');
				return;
			} else {
				thisObj._prevData['update']['elementId'] = elementId;
				thisObj._prevData['update']['categoryName'] = categoryName;
				// thisObj._prevData['update']['property'] = property;
				thisObj._prevData['update']['property'] = $.extend(true, {}, property);
			}
			// console.log('	thisObj._isAccess = ' + thisObj._isAccess);
			// console.log('	elementId = ' + elementId);

			if (thisObj._isAccess === false) {
				if (elementId === 'displayArea') {	// bodyの背景プロパティを更新した場合
					thisObj.updateLibraray_PageProperty(categoryName, property);
				} else {	// エレメントのプロパティを更新した場合
					thisObj._isAccess = true;
					var elementData = thisObj.getElementData('element_id', elementId);
					// console.log('	categoryName = ' + categoryName);
					// console.log('	property');
					// console.log(property);
					// console.log('	elementData');
					// console.log(elementData);
					
					if (elementData) {
						elementData['property'] = eval(elementData['property']);
						elementData['property'][categoryName] = property;
						// console.log('	elementData[property][' + categoryName + ']');
						// console.log(elementData['property'][categoryName]);
						var url;
						if (thisObj._prop['isLibraryElementPage'] === true) {
							url = thisObj._prop['currentUrl'] + 'Library/updateElement/';
						} else {
							url = thisObj._prop['currentUrl'] + 'Page/updateElement/';
						}
						var sendData = {
							'record_id'						: elementData['id'],
							'user_id'						: thisObj._prop['userId'],
							'page_id'						: thisObj._prop['pageId'],
							'smartphone_library_id'			: thisObj._prop['smartphoneLibraryId'],
							'property'						: $.toJSON(elementData['property'])
						}
						console.log('	sendData');
						console.log(sendData);
						console.log('更新開始');
						$(thisObj).trigger('onInitUpdateElement', [elementId, categoryName]);
						$.ajax({
							type		: "POST",
							url			: url,
							data		: sendData,
							dataType	: "json",
							success		: function(obj){
								console.log('更新完了');
								console.log(obj);
								thisObj._isAccess = false;
								$(thisObj).trigger('onCompleteUpdateElement');
							},
							error		: function(XMLHttpRequest, textStatus, errorThrown) {
								// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
								console.log('Error :: onInitUpdateElement');
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
		}

		/*
		 * Element追加メソッド
		 * @param	elementId		追加するElementのID
		 * @param	properties		追加するデータ
		 * @return	void
		 */
		,insertElement: function(elementId, parentId, libraryId, itemName, order, property) {
			var thisObj = this;
			if (
				thisObj._prevData['insert']['elementId'] === elementId &&
				thisObj._prevData['insert']['parentId'] === parentId &&
				thisObj._prevData['insert']['libraryId'] === libraryId &&
				thisObj._prevData['insert']['itemName'] === itemName &&
				thisObj._prevData['insert']['order'] === order &&
				thisObj._prevData['insert']['property'] === property
			) {
				return;
			} else {
				thisObj._prevData['insert']['elementId'] = elementId;
				thisObj._prevData['insert']['parentId'] = parentId;
				thisObj._prevData['insert']['libraryId'] = libraryId;
				thisObj._prevData['insert']['itemName'] = itemName;
				thisObj._prevData['insert']['order'] = order;
				thisObj._prevData['insert']['property'] = $.extend(true, {}, property);
			}
			
			console.log('--------------------');
			console.log('DataManager :: insertElement :: bigin');
			console.log('	elementId = ' + elementId);
			console.log('	parentId = ' + parentId);
			console.log('	libraryId = ' + libraryId);
			console.log('	itemName = ' + itemName);
			console.log('	order = ' + order);
			console.log('	property');
			console.log(property);

			var isLibrary = libraryId !== undefined ? true : false;
			var insertData = {
				'user_id'							: thisObj._prop['userId'],
				'page_id'							: thisObj._prop['pageId'],
				'element_id'						: elementId,
				'smartphone_library_id'				: libraryId,
				'parent_id'							: parentId,
				'item_name'							: itemName,
				'order'								: order,
				'property'							: $.toJSON(property)
			}
			var cloneElementData = thisObj.getElementData('all');
			var updateData = [];
			var reorderElementData = thisObj.getElementData('parent_id', parentId);
			// console.log('	cloneElementData');
			// console.log(cloneElementData);
			// console.log('	reorderElementData');
			// console.log(reorderElementData);
			for (var reorderParentId in reorderElementData) {
				for (var order2 in reorderElementData[reorderParentId]) {
					order2-=0;
					if (order <= order2) {
						updateData.push({id:reorderElementData[reorderParentId][order2]['id'], order:order2 + 1});
						var elementId2 = reorderElementData[reorderParentId][order2]['element_id'];
						// console.log('elementId2 = ' + elementId2 + ', reorderParentId = ' + reorderParentId + ', order2 = ' + order2);
						cloneElementData[elementId2]['order'] = order2 + 1;
					}
				}
			}
			var url;
			// if (isLibrary === true) {
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/insertElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/insertElement/';
			}
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// console.log('追加開始');
				var sendData = {
					'insertData'			: insertData,
					'updateData'			: updateData
				}
				console.log('	sendData');
				console.log(sendData);
				console.log('isLibraryElementPage = ' + thisObj._prop['isLibraryElementPage']);
				console.log('libraryId = ' + libraryId);
				console.log('url = ' + url);
				console.log('---------------------');

				$(thisObj).trigger('onInitInsertElement');
				// return;
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						console.log('追加完了');
						console.log('obj');
						console.log(obj);
						// var elementData = thisObj.setElementData([obj['data']], thisObj._prop['isLibraryElementPage']);
						var elementData = thisObj.setElementData([obj['data']], thisObj._prop['isLibraryElementPage']);
						// var elementData = thisObj.setElementData([obj['data']], isLibrary);
						// var elementData = thisObj.setElementData([obj['data']], libraryId !== undefined ? true : false);
						// console.log('elementData');
						// console.log(elementData);
						for (var tmpElementId in elementData) {
							thisObj._elementData[tmpElementId] = elementData[tmpElementId];
						}
						// thisObj._elementData[elementId] = elementData[elementId];
						console.log('thisObj._elementData');
						console.log(thisObj._elementData);
						thisObj._isAccess = false;
						if (isLibrary === true) {
							$(thisObj).trigger('onCompleteInsertElement', [elementData, true]);
						} else {
							$(thisObj).trigger('onCompleteInsertElement', [elementData[elementId], false]);
						}
						// $(thisObj).trigger('onCompleteInsertElement', [elementData[elementId]]);
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: insertElement');
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
		 * 並び替えデータ保存メソッド
		 * @param	elementId		並び替えたエレメントのID
		 * @return	void
		 */
		,reOrderData: function(reorderElementId, newParentId, newOrder) {
			var thisObj = this;
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
			console.log('--------------------');
			console.log('DataManager :: reOrderData :: bigin');
			console.log('	reorderElementId = ' + reorderElementId);
			console.log('	newParentId = ' + newParentId);
			console.log('	newOrder = ' + newOrder);
			console.log('並べ替え開始');
			var cloneElementData = thisObj.getElementData('all');
			cloneElementData[reorderElementId]['parent_id'] = newParentId;
			cloneElementData[reorderElementId]['order'] = newOrder;
			var oldElementData = thisObj.getElementData('element_id', reorderElementId);
			var reorderId = oldElementData['id'];
			var oldParentId = oldElementData['parent_id'];
			var oldOrder = oldElementData['order'] - 0;
			var tmpElementData = thisObj.getElementData('parent_id', oldParentId);
			console.log('	oldParentId = ' + oldParentId);
			var updateData = [
				{
					'id'		: reorderId,
					'parentId'	: newParentId,
					'order'		: newOrder
				}
			];

			if (newParentId === oldParentId) {
				if (newOrder < oldOrder) {
					for (var order in tmpElementData[oldParentId]) {
						var elementId2 = tmpElementData[oldParentId][order]['element_id'];
						order-=0;
						if (elementId2 !== reorderElementId && (newOrder <= order && order <= oldOrder)) {
							updateData.push({id:tmpElementData[oldParentId][order]['id'], parentId:oldParentId, order:order + 1});
							cloneElementData[elementId2]['order'] = order + 1;
						}
					}

				} else {
					for (var order in tmpElementData[oldParentId]) {
						var elementId2 = tmpElementData[oldParentId][order]['element_id'];
						order-=0;
						if (elementId2 !== reorderElementId && (oldOrder <= order && order <= newOrder)) {
							updateData.push({id:tmpElementData[oldParentId][order]['id'], parentId:oldParentId, order:order - 1});
							cloneElementData[elementId2]['order'] = order - 1;
						}
					}
				}
			} else {
				console.log('入れ替え元の親エレメントの子エレメントを更新');
				console.log('	tmpElementData');
				console.log(tmpElementData);
				for (var order=0,len=tmpElementData[oldParentId].length; order<len; order++) {
					console.log('	order = ' + order);
					if (oldParentId === tmpElementData[oldParentId][order]['parent_id'] && oldOrder < order) {
						var elementId2 = tmpElementData[oldParentId][order]['element_id'];
						updateData.push({id:tmpElementData[oldParentId][order]['id'], parentId:oldParentId, order:order - 1});
						cloneElementData[elementId2]['order'] = order - 1;
					}
				}
				var newElementData = thisObj.getElementData('parent_id', newParentId);
				console.log('-----------------------------');
				console.log('入れ替え先の親エレメントの子エレメントを更新');
				console.log('	newElementData');
				console.log(newElementData);
				for (var tmpParentId in newElementData) {
					for (var order=0,len=newElementData[tmpParentId].length; order<len; order++) {
						console.log('	order = ' + order);
						if (newParentId === newElementData[tmpParentId][order]['parent_id'] && newOrder <= order) {
							var elementId2 = newElementData[newParentId][order]['element_id'];
							updateData.push({id:newElementData[newParentId][order]['id'], parentId:newParentId, order:order + 1});
							cloneElementData[elementId2]['order'] = order + 1;
						}
					}
				}
			}
			thisObj._elementData = cloneElementData;

			var url;
			if (thisObj._prop['isLibraryElementPage'] === true) {
				url = thisObj._prop['currentUrl'] + 'Library/reorderElement/';
			} else {
				url = thisObj._prop['currentUrl'] + 'Page/reorderElement/';
			}

			var sendData = {
				'user_id'						: thisObj._prop['userId'],
				'page_id'						: thisObj._prop['pageId'],
				'smartphone_library_id'			: thisObj._prop['smartphoneLibraryId'],
				'updateData'	: updateData
			}
			console.log('---------------------');
			console.log('	sendData');
			console.log(sendData);
			console.log('---------------------');
			
			if (updateData.length === 0) {
				console.log('並び替えるデータはありません');
				return;
			}
			$.ajax({
				type		: "POST",
				url			: url,
				data		: sendData,
				dataType	: "json",
				success		: function(obj){
					console.log('並べ替え完了');
					console.log(obj);
					console.log('---------------------');
					console.log('	_elementData');
					console.log(thisObj._elementData);
					console.log('---------------------');
					thisObj._isAccess = false;
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
				}
			});
		}

		/*
		 * Element削除メソッド
		 * @param	elementId		削除するエレメントのID
		 * @param	recordId		削除するエレメントのレコードID
		 * @return	void
		 */
		,deleteElement: function(elementId) {
			var thisObj = this;
			if (
				thisObj._prevData['delete']['elementId'] === elementId
			) {
				return;
			} else {
				thisObj._prevData['delete']['elementId'] = elementId;
			}
			var deleteData = [];
			var updateData = [];

			console.log('--------------------');
			console.log('DataManager :: deleteElement :: bigin');
			console.log('	thisObj._elementData');
			console.log(thisObj._elementData);
			console.log('	elementId = ' + elementId);
			var deleteElementData = thisObj.getElementData('element_id', elementId);
			deleteData.push(deleteElementData['id']);
			console.log('	deleteData');
			console.log(deleteData);
			
			var parentId = deleteElementData['parent_id'];
			var order = deleteElementData['order'] - 0;
			var candidateElementData = thisObj.getElementData('parent_id', parentId);
			var cloneElementData = thisObj.getElementData('all');
			console.log('	parentId = ' + parentId);
			console.log('	candidateElementData');
			console.log(candidateElementData);
			for (var order2 in candidateElementData[parentId]) {
				if (order < order2) {
					var elementId2 = candidateElementData[parentId][order2]['element_id'];
					updateData.push({id:candidateElementData[parentId][order2]['id'], order:order2 - 1});
					cloneElementData[elementId2]['order'] = order2 - 1;
				}
			}
			delete cloneElementData[elementId];
			console.log('	updateData');
			console.log(updateData);
			console.log('	thisObj._elementData');
			console.log(thisObj._elementData);
			console.log('	cloneElementData');
			console.log(cloneElementData);
			thisObj._elementData = cloneElementData;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				console.log('削除開始');

				var url;
				if (thisObj._prop['isLibraryElementPage'] === true) {
					url = thisObj._prop['currentUrl'] + 'Library/deleteElement/';
				} else {
					url = thisObj._prop['currentUrl'] + 'Page/deleteElement/';
				}
				var sendData = {
					'user_id'							: thisObj._prop['userId'],
					'page_id'							: thisObj._prop['pageId'],
					'smartphone_library_id'				: thisObj._prop['smartphoneLibraryId'],
					'deleteData'						: deleteData,
					'updateData'						: updateData
				}
				console.log('---------------------');
				console.log('	sendData');
				console.log(sendData);
				console.log('---------------------');
				
				$(thisObj).trigger('onInitDeleteElement');
				$.ajax({
					type		: "POST",
					url			: url,
					data		: sendData,
					dataType	: "json",
					success		: function(obj){
						if (obj['result'] === true) {
							var cloneElementData = thisObj.getElementData('all');
							console.log('削除完了');
							console.log(obj);
							console.log('---------------------');
							console.log('	_elementData');
							console.log(cloneElementData);
							console.log('	_elementData');
							console.log(cloneElementData);
							console.log('---------------------');
						}
						thisObj._isAccess = false;
						$(thisObj).trigger('onCompleteDeleteElement', elementId);
					},
					error		: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: deleteElement');
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
		 * ページリストをリクエストするメソッド
		 * @param	void
		 * @return	void
		 */
		,requestPageList: function() {
			var thisObj = this;

			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				// console.log('リクエスト開始');

				var url = thisObj._prop['currentUrl'] + 'Page/getPageList/';
				var elemnetModelName = 'smartphone_page_elements';
				// var url = thisObj._prop['currentUrl'] + 'Page/requestPage/';
				// thisObj._instances['Util'].setStatus(true, 'データリクエスト中・・・');
				$(thisObj).trigger('onInitRequestPageList');
				$.ajax({
					type: "POST",
					url: url,
					data: {
						'residence_id'				: thisObj._prop['residenceId']
					},
					dataType: "json",
					success: function(obj){
						console.log('ページリクエスト完了');
						console.log(obj);
						thisObj._isAccess = false;
						/*
						thisObj._instances['Util'].setStatus(false);
						// thisObj._instances['Util'].setStatus(false);
						*/
						$(thisObj).trigger('onCompleteRequestPageList', [obj['data']]);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: requestPageList');
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
		 * データをDBに保存する際のプロパティをオブジェクトにセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;

			thisObj._prop = {
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]').val(),
				'concreteUrl'				: $('input[type="hidden"][name="concreteUrl"]').val(),
				'isLibraryElementPage'		: $('input[type="hidden"][name="isLibraryElementPage"]').val() === "1" ? true : false,
				'residenceId'				: $('input[type="hidden"][name="residenceId"]').val(),
				'userId'					: $('input[type="hidden"][name="userId"]').val(),
				'pageId'					: $('input[type="hidden"][name="pageId"]').val(),
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryProperty"]').val() ? $('input[type="hidden"][name="libraryProperty"]').val() : $('input[type="hidden"][name="pageProperty"]').val(),
				'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val() ? eval("(" + $('input[type="hidden"][name="libraryPageProperty"]').val() + ")") : {},
				// 'libraryPageProperty'		: $('input[type="hidden"][name="libraryPageProperty"]').val(),
				'smartphonePageId'			: $('input[type="hidden"][name="smartphonePageId"]').val(),
				'smartphoneLibraryId'		: $('input[type="hidden"][name="smartphoneLibraryId"]').val()
			}
			// thisObj._prop['libraryPageProperty'] = eval("(" + thisObj._prop['libraryPageProperty'] + ")");
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
			// return thisObj._prop;
		}

		/*
		 * parentIdで指定されたIDを親に持つエレメントのデータ抽出メソッド
		 * @param	parentId		親エレメントのID
		 * @return	parentIdで指定されたIDを親に持つエレメントのデータ
		 */
		,getElementData: function(key, val) {
			var thisObj = this;
			var retArr = [];
			var retObj = {};
			var cloneElementData = $.extend(true, {}, thisObj._elementData);
			if (key === 'all') {
				return cloneElementData;
			} else {
				if (key === 'element_id' && val === 'displayArea') {
					retArr.push($.extend(true, {}, thisObj._libraryPageData));
				} else {
					for (var elementId in cloneElementData) {
						var parentId = cloneElementData[elementId]['parent_id'];
						var order = cloneElementData[elementId]['order'] - 0;
						if (key === 'parent_id') {
							var fixedParentId = cloneElementData[elementId]['parent_id'].split('_')[0];
							if (val.indexOf(fixedParentId) !== -1) {
								if (!retObj[parentId]) {
									retObj[parentId] = [];
								}
								retObj[parentId][order] = cloneElementData[elementId];
								retArr.push(cloneElementData[elementId]);
							}
						} else if (key === 'element_id') {
							if (cloneElementData[elementId][key] === val) {
								retArr.push(cloneElementData[elementId]);
								if (!retObj[parentId]) {
									retObj[parentId] = [];
								}
								retObj[parentId][order] = cloneElementData[elementId];
							}
						} else {
							if (cloneElementData[elementId][key] === val) {
								retArr[(cloneElementData[elementId]['order']-0)] = cloneElementData[elementId];
								if (!retObj[parentId]) {
									retObj[parentId] = [];
								}
								retObj[parentId][order] = cloneElementData[elementId];
							}
						}
					}
				}
				return key === 'element_id' ? retArr[0] : retObj;
			}
		}

		/*
		 * parentIdで指定されたIDを親に持つエレメントのデータ抽出メソッド
		 * @param	parentId		親エレメントのID
		 * @return	parentIdで指定されたIDを親に持つエレメントのデータ
		 */
		,refreshElementProperty: function(callerName, elementId, categoryName, property) {
			var thisObj = this;
			// console.log('----------------');
			// console.log('DataManager :: refreshElementProperty :: elementId = ' + elementId + ', categoryName = ' + categoryName);
			// console.log('	property');
			// console.log(property);
			// console.log('----------------');
			if (elementId === 'displayArea') {
				thisObj._libraryPageData['property'][categoryName] = property;
			} else {
				thisObj._elementData[elementId]['property'][categoryName] = property;
			}
			$(thisObj).trigger('onCompleteRefreshElementProperty', [callerName, elementId, categoryName]);
		}
		
		/*
		 * エレメントのデータをセットするメソッド
		 * @param	elementData		エレメントデータオブジェクト
		 * @return	void
		 */
		,setElementData: function(elementData, isLibraryElementPage) {
			var thisObj = this;
			var pageElementData = {};

			if (isLibraryElementPage === true) {
				for (var i=0, len=elementData.length; i<len; i++) {
					/*
					var elementId = elementData[i]['smartphone_page_elements']['element_id'];
					pageElementData[elementId] = elementData[i]['smartphone_page_elements'];

					var libraryElements = elementData[i]['smartphone_libraries']['smartphone_library_elements'];


					*/
					var elementId = elementData[i]['smartphone_library_elements']['element_id'];
					pageElementData[elementId] = elementData[i]['smartphone_library_elements'];
				}

			} else {
				// console.log('-----------------');
				// console.log('DataManager :: setElementData');
				// console.log('	elementData');
				// console.log(elementData);
				// console.log('	elementData.length = ' + elementData.length);
				for (var i=0, len=elementData.length; i<len; i++) {
					var elementId = elementData[i]['smartphone_page_elements']['element_id'];
					pageElementData[elementId] = elementData[i]['smartphone_page_elements'];
					// console.log('	' + i + ' :: elementId = ' + elementId);
					// console.log('	' + i + ' :: smartphone_libraries . id = ' + elementData[i]['smartphone_libraries']['id']);

					if (elementData[i]['smartphone_libraries']['id']) {
						var elementId2 = elementData[i]['smartphone_page_elements']['element_id'];
						pageElementData[elementId2] = elementData[i]['smartphone_page_elements'];
						pageElementData[elementId2]['property'] = elementData[i]['smartphone_libraries']['property'];

						var libraryElements = elementData[i]['smartphone_libraries']['smartphone_library_elements'];
						// console.log('		' + i + ' :: elementId2 = ' + elementId2);
						// console.log('		' + i + ' :: libraryElements');
						// console.log(libraryElements);
						for (var j=0, len2=libraryElements.length; j<len2; j++) {
							if (libraryElements[j]['parent_id'] === 'spContent') {
								libraryElements[j]['parent_id'] = elementId2;
							}
							var elementId3 = libraryElements[j]['element_id'];
							// console.log('			' + j + ' :: elementId3 = ' + elementId3);
							pageElementData[elementId3] = libraryElements[j];
						}
					}
				}
				// console.log('-----------------');
			}
			return pageElementData;
		}
	}
});
