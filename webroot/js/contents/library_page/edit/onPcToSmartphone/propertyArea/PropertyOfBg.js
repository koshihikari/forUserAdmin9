

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する背景プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfBg');
	MYNAMESPACE.modules.PropertyOfBg = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfBg.prototype = {
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
		,tooltipMessages				: {
			'isEnabledGradation'			: ['グラデーションを有効にします。', 'グラデーションを無効にします。'],
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
			this._elementType = 'Bg';
			this._instances = instances;
			this._instances['InsertImageModalManager'] = new MYNAMESPACE.modules.InsertImageModalManager('modal-' + new Date().getTime(), {ignoreWhitespace:true});
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
							<p class="elementTitle">背景</p>\
							<div class="contentWrapper">\
								<div class="control-group bgColorWrapper">\
									<label class="control-label">背景色</label>\
									<div class="controls colorPicker">\
										<div>\
											<input id="' + id + '-bgColor" class="color-input colorCodeInput" value="' + thisObj._currentVal['bgColor'] + '" type="text" />\
										</div>\
									</div>\
								</div>\
								<div class="control-group bgGradationWrapper">\
									<label class="control-label">グラデーション</label>\
									<div class="controls">\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-checkbox">\
												<button type="button" class="btn btn-primary isEnabledGradation' + (thisObj._currentVal['isEnabledGradation'] === true ? ' active' : '') + '" data-item-name="isEnabledGradation" data-placement="left" data-original-title="' + thisObj.tooltipMessages['isEnabledGradation'][0] + '"><span><i data-icon=""></i>グラデーションを有効にする</span></button>\
											</div>\
										</div>\
										<div class="dropdown">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span><i data-icon=""></i>グラデーションの方向</span></button>\
												<div class="dropdown-menu" role="menu" aria-labelledby="dLabel" data-toggle="buttons-radio" data-item-name="gradationDirection">\
													<button class="btn btn-primary topToBottom' + (thisObj._currentVal['gradationDirection'] === 'topToBottom' ? ' active' : '') + '" data-type="topToBottom"><span><i data-icon=""></i>上から下</span></button>\
													<button class="btn btn-primary bottomToTop' + (thisObj._currentVal['gradationDirection'] === 'bottomToTop' ? ' active' : '') + '" data-type="bottomToTop"><span><i data-icon=""></i>下から上</span></button>\
													<button class="btn btn-primary leftToRight' + (thisObj._currentVal['gradationDirection'] === 'leftToRight' ? ' active' : '') + '" data-type="leftToRight"><span><i data-icon=""></i>左から右</span></button>\
													<button class="btn btn-primary rightToLeft' + (thisObj._currentVal['gradationDirection'] === 'rightToLeft' ? ' active' : '') + '" data-type="rightToLeft"><span><i data-icon=""></i>右から左</span></button>\
													<button class="btn btn-primary centerToCorner' + (thisObj._currentVal['gradationDirection'] === 'centerToCorner' ? ' active' : '') + '" data-type="centerToCorner"><span><i data-icon=""></i>中央から周辺</span></button>\
												</div>\
											</div>\
										</div>\
										<div class="box gradationShadeWrapper">\
											<span class="key">濃淡</span>\
											<div class="sliderWrapper">\
												<div class="slider gradationShadeSlider"></div>\
											</div>\
											<input type="text" name="gradationShade" value="' + thisObj._currentVal['gradationShade'] + '" data-min="' + prop['gradationShade']['min'] + '" data-max="' + prop['gradationShade']['max'] + '"/>\
										</div>\
									</div>\
								</div>\
								<div class="control-group bgImageWrapper">\
									<label class="control-label">背景画像</label>\
									<div class="controls">\
										<span>背景画像パス</span>\
										<div class="btn-hole">\
											<button type="button" class="btn btn-primary fromUploadedImageBtn" data-item-name="fromUploadedImageBtn" data-placement="bottom" data-original-title="codelessにアップされている画像から選択します"><span><i data-icon=""></i>アップロード済み画像から指定</span></button>\
											<button type="button" class="btn btn-primary fromWebImageBtn" data-item-name="fromWebImageBtn" data-placement="bottom" data-original-title="ウェブ上の画像から選択します"><span><i data-icon=""></i>ウェブ上の画像のURLを指定</span></button>\
											<button type="button" class="btn btn-primary fromAddedImageBtn" data-item-name="fromAddedImageBtn" data-placement="bottom" data-original-title="PC内の画像をcodelessにアップして表示します"><span><i data-icon=""></i>新規アップロード</span></button>\
										</div>\
										<div class="dropdown">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span><i data-icon=""></i>背景画像の表示の仕方</span></button>\
												<div class="dropdown-menu" role="menu" aria-labelledby="dLabel" data-toggle="buttons-radio" data-item-name="bgRepeat">\
													<button class="btn btn-primary btn-primary repeat' + (thisObj._currentVal['bgRepeat'] === 'repeat' ? ' active' : '') + '" data-type="repeat" data-placement="bottom" data-original-title="背景画像を縦横に繰り返して表示します。"><span><i data-icon=""></i>縦横に繰り返し</span></button>\
													<button class="btn btn-primary btn-primary repeat-y' + (thisObj._currentVal['bgRepeat'] === 'repeat-y' ? ' active' : '') + '" data-type="repeat-y" data-placement="bottom" data-original-title="背景画像を縦方向のみに繰り返して表示します。"><span><i data-icon=""></i>縦方向のみ繰り返し</span></button>\
													<button class="btn btn-primary btn-primary repeat-x' + (thisObj._currentVal['bgRepeat'] === 'repeat-x' ? ' active' : '') + '" data-type="repeat-x" data-placement="bottom" data-original-title="背景画像を横方向のみに繰り返して表示します。"><span><i data-icon=""></i>横方向のみ繰り返し</span></button>\
													<button class="btn btn-primary btn-primary no-repeat' + (thisObj._currentVal['bgRepeat'] === 'no-repeat' ? ' active' : '') + '" data-type="no-repeat" data-placement="bottom" data-original-title="背景画像を繰り返さずに表示します。"><span><i data-icon=""></i>繰り返しなし</span></button>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			elem.find(".gradationShadeSlider").slider(
				{
					range	: 'min',
					min		: prop['gradationShade']['min'],
					max		: prop['gradationShade']['max'],
					value	: thisObj._currentVal['gradationShade'],
					slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'gradationShade');},
					stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'gradationShade');}
				}
			);

			setTimeout(
				function() {
					ProColor.prototype.attachButton(
						id + '-bgColor',
						{
							imgPath			: '../../../plugin/procolor-1.0/img/procolor_win_',
							showInField		: true,
							onChanged		: function(elem, type) {
								// console.log('thisObj._wasAccessed = ' + thisObj._wasAccessed);
								// if (thisObj._wasAccessed === true) {
									thisObj.onChangeColor();
								// }
								// thisObj._wasAccessed = true;
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

			// thisObj._methodObj['onRefreshPrevElements'](thisObj._imagePathId, isEnforcement);
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._imagePathId);
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId);

			// $(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType]);
			// $(thisObj).trigger('onCompleteRefreshStyle', [thisObj._imagePathId, thisObj._elementType]);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				console.log('Bgデータ保存');
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
			// console.log('	colorCode = ' + colorCode);
			// console.log('	bgColor = ' + thisObj._currentVal['bgColor']);
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
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				thisObj._elems['propertyElement']
					.find('.bgColorWrapper  input[type="text"]')
					.on('change', function(event) {
						thisObj.onChangeColor();
					})
					.on('focus', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event2) {thisObj.onChangeColor();}, 100);
					})
					.on('blur', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					})
				.end()
				.find('div[data-toggle="buttons-checkbox"] > .btn')
					.on('click', function(event) {
						thisObj.onCheckHandler(event);
					})
				.end()
				.find('div[data-toggle="buttons-radio"] > .btn')
					.on('click', function(event) {
						thisObj.onClickRadioButtonHandler(event);
					})
				.end()
				.find('.gradationShadeWrapper input[type="text"]')
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
						// var elem = $(this);
						// var val = elem.val() - 0;
						// var min = elem.attr('data-min') - 0;
						// var max = elem.attr('data-max') - 0;
						// if (!isNaN(min) && !isNaN(max)) {
						// 	var keyName = elem.attr('name');
						// 	if (isNaN(val) || val < min || max < val) {
						// 		elem.val(thisObj._currentVal[keyName]);
						// 	}
						// }
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					})
				.end()
				.find('.gradationShadeSlider')
					.slider("enable")
				.end()
				.find('.fromWebImageBtn')
					.on('click', function(event) {
						thisObj._instances['InsertImageModalManager'].open({imagePath:thisObj._currentVal['imagePath']});
					});

				$(thisObj._instances['InsertImageModalManager'])
					.on('onAssignmentImage', function(event, val) {
					//	console.log('val = ' + val);
						thisObj._currentVal['prevImagePath'] = thisObj._currentVal['imagePath'];
						thisObj._currentVal['imagePath'] = val;
						thisObj.refreshStyle(true);
					});

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find('.bgColorWrapper  input[type="text"]')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.find('div[data-toggle="buttons-checkbox"] > .btn')
						.off('click')
					.end()
					.find('div[data-toggle="buttons-radio"] > .btn')
						.off('click')
					.end()
					.find('.gradationShadeWrapper input[type="text"]')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.find(".gradationShadeSlider")
						.slider("disable")
				.end()
				.find('.fromWebImageBtn')
					.off('click');

				$(thisObj._instances['InsertImageModalManager'])
					.off('onAssignmentImage');
			}
		}
	}
});
