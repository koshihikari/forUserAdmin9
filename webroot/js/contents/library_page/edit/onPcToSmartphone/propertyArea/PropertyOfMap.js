

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する地図プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfMap');
	MYNAMESPACE.modules.PropertyOfMap = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfMap.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_eventArr						: []
		,_isChangeSlideOnProgram		: false
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_timers						: {}
		,_hasSaveData					: false
		,_timerId						: null
		,_currentVal					: {}
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
			
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeSlider', 'onChangeText', 'switchActiveArea', 'setEvent');
			this._targetId = id;
			this._elementType = 'Map';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement,
				'addressInput'			: propertyElement.find('input[name="address"]'),
				'longitudeInput'		: propertyElement.find('input[name="longitude"]'),
				'latitudeInput'			: propertyElement.find('input[name="latitude"]'),
				'mapWidthInput'			: propertyElement.find('input[name="mapWidth"]'),
				'mapHeightInput'		: propertyElement.find('input[name="mapHeight"]'),
				'mapScaleInput'			: propertyElement.find('input[name="mapScale"]')
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
			var thisObj			= this;
			var prop = {
				'mapWidth'	: {
					'min'			: 100,
					'max'			: 1000
				},
				'mapHeight'	: {
					'min'			: 10,
					'max'			: 1000
				},
				'mapScale'	: {
					'min'			: 0,
					'max'			: 22
				}
			}
			var source = '\
						<div class="propertyElement forMapElement">\
							<p class="elementTitle">地図</p>\
							<div class="contentWrapper">\
								<div class="control-group mapWrapper">\
									<label class="control-label">表示方法</label>\
									<div class="controls">\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn fromAddressBtn' + (thisObj._currentVal['currentArea'] === 'address' ? ' active' : '') + '" data-item-name="fromAddressBtn" data-placement="bottom" data-original-title="住所から地図を表示します。"><span><i data-icon=""></i>住所を指定</span></button>\
											</div>\
											<div class="address">\
												<div class="btn-hole">\
													<button type="button" class="btn btn-primary setAddressBtn" data-item-name="setAddressBtn" data-placement="bottom" data-original-title="物件情報に記載されている住所を入力します。"><span><i data-icon=""></i>住所を物件情報から取得</span></button>\
												</div>\
												<div class="addressGroup">\
													<span>住所</span><input type="text" name="address" value="' + thisObj._currentVal['address'] + '" />\
												</div>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn fromLatLongBtn' + (thisObj._currentVal['currentArea'] === 'latlong' ? ' active' : '') + '" data-item-name="fromLatLongBtn" data-placement="bottom" data-original-title="緯度/経度から地図を表示します。"><span><i data-icon=""></i>緯度/経度を指定</span></button>\
											</div>\
											<div class="latlong">\
												<div class="btn-hole">\
													<button type="button" class="btn btn-primary setLatLongBtn" data-item-name="setLatLongBtn" data-placement="bottom" data-original-title="物件情報に記載されている緯度/経度を入力します。"><span><i data-icon=""></i>緯度/経度を物件情報から取得</span></button>\
												</div>\
												<div>\
													<div class="latitude">\
														<span>緯度</span><input type="text" name="latitude" value="' + thisObj._currentVal['latitude'] + '" />\
													</div>\
													<div class="longitude">\
														<span>経度</span><input type="text" name="longitude" value="' + thisObj._currentVal['longitude'] + '" />\
													</div>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="control-group mapSizeWrapper">\
									<label class="control-label">地図の大きさ</label>\
									<div class="controls">\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-checkbox">\
												<button type="button" class="btn btn-primary isFullWidthBtn' + (thisObj._currentVal['isFullWidth'] === true ? ' active' : '') + '" data-item-name="isFullWidthBtn" data-placement="bottom" data-original-title="地図の幅を端末の幅いっぱいに表示します。"><span><i data-icon=""></i>地図の幅を端末の幅いっぱいに表示する</span></button>\
											</div>\
										</div>\
										<div class="box mapWidthWrapper">\
											<span class="key">幅</span>\
											<div class="sliderWrapper">\
												<div class="slider mapWidthSlider"></div>\
											</div>\
											<input' + (thisObj._currentVal['isFullWidth'] === true ? ' disabled ' : ' ') + 'type="text" name="mapWidth" value="' + thisObj._currentVal['mapWidth'] + '" data-min="' + prop['mapWidth']['min'] + '" data-max="' + prop['mapWidth']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
										<div class="box mapHeightWrapper">\
											<span class="key">高さ</span>\
											<div class="sliderWrapper">\
												<div class="slider mapHeightSlider"></div>\
											</div>\
											<input type="text" name="mapHeight" value="' + thisObj._currentVal['mapHeight'] + '" data-min="' + prop['mapHeight']['min'] + '" data-max="' + prop['mapHeight']['max'] + '"/>\
											<span class="unit">px</span>\
										</div>\
									</div>\
								</div>\
								<div class="control-group mapScaleWrapper">\
									<label class="control-label">表示倍率</label>\
									<div class="controls">\
										<div class="box">\
											<div class="sliderWrapper">\
												<div class="slider mapScaleSlider"></div>\
											</div>\
											<input type="text" name="mapScale" value="' + thisObj._currentVal['mapScale'] + '" data-min="' + prop['mapScale']['min'] + '" data-max="' + prop['mapScale']['max'] + '"/>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			elem
				.find(".mapWidthSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['mapWidth']['min'],
							max		: prop['mapWidth']['max'],
							value	: thisObj._currentVal['mapWidth'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapWidth');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapWidth');}
						}
					)
				.end()
				.find(".mapHeightSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['mapHeight']['min'],
							max		: prop['mapHeight']['max'],
							value	: thisObj._currentVal['mapHeight'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapHeight');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapHeight');}
						}
					)
				.end()
				.find(".mapScaleSlider")
					.slider(
						{
							range	: 'min',
							min		: prop['mapScale']['min'],
							max		: prop['mapScale']['max'],
							value	: thisObj._currentVal['mapScale'],
							slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapScale');},
							stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'mapScale');}
						}
					);
					
			if (thisObj._currentVal['isFullWidth'] === true) {
				elem.find(".mapWidthSlider").slider('disable');
			}
			var passiveAreaName = thisObj._currentVal['currentArea'] === 'latlong' ? 'address' : 'latlong';
			elem.find('.' + passiveAreaName).css('display', 'none');
			
			return elem;
		}
		,refreshCurrentVal: function(elementId, categoryName, property) {
			var thisObj = this;
			if (thisObj._targetId === elementId && thisObj._elementType === categoryName && property) {
				thisObj._currentVal = property;

				// console.log('緯度経度更新');
				// console.log(thisObj._currentVal);
				thisObj._elems['propertyElement']
					.find('input[name="latitude"]').val(thisObj._currentVal['latitude'])
					.end()
					.find('input[name="longitude"]').val(thisObj._currentVal['longitude']);
			}
		}
		
		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			var lat = 0;
			var lng = 0;
			
			// スライダーと、テキスト入力欄の値を保持している値に更新
			var selector = ['mapWidth', 'mapHeight', 'mapScale'];
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
				console.log('地図データ保存');
				thisObj._hasSaveData = false;
				// thisObj._dataManager.updateData(thisObj._targetId, this._elementType, thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
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
			thisObj._eventArr.unshift(event.type);
			if (2 < thisObj._eventArr.length) {
				thisObj._eventArr.pop();
			}
			thisObj._hasSaveData = thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false;
			if (thisObj._hasSaveData === true) {
				thisObj.refreshStyle(thisObj._hasSaveData);
			}
			// if (thisObj._isChangeSlideOnProgram === false) {
			// 	thisObj.refreshStyle(thisObj._hasSaveData);
			// }
			thisObj._isChangeSlideOnProgram = false;
		}
		
		/*
		 * 住所/緯度/経度の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"address"===住所の値が変わった。"latitude"===緯度の値が変わった。"longitude"===経度の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event, type) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var val = elem.val();
			var min = elem.attr('data-min') - 0;
			var max = elem.attr('data-max') - 0;
			if (!isNaN(min) && !isNaN(max)) {
				val -= 0;
			}
			if (thisObj._currentVal[type] !== val) {
				if (!isNaN(min) && !isNaN(max)) {
					if (val < min || max < val) {
						return;
					}
				}
				thisObj._currentVal[type] = val;
				thisObj._hasSaveData = true;
				// thisObj.refreshStyle();

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
		 * 住所を指定/緯度/経度を指定領域の切り替えメソッド
		 * @param	activeAreaName		address===住所を指定エリアをアクティブ。latlong===緯度/経度を指定エリアをアクティブ
		 * @return	void
		 */
		,switchActiveArea: function(activeAreaName, elem) {
			var thisObj = this;
			var activeBtnClassName = activeAreaName === 'address' ? 'fromAddressBtn' : 'fromLatLongBtn';
			var passiveAreaName = activeAreaName === 'address' ? 'latlong' : 'address';
			thisObj._currentVal['currentArea'] = activeAreaName;
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
			var selectors = [
				".addressGroup input[type='text']",
				".latitude input[type='text']",
				".longitude input[type='text']",
				".mapWidthWrapper input[type='text']",
				".mapHeightWrapper input[type='text']",
				".mapScaleWrapper input[type='text']"
			];
			
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				
				// テキスト入力欄のイベントを有効にする
				for (var i=0,len=selectors.length; i<len; i++) {
					thisObj._elems['propertyElement']
						.find(selectors[i])
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
				
				// スライダーイベントを有効にする
				thisObj._elems['propertyElement']
					.find(".mapWidthSlider")
						.slider('enable')
					.end()
					.find(".mapHeightSlider")
						.slider('enable')
					.end()
					.find(".mapScaleSlider")
						.slider('enable')
					.end()
				// アクティブエリアの切り替えイベントを有効にする
					.find('.switchBtn')
						.on('click', function(event) {
							var activeAreaName = $(this).hasClass('fromAddressBtn') ? 'address' : 'latlong';
							thisObj.switchActiveArea(activeAreaName);
						})
					.end()
				// 「地図の幅を～」ボタンのイベントを有効にする
					.find('.isFullWidthBtn')
						.on('click', function(event) {
							var sliderState = '';
							var isFullWidth = false;
							if ($(this).hasClass('active')) {
								thisObj._elems['propertyElement'].find(".mapWidthWrapper input[type='text']").removeAttr('disabled');
								sliderState = 'enable';
								isFullWidth = false;
							} else {
								thisObj._elems['propertyElement'].find(".mapWidthWrapper input[type='text']").attr('disabled','disabled');
								sliderState = 'disable';
								isFullWidth = true;
							}
							
							thisObj._elems['propertyElement'].find(".mapWidthSlider").slider(sliderState);
							thisObj._currentVal['isFullWidth'] = isFullWidth;
							thisObj.refreshStyle(true);
						})
						
				
				if (thisObj._currentVal['isFullWidth'] === true) {
					thisObj._elems['propertyElement'].find(".mapWidthSlider").slider('disable');
				}
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				
				// テキスト入力欄のイベントを無効にする
				for (var i=0,len=selectors.length; i<len; i++) {
					thisObj._elems['propertyElement']
						.find(selectors[i])
							.off('change')
							.off('focus')
							.off('blur');
				}
				
				// スライダーイベントを無効にする
				thisObj._elems['propertyElement']
					.find(".mapWidthSlider")
						.slider('disable')
					.end()
					.find(".mapHeightSlider")
						.slider('disable')
					.end()
					.find(".mapScaleSlider")
						.slider('disable');
						
				// アクティブエリアの切り替えイベントを無効にする
				thisObj._elems['propertyElement']
					.find('.switchBtn')
						.off('click');
			}
		}
	}
});
