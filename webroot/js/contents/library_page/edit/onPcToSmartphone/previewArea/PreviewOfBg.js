

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfBg');
	MYNAMESPACE.modules.PreviewOfBg = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfBg.prototype = {
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
			var elementDataObj = thisObj._instances['DataManager'].getElementDataObj(elementId);
			// console.log(elementId);
			// console.log(targetElem);
			// console.log('targetElem[0].nodeName = ' + targetElem[0].nodeName);
			// console.log('itemName = ' + elementDataObj['itemName']);
			if (targetElem.hasClass('tdForAbout')) {
				var splitIdArr = elementId.split('_');
				if (elementId.indexOf('_category') !== -1) {
					targetElem = $('#' + splitIdArr[0] + ' td.category');
					// console.log('targetElementはカテゴリー');

				} else {
					var col = splitIdArr[1].split('-')[1] - 0;
					var className = col === 0 ? 'key' : 'val';
					targetElem = $('#' + splitIdArr[0] + ' td.' + className);
					// console.log('targetElementは' + (className === 'key' ? 'キー' : '値'));
				}
			} else {
				if (targetElem[0].nodeName !== 'TD' && elementId !== 'displayArea' && itemName !== 'Library') {
					targetElem = $("#" + elementId).find(" > div.contentWrapper");
				}
			}
			var gradientVal = 'transparent';
			var gradientArr = [];

			if (targetProperty['imagePath'] !== '') {
				gradientArr.push("url(" + targetProperty['imagePath'] + ") 0 0 " + targetProperty['bgRepeat']);
			}

			if (targetProperty['isEnabledGradation']) {
				var gradationShade = 0 < (targetProperty['gradationShade'] - 0) / 100 ? (targetProperty['gradationShade'] - 0) / 100 : 0.20;
				targetProperty['gradationShade'] = gradationShade * 100;
				switch (targetProperty['gradationDirection']) {
					case 'bottomToTop':
						gradientVal = "-webkit-gradient(linear, left bottom, left top, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))";
						gradientArr.push("-webkit-gradient(linear, left bottom, left top, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))");
						break;

					case 'leftToRight':
						gradientVal = "-webkit-gradient(linear, left top, right bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))";
						gradientArr.push("-webkit-gradient(linear, left top, right bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))");
						break;

					case 'rightToLeft':
						gradientVal = "-webkit-gradient(linear, right top, left bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))";
						gradientArr.push("-webkit-gradient(linear, right top, left bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))");
						break;

					case 'centerToCorner':
						gradientVal = "-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 150, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))";
						gradientArr.push("-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 150, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))");
						break;

					case 'topToBottom':
					default:
						gradientVal = "-webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))";
						gradientArr.push("-webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, " + gradationShade + ")), to(rgba(0, 0, 0, " + gradationShade + ")))");
						targetProperty['gradationDirection'] = 'topToBottom';
						break;

				}
			}

			// console.log('---------------------');
			// console.log('PreviewOfBg :: refreshStyle');
			// console.log('	elementId = ' + elementId);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('gradientArr');
			// console.log(gradientArr);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('---------------------');
			targetElem
				.css(
					{
						'background': gradientArr.length === 0 ? 'transparent' : gradientArr.join(','),
						'background-color'	: targetProperty['bgColor'] !== '' ? targetProperty['bgColor'] : 'transparent'
					}
				);

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
