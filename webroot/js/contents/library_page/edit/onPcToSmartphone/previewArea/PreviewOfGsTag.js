

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfGsTag');
	MYNAMESPACE.modules.PreviewOfGsTagPreviewOfGsTag = function() {
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
			if (targetProperty['source'] === '') {
				targetElement.find('> .contentWrapper').empty().addClass('empty');
			} else {
				var code = targetProperty['source'];
				code = code.replace(/\n/g, "");
				console.log('------------------');
				console.log('置換前');
				console.log(code);
				// if (code.match('<style>(.)*</style>')) {
				// 	console.log('cssです。');
				// } else {
				// 	console.log('cssではないです。');
				// }
				// var reForJs = '<script>(.)*</script>';
				// var reForJs = /<script>(.)*<\/script>/g;
				var reForJs = /<script.*?<\/script>/g;
				var result = code.match(reForJs);
				if (result) {
					for (var i=0,len=result.length; i<len; i++) {
						code = code.replace(result[i], '');
					}
				// if (code.match(reForJs)) {
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
				/*
				// targetElement.find('> .contentWrapper').html(code).removeClass('empty');
				if (result) {
					var scriptElems = '';
					for (var i=0,len=result.length; i<len-0; i++) {
						scriptElems += result[i].replace(/<\//g, "<\\/");
				//		var replacedElem = $(result[i].replace(/<\//g, "<\\/"));
				//		var scriptElem = $('<script>').attr('src', replacedElem.attr('src'));
				//		console.log('追加');
				//		console.log(scriptElem);
						// console.log($(result[i]));
						// console.log(result[i].replace(/<\//g, "<\\/"));
						// wrapperElement.append($(replacedElem));
				//		wrapperElement.append(scriptElem);
						// console.log(wrapperElement);
						// console.log(scriptElem);
						// wrapperElement.append($(result[i].replace(/<\//g, "<\\/")));
						// wrapperElement.append($('<script>$(function() {alert("アラート");})</script>'));
						// wrapperElement.append($('<script>alert("アラート");</script>'));
					}
					console.log(scriptElems);
					wrapperElement.append($(scriptElems));
				}
				console.log('置換後');
				// console.log(code);
				console.log(targetElement.find('> .contentWrapper').html());
				console.log(targetElement);
				console.log('------------------');
				*/
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
