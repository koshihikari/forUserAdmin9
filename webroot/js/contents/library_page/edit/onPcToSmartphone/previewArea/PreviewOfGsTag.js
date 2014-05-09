

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfGsTag');
	MYNAMESPACE.modules.PreviewOfGsTag = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfGsTag.prototype = {
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
				,'refreshStyle'
			);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElement = $('#' + elementId);
			// console.log('-------------------');
			// console.log('PreviewOfCode :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElement');
			// console.log(targetElement);
			// console.log('-------------------');
			if (targetProperty['url'] === '') {
				targetElement.find('> .contentWrapper').empty().addClass('empty');
			} else {
				console.log('GS展開');
				targetElement.find('> .contentWrapper').empty().html(targetProperty['tag']);
				/*
				var code = targetProperty['source'];
				code = code.replace(/\n/g, "");
				console.log('------------------');
				console.log('置換前');
				console.log(code);
				var reForJs = /<script.*?<\/script>/g;
				var result = code.match(reForJs);
				if (result) {
					for (var i=0,len=result.length; i<len; i++) {
						code = code.replace(result[i], '');
					}
					console.log(result);
					console.log('jsです。');
				} else {
					console.log('jsではないです。');
				}
				code = code.replace(/&lt;/g, "<");
				code = code.replace(/&gt;/g, ">");
				var wrapperElement = targetElement.find('> .contentWrapper');
				wrapperElement.html(code).removeClass('empty');
				if (wrapperElement.find('> *').eq(0).height() < 200) {
					wrapperElement.find('> *').eq(0).addClass('minimum');
				}
				*/
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
