

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfSpace');
	MYNAMESPACE.modules.PreviewOfSpace = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfSpace.prototype = {
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
			var targetElem = $("#" + elementId);

			var marginTop = targetProperty['marginTop'] + 'px';
			var marginRight = targetProperty['isMarginCentering'] === true ? targetProperty['marginRight'] : targetProperty['marginRight'] + 'px';
			var marginBottom = targetProperty['marginBottom'] + 'px';
			var marginLeft = targetProperty['isMarginCentering'] === true ? targetProperty['marginLeft'] : targetProperty['marginLeft'] + 'px';
			var paddingTop = targetProperty['paddingTop'] + 'px';
			var paddingRight = targetProperty['paddingRight'] + 'px';
			var paddingBottom = targetProperty['paddingBottom'] + 'px';
			var paddingLeft = targetProperty['paddingLeft'] + 'px';

			var elementDataObj = thisObj._instances['DataManager'].getElementDataObj(elementId);

			// console.log('---------------------');
			// console.log('PreviewOfSpace :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('---------------------');
			if (targetElem.hasClass('tdForAbout')) {
				/*
				var splitIdArr = elementId.split('_');
				var col = splitIdArr[1].split('-')[1] - 0;
				var className = col === 0 ? 'key' : 'val';
				targetElem = $('#' + splitIdArr[0] + ' td.' + className);
				*/

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
				targetElem
					.css(
						{
							marginTop		: marginTop,
							marginRight		: targetProperty['isMarginCentering'] === true ? 'auto' : marginRight,
							marginBottom	: marginBottom,
							marginLeft		: targetProperty['isMarginCentering'] === true ? 'auto' : marginLeft,
							paddingTop		: paddingTop,
							paddingRight	: paddingRight,
							paddingBottom	: paddingBottom,
							paddingLeft		: paddingLeft
						 }
					)
			} else {
				targetElem
					.css(
						{
							marginTop		: marginTop,
							marginRight		: targetProperty['isMarginCentering'] === true ? 'auto' : marginRight,
							marginBottom	: marginBottom,
							marginLeft		: targetProperty['isMarginCentering'] === true ? 'auto' : marginLeft
						 }
					)
					.find('> div')
						.css(
							{
								paddingTop		: paddingTop,
								paddingRight	: paddingRight,
								paddingBottom	: paddingBottom,
								paddingLeft		: paddingLeft
							}
						)
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
