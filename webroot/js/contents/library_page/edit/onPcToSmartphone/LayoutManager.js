

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.LayoutManager');
	MYNAMESPACE.modules.library_page.edit.LayoutManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.LayoutManager.prototype = {
		_isEventEnabled							: false
		,_isOnceEventEnabled					: false
		// ,_methodObj								: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		// ,initialize: function(methodObj) {
		,initialize: function() {
			var thisObj = this;
			_.bindAll(this, 'onResizeWindow', 'setOnceEvent', 'setEvent');

			// this._methodObj = methodObj;
			this.onResizeWindow();
		}

		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var height = $("#contentForUserAdmin").height();
			var residueWidth = $("#contentForUserAdmin").width() - $('#previewArea').width();
			var toolbarWidth = Math.round(residueWidth * 0.25);
			toolbarWidth = 300 < toolbarWidth ? 300 : toolbarWidth;
			toolbarWidth = 200 < toolbarWidth ? 200 : toolbarWidth;
			toolbarWidth = 191;
			if ($('#toolbar').length) {
				var toolbarHeight = height + 10 - ($('#toolbar').css('top').replace('px', '') - 0);
				toolbarHeight -= 16;
				// toolbarHeight -= 15;
			}
			var propertyAreaWidth = residueWidth - toolbarWidth - 11;
			var iphone5Height = height - 55;
		//	var iphone5HeaderHeight = (height - 155 < 510) ? height - 155 : 510;
			// var iphone5BodyHeight = iphone5Height - (iphone5HeaderHeight + 114);

			// console.log('----------');
			// console.log('$(#spContentWrapper).height() = ' + $('#spContentWrapper').height());
			// console.log('height = ' + height);
			// console.log('typeof height = ' + typeof height);
			// console.log('$(#spContent).css(height, 100%).height() = ' + ($('#spContent').css('height', '100%').height()));
			// console.log('(0 < (height - 312) = ' + (0 < (height - 312)));
			$('#spContent').css('height', '100%');
			if ($('#spContent').height() === 0 || $('#spContent').height() < (height-312)) {
				// console.log('リサイズ必要');
				$('#spContent').height(height-312);
			// 	console.log('$(#spContent).css(height) = ' + ($('#spContent').css('height')));
			// 	console.log('$(#spContent).height() = ' + $('#spContent').height());
			// } else {
			// 	console.log('aaa');
			}
			// console.log('----------');
			$('#previewArea')
				.height(height - 43)
				// .height(height)
					.find('.iphone5')
						.height(height - 68)
						/*
						// .height(height - 61)
						.find('.iphone5-header')
							.height(iphone5HeaderHeight)
						.end()
						.find('.iphone5-body')
							.css(
								{
									'height'	: (iphone5BodyHeight),
									'top'		: (iphone5HeaderHeight)
								}
							)
						*/
						.end()
						.find('#spContentWrapper')
							.height(height - 258)
							// .height(height - 298)
							// .height(height - 312)
							/*
							.find('#displayArea')
								.find('#spContent')
									.height(height - 312);
									// .height((0 < (height - 312) ? (height - 312) : '100%'));
									// .height((0 < (height - 312) ? '100%' : (height - 312)));
									// .height((0 < (height - 312) ? '100%' : (height - 312)));
									*/
			if ($('#toolbar').length) {
				$('#toolbar')
					.height(toolbarHeight);
			}
			$('#propertyArea')
				.width(propertyAreaWidth)
				.height(height)
				.find('>div')
					.height(height - 30)
					// .height(height - 56)
					.find('.propsWrapper')
						.height(height - 75);
						// .height(height - 116);

			$('.selectLinkPageModal')
				.find('.pageList')
					.height(height / 2);

			$(thisObj).trigger('onCompleteResize');
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(window)
					.on('resize', function(event) {
						thisObj.onResizeWindow(event);
					})
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEventEnabled === false) {
				thisObj._isEventEnabled = true;

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;
			}
		}
	}
});
