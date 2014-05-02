

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する物件概要プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfAbout');
	MYNAMESPACE.modules.PropertyOfAbout = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfAbout.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_targetId						: null
		,_hasSaveData					: false
		,_currentVal					: {}
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_timers						: {}
		,_timerId						: null
		,_instances						: {}
		,_elems							: {}
		
		/*
		 * コンストラクタ
		 * @param	dataManager 	データ管理クラスのインスタンス
		 * @param	id 				プロパティを表示するエレメントのID
		 * @param	methodObj 		メソッド保持オブジェクト
		 * @param	properties 		このクラスで管理するプロパティエレメントのプロパティオブジェクト
		 * @return	void
		 */
		,initialize: function(instances, id) {
			var thisObj = this;
			
			_.bindAll(
				this
				,'getElem'
				,'getProperty'
				,'createElement'
				,'refreshStyle'
				,'onChangeColor'
				,'onCheckHandler'
				,'onChangeSlider'
				,'onChangeText'
				,'onClickRadioButtonHandler'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'About';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'gradationShadeInput'	: propertyElement.find('input[name="gradationShade"]')
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
			var prop = {
				'gradationShade'		: {
					'min'			: 0,
					'max'			: 100
				}
			}
			var source = '\
						<div class="propertyElement forBgElement">\
							<p class="elementTitle">物件概要</p>\
							<div class="contentWrapper">\
								<div class="control-group bgColorWrapper">\
									物件概要の編集は、「物件情報修正」ページから行なって下さい。\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			return elem;
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			thisObj._isChangeSlideOnProgram = true;
			thisObj._elems['propertyElement']
				.find('.gradationShadeWrapper input[type="text"]')
					.val(thisObj._currentVal['gradationShade'])
				.end()
				.find('.gradationShadeSlider')
					.slider("value", thisObj._currentVal['gradationShade']);

			thisObj._elems['propertyElement']
				.find('[data-item-name="gradationDirection"] > button')
					.removeClass('active')
				.end()
				.find('[data-item-name="bgRepeat"]')
					.find('> button')
						.removeClass('active')
					.end()
					.find('> button.' + thisObj._currentVal['bgRepeat'])
						.addClass('active')

			if (thisObj._currentVal['isEnabledGradation'] === true) {
				thisObj._elems['propertyElement']
					.find('[data-item-name="gradationDirection"]')
						.find('.' + thisObj._currentVal['gradationDirection'])
							.addClass('active')
			}
				
			/*
			console.log('グラデ適用 :: gradientVal = ' + gradientVal);
			console.log('backgroundは' + imagePathElem.find('> div.contentWrapper').css('background'));
			console.log('----------------------------');
			console.log('');
			*/
			
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				// console.log('Bgデータ保存');
				thisObj._hasSaveData = false;
				// thisObj._dataManager.updateData(thisObj._imagePathId, thisObj._elementType, thisObj._currentVal);
				// thisObj._dataManager.updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * 背景色が変わった時にコールされるメソッド
		 * @param	void
		 * @return	void
		 */
		,onChangeColor: function() {
			var thisObj = this;
			var colorCode = $('#' + thisObj._targetId + '-bgColor').val();
			// var colorCode = $('#' + thisObj._imagePathId + '-bgColor').val();
			// console.log('PropertyOfBg :: onChangeColor');
			// console.log('	colorCode = ' + colorCode);
			// console.log('	bgColor = ' + thisObj._currentVal['bgColor']);
			if (thisObj._currentVal['bgColor'] !== colorCode) {
				thisObj._currentVal['bgColor'] = colorCode;
				thisObj._hasSaveData = true;
				// console.log('PropertyOfBg :: onChangeColor');
				thisObj.refreshStyle(true);
			}
		}
		
		/*
		 * グラデーションを有効にするの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onCheckHandler: function(event) {
			var thisObj = this;
			// var elem = $(event.currentimagePath);
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var checked = elem.hasClass('active') ? false : true;
			// console.log(elem);
			// console.log('チェックボックスの値が変わった :: itemName = ' + itemName + ', checked = ' + checked);
			elem.attr('data-original-title', thisObj.tooltipMessages[itemName][(checked === true ? 1 : 0)]);
			thisObj._currentVal[itemName] = checked;
			thisObj._hasSaveData = true;
		//	thisObj._currentVal['text'] = thisObj._elems['propertyElement'].find(".textInputWrapper textarea").val();
		//	console.log('elemType = ' + elemType);
			// console.log('PropertyOfBg :: onCheckHandler');
			thisObj.refreshStyle(true);
		}
		
		/*
		 * フォントサイズ/行間スライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"fontSize"===フォントサイズスライダーが動かされた。"lineHeight"===行間スライダーが動かされた。
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			var thisObj = this;
			var val = ui.value;
			thisObj._elems['propertyElement'].find("." + type + 'Wrapper input[type="text"]').val(val);
			thisObj._currentVal[type] = val;
		//	console.log('event.type = ' + event.type);
		//	$(thisObj).trigger('onChangeStyle');
		//	if (event.type === 'slidechange') {
				// thisObj.refreshStyle(true);
		//	}
			
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
				// console.log('PropertyOfBg :: onChangeSlider');
				thisObj.refreshStyle(thisObj._hasSaveData);
				// thisObj.refreshStyle(thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false);
			}
			thisObj._isChangeSlideOnProgram = false;
		}
		
		/*
		 * グラデーションの濃淡の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"gradationShade"===グラデーションの濃淡の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event, type) {
		//	console.log('onChangeText :: type = ' + type);
			
			var thisObj = this;
			var val = thisObj._elems[type + 'Input'].val();
			var min = thisObj._elems[type + 'Input'].attr('data-min') - 0;
			var max = thisObj._elems[type + 'Input'].attr('data-max') - 0;
			/*
			console.log('min = ' + min);
			console.log('max = ' + max);
			*/
			if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
				thisObj._currentVal[type] = val;
				thisObj._hasSaveData = true;
				thisObj.refreshStyle();

				if (thisObj._timers[type]) {
					clearTimeout(thisObj._timers[type]);
				}
				thisObj._timers[type] = setTimeout(
					function(event) {
						if (thisObj._hasSaveData === true) {
							// console.log('PropertyOfBg :: onChangeText');
							thisObj.refreshStyle(true);
						}
					},
					3000
				);
			}
		}
		
		/*
		 * グラデーションの方向の/背景画像の表示の仕方ラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButtonHandler: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			// console.log(elem);
			// console.log("elem.parent().attr('data-item-name') = " + (elem.parent().attr('data-item-name')));
			// console.log("elem.attr('data-type') = " + (elem.attr('data-type')));
			if (elem.parent().attr('data-item-name') === 'gradationDirection') {
				thisObj._currentVal['gradationDirection'] = elem.attr('data-type');
			} else if (elem.parent().attr('data-item-name') === 'bgRepeat') {
				thisObj._currentVal['bgRepeat'] = elem.attr('data-type');
			}
			
			// console.log('PropertyOfBg :: onClickRadioButtonHandler');
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}
		
		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var targetElem = $(thisObj._targetId);
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				
				// targetElem
				// 	.on('click', '.key', thisObj.onClickKeyColumn)
				// 	.on('click', '.val', thisObj.onClickValColumn);
				
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				
				// targetElem
				// 	.off('click', '.key')
				// 	.off('click', '.val');
			}
		}
	}
});
