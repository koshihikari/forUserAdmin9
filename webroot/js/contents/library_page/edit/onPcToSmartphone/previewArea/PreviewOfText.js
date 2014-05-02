

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfText');
	MYNAMESPACE.modules.PreviewOfText = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfText.prototype = {
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
			this._instances['Util'] = new MYNAMESPACE.modules.helper.Util();
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
			var textShadowColor = thisObj._instances['Util'].changeColorCode(targetProperty['textShadowColor'], true);
			// console.log(textShadowColor);
			var textShadow = targetProperty['textShadowX'] + 'px ' + targetProperty['textShadowY'] + 'px ' + targetProperty['textShadowBlur'] + 'px rgb(' + textShadowColor.r + ', ' + textShadowColor.g + ', ' + textShadowColor.b + ')';

			// if (elementId === 'id-1371923589822') {
			// 	console.log('PreviewOfText :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// 	console.log('	targetProperty');
			// 	console.log(targetProperty);
			// 	// console.log(targetElem);
			// }
			targetElem
				.css(
					{
						'color'				: targetProperty['color'],
						'fontSize'			: targetProperty['fontSize'] + "px",
						// 'fontSize'			: targetProperty['fontSize'] + "rem",
						'lineHeight'		: targetProperty['lineHeight'] + "px",
						'fontWeight'		: targetProperty['isEnabledBold'] ? 'bold' : 'normal',
						'fontStyle'			: targetProperty['isEnabledItalic'] ? 'italic' : 'normal',
						'textDecoration'	: targetProperty['isEnabledUnderline'] ? 'underline' : 'none',
						'textShadow'		: textShadow
					}
				);

			if (targetElem.hasClass('tdForAbout') === false) {
				var text = targetProperty['text'];
				var textNode = targetElem.find("span.text");
				targetElem = textNode.length === 0 ? targetElem : textNode;
				if (targetProperty['isEnabledHtml']) {
					text = text.replace(/&lt;/g, "<");
					text = text.replace(/&gt;/g, ">");
					targetElem.html(text.replace(/\n/g, ""));
					// if (elementId === 'id-1371923589822') {
					// 	console.log('text');
					// 	console.log(text);
					// }
				} else {
					var text = targetProperty['text'].replace(/\n/g, "<br />");
					targetElem.html(targetProperty['text'].replace(/\n/g, "<br />"));
					// if (elementId === 'id-1371923589822') {
					// 	console.log('text2');
					// 	console.log(text);
					// }
				}
			}
			// if (elementId === 'id-1371923589822') {
			// 	console.log('PreviewOfText :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// 	console.log('	targetProperty');
			// 	console.log(targetProperty);
			// 	// console.log(targetElem);
			// }

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
