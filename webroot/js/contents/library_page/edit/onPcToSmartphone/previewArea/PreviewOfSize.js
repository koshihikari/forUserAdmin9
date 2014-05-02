

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfSize');
	MYNAMESPACE.modules.PreviewOfSize = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfSize.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			this._instances = {
				'DataManager'		: DataManager
			}
			_.bindAll(
				this
				,'build'
				,'refreshStyle'
			);
		}
		
		/*
		 * このクラスで管理するエレメント構築ソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,build: function(elementId, targetProperty) {
			var thisObj = this;
			$(thisObj).trigger('onCompleteBuild', elementId);
		}
		
		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			// if (elementId === 'id-1362476536747') {
				// console.log('PreviewOfBg :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// 	console.log(targetProperty);
			// }
			var targetElem = $("#" + elementId);
			// var elementDataObj = thisObj._instances['DataManager'].getElementDataObj(elementId);
			// if (elementDataObj['itemName'] === 'AboutTd') {
			if (targetElem.hasClass('tdForAbout')) {
				var splitIdArr = elementId.split('_');
				var col = splitIdArr[1].split('-')[1] - 0;
				var className = col === 0 ? 'key' : 'val';
				targetElem = $('#' + splitIdArr[0] + ' td.' + className);
				// targetElem = $('#' + splitIdArr[0] + ' td.tdForAbout:eq(' + col + ')');
			} else {
				if (targetElem[0].nodeName !== 'TD' && elementId !== 'displayArea' && itemName !== 'Library') {
					targetElem = $("#" + elementId).find(" > div.contentWrapper");
				}
			}
			// console.log(elementId);
			// console.log(targetElem);
			// console.log(targetProperty);
			// console.log('targetElem[0].nodeName = ' + targetElem[0].nodeName);
			// console.log('itemName = ' + elementDataObj['itemName']);

			// var width = targetProperty['isPercentWidth'] === true ? targetProperty['percentWidth'] + '%' : targetProperty['pixelWidth'];
			var width = 0;
			// console.log('widthType = ' + targetProperty['widthType']);
			switch (targetProperty['widthType']) {
				case 'percent':
					width = targetProperty['percentWidth'] + '%';
					break;
				case 'pixel':
					width = targetProperty['pixelWidth'] + 'px';
					break;
				default:
					width = 'auto';
					break;
			}
			targetElem
				.css(
					{
						'width'		: width
					}
				);

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
