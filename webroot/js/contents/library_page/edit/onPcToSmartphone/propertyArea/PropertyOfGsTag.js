

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
			thisObj._currentVal['isPreview'] = thisObj._currentVal['isPreview'] === false ? false : true;
			thisObj._currentVal['tag'] = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
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
										<button type="button" class="btn btn-primary isAbout' + (thisObj._currentVal['type'] === 'about' ? ' active' : '') + '" data-item-name="about" data-placement="bottom" data-original-title="物件詳細ページのGSを挿入します。"><span>物件概要</span></button>\
										<button type="button" class="btn btn-primary isMPlan' + (thisObj._currentVal['type'] === 'plan' ? ' active' : '') + '" data-item-name="plan" data-placement="bottom" data-original-title="間取りページのGSを挿入します。"><span>間取り</span></button>\
										<button type="button" class="btn btn-primary isModelroom' + (thisObj._currentVal['type'] === 'modelroom' ? ' active' : '') + '" data-item-name="modelroom" data-placement="bottom" data-original-title="モデルルームページのGSを挿入します。"><span>モデルルーム</span></button>\
										<button type="button" class="btn btn-primary isAppearance' + (thisObj._currentVal['type'] === 'appearance' ? ' active' : '') + '" data-item-name="appearance" data-placement="bottom" data-original-title="外観ページのGSを挿入します。"><span>外観</span></button>\
										<button type="button" class="btn btn-primary isMap' + (thisObj._currentVal['type'] === 'map' ? ' active' : '') + '" data-item-name="map" data-placement="bottom" data-original-title="現地案内図ページのGSを挿入します。"><span>現地案内図</span></button>\
									</div>\
								</div>\
								<div class="group gs-preview">\
									<p>プレビュー表示するかどうか</p>\
									<div class="btn-group" data-toggle="buttons-radio" data-item-name="type">\
										<button type="button" class="btn btn-primary isEnabledOfPreview' + (thisObj._currentVal['isPreview'] === true ? ' active' : '') + '" data-item-name="isEnabledOfPreview" data-placement="bottom" data-original-title="プレビューエリアにGSを展開します。"><span>プレビューする</span></button>\
										<button type="button" class="btn btn-primary isDisabledOfPreview' + (thisObj._currentVal['isPreview'] !== true ? ' active' : '') + '" data-item-name="isDisabledOfPreview" data-placement="bottom" data-original-title="プレビューエリアにGSを展開しません。"><span>プレビューしない</span></button>\
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
			thisObj._currentVal['tag'] = thisObj.createGsTag(thisObj._currentVal['url'], thisObj._currentVal['type']);
			$('.gs-tag .preview').val(thisObj._currentVal['tag']);
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('GSTagデータ保存');
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * ページタイプのラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButton: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			if (itemName === 'isEnabledOfPreview' || itemName === 'isDisabledOfPreview') {
				thisObj._currentVal['isPreview'] = itemName === 'isEnabledOfPreview' ? true : false;
			} else {
				thisObj._currentVal['type'] = itemName;
			}
			// thisObj._currentVal['type'] = elem.attr('data-item-name');
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
					.on('click', '[data-toggle="buttons-radio"] > .btn', thisObj.onClickRadioButton);

			} else if (isEnabled === false && thisObj._isEnabled === true) {
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find(".input[type='text'][name='url']")
						.off('change')
						.off ('focus')
						.off('blur')
					.end()
					.off('click', '[data-toggle="buttons-radio"] > .btn');
			}
		}
	}
});
