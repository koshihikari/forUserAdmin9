

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示するテキストプロパティ管理クラス
	 * eventName
	 */
	MYNAMESPACE.namespace('modules.PropertyOfIcon');
	MYNAMESPACE.modules.PropertyOfIcon = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfIcon.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_hasSaveData					: false
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_timers						: {}
		,_timerId						: null
		,_currentVal					: {}
		,tooltipMessages				: {
			'isEnabledHtml'					: ['「文言」に記述されているHTMLタグが無効になっています。', '「文言」に記述されているHTMLタグが有効になっています。'],
			'isEnabledBold'					: ['「文言」に記述されている文字を太字にします。', '「文言」に記述されている文字の太字を取り消します。'],
			'isEnabledItalic'				: ['「文言」に記述されている文字を斜体にします。<br />日本語の文字は斜体になりません。', '「文言」に記述されている文字の斜体を取り消します。'],
			'isEnabledUnderline'			: ['「文言」に記述されている文字に下線を引きます。', '「文言」に記述されている文字の下線を取り消します。']
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
				,'onChangeColor'
				,'onChangeSlider'
				,'onChangeText'
				,'onCheckHandler'
				,'onClickIconHandler'
				// ,'onChangeTextarea'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'Icon';
			this._instances = instances;
			this._instances['Util'] = new MYNAMESPACE.modules.helper.Util();
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'fontSizeInput'			: propertyElement.find(".fontSizeWrapper input[type='text']"),
				'lineHeightInput'		: propertyElement.find(".lineHeightWrapper input[type='text']"),
				'xShadowInput'			: propertyElement.find(".xShadowBox input[type='text']"),
				'yShadowInput'			: propertyElement.find(".yShadowBox input[type='text']"),
				'blurInput'				: propertyElement.find(".blurBox input[type='text']")
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
			var thisObj				= this;
			var elem				= $("#" + id);
			var prop = {
				'fontSize'		: {
					'min'			: 0.5,
					'max'			: 10
					// 'min'			: 9,
					// 'max'			: 30
				},
				'lineHeight'	: {
					'min'			: 1,
					'max'			: 10
					// 'min'			: 9,
					// 'max'			: 30
				},
				'textShadowX'	: {
					'min'			: -10,
					'max'			: 10
				},
				'textShadowY'	: {
					'min'			: -10,
					'max'			: 10
				},
				'textShadowBlur': {
					'min'			: 0,
					'max'			: 20
				}
			}
			var icons = thisObj._instances['DataManager'].getIconData();
			var source = '\
						<div class="propertyElement forIconElement">\
							<p class="elementTitle">アイコン</p>\
							<div class="contentWrapper">\
								<div class="iconSelectWrapper">\
									<ul>';
									var tmpTxt = '';
									for (var i=0,len=icons.length; i<len; i++) {
										tmpTxt += '<li class="btn btn-primary"><i data-icon="&' + icons[i] + '"></i></li>';
									}
			source = source + tmpTxt + '\
									</ul>\
								</div>\
								<div class="textBaseWrapper">\
									<div class="control-group colorWrapper">\
										<label class="control-label">文字色</label>\
										<div class="controls colorPicker">\
											<div>\
												<input id="' + id + '-color" data-item-name="color" class="color-input colorCodeInput" value="' + thisObj._currentVal['color'] + '" type="text" />\
											</div>\
											<div id="test"></div>\
										</div>\
									</div>\
									<div class="control-group fontSizeWrapper">\
										<label class="control-label">アイコンサイズ</label>\
										<div class="controls">\
											<div class="box">\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['fontSize'] + '" data-item-name="fontSize" data-min="' + prop['fontSize']['min'] + '" data-max="' + prop['fontSize']['max'] + '"/>\
												<span class="unit">rem</span>\
												<!--\
												<span class="unit">px</span>\
												-->\
											</div>\
										</div>\
									</div>\
									<div class="control-group lineHeightWrapper">\
										<label class="control-label">行間</label>\
										<div class="controls">\
											<div class="box">\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['lineHeight'] + '" data-item-name="lineHeight" data-min="' + prop['lineHeight']['min'] + '" data-max="' + prop['lineHeight']['max'] + '"/>\
												<span class="unit">rem</span>\
												<!--\
												<span class="unit">px</span>\
												-->\
											</div>\
										</div>\
									</div>\
									<div class="control-group textShadowWrapper">\
										<label class="control-label">シャドウ</label>\
										<div class="controls">\
											<div class="box textShadowYWrapper">\
												<span class="key">上下</span>\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['textShadowY'] + '" data-item-name="textShadowY" data-min="' + prop['textShadowY']['min'] + '" data-max="' + prop['textShadowY']['max'] + '"/>\
												<span class="unit">px</span>\
											</div>\
											<div class="box textShadowXWrapper">\
												<span class="key">左右</span>\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['textShadowX'] + '" data-item-name="textShadowX" data-min="' + prop['textShadowX']['min'] + '" data-max="' + prop['textShadowX']['max'] + '"/>\
												<span class="unit">px</span>\
											</div>\
											<div class="box textShadowBlurWrapper">\
												<span class="key">ぼかし</span>\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['textShadowBlur'] + '" data-item-name="textShadowBlur" data-min="' + prop['textShadowBlur']['min'] + '" data-max="' + prop['textShadowBlur']['max'] + '"/>\
												<span class="unit">px</span>\
											</div>\
											<div class="box textShadowColorWrapper">\
												<span class="key">影色</span>\
												<div class="colorPicker">\
													<div>\
														<input id="' + id + '-textShadowColor" data-item-name="textShadowColor" class="color-input colorCodeInput" value="' + thisObj._currentVal['textShadowColor'] + '" type="text" />\
													</div>\
													</div>\
												</div>\
											</div>\
										</div>\
									</div>\
									<!--\
									<div class="btn-hole">\
										<div class="btn-group" data-toggle="buttons-checkbox">\
											<button type="button" class="btn btn-primary isEnabledBold' + (thisObj._currentVal['isEnabledBold'] === true ? ' active' : '') + '" data-item-name="isEnabledBold" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isEnabledBold'][0] + '"><span><i data-icon=""></i>太字にする</span></button>\
											<button type="button" class="btn btn-primary isEnabledItalic' + (thisObj._currentVal['isEnabledItalic'] === true ? ' active' : '') + '" data-item-name="isEnabledItalic" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isEnabledItalic'][0] + '"><span><i data-icon=""></i>斜体にする</span></button>\
											<button type="button" class="btn btn-primary isEnabledUnderline' + (thisObj._currentVal['isEnabledUnderline'] === true ? ' active' : '') + '" data-item-name="isEnabledUnderline" data-placement="bottom" data-original-title="' + thisObj.tooltipMessages['isEnabledUnderline'][0] + '"><span><i data-icon=""></i>下線を引く</span></button>\
										</div>\
									</div>\
									-->\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);

			// if (id.indexOf('_category') !== -1) {
			// 	elem
			// 		.find(".textInputWrapper")
			// 		.css('display', 'none');
			// }

			// var currentIconIndex = _.indexOf(icons, thisObj._currentVal['code']);
			var currentIconIndex = thisObj._instances['DataManager'].getIconData(thisObj._currentVal['code']);
			console.log('code = ' + thisObj._currentVal['code']);
			console.log('currentIconIndex = ' + currentIconIndex);
			elem
				.find('.iconSelectWrapper li:eq(' + currentIconIndex + ')').addClass('active')
				.end()
				.find(".fontSizeWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['fontSize']['min'],
							max		: prop['fontSize']['max'],
							step	: 0.1,
							value	: thisObj._currentVal['fontSize'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'fontSize');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'fontSize');}
						}
					)
				.end()
				.find(".lineHeightWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['lineHeight']['min'],
							max		: prop['lineHeight']['max'],
							step	: 0.1,
							value	: thisObj._currentVal['lineHeight'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'lineHeight');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'lineHeight');}
						}
					)
				.end()
				.find(".textShadowYWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['textShadowY']['min'],
							max		: prop['textShadowY']['max'],
							value	: thisObj._currentVal['textShadowY'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowY');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowY');}
						}
					)
				.end()
				.find(".textShadowXWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['textShadowX']['min'],
							max		: prop['textShadowX']['max'],
							value	: thisObj._currentVal['textShadowX'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowX');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowX');}
						}
					)
				.end()
				.find(".textShadowBlurWrapper .slider")
					.slider(
						{
							range	: 'min',
							min		: prop['textShadowBlur']['min'],
							max		: prop['textShadowBlur']['max'],
							value	: thisObj._currentVal['textShadowBlur'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowBlur');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'textShadowBlur');}
						}
					)
				.end();

			setTimeout(
				function() {
					ProColor.prototype.attachButton(
						id + '-color',
						{
							imgPath			: '../../../plugin/procolor-1.0/img/procolor_win_',
							showInField		: true,
							onChanged		: function(elem, type) {
								thisObj.onChangeColor('color');
							}
						}
					);
					ProColor.prototype.attachButton(
						id + '-textShadowColor',
						{
							imgPath			: '../../../plugin/procolor-1.0/img/procolor_win_',
							showInField		: true,
							onChanged		: function(elem, type) {
								thisObj.onChangeColor('textShadowColor');
							}
						}
					);
					$(".colorPicker > div > a", elem).css(
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
			// console.log('PropertyOfText :: refreshStyle :: isEnforcement = ' + isEnforcement);
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
		//	var targetElem = $("#" + thisObj._targetId + ' > div > div.contentWrapper');
			/*
			console.log('isEnabledBoldのclass = ' + thisObj._elems['propertyElement'].find('.textBaseWrapper .isEnabledBold').attr('class'));
			console.log('isEnabledBold = ' + thisObj._elems['propertyElement'].find('.textBaseWrapper .isEnabledBold').hasClass('active'));
			*/

			var selector = ['fontSize', 'lineHeight', 'textShadowY', 'textShadowX', 'textShadowBlur'];
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
				 console.log('Textデータ保存');
				thisObj._hasSaveData = false;
				// thisObj._dataManager.updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * フォントカラー/シャドウカラーがProColorプラグインから変わった時にコールされるメソッド
		 * @param	type		"color"===文字色が変わった。"textShadowColor"===シャドウカラーが変わった。
		 * @return	void
		 */
		,onChangeColor: function(type) {
			var thisObj = this;
			var colorCode = $('#' + thisObj._targetId + '-' + type).val();
			if (thisObj._currentVal[type] !== colorCode) {
				thisObj._currentVal[type] = colorCode;
				thisObj._hasSaveData = true;
				thisObj.refreshStyle(true);
			}
		}

		/*
		 * フォントサイズ/行間スライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	isSave		true===処理後に保存する
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			var thisObj = this;
			var val = ui.value;
			thisObj._currentVal[type] = val;
			// console.log('PropertyOfText :: onChangeSlider :: event.type = ' + event.type + ', type = ' + type);

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
		 * フォントサイズ/行間の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"fontSize"===フォントサイズの値が変わった。"lineHeight"===行間の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event, type) {
			var thisObj = this;
			var elem = $(event.currentTarget);

			if (type === 'color' || type === 'textShadowColor') {
				var val = elem.val();
				if (thisObj._currentVal[type] !== val) {
					// console.log('---------------------');
					// console.log('onChangeText :: val = ' + val + ', type = ' + type);
					// for (var key in thisObj._currentVal) {
					// 	console.log('	thisObj._currentVal[' + key + '] = ' + thisObj._currentVal[key]);
					// }
					// console.log('---------------------');
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

			} else {
				var val = elem.val() - 0;
				var min = elem.attr('data-min') - 0;
				var max = elem.attr('data-max') - 0;

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
								thisObj.refreshStyle(true);
							}
						},
						3000
					);
				}
			}
		}

		/*
		 * HTMLを有効にする/太字にする/斜体にする/下線を引くの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onCheckHandler: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var checked = elem.hasClass('active') ? false : true;
			elem.attr('data-original-title', thisObj.tooltipMessages[itemName][(checked === true ? 1 : 0)]);
			thisObj._currentVal[itemName] = checked;
			thisObj._currentVal['text'] = thisObj._elems['propertyElement'].find(".textInputWrapper textarea").val();
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * アイコンがクルックされた際にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickIconHandler: function(event) {
			var thisObj = this;
			$('.iconSelectWrapper li').removeClass('active');
			var targetElement = $(event.currentTarget);
			targetElement.addClass('active');
			var index = targetElement.closest('ul').children().index(targetElement);
			var icon = thisObj._instances['DataManager'].getIconData(index);
			// console.log('dta-icon = ' + targetElement.find('>i').attr('data-icon'));
			// console.log('index = ' + index);
			// console.log('icon = ' + icon);
			thisObj._currentVal['code'] = icon;
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
			var textInputSelectors = ['color', 'fontSize', 'lineHeight', 'textShadowY', 'textShadowX', 'textShadowBlur', 'textShadowColor'];

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				for (var i=0,len=textInputSelectors.length; i<len; i++) {
					var elem = thisObj._elems['propertyElement'].find('input[data-item-name="' + textInputSelectors[i] + '"]');
					elem
						.on('change', function(event) {
							var elem = $(this);
							var keyName = elem.attr('data-item-name');
							thisObj.onChangeText(event, keyName);
						})
						.on('focus', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							var elem = $(this);
							var keyName = elem.attr('data-item-name');
							thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event, keyName);}, 100);
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

				thisObj._elems['propertyElement']
					// .find('div[data-toggle="buttons-checkbox"] > .btn')
					.on('click', 'div[data-toggle="buttons-checkbox"] > .btn', function(event) {
						thisObj.onCheckHandler(event);
					})
					.on('click', '.iconSelectWrapper li', thisObj.onClickIconHandler);

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				for (var i=0,len=textInputSelectors.length; i<len; i++) {
					elem
						.off('change')
						.off('focus')
						.off('blur');
				}

				thisObj._elems['propertyElement']
					.off('click', 'div[data-toggle="buttons-checkbox"] > .btn')
					/*
					.find(".textInputWrapper textarea")
						.off('change')
						.off('focus')
						.off('blur')
						*/
					// .end()
					// .find('div[data-toggle="buttons-checkbox"] > .btn')
					// 	.off('click')
			}
		}
	}
});
