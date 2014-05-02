

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * テキスト入力管理クラス
	 */
	MYNAMESPACE.namespace('modules.helper.TextInputManager');
	MYNAMESPACE.modules.helper.TextInputManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.TextInputManager.prototype = {
		_isEnabled						: false
		,_timer							: 0
		// ,_$focusedElem					: null

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'setTimer'
				,'checkValue'
				,'setEvent'
			);
		}

		/*
		 * タイマーをセットするメソッド
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,setTimer: function(event) {
			var thisObj = this;
			// thisObj._$focusedElem = $(event.currentTarget);
			// console.log('フォーカスセットor値変更で、_$focusedElem更新');
			// console.log('setTimer設定');
			if (thisObj._timer) {
				clearTimeout(thisObj._timer);
			}
			thisObj._timer = setTimeout(
				function(event2) {
					// console.log('setTimer発動');
					thisObj.checkValue(event);
				},
				3000
			);
			$(thisObj).trigger('onSetFocus');
		}

		/*
		 * 現在の入力値と前回の入力値を比較して、両者が異なっていればイベントをtriggerするメソッド
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,checkValue: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var currentVal = elem.val();
			var prevVal = elem.attr('data-prev-val');
			// if (event.type === 'blur') {
			// 	thisObj._$focusedElem = elem;
			// 	console.log('フォーカスblurで、_$focusedElem削除');
			// }
			// console.log('checkValue :: currentVal = ' + currentVal + ', prevVal = ' + prevVal);

			if (thisObj._timer) {
				clearTimeout(thisObj._timer);
			}
			if (currentVal !== prevVal) {
				// thisObj._targetElem = null;
				elem.attr('data-prev-val', currentVal);
				// console.log('trigger発動 :: currentVal = ' + currentVal);
				$(thisObj).trigger('onChangeValue', [elem, currentVal]);
			}
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	void
		 * @return	void
		 */
		,setEvent: function(targetElements, isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				targetElements.each(function(i) {
					var elem = $(this);
					var currentVal = elem.val();
					// console.log('	' + i + ' :: currentVal = ' + currentVal);
					elem
						.attr('data-prev-val', currentVal)
						.on('keydown', thisObj.setTimer)
						.on('focus', thisObj.setTimer)
						.on('blur', thisObj.checkValue)
				})

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				targetElements.each(function(i) {
					// console.log('	' + i + ' :: 削除');
					var elem = $(this);
					elem
						.off('keydown')
						.off('focus')
						.off('blur')
				})
			}
		}
	}
});
