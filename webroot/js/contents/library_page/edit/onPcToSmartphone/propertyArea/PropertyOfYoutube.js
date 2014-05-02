

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * プロパティエリアに表示するYouTubeプロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfYoutube');
	MYNAMESPACE.modules.PropertyOfYoutube = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfYoutube.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_targetId						: null
		// ,_methodObj						: {}
		,_currentVal					: {}
		,_timerId						: null
		,_elems							: {}
		
		,_instances						: {}
	//	,_elem							: null
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
			
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeText', 'setEvent');
			// _.bindAll(this, 'setInitData', 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeText', 'setEvent');
			// this._dataManager = dataManager;
			this._targetId = id;
			// this._methodObj = methodObj;
			this._elementType = 'Youtube';
			this._instances = instances;
			// var elementData = this._instances['DataManager'].getElementData('element_id', this._targetId);
			// this._currentVal = elementData['property'][this._elementType] || {};
			// var elementProperty = this._instances['DataManager'].getElementProperty(this._targetId);
			// this._currentVal = elementProperty['property'][this._elementType] || {};
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			// this._currentVal = this.setInitData(this._targetId, this._instances['DataManager'], this._elementType);
			
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
				'url'					: ''
			}
			/*
			if (isCommonElement === true && libraryProp) {
				retObj = {
					'url'				: libraryProp['url'] ? libraryProp['url'] : defaultProp['url']
				}
				if (isEditable === true && individualProp) {
					retObj = {
						'url'				: individualProp['url'] ? individualProp['url'] : retObj['url']
					}
				}
			} else if (individualProp) {
				retObj = {
					'url'				: individualProp['url'] ? individualProp['url'] : defaultProp['url']
				}
			} else {
				retObj = defaultProp;
			}
			*/
			if (elementProp) {
				retObj = {
					'url'				: elementProp['url'] ? elementProp['url'] : defaultProp['url']
				}
			} else {
				retObj = defaultProp;
			}
			/*
			var retObj = {
				'url'				: dataObj['url'] ? dataObj['url'] : ''
			}
			*/

			// console.log('-------------------');
			// console.log('PropertyOfYoutube :: setInitData :: bigin');
			// console.log('isCommonElement = ' + isCommonElement);
			// console.log('isEditable = ' + isEditable);
			// console.log('libraryProp');
			// console.log(libraryProp);
			// console.log('individualProp');
			// console.log(individualProp);
			// console.log('retObj');
			// console.log(retObj);
			// console.log('PropertyOfYoutube :: setInitData :: end');
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
			var thisObj		= this;
		// 	var targetElem = $("#" + thisObj._targetId);
		// //	var url			= '';
		// 	var url			= targetElem.attr('data-youtube-url') ? targetElem.attr('data-youtube-url') : '';
			
		// 	thisObj._currentVal = {
		// 		'url'		: url
		// 	}
			
			var source = '\
						<div class="propertyElement forMapElement">\
							<p class="elementTitle">YouTube</p>\
							<div class="contentWrapper">\
								<div class="control-group urlWrapper">\
									<label class="control-label">YouTube動画のURL</label>\
									<div class="controls">\
										<input type="text" value="' + thisObj._currentVal['url'] + '"/>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			return $(source);
		}
		
		/*
		,onCheckHandler: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var checked = elem.hasClass('active') ? false : true;
			console.log('チェックボックスの値が変わった :: checked = ' + checked);
			elem.attr('data-original-title', thisObj.tooltipMessages[itemName][(checked === true ? 1 : 0)]);
		}
		*/
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			
			/*
			if (thisObj._currentVal['url'] !== '') {
				// console.log('差し替え');
				// console.log('url = ' + thisObj._currentVal['url']);
				if (thisObj._currentVal['url'].indexOf('http://www.youtube.com/') === -1) {
					targetElem.attr('data-youtube-url', '').find('.youtube > *').remove().end().addClass('empty');
				} else {
					var url = thisObj._currentVal['url'].replace('/watch?v=', '/embed/');
					var split = thisObj._currentVal['url'].split('?');
					if (split.length === 2) {
					var split2 = split[1].split('&');
					for (var key in split2) {
						var split3 = split2[key].split('=');
						if (split3[0] === 'v') {
							url = split3[1];
							break;
						}
					}
					var src = '<iframe dmle_widget="dudaYouTubeId" class="youtubeExt dmNoMark" src="http://www.youtube.com/embed/' + url + '?html5=1&amp;wmode=Opaque" frameborder="0" allowfullscreen="" id="1510038864" duda_id="1510038864" dmle_insert="true"></iframe>';
				//	var src = '<iframe dmle_widget="dudaYouTubeId" class="youtubeExt dmNoMark" src="http://www.youtube.com/embed/CjMsY5sMI0M?html5=1&amp;wmode=Opaque" frameborder="0" allowfullscreen="" id="1510038864" duda_id="1510038864" dmle_insert="true"></iframe>';
					// console.log('url = ' + url);
					// console.log('src = ' + src);
					targetElem.attr('data-youtube-url', thisObj._currentVal['url']).find('.youtube > *').remove().end().removeClass('empty').find('.youtube').append(src);
					// targetElem.find('.youtube > *').remove().end().removeClass('empty').find('.youtube').append(src);
				//	targetElem.find('iframe').remove().end().removeClass('empty').find('.youtube').append(src);
					}
				}
			}
			
			targetElem
				.find('iframe')
					.css(
						{
							'width'			: '100%',
							'height'		: Math.round(targetElem.width() * 180 / 320) + 30
						}
					);
					*/
					
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId, isEnforcement);
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId);
			
			// $(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType]);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('Youtubeデータ保存');
				// thisObj._dataManager.updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeText: function(event) {
			var thisObj = this;
		//	var val = thisObj._elem.find('.urlWrapper input[type="text"]').val();
			// var val = thisObj._elems['propertyElement'].find('.urlWrapper input[type="text"]').val();
			var val = $(event.currentTarget).val();
			
			if (thisObj._currentVal['url'] !== val) {
				/*
				var targetElem = $("#" + thisObj._targetId);
				if (val !== "") {
					$("#" + thisObj._targetId).removeClass("empty");
				} else {
					targetElem.addClass("empty");
				}
				*/
				thisObj._currentVal['url'] = val;
				thisObj.refreshStyle(true);
			}
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
					.find(".urlWrapper")
						.on('change', 'input[type="text"]', function(event) {
							thisObj.onChangeText(event);
						})
						.on('focus', 'input[type="text"]', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
						})
						.on('blur', 'input[type="text"]', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
						});
				
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				
				thisObj._elems['propertyElement']
					.find(".urlWrapper")
						.off('change')
						.off('focus')
						.off('blur');
			}
		}
	}
});
