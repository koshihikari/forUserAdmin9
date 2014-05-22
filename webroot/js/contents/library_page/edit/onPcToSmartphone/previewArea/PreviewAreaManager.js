

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.PreviewAreaManager');
	MYNAMESPACE.modules.library_page.edit.PreviewAreaManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.PreviewAreaManager.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		,_methodObj								: {}
		,_styleInstances						: {}
		,_elementInstances						: {}
		,_currentPrevContentsHeight				: -1

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'mergeElementData'
				,'changeSkin'
				,'reset'
				,'insert'
				,'render'
				,'createElem'
				,'buildElement'
				,'onClickPreviewElement'
				,'refreshStyle'
				,'refreshAllElementStyle'
				,'setSortableInstance'
				,'deleteElem'
				,'setEvent'
			);

			this._instances = {
				'DataManager'							: DataManager
				// 'PreviewAreaElementSourceManager'		: new MYNAMESPACE.modules.PreviewAreaElementSourceManager(DataManager)
			};
		}

		/*
		 * #spContentに配置されているエレメントとエレメントデータを比較し、配置されていないエレメントデータを削除するメソッド
		 * @param	void
		 * @return	void
		 */
		,mergeElementData: function() {
			// console.log('PreviewAreaManager :: mergeElementData');
			var thisObj = this;
			var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
			for (var elementId in allElementDataObj) {
				if ($('#' + elementId).length === 0) {
					thisObj._instances['DataManager'].deleteElementDataObj(elementId);
				}
			}
			$('#displayArea td').each(function(i) {
				if (0 < $(this).find('> *').length) {
					$(this).addClass('hasChildren');
				} else {
					$(this).removeClass('hasChildren');
				}
			});
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,changeSkin: function(deviceName) {
			var thisObj = this;
			var backgroundX = 0;

			switch (deviceName) {
				case 'iphone5-black':
					backgroundX = -55;
					break;

				case 'iphone5-white':
					backgroundX = -543;
					break;

				case 'ipodTouch5g-pink':
					backgroundX = -1023;
					break;

				case 'ipodTouch5g-blue':
					backgroundX = -1488;
					break;

				case 'ipodTouch5g-yellow':
					backgroundX = -1953;
					break;

				case 'ipodTouch5g-silver':
					backgroundX = -2418;
					break;

				case 'ipodTouch5g-black':
					backgroundX = -2883;
					break;
			}

			$("#previewArea")
			 	.find(".iphone5-header, .iphone5-footer")
			 		.css('background-position-x', backgroundX)
			 	.end()
			 	.find(".iphone5-body > img")
			 		.css('left', backgroundX);
		}

		,reset: function() {
			var thisObj = this;
			thisObj._createdElement = {};
		}

		,insert: function(elementId, parentId, itemName, order, property) {
			var thisObj = this;
			var itemData = thisObj._instances['DataManager'].getItemDataObj(itemName);
			var element = $('<div id="' + elementId + '">' + itemData['defaultSource'] + '</div>');
			// console.log('PreviewAreaManager :: insert');
			// console.log('	elementId = ' + elementId);
			// console.log('	parentId = ' + parentId);
			// console.log('	itemName = ' + itemName);
			// console.log('	order = ' + order);
			// console.log('	property');
			// console.log(property);
			// console.log('	itemData.defaultSource = ' + itemData['defaultSource']);
			// console.log(element);
			// console.log(element.html());
			if (order === 1) {
			// if (order === 0) {
				if (0 < $('#' + parentId + ' > *').length) {
					$('#' + parentId + ' > *').eq(order-1).before(element);
				} else {
					$('#' + parentId).append(element);
				}
			} else {
				$('#' + parentId + ' > *').eq(order-2).after(element);
			}
			element
				.attr(
					{
						'id'				: elementId,
						'data-item-name'	: itemName,
						'data-item-type'	: itemData['itemType']
					}
				)
				.addClass(itemName === 'Library' ? 'not-deitable' : 'editable');
			thisObj.buildElement(elementId);
			thisObj.refreshStyle(elementId, undefined);
		}

		,render: function(parentId, targetElement, isBaseElement) {
			var thisObj = this;
			var targetElementData = thisObj._instances['DataManager'].getChildElementDataObj(parentId);
			// console.log('--------');
			// console.log('PreviewAreaManager :: render');
			// console.log('parentId =' + parentId);
			// console.log(targetElementData);
			// console.log(targetElement);
			// console.log(targetElementData.length);
			// console.log('--------');
			if (0 < targetElementData.length) {
				for (var order=0,len=targetElementData.length; order<len; order++) {
					// var isLibrary = targetElementData[order]['isLibrary'];
					// var isEditable = thisObj._instances['DataManager'].getProp()['isLibraryElementPage'] === false && isLibrary === true ? false : true;
					var isEditable = thisObj._instances['DataManager'].getProp()['isLibraryElementPage'] === false && targetElementData[order]['isLibrary'] === true ? false : true;
					// var isEditable = thisObj._instances['DataManager'].getProp()['isLibraryElementPage'] === false && isLibrary === true ? true : false;
					targetElement = thisObj.createElem(isEditable, targetElementData[order], targetElement);
					thisObj.render(targetElementData[order]['elementId'], targetElement, false);
				}
			}
			if (isBaseElement === true) {
				$(thisObj).trigger('onCompleteAllAddElement');
			}
		}

		/*
		 * dataTypeに応じたエレメントをプロパティエリアに追加するメソッド
		 * @param	isDifferent 		追加するエレメントのID
		 * @param	itemName 			追加するエレメントのアイテム名
		 * @param	elem	 			このエレメントの後ろに新しいエレメントを追加する(新しいエレメント追加後、このエレメントは削除する)
		 * @param	action	 			'append'===elemにappend、'after'===elemにafter
		 * @param	properties	 		追加するエレメントのプロパティオブジェクト
		 * @return	void
		 */
		// ,addElem: function(isEditable, elementId, itemName, elem, action, recordId, properties) {
		,createElem: function(isEditable, elementData, targetElement) {
			var thisObj = this;
			// var elementId = elementData['element_id'];
			var elementId = elementData['elementId'];
			// console.log($('#spContent #' + elementId).length);
			// console.log($('#spContent #' + elementId));
			// console.log('smartphoneLibraryId = ' + elementData['smartphoneLibraryId']);
			if ($('#spContent #' + elementId).length) {
				// console.log('作成済み :: elementId = ' + elementId);
				return targetElement;

			} else {
				var itemName = elementData['itemName'];
				var parentId = elementData['parentId'];
				var property = elementData['property'];
				var itemDataObj = thisObj._instances['DataManager'].getItemDataObj(itemName);
				var addElemSource = itemDataObj['defaultSource'];
				var itemType = itemDataObj['itemType'];
				// if (itemName === 'Td') {
				// 	console.log('新規作成 :: elementId = ' + elementId);
				// 	console.log('isEditable = ' + isEditable);
				// }
				var addElem = $('<div id="' + elementId + '">' + addElemSource + '</div>');
				addElem
					.attr(
						{
							'data-item-name'	: itemName,
							'data-item-type'	: itemType
						}
					)
					// .attr('data-item-type', itemType)
					.addClass('editable');
					// .addClass(isEditable === true ? 'editable' : 'not-editalbe');
				// console.log('	itemName = ' + itemName);
				// console.log('	parentId = ' + parentId);
				// console.log('	addElemSource = ' + addElemSource);
				// console.log('	itemType = ' + itemType);
				/*
				addElem.css(
					{
						'zIndex'	: 1
					}
				);
				*/
				// console.log('addElem :: id = ' + id);
				// addElem.attr('data-record-id', recordId);
				// if (elementId === 'id-1362476536747') {
					// console.log('\n');
					// console.log('--------------------------------------');
					// console.log(elementData);
					// console.log('--------------------------------------');
					// console.log('\n');
				// }
				// console.log('a');
				var parentElementData = thisObj._instances['DataManager'].getElementDataObj(parentId);
				// var parentElementData = thisObj._instances['DataManager'].getElementDataObj(elementId);
				var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
				// console.log(allElementDataObj);
				// console.log(addElem);
				// console.log('parentElementData.itemName = ' + parentElementData['itemName']);
				if (targetElement) {
					targetElement.after(addElem).remove();
					targetElement = null;
					// console.log('指定されたエレメントの後ろに追加');
				} else {
					if (parentElementData['itemName'] === 'Library') {
						$("#" + parentId + ' > div.contentWrapper').append(addElem);
					} else {
						// console.log(elementData);
						var parentElem = $("#" + parentId);
						if (elementData['itemName'] === 'Library') {
							var order = elementData['order'] - 0;
							var insertTargetElem = parentElem.find('> *').eq(order - 1);
							if (insertTargetElem.length === 1) {
								insertTargetElem.before(addElem);
							} else {
								parentElem.append(addElem);
							}
						} else {
							// $("#" + parentId).append(addElem);
							parentElem.append(addElem);
						}
					}
					// console.log('指定されたエレメントの中に追加 :: itemName = ' + parentElementData['itemName']);
				}
				if (parentElementData['itemName'] === 'Library') {
					addElem.removeClass('editable').addClass('not-editable');
				}
				thisObj.buildElement(elementId);
				thisObj._createdElement[elementId] = addElem;

				// console.log('createElem :: emenetId = ' + elementId + ', itemName = ' + itemName);
				$(thisObj).trigger('onAddElementComplete', [elementId, itemName, property]);

				// if (thisObj.checkCompleteAttach() === true) {
				// 	console.log('全element配置完了');
				// 	$(thisObj).trigger('onCompleteAllAddElement');
				// }
				return targetElement;
			}
		}

		/*
		 * プレビューエリア内のエレメントがクリックされた時にコールされるメソッド
		 * @param	event 				Eventオブジェクト
		 * @param	elementId	 		クリックされたエレメントのID
		 * @return	void
		 */
		,onClickPreviewElement: function(event, elementId) {
			var thisObj = this;
			$(thisObj).trigger('onClickEditableElement', [event, elementId]);
		}

		,createElementManagerInstance: function(componentName) {
			var thisObj = this;
			var instance = null;
			// console.log('componentName = ' + componentName);
			switch (componentName) {
				case 'About':
					instance = new MYNAMESPACE.modules.PreviewOfAbout(thisObj._instances['DataManager'], {'onClick':thisObj.onClickPreviewElement});
					break;

				case 'Bg':
					instance = new MYNAMESPACE.modules.PreviewOfBg(thisObj._instances['DataManager']);
					break;

				case 'Border':
					instance = new MYNAMESPACE.modules.PreviewOfBorder(thisObj._instances['DataManager']);
					break;

				case 'Code':
					instance = new MYNAMESPACE.modules.PreviewOfCode(thisObj._instances['DataManager']);
					break;

				case 'Gallery':
					instance = new MYNAMESPACE.modules.PreviewOfGallery(thisObj._instances['DataManager']);
					break;

				case 'GsTag':
					instance = new MYNAMESPACE.modules.PreviewOfGsTag(thisObj._instances['DataManager']);
					break;

				case 'Icon':
					instance = new MYNAMESPACE.modules.PreviewOfIcon(thisObj._instances['DataManager']);
					break;

				case 'Image':
					instance = new MYNAMESPACE.modules.PreviewOfImage(thisObj._instances['DataManager']);
					$(instance).on('onLoadCompleteImage', function(event, elementId2, categoryName2, property2) {
						$(thisObj).trigger('onCompleteAsyncMethod', [elementId2, categoryName2, property2]);
					})
					break;

				case 'Layout':
					instance = new MYNAMESPACE.modules.PreviewOfLayout(thisObj._instances['DataManager']);
					break;

				case 'Link':
					instance = new MYNAMESPACE.modules.PreviewOfLink(thisObj._instances['DataManager']);
					break;

				case 'Map':
					instance = new MYNAMESPACE.modules.PreviewOfMap(thisObj._instances['DataManager']);
					$(instance).on('onCompleteRenderMap', function(event, elementId2, categoryName2, property2) {
						// console.log('地図レンダリング完了 :: elementId2 = ' + elementId2);
						// console.log($('#' + elementId2));
						// console.log('h = ' + $('#' + elementId2).height());
						// console.log('h = ' + $('#' + elementId2).css('height'));
						$(thisObj).trigger('onCompleteAsyncMethod', [elementId2, categoryName2, property2]);
					})
					break;

				case 'Size':
					instance = new MYNAMESPACE.modules.PreviewOfSize(thisObj._instances['DataManager']);
					break;

				case 'Space':
					instance = new MYNAMESPACE.modules.PreviewOfSpace(thisObj._instances['DataManager']);
					break;

				case 'Table':
					instance = new MYNAMESPACE.modules.PreviewOfTable(thisObj._instances['DataManager']);
					break;

				case 'Text':
					instance = new MYNAMESPACE.modules.PreviewOfText(thisObj._instances['DataManager']);
					break;

				case 'Youtube':
					instance = new MYNAMESPACE.modules.PreviewOfYoutube(thisObj._instances['DataManager']);
					break;

				default:
					return;
					break;
			}
			return instance;
		}

		/*
		 * 指定されたエレメントをbuildするメソッド
		 * @param	elementId			buildするエレメントのエレメントID
		 * @param	callback			build完了時にコールされるメソッド
		 * @return	void
		 */
		,buildElement: function(elementId, callback) {
			var thisObj = this;
				// console.log('b');
			var elementData = thisObj._instances['DataManager'].getElementDataObj(elementId);
			var elementProperty = elementData['property']
			// console.log('build :: elementId = ' + elementId + ', elementId = ' + elementId);
			// console.log(elementProperty);

			if (elementProperty !== undefined) {
				for (var componentName in elementProperty) {
					thisObj._elementInstances[elementId] = thisObj._elementInstances[elementId] || {};
					// console.log('thisObj._elementInstances[' + elementId + '][' + componentName + '] = ' + thisObj._elementInstances[elementId][componentName]);
					if (!thisObj._elementInstances[elementId][componentName]) {
						// console.log('作成');
						thisObj._elementInstances[elementId][componentName] = thisObj.createElementManagerInstance(componentName);
					}
					$(thisObj._elementInstances[elementId][componentName]).on('onCompleteBuild', function(event, elementId2) {
						if (callback) {
							callback(event, elementId2);
						}
					});
					// console.log('componentName = ' + componentName);
					// console.log('thisObj._elementInstances[' + elementId + '][' + componentName + '] = ' + thisObj._elementInstances[elementId][componentName]);
					if (thisObj._elementInstances[elementId][componentName] && thisObj._elementInstances[elementId][componentName].build) {
						thisObj._elementInstances[elementId][componentName].build(elementId, elementProperty[componentName]);
					}
				}
			}

		}

		,_tmpObj : {}
		/*
		 * プレビューエリアに配置している全てのエレメントをbuildするメソッド
		 * @param	isPublishStaticPage		true===静的ページ書き出し
		 * @return	void
		 */
		,refreshAllElementStyle: function(isPublishStaticPage) {
			var thisObj = this;
			var elementData = thisObj._instances['DataManager'].getAllElementDataObj();
			console.log('');
			console.log('----------');
			console.log('PreviewAreaManager.js :: refreshAllElementStyleメソッド');
			console.log('isPublishStaticPage = ' + isPublishStaticPage);
			console.log('elementData');
			console.log(elementData);
			console.log('----------');
			var count = 0;
			var tmpCount2 = 0;
			for (var elementId in elementData) {
					tmpCount2 = 0;
				if (elementData[elementId]['itemName'] !== 'Library') {
					for (var componentName in elementData[elementId]['property']) {
						count ++;
						// tmpCount2 ++;
						if (!thisObj._tmpObj[elementId]) {
							thisObj._tmpObj[elementId] = {};
						}
						thisObj._tmpObj[elementId][componentName] = 0;
					}
					// console.log(elementId + ' :: スタイルのカウント = ' + tmpCount2);
				}
			}
			var compCount = 0;
			// console.log('count = ' + count);
			var callback = function(event, elementId2, componentName2) {
				// if (elementData[elementId]['smartphoneLibraryId'] === '') {
				if (elementData[elementId]['itemName'] !== 'Library') {
					thisObj._tmpObj[elementId2][componentName2]++;
					// console.log('***************');
					// console.log('compCount = ' + compCount + ', count = ' + count + ', elementId2 = ' + elementId2 + ', componentName2 = ' + componentName2);
					// console.log(thisObj._tmpObj);
					// console.log('***************');
					if (++compCount === count) {
						// console.log('全てのエレメントのスタイル適用完了')
						$(thisObj).trigger('onCompleteRefreshAllElementStyle');
					}
				}
			}
			for (var elementId in elementData) {
				thisObj.refreshStyle(elementId, undefined, isPublishStaticPage, callback);
			}
		}
		,refreshStyle: function(elementId, componentName, isPublishStaticPage, callback) {
			var thisObj = this;
			// console.log('PreviewAreaManager.js :: refreshStyle :: elementId = ' + elementId + ', componentName = ' + componentName + ', isPublishStaticPage = ' + isPublishStaticPage);
			var elementData = thisObj._instances['DataManager'].getElementDataObj(elementId);
			var elementPropertyData = elementData['property'];
			// console.log('elementPropertyData');
			// console.log(elementPropertyData);
			// if (elementId === 'id-1362476536747') {
				// console.log('PreviewAreaManager :: refreshStyle :: elementId = ' + elementId + ', componentName = ' + componentName);
				// console.log('elementId = ' + elementId);
				// console.log('componentName = ' + componentName);
				// console.log(elementPropertyData);
			// }

			if (elementPropertyData !== undefined) {
				if (componentName) {
					thisObj._elementInstances[elementId] = thisObj._elementInstances[elementId] || {};
					if (!thisObj._elementInstances[elementId][componentName]) {
						thisObj._elementInstances[elementId][componentName] = thisObj.createElementManagerInstance(componentName);
					}
					// console.log('--------------------------');
					// console.log('--------------------------');
					// console.log('elementId = ' + elementId);
					// console.log('componentName = ' + componentName);
					// console.log('elementPropertyData');
					// console.log(elementPropertyData);
					// console.log('thisObj._elementInstances[elementId][componentName] = ' + thisObj._elementInstances[elementId][componentName]);
					// console.log(thisObj._elementInstances[elementId][componentName]);
					if (thisObj._elementInstances[elementId][componentName]) {
						$(thisObj._elementInstances[elementId][componentName]).off('onCompleteRefreshStyle');
						$(thisObj._elementInstances[elementId][componentName]).on('onCompleteRefreshStyle', function(event, elementId2, componentName3) {
							$(thisObj._elementInstances[elementId][componentName]).off('onCompleteRefreshStyle');
							// thisObj.onCompleteRefreshStyle(event);
							if (callback) {
								callback(event, elementId2, componentName3);
							}
						});
						thisObj._elementInstances[elementId][componentName].refreshStyle(elementId, componentName, elementPropertyData[componentName], isPublishStaticPage);
					}
				} else {
					for (var componentName2 in elementPropertyData) {
						thisObj._elementInstances[elementId] = thisObj._elementInstances[elementId] || {};
						// console.log('thisObj._elementInstances[' + elementId + '][' + componentName2 + '] = ' + thisObj._elementInstances[elementId][componentName2]);
						if (!thisObj._elementInstances[elementId][componentName2]) {
							thisObj._elementInstances[elementId][componentName2] = thisObj.createElementManagerInstance(componentName2);
						}
						// console.log('thisObj._elementInstances[' + elementId + '][' + componentName2 + '] = ' + thisObj._elementInstances[elementId][componentName2]);
						if (thisObj._elementInstances[elementId][componentName2]) {
							$(thisObj._elementInstances[elementId][componentName2]).off('onCompleteRefreshStyle');
							$(thisObj._elementInstances[elementId][componentName2]).on('onCompleteRefreshStyle', function(event, elementId2, componentName3) {
								// console.log('	onCompleteRefreshStyle :: elementId2 = ' + elementId2);
								$(thisObj._elementInstances[elementId][componentName2]).off('onCompleteRefreshStyle');
								// thisObj.onCompleteRefreshStyle(event);
				// console.log('');
				// console.log('');
				// console.log('スタイル指定処理完了');
				// console.log('');
				// console.log('');
								if (callback) {
									callback(event, elementId2, componentName3);
								}
							});
							// if (elementId === 'id-1362476536747') {
								// console.log('elementId = ' + elementId);
								// console.log('componentName2 = ' + componentName2);
								// console.log(elementPropertyData[componentName2]);
							// }
							thisObj._elementInstances[elementId][componentName2].refreshStyle(elementId, componentName2, elementPropertyData[componentName2], isPublishStaticPage);
						}
					}
				}
			}
		}


		/*
		 * エレメント削除メソッド
		 * @param	targetId		削除するエレメントのID
		 * @return	void
		 */
		,deleteElem: function(targetId) {
			var thisObj = this;
			var deleteTarget = $("#" + targetId);
			// console.log('deleteElem :: targetId = ' + targetId);
			// console.log('deleteTarget = ' + deleteTarget);
			// console.log('deleteTarget.length = ' + deleteTarget.length);
			// console.log('削除前 :: thisObj._createdElement[' + targetId + '] = ' + thisObj._createdElement[targetId]);
			if (deleteTarget.length) {
				deleteTarget.remove();
				delete thisObj._createdElement[targetId];
				// thisObj.onCompleteRefreshStyle();
				// console.log('削除後 :: thisObj._createdElement[' + targetId + '] = ' + thisObj._createdElement[targetId]);
				$(thisObj).trigger('onCompleteDeleteElement', targetId);
			}
		}

		/*
		 * sortableクラスのインスタンス作成メソッド
		 * @param	void
		 * @return	void
		 */
		,setSortableInstance: function() {
			var thisObj = this;
			var sortTargetSelector = "#previewArea .droppable";
			var connectTargetSelector = ".droppable";
			// console.log('--------------------');
			// console.log('PreiewAreaManager :: setSortableInstance');
			// console.log('--------------------');

			if (thisObj._isSortable === true) {
				thisObj._isSortable = false;
			}
			// $(sortTargetSelector).each(function(i) {
			// 	console.log($(this));
			// 	console.log($(this).html());
			// });
			$(sortTargetSelector).sortable(
			// $('.droppable').sortable(
				{
					// axis			: 'y',
					placeholder		: "placeholder",
					revert			: 100,
					connectWith		: connectTargetSelector,
					// connectWith		: '.droppable',
					tolerance		: 'intersect',
					// cancel			: '.not-editable',
					start			: function(event, ui) {
						var elem = $(ui.item);
						// console.log(elem);
						// if (1 < elem.width() && 1 < elem.height()) {
						// $(".placeholder").css({"width":elem.width(), "height":elem.height()});
						// }
					},
					update			: function(event, ui) {
						// console.log('update');
						var elem = $(ui.item);
						var itemName = elem.attr('data-item-name');

						if (itemName) {
							var tagName = elem.get(0).tagName;
							if (tagName === 'LI') {
								$(thisObj).trigger('onDropToolbarElem', [itemName, elem]);
							} else {
								$(thisObj).trigger('onDropPreviewAreaElem', [itemName, elem, {}]);
							}
						}
					},
					deactivate: function(event, ui) {
						// console.log('deactivate');
						elem = $(ui.item);
						elem.removeClass('dragging');
					}
				}
			);
			thisObj._isSortable = true;
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEventEnabled === false) {
				thisObj._isEventEnabled = true;

				$("#previewArea")
					.on('click', function(event) {
						$('#spContent *').removeClass('now-edit other');
					})
					.on('click', '.dropdown-menu > li > a', function(event) {
						thisObj.changeSkin($(this).attr('data-device'));
						return false;
					})
					.on('click', '.editable', function(event) {
						event.stopPropagation();
						event.preventDefault();
						var elem = $(this);
						// console.log('id = ' + elem.attr('id'));
						if (elem.attr('id') !== undefined) {
							$('#spContent > *').removeClass('now-edit').addClass('other');
							$('#' + elem.attr('id')).addClass('now-edit').removeClass('other');
							var targetElem = elem.parent();
							while(targetElem.attr('id') !== 'spContent') {
								targetElem.removeClass('other');
								targetElem = targetElem.parent();
							}
							$(thisObj).trigger('onClickEditableElement', [event, elem.attr('id')]);
						}
					})
					.on('mouseenter', '.editable', function(event) {
						event.stopPropagation();
						event.preventDefault();
						var elem = $(this);
						if (elem.hasClass('now-edit') === false) {
							var isEditableElement = false;
							while(elem.parent().attr('id') !== 'spContent') {
								if (elem.hasClass('now-edit') === true) {
									isEditableElement = true;
									break;
								} else {
									elem = elem.parent();
								}
							}
							if (isEditableElement === false) {
							}
						}
					})
					.on('mouseleave', '.editable', function(event) {
						event.stopPropagation();
						event.preventDefault();
					});

				$("#bgBtn")
					.on('click', function(event) {
						$(thisObj).trigger('onClickBgBtn', event);
						return false;
					});
				thisObj.setSortableInstance();

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;

				$("#previewArea")
					.find('.dropdown-menu > li > a')
						.off('click');
			}
		}
	}
});
