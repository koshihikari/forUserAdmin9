

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * プロパティエリア管理クラス
	 * eventName
	 * 		onRenderComplete		プロパティエリアのレンダリングが完了した
	 * 		onClickDeleteBtn		プロパティエリアの「削除」ボタンがクリックされた
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.PropertyAreaManager');
	MYNAMESPACE.modules.library_page.edit.PropertyAreaManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.PropertyAreaManager.prototype = {
		_isEnabled						: false
		// ,_dataManager					: null
		// ,_accessManager					: null
		,_dialogElemSources				: {}
		,_elems							: {}
		,_sources						: {}
		,_currentPartsProperty			: {}
		,_instances						: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager, AlertModalManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'refreshCurrentVal'
				,'onRefreshStyle'
				,'render'
				,'createPropertyAreaInstance'
				,'deleteElem'
				,'setEvent'
			);

			// this._dataManager = DataManager;
			// this._accessManager = AccessManager;
			this._instances = {
				'propertyArea'			: {},
				'DataManager'			: DataManager,
				'AlertModalManager'		: AlertModalManager
			}
		}
		,refreshCurrentVal: function(elementId, categoryName, property) {
			var thisObj = this;
			// console.log('PropertyAreaManager :: refreshCurrentVal :: elementId = ' + elementId + ', categoryName = ' + categoryName);
			// console.log(property);
			if (thisObj._instances['propertyArea'][elementId + '-prop'] && thisObj._instances['propertyArea'][elementId + '-prop']['container']) {
				var instances = thisObj._instances['propertyArea'][elementId + '-prop']['instances'];
				for (var i=0, len=instances.length; i<len; i++) {
					if (instances[i].refreshCurrentVal) {
						instances[i].refreshCurrentVal(elementId, categoryName, property);
					}
				}
			}
		}

		,onRefreshStyle: function(event, elementId, componentName, property) {
			var thisObj = this;
			var elementDataobj = thisObj._instances['DataManager'].getElementDataObj(elementId);
	// console.log('-------------');
	// console.log('aa');
	// console.log('property');
	// console.log(property);
			elementDataobj['property'][componentName] = property
	// console.log('aa1');
	// console.log('elementDataobj');
	// console.log(elementDataobj);
	// console.log('-------------');
			thisObj._instances['DataManager'].setElementDataObj(elementId, 'property', elementDataobj['property']);
			// thisObj._instances['DataManager'].updateElementProperty(elementId, componentName, property);
			// var elementProperty = thisObj._instances['DataManager'].getElementProperty(elementId);
			// console.log('PropertyAreaManager :: onRefreshStyle :: elementId = ' + elementId + ', componentName = ' + componentName);
			// console.log(property);
			// console.log(elementProperty);
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, componentName, property]);
		}
		/*
		 * プロパティエリア描画メソッド
		 * @param	id 		プロパティを表示するエレメントのID
		 * @return	void
		 */
		,render: function(id) {
			// console.log('PropertyManager :: render');
			var thisObj = this;
			var targetContainer = $("#propertyArea > div");

			// 存在する全てのプロパティエリアエレメントを非表示にしてイベントを無効にする
			targetContainer.find('.propertyElem').css('display', 'none');

			// 引数で渡されたIDのプロパティエリアエレメントが存在しなければ作成
			// console.log('thisObj._instances[propertyArea][' + id + '-prop] = ' + (thisObj._instances['propertyArea'][id + '-prop']));
			// if (!thisObj._instances[id + '-prop'] || !thisObj._instances[id + '-prop']['container']) {
			if (!thisObj._instances['propertyArea'][id + '-prop'] || !thisObj._instances['propertyArea'][id + '-prop']['container']) {
				var itemName = $("#" + id).attr('data-item-name');
				// var elementData = instances.getElementData(id);
				// console.log('itemName = ' + itemName);
				// console.log(elementData);
				// var properties = elementData && elementData['properties'] ? elementData['properties'] : {};
				// var elemInstances = thisObj.createPropertyAreaInstance(id, itemName, properties);
				var elemInstances = thisObj.createPropertyAreaInstance(id, itemName);
				// var len = elemInstances.length;
				var cloneElem = $("#masterPropertyElem").clone().attr('id', id + '-prop');

				// console.log('--------- id = ' + id + ' ---------');
				// var elementDataObj = thisObj._instances['DataManager'].setElementDataObj(id);
				// console.log(elementDataObj);
				if (id === 'displayArea' || itemName === 'Td' || itemName === 'AboutTd') {
					// console.log($("#" + id + "-prop"));
					cloneElem.find('.btnsWrapper').css({'visibility':'hidden'});
				}
				thisObj._instances['propertyArea'][id + '-prop'] = {
				// thisObj._instances[id + '-prop'] = {
					container		: cloneElem,
					instances		: elemInstances
				}
				var len = elemInstances.length;
				var count = 0;
				var listener = function(event, elementId, itemName) {
					count++;
					// console.log('count = ' + count + ', len = ' + len + ', itemName = ' + itemName);
					if (count === len) {
						var saveProperties = {};
						// console.log('len = ' + len);
						for (var j=0; j<len; j++) {
							var obj = elemInstances[j].getProperty();
							saveProperties[obj['key']] = obj['val'];
							$(elemInstances[j]).off('onCompleteRefreshStyle');
							$(elemInstances[j]).on('onCompleteRefreshStyle', thisObj.onRefreshStyle);
							// console.log('thisObj.onRefreshStyle = ' + thisObj.onRefreshStyle);
						}
						$(thisObj).trigger('onRenderComplete', [id, saveProperties]);
					}
				}
				var propsWrapper = cloneElem.find('.propsWrapper');
				for (var i=0; i<len; i++) {
					propsWrapper.append(elemInstances[i].getElem());
					$(elemInstances[i]).on('onCompleteRefreshStyle', listener);
					elemInstances[i].refreshStyle();
					elemInstances[i].setEvent(true);
				}
				targetContainer.append(cloneElem);
				// return;
				cloneElem.find('*[data-placement][data-original-title]').tooltip();

				// console.log('len = ' + len);
				if (isNaN(len) === true) {
					$(thisObj).trigger('onRenderComplete', [id]);
				}
			}
			// }

			// 引数で渡されたプロパティエリアエレメントを表示して、イベントを有効にする
			thisObj._instances['propertyArea'][id + '-prop']['container'].css('display', 'block');
			// thisObj._instances[id + '-prop']['container'].css('display', 'block');
		}

		/*
		 * プロパティエリアに表示するエレメントのインスタンス作成メソッド
		 * @param	elementId 		プロパティを表示するエレメントのID
		 * @param	itemName 		プロパティを表示するエレメントのアイテム名
		 * @return	void
		 */
		,createPropertyAreaInstance: function(elementId, itemName) {
			var thisObj = this;
			// var instances = {
			// 	'DataManager'		: thisObj._instances['DataManager'],
			// 	'AccessManager'		: thisObj._instances['AccessManager']
			// };
			var instances = thisObj._instances;
			// console.log('PropertyAreaManager :: createPropertyAreaInstance :: itemName = ' + itemName);
			var elementProperty = thisObj._instances['DataManager'].getElementDataObj(elementId);
			var retArr = [];
			// console.log('itemName = ' + itemName);
			// console.log('elementId = ' + elementId);
			// console.log(elementProperty);
			if (itemName !== 'Library') {
				for (var componentName in elementProperty['property']) {
					// console.log('componentName = ' + componentName);
					retArr.push(eval('new MYNAMESPACE.modules.PropertyOf' + componentName + '(instances, elementId)'));
				}
			}
			return retArr;
		}

		/*
		 * エレメント削除メソッド
		 * @param	targetId		削除するエレメントのIDに含まれる文字列
		 * @return	void
		 */
		,deleteElem: function(targetId) {
			var thisObj = this;
			/*
			console.log('deleteElem :: targetId = ' + targetId);
			console.log('thisObj._instances[' + targetId + '-prop] = ' + thisObj._instances[targetId + '-prop']);
			*/
			if (thisObj._instances['propertyArea'][targetId + '-prop']) {
				$("div.tooltip").remove();
				thisObj._instances['propertyArea'][targetId + '-prop'].container.remove();
				delete thisObj._instances['propertyArea'][targetId + '-prop'];
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
		//	console.log('PropertyAreaManager.jsのSetEvent :: isEnabled = ' + isEnabled + ', thisObj._isEnabled = ' + thisObj._isEnabled);
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				$('#propertyArea')
					.on('click', '.elementTitle', function(event) {
						// console.log('クリックされた');
						$(this).parent().find(".contentWrapper").slideToggle();
					})
					.on('click', '.deleteBtn', function(event) {
						var targetId = $(this).parent().parent().parent().attr('id').replace('-prop', '');
						// console.log('targetId = ' + targetId);
						$(thisObj).trigger('onClickDeleteBtn', targetId);
					});
				/*
				$(document).on('click', 'div.editable.header', function(event) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				});
				*/

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				$('#propertyArea')
					.off('click', '.elementTitle')
					.off('click', '.deleteBtn');
			}
		}
	}
});
