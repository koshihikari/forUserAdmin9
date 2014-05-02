

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する画像プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfImage');
	MYNAMESPACE.modules.PropertyOfImage = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfImage.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_timers						: {}
		,_hasSaveData					: false
		,_targetId						: null
		,_currentVal					: {}
		,_instances						: {}
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
		,initialize: function(instances, id) {
			var thisObj = this;
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshCurrentVal', 'refreshSlider', 'refreshStyle', 'onChangeSlider', 'onChangeText', 'switchActiveArea', 'setEvent');
			this._dataManager = instances['DataManager'];
			this._targetId = id;
			this._elementType = 'Image';
			this._instances = instances;
			this._instances['InsertImageModalManager'] = new MYNAMESPACE.modules.InsertImageModalManager('modal-' + new Date().getTime(), {'ignoreWhitespace':true});
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id, this._currentVal);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'imagePathInput'		: propertyElement.find(".imagePathWrapper input[type='text']"),
				'imageWidthInput'		: propertyElement.find(".imageWidthWrapper input[type='text']"),
				'imageHeightInput'		: propertyElement.find(".imageHeightWrapper input[type='text']")
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
		 * @param	id 				このクラスが管理するエレメントのコンてナのID
		 * @param	currentVal 		このクラスが管理するエレメントのプロパティデータ
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id, currentVal) {
			var thisObj				= this;
			var targetElem			= $("#" + thisObj._targetId);
			var prop = {
				'imageWidth'		: {
					'min'			: 1,
					'max'			: currentVal['masterImageWidth']
				},
				'imageHeight'	: {
					'min'			: 1,
					'max'			: currentVal['masterImageHeight']
				},
				'imageScale'	: {
					'min'			: 1,
					'max'			: 100
				}
			}
			var source = '\
						<div class="propertyElement forImageElement">\
							<p class="elementTitle">画像</p>\
							<div class="contentWrapper">\
								<div class="control-group imgWrapper">\
									<label class="control-label">画像差し替え</label>\
									<div class="controls">\
										<div class="btn-hole">\
											<button type="button" class="btn btn-primary fromUploadedImageBtn" data-item-name="fromUploadedImageBtn" data-placement="bottom" data-original-title="codelessにアップされている画像から選択します"><span><i data-icon=""></i>アップロード済み画像から指定</span></button>\
											<button type="button" class="btn btn-primary fromWebImageBtn" data-item-name="fromWebImageBtn" data-placement="bottom" data-original-title="ウェブ上の画像から選択します"><span><i data-icon=""></i>ウェブ上の画像のURLを指定</span></button>\
											<button type="button" class="btn btn-primary fromAddedImageBtn" data-item-name="fromAddedImageBtn" data-placement="bottom" data-original-title="PC内の画像をcodelessにアップして表示します"><span><i data-icon=""></i>新規アップロード</span></button>\
										</div>\
									</div>\
								</div>\
								<div class="control-group imgViewWrapper">\
									<label class="control-label">表示する画像</label>\
									<div class="controls">\
										<img src="" />\
									</div>\
								</div>\
								<div class="control-group imageSizeWrapper">\
									<label class="control-label">画像のサイズ</label>\
									<div class="controls">\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn percentBtn' + (currentVal['sizeway'] === 'percent' ? ' active' : '') + '" data-item-name="percentBtn" data-placement="bottom" data-original-title="画像のサイズをパーセントで指定します。"><span><i data-icon=""></i>画像のサイズをパーセントで指定</span></button>\
											</div>\
											<div class="percent">\
												<div class="box imageScaleWrapper">\
													<span class="key">大きさ</span>\
													<div class="sliderWrapper">\
														<div class="slider imageScaleSlider"></div>\
													</div>\
													<input type="text" data-item-name="imageScale" value="' + currentVal['imageScale'] + '" data-min="' + prop['imageScale']['min'] + '" data-max="' + prop['imageScale']['max'] + '"/>\
													<span class="unit">%</span>\
												</div>\
												<p class="caution">\
													「大きさ」は元の画像の大きさに対しての大きさです。<br />\
													「大きさ」を100%にすると原寸大の大きさで表示されます。<br />\
													端末の幅のよりも原寸大の画像の幅の方が大きい場合は端末の幅いっぱいにリサイズされます。\
												</p>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn pixelBtn' + (currentVal['sizeway'] === 'pixel' ? ' active' : '') + '" data-item-name="pixelBtn" data-placement="bottom" data-original-title="画像のサイズをピクセルで指定します。"><span><i data-icon=""></i>画像のサイズをピクセルで指定</span></button>\
											</div>\
											<div class="pixel">\
												<div class="box imageWidthWrapper">\
													<span class="key">幅</span>\
													<div class="sliderWrapper">\
														<div class="slider imageWidthSlider"></div>\
													</div>\
													<input type="text" data-item-name="imageWidth" value="' + currentVal['imageWidth'] + '" data-min="' + prop['imageWidth']['min'] + '" data-max="' + prop['imageWidth']['max'] + '"/>\
													<span class="unit">px</span>\
												</div>\
												<div class="box imageHeightWrapper">\
													<span class="key">高さ</span>\
													<div class="sliderWrapper">\
														<div class="slider imageHeightSlider"></div>\
													</div>\
													<input type="text" data-item-name="imageHeight" value="' + currentVal['imageHeight'] + '" data-min="' + prop['imageHeight']['min'] + '" data-max="' + prop['imageHeight']['max'] + '"/>\
													<span class="unit">px</span>\
												</div>\
												<div class="btn-hole" data-toggle="buttons-checkbox">\
													<button type="button" class="btn btn-primary aspectLinkageBtn' + (currentVal['isAspectLinkage'] === true ? ' active' : '') + '" data-item-name="isAspectLinkage" data-placement="bottom" data-original-title="画像の縦横の比率を固定します"><span><i data-icon=""></i>縦横比を固定する</span></button>\
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
				.find(".imageSizeWrapper")
					.find(".imageWidthSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['imageWidth']['min'],
								max		: prop['imageWidth']['max'],
								value	: currentVal['imageWidth'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageWidth');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageWidth');}
							}
						)
					.end()
					.find(".imageHeightSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['imageHeight']['min'],
								max		: prop['imageHeight']['max'],
								value	: currentVal['imageHeight'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageHeight');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageHeight');}
							}
						)
					.end()
					.find(".imageScaleSlider")
						.slider(
							{
								range	: 'min',
								min		: prop['imageScale']['min'],
								max		: prop['imageScale']['max'],
								value	: currentVal['imageScale'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageScale');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageScale');}
							}
						);
			var passiveAreaName = currentVal['sizeway'] === 'pixel' ? 'percent' : 'pixel';
			elem.find('.' + passiveAreaName).css('display', 'none');
			
			return elem;
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshCurrentVal: function(elementId, categoryName, property) {
			var thisObj = this;
			if (thisObj._targetId === elementId && thisObj._elementType === categoryName && property) {
				thisObj._currentVal = property;
				// console.log('画像サイズ更新');
				// console.log(thisObj._currentVal);
				thisObj.refreshSlider();
			}
		}
		,refreshSlider: function() {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			thisObj._elems['propertyElement']
				.find(".imageSizeWrapper")
					.find(".imageWidthSlider")
						.slider(
							{
								range	: 'min',
								min		: 1,
								max		: thisObj._currentVal['masterImageWidth'],
								value	: thisObj._currentVal['imageWidth'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageWidth');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageWidth');}
							}
						)
					.end()
					.find(".imageHeightSlider")
						.slider(
							{
								range	: 'min',
								min		: 1,
								max		: thisObj._currentVal['masterImageHeight'],
								value	: thisObj._currentVal['imageHeight'],
								slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageHeight');},
								stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'imageHeight');}
							}
						);
			var selector = ['imageWidth', 'imageHeight', 'imageScale'];
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

			// プロパティエリアにサムネイル表示
			var thumbElem = thisObj._elems['propertyElement'].find('.imgViewWrapper img');
			if (thumbElem.attr('src') !== thisObj._currentVal['imagePath']) {
				thumbElem.attr('src', thisObj._currentVal['imagePath']);
			}
		}
		
		/*
		 * 画像のプロパティをセットするメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		// ,setImageProperty: function(isEnforcement) {
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			
			thisObj.refreshSlider();

			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				console.log('画像データ保存');
				thisObj._hasSaveData = false;
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * 画像の幅/高さ/大きさスライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"imageWidth"===画像の幅スライダーが動かされた。"imageHeight"===画像の高さスライダーが動かされた。"imageScale"===画像の大きさスライダーが動かされた。
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			// slideさせた => 見た目は変える。ただし、保存はしない。
			// sliderが終了した => 見た目を変えて保存する。
			var thisObj = this;
			var val = ui.value;
			thisObj._currentVal[type] = val;
			
			// 縦横比を固定する場合、画像の幅と高さの値を補正
			if (thisObj._currentVal['isAspectLinkage'] === true) {
				if (type === 'imageWidth') {
					thisObj._currentVal['imageHeight'] = Math.round(thisObj._currentVal['imageWidth'] * thisObj._currentVal['masterImageHeight'] / thisObj._currentVal['masterImageWidth']);
				} else {
					thisObj._currentVal['imageWidth'] = Math.round(thisObj._currentVal['imageHeight'] * thisObj._currentVal['masterImageWidth'] / thisObj._currentVal['masterImageHeight']);
				}
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
		 * 画像パス/画像の幅/画像の高さの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"imagePath"===画像パスの値が変わった。"imageWidth"===画像の幅の値が変わった。"imageHeight"===画像の高さの値が変わった。
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

				// 縦横比を固定する場合、画像の幅と高さの値を補正
				if (thisObj._currentVal['isAspectLinkage'] === true) {
					if (type === 'imageWidth') {
						thisObj._currentVal['imageHeight'] = Math.round(thisObj._currentVal['imageWidth'] * thisObj._currentVal['masterImageHeight'] / thisObj._currentVal['masterImageWidth']);
					} else {
						thisObj._currentVal['imageWidth'] = Math.round(thisObj._currentVal['imageHeight'] * thisObj._currentVal['masterImageWidth'] / thisObj._currentVal['masterImageHeight']);
					}
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
			}
		}
		
		/*
		 * 画像サイズのピクセル/パーセント指定領域の切り替えメソッド
		 * @param	activeAreaName		pixel===ピクセル指定エリアをアクティブ。percent===パーセント指定エリアをアクティブ
		 * @return	void
		 */
		,switchActiveArea: function(activeAreaName, elem) {
			var thisObj = this;
			var activeBtnClassName = activeAreaName === 'pixel' ? 'pixelBtn' : 'percentBtn';
			var passiveAreaName = activeAreaName === 'pixel' ? 'percent' : 'pixel';
			thisObj._currentVal['sizeway'] = activeAreaName;
			thisObj._hasSaveData = true;
			
			thisObj._elems['propertyElement']
				.find('.switchBtn')
					.removeClass('active')
				.end()
				.find('.' + activeBtnClassName)
					.addClass('active');
					
			thisObj._elems['propertyElement']
				.find('.' + passiveAreaName).slideUp()
				.end()
				.find('.' + activeAreaName).slideDown();
			
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
					.find('[data-toggle="buttons-checkbox"] button')
						.on('click', function(event) {
							var key = $(this).attr('data-item-name');
							thisObj._currentVal[key] = !thisObj._currentVal[key];
							thisObj.refreshStyle(true);
						})
					.end()
					.find('.switchBtn')
						.on('click', function(event) {
							var activeAreaName = $(this).hasClass('pixelBtn') ? 'pixel' : 'percent';
							thisObj.switchActiveArea(activeAreaName);
						})
					.end()
					.find('.fromWebImageBtn')
						.on('click', function(event) {
							thisObj._instances['InsertImageModalManager'].open({imagePath:thisObj._currentVal['imagePath']});
						});

				$(thisObj._instances['InsertImageModalManager'])
					.on('onAssignmentImage', function(event, val) {
						thisObj._currentVal['prevImagePath'] = thisObj._currentVal['imagePath'];
						thisObj._currentVal['imagePath'] = val;
						thisObj.refreshStyle(true);
					});
					
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
			}
		}
	}
});
