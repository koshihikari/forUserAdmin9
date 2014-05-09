

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する配置プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfGsTag');
	MYNAMESPACE.modules.PropertyOfGsTag = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfGsTag.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_currentVal					: {}
		,_hasSaveData					: false
		,_timers						: {}
		,_timerId						: -1
		/*
		,tooltipMessages				: {
			'isLeft'					: ['表示する内容を左揃えにします。'],
			'isCenter'					: ['表示する内容を中央に配置します。'],
			'isRight'					: ['表示する内容を右揃えにします']
		}
		*/

		/*
		 * @param	dataManager 	データ管理クラスのインスタンス
		 * @param	id 				プロパティを表示するエレメントのID
		 * @param	methodObj 		メソッド保持オブジェクト
		 * @param	properties 		このクラスで管理するプロパティエレメントのプロパティオブジェクト
		 * @return	void
		 */
		,initialize: function(instances, id) {
			var thisObj = this;

			_.bindAll(this, 'getElem', 'getProperty', 'createGsTag', 'createElement', 'refreshStyle', 'onClickRadioButton', 'onChangeText', 'setEvent');
			this._targetId = id;
			this._elementType = 'GsTag';
			this._instances = instances;
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement
			}
			// console.log('---------');
			// console.log('this._instances');
			// console.log(this._instances);
			// console.log('elementProperty');
			// console.log(elementProperty);
			// console.log('this._currentVal');
			// console.log(this._currentVal);
			// console.log('---------');
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
			var type = '';
			switch (thisObj._currentVal['type']) {
				case 'about':
					type = 'about';
					break;
				case 'plan':
					type = 'plan';
					break;
				case 'modelroom':
					type = 'modelroom';
					break;
				case 'appearance':
					type = 'appearance';
					break;
				case 'map':
					type = 'map';
					break;
				default:
					type = 'about';
					break;
			}
			thisObj._currentVal['type'] = type;
			thisObj._currentVal['tag'] = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
			// var gsTag = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
			var source = '\
						<div class="propertyElement forGsTagElement">\
							<p class="elementTitle">Google Spreadsheet埋め込み</p>\
							<div class="contentWrapper">\
								<div class="group gs-url">\
									<p>Google SpreadsheetのURL</p>\
									<input type="text" name="url" value="' + thisObj._currentVal['url'] + '" placeholder="GSのURLを入力してください">\
								</div>\
								<div class="group gs-page-type">\
									<p>ページタイプ</p>\
									<div class="btn-group" data-toggle="buttons-radio" data-item-name="type">\
										<button type="button" class="btn btn-primary isAbout' + (thisObj._currentVal['type'] === 'about' ? ' active' : '') + '" data-item-name="about" data-placement="bottom" data-original-title="物件詳細ページのGSを展開します。"><span>物件概要</span></button>\
										<button type="button" class="btn btn-primary isMPlan' + (thisObj._currentVal['type'] === 'plan' ? ' active' : '') + '" data-item-name="plan" data-placement="bottom" data-original-title="間取りページのGSを展開します。"><span>間取り</span></button>\
										<button type="button" class="btn btn-primary isModelroom' + (thisObj._currentVal['type'] === 'modelroom' ? ' active' : '') + '" data-item-name="modelroom" data-placement="bottom" data-original-title="モデルルームページのGSを展開します。"><span>モデルルーム</span></button>\
										<button type="button" class="btn btn-primary isAppearance' + (thisObj._currentVal['type'] === 'appearance' ? ' active' : '') + '" data-item-name="appearance" data-placement="bottom" data-original-title="外観ページのGSを展開します。"><span>外観</span></button>\
										<button type="button" class="btn btn-primary isMap' + (thisObj._currentVal['type'] === 'map' ? ' active' : '') + '" data-item-name="map" data-placement="bottom" data-original-title="現地案内図ページのGSを展開します。"><span>現地案内図</span></button>\
									</div>\
								</div>\
								<div class="group gs-tag">\
									<p>挿入されるGSタグ</p>\
									<textarea class="preview" readonly>' + thisObj._currentVal['tag'] + '</textarea>\
								</div>\
							</div>\
						</div>\
			';
			return $(source);
		}

		/*
		 * GoogleSpreadsheet埋め込み用タグを生成するメソッド
		 * @param	url			埋め込むGSのURL
		 * @param	type		埋め込むGSのページタイプ
		 * @return	GoogleSpreadsheet埋め込み用タグ
		 */
		,createGsTag: function(url, type) {
			var thisObj = this;
			var gsTag = '';
			switch (type) {
				case 'about':
					gsTag = '<!--insert_gs_to_about(' + url + ')-->';
					break;
				case 'plan':
					gsTag = '<!--insert_gs_to_plan(' + url + ')-->';
					break;
				case 'modelroom':
					gsTag = '<!--insert_gs_to_modelroom(' + url + ')-->';
					break;
				case 'appearance':
					gsTag = '<!--insert_gs_to_appearance(' + url + ')-->';
					break;
				case 'map':
					gsTag = '<!--insert_gs_to_map(' + url + ')-->';
					break;
			}
			return gsTag;
		}

		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			var targetElem = $("#" + thisObj._targetId);
			// targetElem
			// 	.css(
			// 		{
			// 			'textAlign'		: thisObj._currentVal['textAlign']
			// 		}
			// 	);
			// GSタグの更新
			// var gsTag = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
			thisObj._currentVal['tag'] = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
			$('.gs-tag .preview').val(thisObj._currentVal['tag']);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('GSTagデータ保存');
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * Textareaの内容が変わった際にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		 /*
		,onChangeTextarea: function(event) {
			var thisObj = this;
			var val = $(event.currentTarget).val();

			if (thisObj._currentVal['source'] !== val) {
				// var targetElem = $("#" + thisObj._targetId);
				// if (val !== "") {
				// 	$("#" + thisObj._targetId).removeClass("empty");
				// } else {
				// 	targetElem.addClass("empty");
				// }
				thisObj._currentVal['source'] = val;
				thisObj._hasSaveData = true;
				thisObj.refreshStyle();

				if (thisObj._timers['forTextarea']) {
					clearTimeout(thisObj._timers['forTextarea']);
				}
				thisObj._timers['forTextarea'] = setTimeout(
					function(event) {
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					},
					3000
				);
			}
		}
		*/

		/*
		 * ページタイプのラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButton: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			// var parentItemName = elem.parent().attr('data-item-name');
			// var obj = {
			// 	'isSelf'		: '_self',
			// 	'isBlank'		: '_blank',
			// 	'isUrl'			: 'url',
			// 	'isMail'		: 'mail',
			// 	'isPhoneNum'	: 'phoneNum'
			// }
			thisObj._currentVal['type'] = elem.attr('data-item-name');
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * リンク先URLの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"url"===URLの値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event) {
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var val = currentTarget.val();

			// if (
			// 	currentTarget.attr('name') === 'linkUrl' ||
			// 	currentTarget.attr('name') === 'linkPageId' ||
			// 	currentTarget.attr('name') === 'mapUrl'
			// ) {
				// var key = currentTarget.attr('name') === 'linkUrl' ? 'linkUrl' : 'mapUrl';
				// console.log('-------');
				// console.log('url = ' + thisObj._currentVal['url']);
				// console.log('val = ' + val);
				var key = currentTarget.attr('name');
				if (thisObj._currentVal[key] !== val) {
					thisObj._currentVal[key] = val;
					// console.log('データ更新');
					thisObj._hasSaveData = true;
					thisObj.refreshStyle();

					if (thisObj._timers[key]) {
						clearTimeout(thisObj._timers[key]);
					}
					thisObj._timers[key] = setTimeout(
						function(event) {
							if (thisObj._hasSaveData === true) {
								thisObj.refreshStyle(true);
							}
						},
						3000
					);
				}
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
					.find("input[type='text'][name='url']")
						.on('change', function(event) {
							thisObj.onChangeText(event);
						})
						.on('focus', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
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
					.on('click', '[data-toggle="buttons-radio"] > .btn', thisObj.onClickRadioButton)
					/*
					.on('change', 'textarea', thisObj.onChangeTextarea)
					.on('focus', 'textarea', function(event) {
						if (thisObj._timers['onFocus']) {
							clearInterval(thisObj._timers['onFocus']);
						}
						thisObj._timers['onFocus'] = setInterval(function(event2) {thisObj.onChangeTextarea(event);}, 100);
					})
					.on('blur', 'textarea', function(event) {
						if (thisObj._timers['onFocus']) {
							clearInterval(thisObj._timers['onFocus']);
						}
						if (thisObj._hasSaveData === true) {
							thisObj.refreshStyle(true);
						}
					});
*/

			} else if (isEnabled === false && thisObj._isEnabled === true) {
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find(".input[type='text'][name='url']")
						.off('change')
						.off ('focus')
						.off('blur')
					.end()
					.off('click', '[data-toggle="buttons-radio"] > .btn')
					// .off('change', 'textarea')
					// .off('focus', 'textarea')
					// .off('blur', 'textarea');
			}
		}
	}
});
