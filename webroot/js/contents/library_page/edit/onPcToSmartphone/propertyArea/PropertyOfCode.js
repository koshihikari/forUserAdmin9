

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示する配置プロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfCode');
	MYNAMESPACE.modules.PropertyOfCode = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfCode.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_currentVal					: {}
		,_hasSaveData					: false
		,_timers						: {}
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
			
			_.bindAll(this, 'getElem', 'getProperty', 'createElement', 'refreshStyle', 'onChangeTextarea', 'setEvent');
			this._targetId = id;
			this._elementType = 'Code';
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
			var source = '\
						<div class="propertyElement forCodeElement">\
							<p class="elementTitle">コード</p>\
							<div class="contentWrapper">\
								<p class="caution">\
									※JavaScriptを記述した場合、本番ページ以外では動作しません。<br />動作確認する場合は本番ページを表示して下さい。\
								</p>\
								<textarea>' + thisObj._currentVal['source'] + '</textarea>\
							</div>\
						</div>\
			';
			return $(source);
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
			
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				 console.log('Codeデータ保存');
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}
		
		/*
		 * Textareaの内容が変わった際にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
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
				
			} else if (isEnabled === false && thisObj._isEnabled === true) {
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.off('change', 'textarea')
					.off('focus', 'textarea')
					.off('blur', 'textarea');
			}
		}
	}
});
