

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.ToolbarManager');
	MYNAMESPACE.modules.library_page.edit.ToolbarManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.ToolbarManager.prototype = {
		_isEventEnabled							: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(this, 'setEvent');

			$("#toolbar .sortable li").draggable(
				{
					connectToSortable	: "#previewArea .droppable",
					helper				: "clone",
					// zIndex				: 99999,
					scroll				: false,
					revert				: false,
					start				: function(event, ui) {
						$('#toolbar').css({'overflow':'hidden'});
					},
					stop				: function(event, ui) {
						$('#toolbar').css({'overflow':'scroll'});
					}
				}
			);

			$('#palette dd.open')
						.slideToggle(1);
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,onClickAccordion: function(event) {
			var thisObj = this;
			var targetElem = $(event.currentTarget);

			if (targetElem.hasClass('open')) {
				targetElem
					.find('+dd')
						.slideToggle('first')
				.end()
					.removeClass('open');
			} else {
				targetElem
					.find('+dd')
						.slideToggle('first')
				.end()
					.addClass('oepn');
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

				$('#palette')
					.find('> dl > dt')
						.on('click', function(event) {
							thisObj.onClickAccordion(event);
						})
					.end()
						.find('.libraries > dt')
							.on('click', function(event) {
								thisObj.onClickAccordion(event);
							})

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;
				$('#palette')
					.find('> dl > dt')
						.off('click');
			}
		}
	}
});
