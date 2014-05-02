

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する配置プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfSize');
	MYNAMESPACE.modules.PropertyOfSize = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfSize.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_timers						: {}
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
		,initialize: function(instances, id) {
			var thisObj = this;
			
			_.bindAll(
				this
				,'getElem'
				,'getProperty'
				,'createElement'
				,'refreshStyle'
				,'onChangeSlider'
				,'switchActiveArea'
				,'onChangeText'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'Size';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement
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
				'percentWidth'		: {
					'min'			: 1,
					'max'			: 100
				},
				'pixelWidth'	: {
					'min'			: 1,
					'max'			: 500
				}
			}
			var source = '\
						<div class="propertyElement forSizeElement">\
							<p class="elementTitle">サイズ</p>\
							<div class="contentWrapper">\
								<div class="control-group sizeWrapper">\
									<div class="controls">\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn autoWidthBtn' + (thisObj._currentVal['widthType'] !== 'percent' && thisObj._currentVal['widthType'] !== 'pixel' ? ' active' : '') + '" data-item-name="autoWidthBtn" data-placement="bottom" data-original-title="幅を自動で設定します。"><span><i data-icon=""></i>幅を自動で指定</span></button>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn percentWidthBtn' + (thisObj._currentVal['widthType'] === 'percent' ? ' active' : '') + '" data-item-name="percentWidthBtn" data-placement="bottom" data-original-title="幅を％で指定します。"><span><i data-icon=""></i>幅を%で指定</span></button>\
											</div>\
											<div class="percentWidth">\
												<div class="box percentWidthWrapper">\
													<span class="key">幅(%)</span>\
													<div class="controls">\
														<div class="box">\
															<div class="sliderWrapper">\
																<div class="slider percentWidthSlider"></div>\
															</div>\
															<input type="text" data-item-name="percentWidth" value="' + thisObj._currentVal['percentWidth'] + '" data-min="' + prop['percentWidth']['min'] + '" data-max="' + prop['percentWidth']['max'] + '"/>\
															<span class="unit">%</span>\
														</div>\
													</div>\
												</div>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn pixelWidthBtn' + (thisObj._currentVal['widthType'] === 'pixel' ? ' active' : '') + '" data-item-name="pixelWidthBtn" data-placement="bottom" data-original-title="幅をピクセルで指定します。"><span><i data-icon=""></i>幅をピクセルで指定</span></button>\
											</div>\
											<div class="pixelWidth">\
												<div class="box pixelWidthWrapper">\
													<span class="key">幅(ピクセル)</span>\
													<div class="controls">\
														<div class="box">\
															<div class="sliderWrapper">\
																<div class="slider pixelWidthSlider"></div>\
															</div>\
															<input type="text" data-item-name="pixelWidth" value="' + thisObj._currentVal['pixelWidth'] + '" data-min="' + prop['pixelWidth']['min'] + '" data-max="' + prop['pixelWidth']['max'] + '"/>\
															<span class="unit">px</span>\
														</div>\
													</div>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			elem
				.find(".sizeWrapper")
					.find(".percentWidthSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['percentWidth']['min'],
								max		: prop['percentWidth']['max'],
								value	: thisObj._currentVal['percentWidth'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'percentWidth');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'percentWidth');}
							}
						)
					.end()
					.find(".pixelWidthSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['pixelWidth']['min'],
								max		: prop['pixelWidth']['max'],
								value	: thisObj._currentVal['pixelWidth'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'pixelWidth');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'pixelWidth');}
							}
						);
			// var passiveAreaName = thisObj._currentVal['isPercentWidth'] === true ? 'pixelWidth' : 'percentWidth';
			// elem.find('.' + passiveAreaName).css('display', 'none');
			var passiveAreaName = '';
			switch (thisObj._currentVal['widthType']) {
				case 'percent':
					passiveAreaName = '.autoWidth, .pixelWidth';
					break;
				case 'pixel':
					passiveAreaName = '.autoWidth, .percentWidth';
					break;
				default:
					passiveAreaName = '.percentWidth, .pixelWidth';
					break;
			}
			elem.find(passiveAreaName).css('display', 'none');
			
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
			// var width = thisObj._currentVal['isPercentWidth'] === true ? thisObj._currentVal['percentWidth'] + '%' : thisObj._currentVal['pixelWidth'];
			// var width = 0;
			// console.log('widthType = ' + thisObj._currentVal['widthType']);
			// switch (thisObj._currentVal['widthType']) {
			// 	case 'auto':
			// 		width = 'auto';
			// 		break;
			// 	case 'percent':
			// 		width = thisObj._currentVal['percentWidth'] + '%';
			// 		break;
			// 	case 'pixel':
			// 		width = thisObj._currentVal['pixelWidth'] + 'px';
			// 		break;
			// }
			// targetElem
			// 	.css(
			// 		{
			// 			'width'		: width
			// 		}
			// 	);
			
			var selector = ['percentWidth', 'pixelWidth'];
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

			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('Sizeデータ保存');
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * 幅スライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"percentWidth"===幅のパーセント指定スライダーが動かされた。"pixelWidth"===幅のピクセル指定スライダーが動かされた。
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			// slideさせた => 見た目は変える。ただし、保存はしない。
			// sliderが終了した => 見た目を変えて保存する。
			var thisObj = this;
			var val = ui.value;
			thisObj._currentVal[type] = val;
			thisObj._elems['propertyElement'].find("." + type + 'Wrapper input[type="text"]').val(val);
			
			thisObj._eventArr.unshift(event.type);
			if (2 < thisObj._eventArr.length) {
				thisObj._eventArr.pop();
			}
			thisObj._hasSaveData = thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false;

			if (thisObj._isChangeSlideOnProgram === false) {
				thisObj.refreshStyle(thisObj._hasSaveData);
			}
			thisObj._isChangeSlideOnProgram = false;
		}
		
		/*
		 * 画像サイズのピクセル/パーセント指定領域の切り替えメソッド
		 * @param	activeAreaName		pixel===ピクセル指定エリアをアクティブ。percent===パーセント指定エリアをアクティブ
		 * @return	void
		 */
		,switchActiveArea: function(event) {
			var thisObj = this;
			var element = $(event.currentTarget);
			var activeBtnClassName = element.attr('data-item-name');
			var activeAreaName, passiveAreaName, widthType;
			switch (activeBtnClassName) {
				case 'autoWidthBtn':
					widthType = 'auto';
					activeAreaName = '.autoWidth';
					passiveAreaName = '.percentWidth, .pixelWidth';
					break;
				case 'percentWidthBtn':
					widthType = 'percent';
					activeAreaName = '.percentWidth';
					passiveAreaName = '.autoWidth, .pixelWidth';
					break;
				case 'pixelWidthBtn':
					widthType = 'pixel';
					activeAreaName = '.pixelWidth';
					passiveAreaName = '.autoWidth, .percentWidth';
					break;
				default:
					return;
					break;
			}
			thisObj._currentVal['widthType'] = widthType;
			thisObj._hasSaveData = true;
			
			thisObj._elems['propertyElement']
				.find('.switchBtn')
					.removeClass('active')
				.end()
				.find('.' + activeBtnClassName)
					.addClass('active')
				.end()
				.find(passiveAreaName).slideUp()
				.end()
				.find(activeAreaName).slideDown();
			
			thisObj.refreshStyle(true);
		}
		// ,switchActiveArea: function(activeAreaName, elem) {
		// 	var thisObj = this;
		// 	var activeBtnClassName = activeAreaName === 'percentWidth' ? 'percentWidthBtn' : 'pixelWidthBtn';
		// 	var passiveAreaName = activeAreaName === 'percentWidth' ? 'pixelWidth' : 'percentWidth';
		// 	thisObj._currentVal['isPercentWidth'] = activeAreaName === 'percentWidth' ? true : false;
		// 	thisObj._hasSaveData = true;
			
		// 	thisObj._elems['propertyElement']
		// 		.find('.switchBtn')
		// 			.removeClass('active')
		// 		.end()
		// 		.find('.' + activeBtnClassName)
		// 			.addClass('active')
		// 		.end()
		// 		.find('.' + passiveAreaName).slideUp()
		// 		.end()
		// 		.find('.' + activeAreaName).slideDown();
			
		// 	thisObj.refreshStyle(true);
		// }
		
		/*
		 * フォントサイズ/行間の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"fontSize"===フォントサイズの値が変わった。"lineHeight"===行間の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event, type) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			
			thisObj._currentVal['isPercentWidth'] = type === 'percentWidth' ? true : false;
			// if (type === 'percentWidth') {
				var val = elem.val();
				if (thisObj._currentVal[type] !== val) {
					console.log('---------------------');
					console.log('onChangeText :: val = ' + val + ', type = ' + type);
					for (var key in thisObj._currentVal) {
						console.log('	thisObj._currentVal[' + key + '] = ' + thisObj._currentVal[key]);
					}
					console.log('---------------------');
					thisObj._currentVal[type] = val;
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
				}
				
			// } else {
			// 	var val = elem.val() - 0;
			// 	var min = elem.attr('data-min') - 0;
			// 	var max = elem.attr('data-max') - 0;
				
			// 	if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
			// 		thisObj._currentVal[type] = val;
			// 		thisObj._hasSaveData = true;
			// 		thisObj.refreshStyle();

			// 		if (thisObj._timers[type]) {
			// 			clearTimeout(thisObj._timers[type]);
			// 		}
			// 		thisObj._timers[type] = setTimeout(
			// 			function(event) {
			// 				if (thisObj._hasSaveData === true) {
			// 					thisObj.refreshStyle(true);
			// 				}
			// 			},
			// 			3000
			// 		);
			// 	}
			// }
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
					.on('change', 'input[type="text"]', function(event) {
						thisObj.onChangeText(event, $(this).attr('data-item-name'));
					})
					.on('focus', 'input[type="text"]', function(event) {
						var elem = $(this);
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, elem.attr('data-item-name'));}, 100);
					})
					.on('blur', 'input[type="text"]', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					})
					.on('click', '.switchBtn', thisObj.switchActiveArea)
					/*
					.on('click', '.switchBtn', function(event) {
						var activeAreaName = $(this).hasClass('percentWidthBtn') ? 'percentWidth' : 'pixelWidth';
						thisObj.switchActiveArea(activeAreaName);
					})
					*/
				
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find('div[data-toggle="buttons-radio"] > .btn')
						.off('click');
			}
			/*
			*/
		}
	}
});
