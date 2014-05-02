

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * プロパティエリアに表示するテーブルプロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfTable');
	MYNAMESPACE.modules.PropertyOfTable = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfTable.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_currentVal					: {}
		,_baseVal						: {}
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		
		/*
		 * コンストラクタ
		 * @param	dataManager 	データ管理クラスのインスタンス
		 * @param	id 				プロパティを表示するエレメントのID
		 * @param	methodObj 		メソッド保持オブジェクト
		 * @param	properties 		このクラスで管理するプロパティエレメントのプロパティオブジェクト
		 * @return	void
		 */
		// ,initialize: function(instances, id, methodObj) {
		,initialize: function(instances, id) {
			var thisObj = this;

			_.bindAll(
				this
				,'getElem'
				,'getProperty'
				,'createElement'
				,'refreshStyle'
				,'onChangeSlider'
				,'onChangeInput'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'Table';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			this._baseVal = $.extend(true, {}, this._currentVal);
			
			var propertyElement = this.createElement(id, this._currentVal);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'rowInput'				: propertyElement.find(".rowWrapper input[type='text']"),
				'colInput'				: propertyElement.find(".colWrapper input[type='text']")
			}
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
			var targetElem			= $("#" + id);
			var prop = {
				'row'		: {
					'min'			: 1,
					'max'			: 30
				},
				'col'	: {
					'min'			: 1,
					'max'			: 20
				}
			}
			var source = '\
						<div class="propertyElement forTableElement">\
							<p class="elementTitle">表組み</p>\
							<div class="contentWrapper">\
								<div class="control-group rowWrapper">\
									<label class="control-label">行</label>\
									<div class="slider"></div>\
									<input type="text" value="' + thisObj._currentVal['row'] + '" data-min="' + prop['row']['min'] + '" data-max="' + prop['row']['max'] + '"/>行\
								</div>\
								<div class="control-group colWrapper">\
									<label class="control-label">列</label>\
									<div class="slider"></div>\
									<input type="text" value="' + thisObj._currentVal['col'] + '" data-min="' + prop['col']['min'] + '" data-max="' + prop['col']['max'] + '"/>列\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			elem
				.find(".rowWrapper .slider").slider(
					{
						range	: 'min',
						min		: prop['row']['min'],
						max		: prop['row']['max'],
						value	: thisObj._currentVal['row'],
						slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'row');},
						stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'row');}
					}
				)
				.end()
				.find(".colWrapper .slider").slider(
					{
						range	: 'min',
						min		: prop['col']['min'],
						max		: prop['col']['max'],
						value	: thisObj._currentVal['col'],
						slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'col');},
						stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'col');}
					}
				);
			thisObj._instances['slider'] = {
				'rowSlider'	: elem.find(".rowWrapper .slider"),
				'colSlider'	: elem.find(".colWrapper .slider")
			};
			return elem;
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var selector = ['row', 'col'];
			for (var i=0,len=selector.length; i<len; i++) {
				thisObj._isChangeSlideOnProgram = true;
				var wrapperElem = thisObj._elems['propertyElement'].find('.' + selector[i] + 'Wrapper');
				wrapperElem
					.find('.slider')
						.slider('value', thisObj._currentVal[selector[i]])
					.end()
					.find('input[data-item-name="' + selector[i] + '"]')
						.val(thisObj._currentVal[selector[i]]);
			}
			// var elementDataObj = thisObj._instances['DataManager'].getElementDataObj(thisObj._targetId);
			// console.log('PropertyOfTable :: refreshStyle :: isEnforcement = ' + isEnforcement);
			// console.log(elementDataObj);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 // console.log('Tableデータ保存');
				 // console.log(elementDataObj);
				 thisObj._instances['DataManager'].editTableElement(thisObj._targetId, $.extend(true, {}, thisObj._currentVal), thisObj._baseVal);
				 // thisObj._instances['DataManager'].editTableElement(thisObj._targetId, $.extend(true, {}, thisObj._currentVal), elementDataObj['property']['Table']);
				thisObj._baseVal = $.extend(true, {}, thisObj._currentVal);
				// thisObj._dataManager.updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
				// thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * 境界線の太さ/境界線の角丸スライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"borderWidth"===境界線の太さスライダーが動かされた。"borderRadius"===境界線の角丸スライダーが動かされた。
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			var thisObj = this;
			var val = ui.value;
			thisObj._elems['propertyElement'].find("." + type + 'Wrapper input[type="text"]').val(val);
			thisObj._currentVal[type] = val;
			// console.log('thisObj._currentVal[' + type + '] = ' + thisObj._currentVal[type]);

			thisObj._eventArr.unshift(event.type);
			if (2 < thisObj._eventArr.length) {
				thisObj._eventArr.pop();
			}
			if (thisObj._isChangeSlideOnProgram === false) {
				thisObj.refreshStyle(thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false);
			}
			thisObj._isChangeSlideOnProgram = false;
		}
		
		/*
		 * 境界線の太さ/境界線の角丸の値が変わった時にコールされるメソッド
		 * @param	type		"borderWidth"===境界線の太さの値が変わった。"borderRadius"===境界線の角丸の値が変わった。
		 * @return	void
		 */
		,onChangeInput: function(type) {
			var thisObj = this;
			var val = thisObj._elems[type + 'Input'].val() - 0;
			var min = thisObj._elems[type + 'Input'].attr('data-min') - 0;
			var max = thisObj._elems[type + 'Input'].attr('data-max') - 0;
			if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
				thisObj._instances['slider'][type + 'Slider'].slider('value', val);
				thisObj._currentVal[type] = val;
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

				thisObj._elems['rowInput']
					.on('change', function(event) {
						thisObj.onChangeInput('row');
					})
					.on('focus', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event) {thisObj.onChangeInput('row');}, 100);
					})
					.on('blur', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						var val = thisObj._elems['rowInput'].val() - 0;
						var min = thisObj._elems['rowInput'].attr('data-min') - 0;
						var max = thisObj._elems['rowInput'].attr('data-max') - 0;
						if (!val || min <= val || val <= max) {
							thisObj._instances['slider']['rowSlider'].slider('value', thisObj._currentVal['row']);
						}
					});
				
				thisObj._elems['colInput']
					.on('change', function(event) {
						thisObj.onChangeInput('col');
						return false;
					})
					.on('focus', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event) {thisObj.onChangeInput('col');}, 100);
					})
					.on('blur', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						var val = thisObj._elems['colInput'].val() - 0;
						var min = thisObj._elems['colInput'].attr('data-min') - 0;
						var max = thisObj._elems['colInput'].attr('data-max') - 0;
						if (!val || min <= val || val <= max) {
							thisObj._instances['slider']['colSlider'].slider('value', thisObj._currentVal['col']);
						}
					});
					
				for (var key in thisObj._instances['slider']) {
					thisObj._instances['slider'][key].slider('enable');
				}
				
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				
				thisObj._elems['rowInput']
					.off('change')
					.off('focus')
					.off('blur');
				
				thisObj._elems['colInput']
					.off('change')
					.off('focus')
					.off('blur');
					
				for (var key in thisObj._instances['slider']) {
					thisObj._instances['slider'][key].slider('disable');
				}
			}
		}
	}
});
