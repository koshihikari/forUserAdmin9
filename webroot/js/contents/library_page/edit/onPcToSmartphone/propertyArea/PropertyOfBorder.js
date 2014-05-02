

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示するボーダープロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfBorder');
	MYNAMESPACE.modules.PropertyOfBorder = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfBorder.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_hasSaveData					: false
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_targetId						: null
		,_timers						: {}
		,_timerId						: null
		,_elems							: {}
		,_currentVal					: {}
		,tooltipMessages				: {
			'isLeft'					: ['表示する内容を左揃えにします。'],
			'isCenter'					: ['表示する内容を中央に配置します。'],
			'isRight'					: ['表示する内容を右揃えにします']
		}

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
				,'onChangeSlider'
				,'onChangeText'
				,'onClickRadioButtonHandler'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'Border';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};

			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'borderWidthInput'		: propertyElement.find(".borderWidthWrapper input[type='text']"),
				'borderRadiusInput'		: propertyElement.find(".borderRadiusWrapper input[type='text']")
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
			var targetElem					= $("#" + id);
			var prop = {
				// 'borderWidth'		: {
				// 	'min'			: 0,
				// 	'max'			: 10
				// },
				'borderTopWidth'		: {
					'min'			: 0,
					'max'			: 10
				},
				'borderRightWidth'		: {
					'min'			: 0,
					'max'			: 10
				},
				'borderBottomWidth'		: {
					'min'			: 0,
					'max'			: 10
				},
				'borderLeftWidth'		: {
					'min'			: 0,
					'max'			: 10
				},
				'borderTopLeftRadius'	: {
					'min'			: 0,
					'max'			: 30
				},
				'borderTopRightRadius'	: {
					'min'			: 0,
					'max'			: 30
				},
				'borderBottomRightRadius'	: {
					'min'			: 0,
					'max'			: 30
				},
				'borderBottomLeftRadius'	: {
					'min'			: 0,
					'max'			: 30
				}
			}
			var source = '\
						<div class="propertyElement forBorderElement">\
							<p class="elementTitle">境界線</p>\
							<div class="contentWrapper">\
								<div class="control-group borderColorWrapper">\
									<label class="control-label">境界線の色</label>\
									<div class="controls colorPicker">\
										<div>\
											<input id="' + id + '-borderColor" class="color-input colorCodeInput" value="' + thisObj._currentVal['borderColor'] + '" type="text" />\
										</div>\
									</div>\
								</div>\
								<div class="dropdown">\
									<div class="btn-hole">\
										<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span><i data-icon=""></i>境界線のスタイル</span></button>\
										<div class="dropdown-menu" role="menu" aria-labelledby="dLabel" data-toggle="buttons-radio">\
											<button class="btn btn-primary btn-primary solid' + (thisObj._currentVal['borderStyle'] === 'solid' ? ' active' : '') + '" data-item-name="solid"><span><i data-icon=""></i>1本線</span></button>\
											<button class="btn btn-primary btn-primary double' + (thisObj._currentVal['borderStyle'] === 'double' ? ' active' : '') + '" data-item-name="double"><span><i data-icon=""></i>2本線</span></button>\
											<button class="btn btn-primary btn-primary dashed' + (thisObj._currentVal['borderStyle'] === 'dashed' ? ' active' : '') + '" data-item-name="dashed"><span><i data-icon=""></i>破線</span></button>\
											<button class="btn btn-primary btn-primary dotted' + (thisObj._currentVal['borderStyle'] === 'dotted' ? ' active' : '') + '" data-item-name="dotted"><span><i data-icon=""></i>点線</span></button>\
											<button class="btn btn-primary btn-primary groove' + (thisObj._currentVal['borderStyle'] === 'groove' ? ' active' : '') + '" data-item-name="groove"><span><i data-icon=""></i>立体的に窪んだ線</span></button>\
											<button class="btn btn-primary btn-primary ridge' + (thisObj._currentVal['borderStyle'] === 'ridge' ? ' active' : '') + '" data-item-name="ridge"><span><i data-icon=""></i>立体的に隆起した線</span></button>\
											<button class="btn btn-primary btn-primary inset' + (thisObj._currentVal['borderStyle'] === 'inset' ? ' active' : '') + '" data-item-name="inset"><span><i data-icon=""></i>領域全体を立体的に窪ませる</span></button>\
											<button class="btn btn-primary btn-primary outset' + (thisObj._currentVal['borderStyle'] === 'outset' ? ' active' : '') + '" data-item-name="outset"><span><i data-icon=""></i>領域全体を立体的に隆起させる</span></button>\
										</div>\
									</div>\
								</div>\
								<div class="control-group borderWidthWrapper">\
									<label class="control-label">境界線の太さ</label>\
									<div class="controls">\
										<div class="box borderTopWidthWrapper">\
											<span class="key">上</span>\
											<div class="sliderWrapper">\
												<div class="slider borderTopWidthSlider"></div>\
											</div>\
											<input type="text" name="borderTopWidth" value="' + thisObj._currentVal['borderTopWidth'] + '" data-min="' + prop['borderTopWidth']['min'] + '" data-max="' + prop['borderTopWidth']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderRightWidthWrapper">\
											<span class="key">右</span>\
											<div class="sliderWrapper">\
												<div class="slider borderRightWidthSlider"></div>\
											</div>\
											<input type="text" name="borderRightWidth" value="' + thisObj._currentVal['borderRightWidth'] + '" data-min="' + prop['borderRightWidth']['min'] + '" data-max="' + prop['borderRightWidth']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderBottomWidthWrapper">\
											<span class="key">下</span>\
											<div class="sliderWrapper">\
												<div class="slider borderBottomWidthSlider"></div>\
											</div>\
											<input type="text" name="borderBottomWidth" value="' + thisObj._currentVal['borderBottomWidth'] + '" data-min="' + prop['borderBottomWidth']['min'] + '" data-max="' + prop['borderBottomWidth']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderLeftWidthWrapper">\
											<span class="key">左</span>\
											<div class="sliderWrapper">\
												<div class="slider borderLeftWidthSlider"></div>\
											</div>\
											<input type="text" name="borderLeftWidth" value="' + thisObj._currentVal['borderLeftWidth'] + '" data-min="' + prop['borderLeftWidth']['min'] + '" data-max="' + prop['borderLeftWidth']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-checkbox">\
												<button type="button" class="btn btn-primary borderWidthLinkageBtn' + (thisObj._currentVal['isBorderWidthLinkage'] === true ? ' active' : '') + '" data-item-name="isBorderWidthLinkage" data-placement="bottom" data-original-title="全ての境界線の太さを連動させ、値を同じにします。"><span><i data-icon=""></i>境界線の太さを連動させる</span></button>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="control-group borderRadiusWrapper">\
									<label class="control-label">境界線の角丸</label>\
									<div class="controls">\
										<div class="box borderTopLeftRadiusWrapper">\
											<span class="key">左上</span>\
											<div class="sliderWrapper">\
												<div class="slider borderTopLeftRadiusSlider"></div>\
											</div>\
											<input type="text" name="borderTopLeftRadius" value="' + thisObj._currentVal['borderTopLeftRadius'] + '" data-min="' + prop['borderTopLeftRadius']['min'] + '" data-max="' + prop['borderTopLeftRadius']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderTopRightRadiusWrapper">\
											<span class="key">右上</span>\
											<div class="sliderWrapper">\
												<div class="slider borderTopRightRadiusSlider"></div>\
											</div>\
											<input type="text" name="borderTopRightRadius" value="' + thisObj._currentVal['borderTopRightRadius'] + '" data-min="' + prop['borderTopRightRadius']['min'] + '" data-max="' + prop['borderTopRightRadius']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderBottomRightRadiusWrapper">\
											<span class="key">右下</span>\
											<div class="sliderWrapper">\
												<div class="slider borderBottomRightRadiusSlider"></div>\
											</div>\
											<input type="text" name="borderBottomRightRadius" value="' + thisObj._currentVal['borderBottomRightRadius'] + '" data-min="' + prop['borderBottomRightRadius']['min'] + '" data-max="' + prop['borderBottomRightRadius']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box borderBottomLeftRadiusWrapper">\
											<span class="key">左下</span>\
											<div class="sliderWrapper">\
												<div class="slider borderBottomLeftRadiusSlider"></div>\
											</div>\
											<input type="text" name="borderBottomLeftRadius" value="' + thisObj._currentVal['borderBottomLeftRadius'] + '" data-min="' + prop['borderBottomLeftRadius']['min'] + '" data-max="' + prop['borderBottomLeftRadius']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-checkbox">\
												<button type="button" class="btn btn-primary borderLinkageBtn' + (thisObj._currentVal['isBorderRadiusLinkage'] === true ? ' active' : '') + '" data-item-name="isBorderRadiusLinkage" data-placement="bottom" data-original-title="全ての角丸を連動させ、値を同じにします。"><span><i data-icon=""></i>角丸を連動させる</span></button>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);

			elem
				// .find(".borderWidthWrapper .slider")
				// 	.slider(
				// 		{
				// 			range	: 'min',
				// 			min		: prop['borderWidth']['min'],
				// 			max		: prop['borderWidth']['max'],
				// 			value	: thisObj._currentVal['borderWidth'],
				// 			slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderWidth');},
				// 			stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderWidth');}
				// 		}
				// 	)
				// .end()
				.find(".borderTopWidthWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderTopWidth']['min'],
							max		: prop['borderTopWidth']['max'],
							value	: thisObj._currentVal['borderWidth'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopWidth');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopWidth');}
						}
					)
				.end()
				.find(".borderRightWidthWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderRightWidth']['min'],
							max		: prop['borderRightWidth']['max'],
							value	: thisObj._currentVal['borderRightWidth'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderRightWidth');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderRightWidth');}
						}
					)
				.end()
				.find(".borderBottomWidthWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderBottomWidth']['min'],
							max		: prop['borderBottomWidth']['max'],
							value	: thisObj._currentVal['borderBottomWidth'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomWidth');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomWidth');}
						}
					)
				.end()
				.find(".borderLeftWidthWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderLeftWidth']['min'],
							max		: prop['borderLeftWidth']['max'],
							value	: thisObj._currentVal['borderLeftWidth'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderLeftWidth');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderLeftWidth');}
						}
					)
				.end()
				.find(".borderTopLeftRadiusSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderTopLeftRadius']['min'],
							max		: prop['borderTopLeftRadius']['max'],
							value	: thisObj._currentVal['borderTopLeftRadius'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopLeftRadius');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopLeftRadius');}
						}
					)
				.end()
				.find(".borderTopRightRadiusSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderTopRightRadius']['min'],
							max		: prop['borderTopRightRadius']['max'],
							value	: thisObj._currentVal['borderTopRightRadius'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopRightRadius');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderTopRightRadius');}
						}
					)
				.end()
				.find(".borderBottomRightRadiusSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderBottomRightRadius']['min'],
							max		: prop['borderBottomRightRadius']['max'],
							value	: thisObj._currentVal['borderBottomRightRadius'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomRightRadius');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomRightRadius');}
						}
					)
				.end()
				.find(".borderBottomLeftRadiusSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['borderBottomLeftRadius']['min'],
							max		: prop['borderBottomLeftRadius']['max'],
							value	: thisObj._currentVal['borderBottomLeftRadius'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomLeftRadius');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'borderBottomLeftRadius');}
						}
					);

			setTimeout(
				function() {
					ProColor.prototype.attachButton(
						id + '-borderColor',
						{
							imgPath			: '../../../plugin/procolor-1.0/img/procolor_win_',
							showInField		: true,
							onChanged		: function(elem, type) {
								thisObj.onChangeColor();
							}
						}
					);
					$(".colorPicker > div > a", thisObj._elems['propertyElement']).css(
						{
							'vertical-align': 'top'
						}
					);
				},
				1
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
			var selectors = [
				// 'borderWidth',
				'borderTopWidth',
				'borderRightWidth',
				'borderBottomWidth',
				'borderLeftWidth',
				'borderTopLeftRadius',
				'borderTopRightRadius',
				'borderBottomRightRadius',
				'borderBottomLeftRadius'
			];
			for (var i=0,len=selectors.length; i<len; i++) {
				thisObj._isChangeSlideOnProgram = true;
				var val = thisObj._currentVal[selectors[i]];
				thisObj._elems['propertyElement']
					.find('.' + selectors[i] + 'Wrapper')
						.find('.slider')
							.slider('value', val)
						.end()
						.find('input[type="text"]')
							.val(val);
			}

			// console.log('aaaaaaaaaaaaaaaaaaa');
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				console.log('ボーダーデータ保存');
				thisObj._hasSaveData = false;
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * ボーダーカラーが変わった時にコールされるメソッド
		 * @param	void
		 * @return	void
		 */
		,onChangeColor: function() {
			var thisObj = this;
			var colorCode = $('#' + thisObj._targetId + '-borderColor').val();
			if (thisObj._currentVal['borderColor'] !== colorCode) {
				thisObj._currentVal['borderColor'] = colorCode;
				thisObj._hasSaveData = true;
				thisObj.refreshStyle(true);
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
			thisObj._currentVal[type] = val;

			console.log('type = ' + type);
			if (type.indexOf('Width') !== -1 && thisObj._currentVal['isBorderWidthLinkage'] === true) {
				console.log('太さ');
				thisObj._currentVal['borderTopWidth'] = thisObj._currentVal['borderRightWidth'] = thisObj._currentVal['borderBottomWidth'] = thisObj._currentVal['borderLeftWidth'] = val;
			} else if (type.indexOf('Radius') !== -1 && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
			// if (type !== 'borderWidth' && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
				console.log('角丸');
				thisObj._currentVal['borderTopLeftRadius'] = thisObj._currentVal['borderTopRightRadius'] = thisObj._currentVal['borderBottomRightRadius'] = thisObj._currentVal['borderBottomLeftRadius'] = val;
			}

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
		 * 境界線の太さ/境界線の角丸の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"borderWidth"===境界線の太さの値が変わった。"borderRadius"===境界線の角丸の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event, type) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var val = elem.val() - 0;
			var min = elem.attr('data-min') - 0;
			var max = elem.attr('data-max') - 0;
			if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
				thisObj._currentVal[type] = val;
				if (type.indexOf('Width') !== -1 && thisObj._currentVal['isBorderWidthLinkage'] === true) {
					thisObj._currentVal['borderTopWidth'] = thisObj._currentVal['borderRightWidth'] = thisObj._currentVal['borderBottomWidth'] = thisObj._currentVal['borderLeftWidth'] = val;
				} else if (type.indexOf('Radius') !== -1 && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
				// if (type !== 'borderWidth' && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
					thisObj._currentVal['borderTopLeftRadius'] = thisObj._currentVal['borderTopRightRadius'] = thisObj._currentVal['borderBottomRightRadius'] = thisObj._currentVal['borderBottomLeftRadius'] = val;
				}
				thisObj._hasSaveData = true;
				thisObj.refreshStyle();

				/*
				if (type.indexOf('Width') !== -1 && thisObj._currentVal['isBorderWidthLinkage'] === true) {
					thisObj._currentVal['borderTopWidth'] = thisObj._currentVal['borderRightWidth'] = thisObj._currentVal['borderBottomWidth'] = thisObj._currentVal['borderLeftWidth'] = val;
				} else if (type.indexOf('Radius') !== -1 && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
				// if (type !== 'borderWidth' && thisObj._currentVal['isBorderRadiusLinkage'] === true) {
					thisObj._currentVal['borderTopLeftRadius'] = thisObj._currentVal['borderTopRightRadius'] = thisObj._currentVal['borderBottomRightRadius'] = thisObj._currentVal['borderBottomLeftRadius'] = val;
				}
				*/

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
		}

		/*
		 * ボーダースタイルのラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButtonHandler: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			thisObj._currentVal['borderStyle'] = elem.attr('data-item-name');
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
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				thisObj._elems['propertyElement']
					// .end()
					// .find('div[data-toggle="buttons-radio"] > .btn')
					// 	.on('click', function(event) {
						.on('click', 'div[data-toggle="buttons-radio"] > .btn', function(event) {
							thisObj.onClickRadioButtonHandler(event);
						})
					// .end()
					// .find('.borderLinkageBtn')
					// 	.on('click', function(event) {
						.on('click', '.borderWidthLinkageBtn', function(event) {
							thisObj._currentVal['isBorderWidthLinkage'] = !thisObj._currentVal['isBorderWidthLinkage'];
							thisObj.refreshStyle(true);
						})
						.on('click', '.borderLinkageBtn', function(event) {
							thisObj._currentVal['isBorderRadiusLinkage'] = !thisObj._currentVal['isBorderRadiusLinkage'];
							thisObj.refreshStyle(true);
						})

					.find('#borderColor')
						.on('change', function(event) {
							thisObj.onChangeColor();
						})
						.on('focus', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							thisObj._timerId = setInterval(function(event) {thisObj.onChangeColor();}, 100);
						})
						.on('blur', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							if (thisObj._hasSaveData === true) {
								thisObj.refreshStyle(true);
							}
						})

				// ボーダーの太さ/角丸のテキスト入力欄のイベントを有効にする
				var selectors = [
					'.borderWidthWrapper',
					'.borderRadiusWrapper'
				];
				for (var i=0,len=selectors.length; i<len; i++) {
					var val = thisObj._currentVal[selectors[i]];
					thisObj._elems['propertyElement']
						.find(selectors[i] + ' input[type="text"]')
							.on('change', function(event) {
								thisObj.onChangeText(event, $(this).attr('name'));
							})
							.on('focus', function(event) {
								var elem = $(this);
								if (thisObj._timerId) {
									clearInterval(thisObj._timerId);
								}
								thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, elem.attr('name'));}, 100);
							})
							.on('blur', function(event) {
								if (thisObj._timerId) {
									clearInterval(thisObj._timerId);
								}
								if (thisObj._hasSaveData === true) {
									thisObj.refreshStyle(true);
								}
							});
				}


			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find('#borderColor')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.find('div[data-toggle="buttons-radio"] > .btn')
						.off('click')
					.end()
					.find('.borderLinkageBtn')
						.off('click')

				// ボーダーの太さ/角丸のテキスト入力欄のイベントを有効にする
				var selectors = [
					'.borderWidthWrapper',
					'.borderRadiusWrapper'
				];
				for (var i=0,len=selectors.length; i<len; i++) {
					var val = thisObj._currentVal[selectors[i]];
					thisObj._elems['propertyElement']
						.find(selectors[i] + ' input[type="text"]')
							.off('change')
							.off('focus')
							.off('blur');
				}
			}
		}
	}
});
