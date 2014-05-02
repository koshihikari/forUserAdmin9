

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * プロパティエリアに表示する間隔プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfSpace');
	MYNAMESPACE.modules.PropertyOfSpace = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfSpace.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_currentVal					: {}
		,_targetId						: null
		// ,_methodObj						: {}
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_instances						: {}
		,_hasSaveData					: false
		,_timers						: {}
		,_elems							: {}
		,tooltipMessages				: {
			'isInabledGradation'			: ['グラデーションを有効にします。', 'グラデーションを無効にします。'],
			'directionOfGradient'			: ['上から下にグラデーションを適用します。', '下から上にグラデーションを適用します。', '左から右にグラデーションを適用します。', '右から左にグラデーションを適用します。', '中央から周辺にグラデーションを適用します。', '周辺から中央にグラデーションを適用します。']
		}
		
		/*
		 * コンストラクタ
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
			
			// _.bindAll(this, 'setInitData', 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeSlider', 'onChangeText', 'setEvent');
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeSlider', 'onChangeText', 'setEvent');
			this._targetId = id;
			// this._methodObj = methodObj;
			this._elementType = 'Space';
			this._instances = instances;
			// var elementData = this._instances['DataManager'].getElementData('element_id', this._targetId);
			// this._currentVal = elementData['property'][this._elementType] || {};
			// var elementProperty = this._instances['DataManager'].getElementProperty(this._targetId);
			// this._currentVal = elementProperty['property'][this._elementType] || {};
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			// this._currentVal = this.setInitData(this._targetId, this._instances['DataManager'], this._elementType);
			
			var propertyElement = this.createElement(id, this._currentVal);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'isMarginLinkageInput'		: propertyElement.find(".isMarginLinkageWrapper input[type='text']"),
				'imageWidthInput'		: propertyElement.find(".imageWidthWrapper input[type='text']"),
				'imageHeightInput'		: propertyElement.find(".imageHeightWrapper input[type='text']")
			}
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
				'marginTop'				: 0,
				'marginBottom'			: 0,
				'marginLeft'			: 'auto',
				'marginRight'			: 'auto',
				'isMarginLinkage'		: true,
				'isMarginCentering'		: true,
				'paddingTop'				: 0,
				'paddingBottom'			: 0,
				'paddingLeft'			: 0,
				'paddingRight'			: 0,
				'isPaddingLinkage'		: true
			}
			/*
			if (isCommonElement === true && libraryProp) {
				retObj = {
					'marginTop'				: !isNaN(libraryProp['marginTop']-0) ? libraryProp['marginTop'] : defaultProp['marginTop'],
					'marginBottom'			: !isNaN(libraryProp['marginBottom']-0) ? libraryProp['marginBottom'] : defaultProp['marginBottom'],
					'marginLeft'			: !isNaN(libraryProp['marginLeft']-0) ? libraryProp['marginLeft'] : defaultProp['marginLeft'],
					'marginRight'			: !isNaN(libraryProp['marginRight']-0) ? libraryProp['marginRight'] : defaultProp['marginRight'],
					'isMarginLinkage'		: libraryProp['isMarginLinkage'] === false ? false : defaultProp['isMarginLinkage'],
					'isMarginCentering'		: libraryProp['isMarginCentering'] === false ? false : defaultProp['isMarginCentering'],
					'paddingTop'			: !isNaN(libraryProp['paddingTop']-0) ? libraryProp['paddingTop'] : defaultProp['paddingTop'],
					'paddingBottom'			: !isNaN(libraryProp['paddingBottom']-0) ? libraryProp['paddingBottom'] : defaultProp['paddingBottom'],
					'paddingLeft'			: !isNaN(libraryProp['paddingLeft']-0) ? libraryProp['paddingLeft'] : defaultProp['paddingLeft'],
					'paddingRight'			: !isNaN(libraryProp['paddingRight']-0) ? libraryProp['paddingRight'] : defaultProp['paddingRight'],
					'isPaddingLinkage'		: libraryProp['isPaddingLinkage'] === false ? false : defaultProp['isPaddingLinkage']
				}
				if (isEditable === true && individualProp) {
					retObj = {
						'marginTop'				: !isNaN(individualProp['marginTop']-0) ? individualProp['marginTop'] : retObj['marginTop'],
						'marginBottom'			: !isNaN(individualProp['marginBottom']-0) ? individualProp['marginBottom'] : retObj['marginBottom'],
						'marginLeft'			: !isNaN(individualProp['marginLeft']-0) ? individualProp['marginLeft'] : retObj['marginLeft'],
						'marginRight'			: !isNaN(individualProp['marginRight']-0) ? individualProp['marginRight'] : retObj['marginRight'],
						'isMarginLinkage'		: individualProp['isMarginLinkage'] !== null ? individualProp['isMarginLinkage'] : retObj['isMarginLinkage'],
						'isMarginCentering'		: individualProp['isMarginCentering'] !== null ? individualProp['isMarginCentering'] : retObj['isMarginCentering'],
						'paddingTop'			: !isNaN(individualProp['paddingTop']-0) ? individualProp['paddingTop'] : defaultProp['paddingTop'],
						'paddingBottom'			: !isNaN(individualProp['paddingBottom']-0) ? individualProp['paddingBottom'] : defaultProp['paddingBottom'],
						'paddingLeft'			: !isNaN(individualProp['paddingLeft']-0) ? individualProp['paddingLeft'] : defaultProp['paddingLeft'],
						'paddingRight'			: !isNaN(individualProp['paddingRight']-0) ? individualProp['paddingRight'] : defaultProp['paddingRight'],
						'isPaddingLinkage'		: individualProp['isPaddingLinkage'] === false ? false : defaultProp['isPaddingLinkage']
					}
				}
			} else if (individualProp) {
				retObj = {
					'marginTop'				: !isNaN(individualProp['marginTop']-0) ? individualProp['marginTop'] : defaultProp['marginTop'],
					'marginBottom'			: !isNaN(individualProp['marginBottom']-0) ? individualProp['marginBottom'] : defaultProp['marginBottom'],
					'marginLeft'			: !isNaN(individualProp['marginLeft']-0) ? individualProp['marginLeft'] : defaultProp['marginLeft'],
					'marginRight'			: !isNaN(individualProp['marginRight']-0) ? individualProp['marginRight'] : defaultProp['marginRight'],
					'isMarginLinkage'		: individualProp['isMarginLinkage'] !== null ? individualProp['isMarginLinkage'] : defaultProp['isMarginLinkage'],
					'isMarginCentering'		: individualProp['isMarginCentering'] !== null ? individualProp['isMarginCentering'] : defaultProp['isMarginCentering'],
					'paddingTop'			: !isNaN(individualProp['paddingTop']-0) ? individualProp['paddingTop'] : defaultProp['paddingTop'],
					'paddingBottom'			: !isNaN(individualProp['paddingBottom']-0) ? individualProp['paddingBottom'] : defaultProp['paddingBottom'],
					'paddingLeft'			: !isNaN(individualProp['paddingLeft']-0) ? individualProp['paddingLeft'] : defaultProp['paddingLeft'],
					'paddingRight'			: !isNaN(individualProp['paddingRight']-0) ? individualProp['paddingRight'] : defaultProp['paddingRight'],
					'isPaddingLinkage'		: individualProp['isPaddingLinkage'] === false ? false : defaultProp['isPaddingLinkage']
				}
			} else {
				retObj = defaultProp;
			}
			*/
			if (elementProp) {
				retObj = {
					'marginTop'				: !isNaN(elementProp['marginTop']-0) ? elementProp['marginTop'] : defaultProp['marginTop'],
					'marginBottom'			: !isNaN(elementProp['marginBottom']-0) ? elementProp['marginBottom'] : defaultProp['marginBottom'],
					'marginLeft'			: !isNaN(elementProp['marginLeft']-0) ? elementProp['marginLeft'] : defaultProp['marginLeft'],
					'marginRight'			: !isNaN(elementProp['marginRight']-0) ? elementProp['marginRight'] : defaultProp['marginRight'],
					'isMarginLinkage'		: elementProp['isMarginLinkage'] !== null ? elementProp['isMarginLinkage'] : defaultProp['isMarginLinkage'],
					'isMarginCentering'		: elementProp['isMarginCentering'] !== null ? elementProp['isMarginCentering'] : defaultProp['isMarginCentering'],
					'paddingTop'			: !isNaN(elementProp['paddingTop']-0) ? elementProp['paddingTop'] : defaultProp['paddingTop'],
					'paddingBottom'			: !isNaN(elementProp['paddingBottom']-0) ? elementProp['paddingBottom'] : defaultProp['paddingBottom'],
					'paddingLeft'			: !isNaN(elementProp['paddingLeft']-0) ? elementProp['paddingLeft'] : defaultProp['paddingLeft'],
					'paddingRight'			: !isNaN(elementProp['paddingRight']-0) ? elementProp['paddingRight'] : defaultProp['paddingRight'],
					'isPaddingLinkage'		: elementProp['isPaddingLinkage'] === false ? false : defaultProp['isPaddingLinkage']
				}
			} else {
				retObj = defaultProp;
			}
			/*
			var retObj = {
				'url'				: dataObj['url'] ? dataObj['url'] : '',
				'target'			: dataObj['target'] ? dataObj['target'] : '_self',
				'linkType'			: dataObj['linkType'] ? dataObj['linkType'] : 'url',
			}
			var retObj = {
				'marginTop'			: !isNaN(dataObj['marginTop']-0) ? dataObj['marginTop'] : 0,
				'marginBottom'		: !isNaN(dataObj['marginBottom']-0) ? dataObj['marginBottom'] : 0,
				'marginLeft'		: !isNaN(dataObj['marginLeft']-0) ? dataObj['marginLeft'] : 'auto',
				'marginRight'		: !isNaN(dataObj['marginRight']-0) ? dataObj['marginRight'] : 'auto',
				'isMarginLinkage'	: dataObj['isMarginLinkage'] === false ? false : true,
				'isMarginCentering'	: dataObj['isMarginCentering'] === false ? false : true,
				'paddingTop'		: !isNaN(dataObj['paddingTop']-0) ? dataObj['paddingTop'] : 0,
				'paddingBottom'		: !isNaN(dataObj['paddingBottom']-0) ? dataObj['paddingBottom'] : 0,
				'paddingLeft'		: !isNaN(dataObj['paddingLeft']-0) ? dataObj['paddingLeft'] : 0,
				'paddingRight'		: !isNaN(dataObj['paddingRight']-0) ? dataObj['paddingRight'] : 0,
				'isPaddingLinkage'	: dataObj['isPaddingLinkage'] === false ? false : true
			}*/


			// console.log('-------------------');
			// console.log('PropertyOfSpace :: setInitData :: bigin');
			// console.log('isCommonElement = ' + isCommonElement);
			// console.log('isEditable = ' + isEditable);
			// console.log('libraryProp');
			// console.log(libraryProp);
			// console.log('individualProp');
			// console.log(individualProp);
			// console.log('retObj');
			// console.log(retObj);
			// console.log('PropertyOfSpace :: setInitData :: end');
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
		//	return thisObj._elem;
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
		 * @param	currentVal 		このクラスが管理するエレメントのプロパティデータ
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id, currentVal) {
			var thisObj				= this;
			var targetElem = $("#" + thisObj._targetId);
			var prop = {
				'marginTop'		: {
					'min'			: -50,
					'max'			: 80
				},
				'marginBottom'	: {
					'min'			: -50,
					'max'			: 80
				},
				'marginLeft'	: {
					'min'			: -50,
					'max'			: 80
				},
				'marginRight'	: {
					'min'			: -50,
					'max'			: 80
				},
				'paddingTop'		: {
					'min'			: 0,
					'max'			: 100
				},
				'paddingBottom'	: {
					'min'			: 0,
					'max'			: 100
				},
				'paddingLeft'	: {
					'min'			: 0,
					'max'			: 100
				},
				'paddingRight'	: {
					'min'			: 0,
					'max'			: 100
				}
			}
			var source = '\
						<div class="propertyElement forSpaceElement">\
							<p class="elementTitle">間隔</p>\
							<div class="contentWrapper">\
								<div class="control-group marginWrapper">\
									<label class="control-label">マージン</label>\
									<div class="controls">\
										<div class="box">\
											<span class="key">上</span>\
											<div class="sliderWrapper">\
												<div class="slider marginTopSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['marginTop'] + '" data-item-name="marginTop" data-min="' + prop['marginTop']['min'] + '" data-max="' + prop['marginTop']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">右</span>\
											<div class="sliderWrapper">\
												<div class="slider marginRightSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['marginRight'] + '" data-item-name="marginRight" data-min="' + prop['marginRight']['min'] + '" data-max="' + prop['marginRight']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">下</span>\
											<div class="sliderWrapper">\
												<div class="slider marginBottomSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['marginBottom'] + '" data-item-name="marginBottom" data-min="' + prop['marginBottom']['min'] + '" data-max="' + prop['marginBottom']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">左</span>\
											<div class="sliderWrapper">\
												<div class="slider marginLeftSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['marginLeft'] + '" data-item-name="marginLeft" data-min="' + prop['marginLeft']['min'] + '" data-max="' + prop['marginLeft']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="btn-hole" data-toggle="buttons-checkbox">\
											<button type="button" class="btn btn-primary marginLinkageBtn' + (currentVal['isMarginLinkage'] === true ? ' active' : '') + '" data-item-name="isMarginLinkage" data-placement="bottom" data-original-title="上下左右のマージンを連動させ、すべての値を同じにします。"><span><i data-icon=""></i>マージンを連動させる</span></button>\
											<button type="button" class="btn btn-primary centeringBtn' + (currentVal['isMarginCentering'] === true ? ' active' : '') + '" data-item-name="isMarginCentering" data-placement="bottom" data-original-title="中央揃えにします。"><span><i data-icon=""></i>中央揃えにする</span></button>\
										</div>\
									</div>\
								</div>\
								<div class="control-group paddingWrapper">\
									<label class="control-label">パディング</label>\
									<div class="controls">\
										<div class="box">\
											<span class="key">上</span>\
											<div class="sliderWrapper">\
												<div class="slider paddingTopSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['paddingTop'] + '" data-item-name="paddingTop" data-min="' + prop['paddingTop']['min'] + '" data-max="' + prop['paddingTop']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">右</span>\
											<div class="sliderWrapper">\
												<div class="slider paddingRightSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['paddingRight'] + '" data-item-name="paddingRight" data-min="' + prop['paddingRight']['min'] + '" data-max="' + prop['paddingRight']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">下</span>\
											<div class="sliderWrapper">\
												<div class="slider paddingBottomSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['paddingBottom'] + '" data-item-name="paddingBottom" data-min="' + prop['paddingBottom']['min'] + '" data-max="' + prop['paddingBottom']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box">\
											<span class="key">左</span>\
											<div class="sliderWrapper">\
												<div class="slider paddingLeftSlider"></div>\
											</div>\
											<input type="text" value="' + currentVal['paddingLeft'] + '" data-item-name="paddingLeft" data-min="' + prop['paddingLeft']['min'] + '" data-max="' + prop['paddingLeft']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="btn-hole" data-toggle="buttons-checkbox">\
											<button type="button" class="btn btn-primary paddingLinkageBtn' + (currentVal['isPaddingLinkage'] === true ? ' active' : '') + '" data-item-name="isPaddingLinkage" data-placement="bottom" data-original-title="上下左右のパディングを連動させ、すべての値を同じにします。"><span><i data-icon=""></i>パディングを連動させる</span></button>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			
			if (targetElem.attr('data-item-name') === 'Image') {
				elem
					.find(".paddingWrapper")
						.css('display', 'none');

			} else if (targetElem.hasClass('tdForAbout')) {
				elem
					.find(".marginWrapper")
						.css('display', 'none')
					.end()
					.find(".paddingWrapper > div.controls")
						.css('border-top', 'none');
			}
			
			elem
				.find(".marginWrapper")
					.find(".marginTopSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['marginTop']['min'],
								max		: prop['marginTop']['max'],
								value	: currentVal['marginTop'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginTop');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginTop');}
							}
						)
					.end()
					.find(".marginRightSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['marginRight']['min'],
								max		: prop['marginRight']['max'],
								value	: currentVal['marginRight'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginRight');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginRight');}
							}
						)
					.end()
					.find(".marginBottomSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['marginBottom']['min'],
								max		: prop['marginBottom']['max'],
								value	: currentVal['marginBottom'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginBottom');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginBottom');}
							}
						)
					.end()
					.find(".marginLeftSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['marginLeft']['min'],
								max		: prop['marginLeft']['max'],
								value	: currentVal['marginLeft'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginLeft');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'marginLeft');}
							}
						)
					.end()
				.end()
				.find(".paddingWrapper")
					.find(".paddingTopSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['paddingTop']['min'],
								max		: prop['paddingTop']['max'],
								value	: currentVal['paddingTop'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingTop');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingTop');}
							}
						)
					.end()
					.find(".paddingRightSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['paddingRight']['min'],
								max		: prop['paddingRight']['max'],
								value	: currentVal['paddingRight'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingRight');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingRight');}
							}
						)
					.end()
					.find(".paddingBottomSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['paddingBottom']['min'],
								max		: prop['paddingBottom']['max'],
								value	: currentVal['paddingBottom'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingBottom');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingBottom');}
							}
						)
					.end()
					.find(".paddingLeftSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['paddingLeft']['min'],
								max		: prop['paddingLeft']['max'],
								value	: currentVal['paddingLeft'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingLeft');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'paddingLeft');}
							}
						);
			return elem;
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			
			/*
			console.log('------------------------');
			console.log('修正前');
			for (var key in thisObj._currentVal) {
				console.log('thisObj._currentVal[' + key + '] = ' + thisObj._currentVal[key]);
			}
			if (thisObj._currentVal['isMarginLinkage'] === true) {
				
			}
			*/
			
			var sliderStatus = thisObj._currentVal['isMarginCentering'] === true ? 'disable' : 'enable';
			thisObj._elems['propertyElement']
				.find('.marginLeftSlider')
					.slider(sliderStatus)
				.end()
				.find('.marginRightSlider')
					.slider(sliderStatus);
					
			if (thisObj._currentVal['isMarginCentering'] === true) {
				// thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginRight'] = 'auto';
				thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginRight'] = 0;
				// thisObj._elems['propertyElement']
				// 	.find('[data-item-name="marginLeft"]')
				// 		.attr('disabled','disabled')
				// 	.end()
				// 	.find('[data-item-name="marginRight"]')
				// 		.attr('disabled','disabled');
			// } else {
				// thisObj._elems['propertyElement']
				// 	.find('[data-item-name="marginLeft"]')
				// 		.removeAttr('disabled')
				// 	.end()
				// 	.find('[data-item-name="marginRight"]')
				// 		.removeAttr('disabled');
				// thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginLeft'] === 'auto' ? thisObj._elems['propertyElement'].find('[data-item-name="marginLeft"]').val() : thisObj._currentVal['marginLeft'];
				// thisObj._currentVal['marginRight'] = thisObj._currentVal['marginRight'] === 'auto' ? thisObj._elems['propertyElement'].find('[data-item-name="marginRight"]').val() : thisObj._currentVal['marginRight'];
			}
			
			/*
			if (thisObj._currentVal['isPaddingLinkage'] === true) {
				
			}
			console.log('修正後');
			for (var key in thisObj._currentVal) {
				console.log('thisObj._currentVal[' + key + '] = ' + thisObj._currentVal[key]);
			}
			console.log('------------------------');
			*/
			
			var selectors = [
				'marginTop',
				'marginBottom',
				'marginLeft',
				'marginRight',
				'paddingTop',
				'paddingBottom',
				'paddingLeft',
				'paddingRight'
			];
			for (var i=0,len=selectors.length; i<len; i++) {
				var val = thisObj._currentVal[selectors[i]] - 0;
				if (!isNaN(val)) {
					thisObj._isChangeSlideOnProgram = true;
					thisObj._elems['propertyElement']
						.find('.' + selectors[i] + 'Slider')
							.slider('value', val)
						.end()
						.find('[data-item-name="' + selectors[i] + '"]')
							.val(val);
				}
			}
			
			// var marginTop = thisObj._currentVal['marginTop'] + 'px';
			// var marginRight = thisObj._currentVal['isMarginCentering'] === true ? thisObj._currentVal['marginRight'] : thisObj._currentVal['marginRight'] + 'px';
			// var marginBottom = thisObj._currentVal['marginBottom'] + 'px';
			// var marginLeft = thisObj._currentVal['isMarginCentering'] === true ? thisObj._currentVal['marginLeft'] : thisObj._currentVal['marginLeft'] + 'px';
			// var paddingTop = thisObj._currentVal['paddingTop'] + 'px';
			// var paddingRight = thisObj._currentVal['paddingRight'] + 'px';
			// var paddingBottom = thisObj._currentVal['paddingBottom'] + 'px';
			// var paddingLeft = thisObj._currentVal['paddingLeft'] + 'px';

			// targetElem
			// 	.css(
			// 		{
			// 			marginTop		: marginTop,
			// 			marginRight		: thisObj._currentVal['isMarginCentering'] === true ? 'auto' : marginRight,
			// 			marginBottom	: marginBottom,
			// 			marginLeft		: thisObj._currentVal['isMarginCentering'] === true ? 'auto' : marginLeft
			// 		 }
			// 	)
			// 	.find('> div')
			// 		.css(
			// 			{
			// 				paddingTop		: paddingTop,
			// 				paddingRight	: paddingRight,
			// 				paddingBottom	: paddingBottom,
			// 				paddingLeft		: paddingLeft
			// 			}
			// 		)
			
			
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId, isEnforcement);
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId);
			// $(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType]);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				console.log('Spaceデータ保存');
				thisObj._hasSaveData = false;
				// thisObj._dataManager.updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * マージン/パディングスライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"marginTop"、"marginBottom"、"marginLeft"、"marginRight"、"paddingTop"、"paddingBottom"、"paddingLeft"、"paddingRight"
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			var thisObj = this;
			var val = ui.value;
		//	thisObj._elems['propertyElement'].find("." + type + 'Wrapper input[type="text"]').val(val);
			thisObj._currentVal[type] = val;
			
			switch (type) {
				case 'marginTop':
				case 'marginBottom':
				case 'marginLeft':
				case 'marginRight':
					if (thisObj._currentVal['isMarginLinkage'] === true) {
						thisObj._currentVal['marginTop'] = thisObj._currentVal['marginBottom'] = thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginRight'] = val;
					}
					break;
					
				case 'paddingTop':
				case 'paddingBottom':
				case 'paddingLeft':
				case 'paddingRight':
					if (thisObj._currentVal['isPaddingLinkage'] === true) {
						thisObj._currentVal['paddingTop'] = thisObj._currentVal['paddingBottom'] = thisObj._currentVal['paddingLeft'] = thisObj._currentVal['paddingRight'] = val;
					}
					break;
			}
			
			if (thisObj._currentVal['isMarginCentering'] === true) {
				thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginRight'] = 'auto';
			}
			
			thisObj._eventArr.unshift(event.type);
			// console.log('	thisObj._eventArr[0] = ' + thisObj._eventArr[0]);
			// console.log('	thisObj._eventArr[1] = ' + thisObj._eventArr[1]);
			// console.log('	thisObj._eventArr.length = ' + thisObj._eventArr.length);
			if (2 < thisObj._eventArr.length) {
				thisObj._eventArr.pop();
			}
			thisObj._hasSaveData = thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false;
			// console.log('	thisObj._eventArr[0] = ' + thisObj._eventArr[0]);
			// console.log('	thisObj._eventArr[1] = ' + thisObj._eventArr[1]);
			// console.log('-----------------------------------');
			// if (thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidechange' && thisObj._isChangeSlideOnProgram === false) {
			// // if (thisObj._prevEvent === 'slide' && event.type === 'slidechange') {
			// 	thisObj.refreshStyle(true);
			// }
			// console.log('	thisObj._isChangeSlideOnProgram = ' + thisObj._isChangeSlideOnProgram);
			if (thisObj._isChangeSlideOnProgram === false) {
				thisObj.refreshStyle(thisObj._hasSaveData);
				// thisObj.refreshStyle(thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false);
			}
			thisObj._isChangeSlideOnProgram = false;
		}
		
		/*
		 * 画像パス/画像の幅/画像の高さの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type
		 * @return	void
		 */
		// ,onChangeText: function(event, isSave) {
		,onChangeText: function(event, type) {
		//	console.log('onChangeText :: type = ' + type);
			var thisObj = this;
		//	var elem = $("input[data-item-name='" + type + "']");
			var elem = $(event.currentTarget);
			// var type = elem.attr('data-item-name');
			var val = elem.val() - 0;
			var min = elem.attr('data-min') - 0;
			var max = elem.attr('data-max') - 0;
			
			if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
			//	thisObj._instances['slider'][type + 'Slider'].slider('value', val);
				thisObj._currentVal[type] = val;
				
				if (
					(type === 'marginTop' || type === 'marginBottom' || type === 'marginLeft' || type === 'marginRight') && thisObj._currentVal['isMarginLinkage'] === true
				) {
					thisObj._currentVal['marginTop'] = thisObj._currentVal['marginBottom'] = val;
					if (thisObj._currentVal['isMarginCentering']!== true) {
						thisObj._currentVal['marginLeft'] = thisObj._currentVal['marginRight'] = val;
					}
				} else if (
					(type === 'paddingTop' || type === 'paddingBottom' || type === 'paddingLeft' || type === 'paddingRight') && thisObj._currentVal['isPaddingLinkage'] === true
				) {
					thisObj._currentVal['paddingTop'] = thisObj._currentVal['paddingBottom'] = thisObj._currentVal['paddingLeft'] = thisObj._currentVal['paddingRight'] = val;
				}

				thisObj._hasSaveData = true;
				thisObj.refreshStyle();

				if (thisObj._timers[type]) {
					clearTimeout(thisObj._timers[type]);
				}
				thisObj._timers[type] = setTimeout(
					function(event) {
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					},
					3000
				);
				// thisObj.refreshStyle(true);
			}
			// if (isSave === true) {
			// 	thisObj.refreshStyle(isSave);
			// }

			
			/*
			var val = thisObj._elems[type + 'Input'].val();
			if (thisObj._currentVal[type] !== val) {
				thisObj._currentVal[type] = val;
				thisObj.refreshStyle();
			}
			*/
		}
		
		/*
		 * このクラスで管理するエレメントのイベント定義メソッド
		 * @param	void
		 * @return	void
		 */
		// ,attachEvent: function() {
		// 	var thisObj = this;
		// }
		
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
					.find('input[type="text"]')
						.on('change', function(event) {
							// thisObj.onChangeText(event, $(this).attr('data-item-name'));
							thisObj.onChangeText(event, $(this).attr('name'));
							// thisObj.onChangeText(event, false);
						})
						.on('focus', function(event) {
							var elem = $(this);
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							// thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, elem.attr('data-item-name'));}, 100);
							thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, elem.attr('data-item-name'));}, 100);
							// thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, false);}, 100);
						})
						.on('blur', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							// thisObj.onChangeText(event, true);
							// var elem = $(this);
							// var keyName = elem.attr('data-item-name');
							// var val = elem.val() - 0;
							// var min = elem.attr('data-min') - 0;
							// var max = elem.attr('data-max') - 0;
							// if (!val || min <= val || val <= max) {
							// 	elem.val(thisObj._currentVal[keyName]);
							// }
							if (thisObj._hasSaveData === true) {
								thisObj.refreshStyle(true);
							}
						})
					.end()
					.find('[data-toggle="buttons-checkbox"] button')
						.on('click', function(event) {
							var key = $(this).attr('data-item-name');
							thisObj._currentVal[key] = !thisObj._currentVal[key];
							thisObj.refreshStyle(true);
						});

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find('input[type="text"]')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.find('[data-toggle="buttons-checkbox"] button')
						.off('click');
			}
		}
	}
});
