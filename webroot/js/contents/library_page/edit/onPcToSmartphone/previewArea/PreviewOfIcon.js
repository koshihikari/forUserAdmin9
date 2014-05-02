

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfIcon');
	MYNAMESPACE.modules.PreviewOfIcon = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfIcon.prototype = {
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
			_.bindAll(
				this
				,'refreshStyle'
			);
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

			// console.log('-------------');
			// console.log('PreviewOfIcon :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('-------------');
			var textShadowColor = thisObj._instances['Util'].changeColorCode(targetProperty['textShadowColor'], true);
			var textShadow = targetProperty['textShadowX'] + 'px ' + targetProperty['textShadowY'] + 'px ' + targetProperty['textShadowBlur'] + 'px rgb(' + textShadowColor.r + ', ' + textShadowColor.g + ', ' + textShadowColor.b + ')';
			
			targetElem
				.css(
					{
						'color'				: targetProperty['color'],
						'fontSize'			: targetProperty['fontSize'] + "rem",
						'lineHeight'		: targetProperty['lineHeight'] + "rem",
						'fontWeight'		: targetProperty['isEnabledBold'] ? 'bold' : 'normal',
						'fontStyle'			: targetProperty['isEnabledItalic'] ? 'italic' : 'normal',
						'textDecoration'	: targetProperty['isEnabledUnderline'] ? 'underline' : 'none',
						'textShadow'		: textShadow
					}
				)
				.find('i').remove()
				.end()
				.find('>.contentWrapper')
				.append('<i data-icon="&' + targetProperty['code'] + '">');

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
