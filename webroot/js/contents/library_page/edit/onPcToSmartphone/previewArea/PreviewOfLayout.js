

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfLayout');
	MYNAMESPACE.modules.PreviewOfLayout = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfLayout.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(this, 'refreshStyle');
		}
		
		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElem = $("#" + elementId);

			if (targetElem.hasClass('tdForAbout')) {
				var splitIdArr = elementId.split('_');
				if (elementId.indexOf('_category') !== -1) {
					targetElem = $('#' + splitIdArr[0] + ' td.category');
					
				} else {
					var col = splitIdArr[1].split('-')[1] - 0;
					var className = col === 0 ? 'key' : 'val';
					targetElem = $('#' + splitIdArr[0] + ' td.' + className);
				}
			}

			// console.log('---------------------');
			// console.log('PreviewOfLayout :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('---------------------');

			targetElem
				.css(
					{
						'textAlign'		: targetProperty['textAlign']
					}
				);

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
