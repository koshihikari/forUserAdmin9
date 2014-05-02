

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * プロパティエリアに表示する配置プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfLayout');
	MYNAMESPACE.modules.PropertyOfLayout = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfLayout.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		// ,_dataManager					: null
		,_targetId						: null
		// ,_methodObj						: {}
		,_instances						: {}
		,_elems							: {}
		,_currentVal					: {}
		,tooltipMessages				: {
			'isLeft'					: ['表示する内容を左揃えにします。'],
			'isCenter'					: ['表示する内容を中央に配置します。'],
			'isRight'					: ['表示する内容を右揃えにします']
		}
		
		/*
		 * @param	dataManager 	データ管理クラスのインスタンス
		 * @param	id 				プロパティを表示するエレメントのID
		 * @param	methodObj 		メソッド保持オブジェクト
		 * @param	properties 		このクラスで管理するプロパティエレメントのプロパティオブジェクト
		 * @return	void
		 */
		// ,initialize: function(dataManager, id, methodObj) {
		// ,initialize: function(instances, id, methodObj) {
		,initialize: function(instances, id) {
			var thisObj = this;
			
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onClickRadioButton', 'setEvent');
			// _.bindAll(this, 'setInitData', 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onClickRadioButton', 'setEvent');
			// this._dataManager = dataManager;
			this._targetId = id;
			// this._methodObj = methodObj;
			this._elementType = 'Layout';
			this._instances = instances;
			// var elementData = dataManager.getElementData(id);
			// var isCommonElement = elementData['smartphone_elements']['smartphone_common_element_id'] ? true : false;
			// var isEditable = elementData['smartphone_common_elements']['is_editable'] === 0 ? false : true;
			// var commonProp = elementData['smartphone_common_elements']['properties'] ? elementData['smartphone_common_elements']['properties'][this._elementType] : {};
			// var individualProp = elementData['smartphone_elements']['properties'] ? elementData['smartphone_elements']['properties'][this._elementType] : {};
			// this._currentVal = this.setInitData(isCommonElement, isEditable, commonProp, individualProp);
			// this._currentVal = this.setInitData(this._targetId, this._dataManager, this._elementType);
			// var elementData = this._instances['DataManager'].getElementData('element_id', this._targetId);
			// this._currentVal = elementData['property'][this._elementType] || {};
			// var elementProperty = this._instances['DataManager'].getElementProperty(this._targetId);
			// this._currentVal = elementProperty['property'][this._elementType] || {};
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			// this._currentVal = this.setInitData(this._targetId, this._instances['DataManager'], this._elementType);
			// this._currentVal = this.setInitData(properties);
			
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement
			}
		//	this.attachEvent();
		//	this.refreshStyle();
		}
		
		/*
		 * 初期データセットメソッド
		 * @param	elementId		プロパティを表示するエレメントのID
		 * @param	dataManager		データ管理クラスのインスタンス
		 * @param	elementType		このクラスで管理するプロパティの名前
		 * @return	このクラスが管理するエレメントのプロパティデータ
		 */
		,DEL_setInitData: function(elementId, dataManager, elementType) {
			var elementData = dataManager.getElementData('element_id', elementId);
			// console.log('elementId = ' + elementId);
			// console.log(elementData);
			var elementProp = elementData['property'] ? elementData['property'][elementType] : null, isCommonElement;
			if (elementData && elementData['smartphone_library_id'] !== '0' && !elementData['item_name'] !== 'Library') {
				isCommonElement = true;
			} else {
				isCommonElement = false;
			}
			/*
			var isCommonElement = false, isEditable = false, libraryProp = {}, individualProp = {}, retObj = {};
			if (elementData && elementData['smartphone_library_id'] !== '0' && !elementData['item_name'] !== 'Library') {
				isCommonElement = true;
				isEditable = elementData['is_editable'];
				libraryProp = elementData['library_element_property'] ? elementData['library_element_property'][elementType] : null;
				individualProp = elementData['page_element_property'] ? elementData['page_element_property'][elementType] : null;
			} else {
				isCommonElement = false;
				isEditable = true;
				libraryProp = null;
				individualProp = elementData['page_element_property'] ? elementData['page_element_property'][elementType] : null;
			}
			*/
			var retObj = {};
			var defaultProp = {
				'textAlign'			: 'left'
			}
			/*
			if (isCommonElement === true && libraryProp) {
				retObj = {
					'textAlign'				: libraryProp['textAlign'] ? libraryProp['textAlign'] : defaultProp['textAlign']
				}
				if (isEditable === true && individualProp) {
					retObj = {
						'textAlign'			: individualProp['textAlign'] ? individualProp['textAlign'] : retObj['textAlign']
					}
				}
			} else if (individualProp) {
				retObj = {
					'textAlign'				: individualProp['textAlign'] ? individualProp['textAlign'] : defaultProp['textAlign']
				}
			} else {
				retObj = defaultProp;
			}
			*/
			if (elementProp) {
				retObj = {
					'textAlign'				: elementProp['textAlign'] ? elementProp['textAlign'] : defaultProp['textAlign']
				}
			} else {
				retObj = defaultProp;
			}
			// var retObj = {
			// 	'textAlign'				: dataObj['textAlign'] ? dataObj['textAlign'] : 'left'
			// }

			// console.log('-------------------');
			// console.log('PropertyOfLayout :: setInitData :: bigin');
			// console.log('isCommonElement = ' + isCommonElement);
			// console.log('isEditable = ' + isEditable);
			// console.log('libraryProp');
			// console.log(libraryProp);
			// console.log('individualProp');
			// console.log(individualProp);
			// console.log('retObj');
			// console.log(retObj);
			// console.log('PropertyOfLayout :: setInitData :: end');
			// console.log('-------------------');
			return retObj;
		}
		
		/*
		 * このクラスが管理するエレメント返すメソッド
		 * @param	void
		 * @return	このクラスが管理するエレメント
		 */
		,getElem: function() {
			var thisObj = this;
			return thisObj._elems['propertyElement'];
		}
		
		/*
		 * このクラスが管理するエレメントのプロパティを返すメソッド
		 * @param	void
		 * @return	このクラスが管理するエレメントのプロパティ
		 */
		,getProperty: function() {
			var thisObj = this;
			return {key:thisObj._elementType, val:thisObj._currentVal};
		}
		
		/*
		 * このクラスが管理するエレメントを作成し、作成したエレメントを返すメソッド
		 * @param	id 		このクラスが管理するエレメントのコンてナのID
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id) {
			var thisObj = this;
			var source = '\
						<div class="propertyElement forLayoutElement">\
							<p class="elementTitle">配置</p>\
							<div class="contentWrapper">\
								<div class="btn-hole">\
									<div class="btn-group" data-toggle="buttons-radio">\
										<button type="button" class="btn btn-primary isLeft' + (thisObj._currentVal['textAlign'] === 'left' ? ' active' : '') + '" data-item-name="isLeft" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isLeft'][0] + '"><span><i data-icon=""></i>左揃え</span></button>\
										<button type="button" class="btn btn-primary isCenter' + (thisObj._currentVal['textAlign'] === 'center' ? ' active' : '') + '" data-item-name="isCenter" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isCenter'][0] + '"><span><i data-icon=""></i>中央配置</span></button>\
										<button type="button" class="btn btn-primary isRight' + (thisObj._currentVal['textAlign'] === 'right' ? ' active' : '') + '" data-item-name="isRight" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isRight'][0] + '"><span><i data-icon=""></i>右揃え</span></button>\
									</div>\
								</div>\
								<!--\
								<div class="btn-group" data-toggle="buttons-radio">\
									<button type="button" class="btn isLeft' + (thisObj._currentVal['layout'] === 'left' ? ' active' : '') + '" data-item-name="isLeft" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isLeft'][0] + '"><i class="icon-bold"></i><span>左揃え</span></button>\
									<button type="button" class="btn isCenter' + (thisObj._currentVal['layout'] === 'center' ? ' active' : '') + '" data-item-name="isCenter" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isCenter'][0] + '"><i data-icon=""></i><span>中央配置</span></button>\
									<button type="button" class="btn isRight' + (thisObj._currentVal['layout'] === 'right' ? ' active' : '') + '" data-item-name="isRight" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isRight'][0] + '"><i data-icon=""></i><span>右揃え</span></button>\
								</div>\
								-->\
							</div>\
						</div>\
			';
			return $(source);
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
		//	var targetElem = $("#" + thisObj._targetId + " > div > div.contentWrapper");
			targetElem
				.css(
					{
						'textAlign'		: thisObj._currentVal['textAlign']
					}
				);
				
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId, isEnforcement);
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId);
			
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('Layoutデータ保存');
				// thisObj._dataManager.updateData(thisObj._targetId, this._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * 左揃え/中央配置/右揃えのラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButton: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var layout = {
				'isLeft'	: 'left',
				'isCenter'	: 'center',
				'isRight'	: 'right'
			}
			if (layout[itemName] !== 'center' && layout[itemName] !== 'right') {
				layout[itemName] = 'left';
			}
			thisObj._currentVal['textAlign'] = layout[itemName];
			thisObj.refreshStyle(true);
		}
		
		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				thisObj._elems['propertyElement']
					.find('div[data-toggle="buttons-radio"] > .btn')
						.on('click', function(event) {
							thisObj.onClickRadioButton(event);
						});
				
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find('div[data-toggle="buttons-radio"] > .btn')
						.off('click');
			}
		}
	}
});
