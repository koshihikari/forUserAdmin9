

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfImage');
	MYNAMESPACE.modules.PreviewOfImage = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfImage.prototype = {
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
			// var imageElem = targetElem.find('> .contentWrapper .img > img');
			var imageElem = targetElem.find('> .contentWrapper');
			// console.log('---------------------');
			// console.log('PreviewOfImage :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('thisObj._count = ' + thisObj._count);
			// console.log('---------------------');

			var method = function() {
				// 画像のサイズ指定
				if (targetProperty['sizeway'] === 'pixel') {
					imageElem
						.find('.img')
							.css(
									{
										width	: targetProperty['imageWidth'] + 'px',
										height	: targetProperty['imageHeight'] + 'px'
									}
							)
							.find('>img')
								.css(
									{
										width	: targetProperty['imageWidth'] + 'px',
										height	: targetProperty['imageHeight'] + 'px'
									}
								)
				} else {
					imageElem
						.find('.img')
							.css(
									{
										width		: targetProperty['imageScale'] + '%',
										height		: 'auto'
									}
							)
							.find('>img')
								.css(
									{
										width		: targetProperty['imageScale'] + '%',
										height		: 'auto'
									}
								)
				}
				$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
			}

			// console.log('src = ' + imageElem.attr('src'));
			// console.log('imagePath = ' + targetProperty['imagePath']);
			// console.log('prevImagePath = ' + targetProperty['prevImagePath']);
			// if (targetProperty['imagePath'] !== targetProperty['prevImagePath'] || imageElem.attr('src') === '') {
			if (targetProperty['imagePath'] !== targetProperty['prevImagePath'] || imageElem.find('.img > img').attr('src') === '') {
				// console.log('画像表示');
				if (targetProperty['imagePath'] === '') {
					// imageElem.parent().addClass('empty');
					imageElem.find('.img').addClass('empty');
					var cloneElem = imageElem.find('.img > img').clone().attr('src', '');
					// var cloneElem = imageElem.clone().attr('src', '');
					// imageElem.after(cloneElem).remove();
					imageElem.find('.img > img').after(cloneElem).remove();
					$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
				} else {
					imageElem.find('.img').removeClass('empty');
					// imageElem.parent().removeClass('empty');
					// imageElem
					imageElem
						.find('.img > img')
						.attr('src', targetProperty['imagePath'])
							.load(function(event) {
								// console.log('読み込み完了 :: isEnforcement = ' + isEnforcement);
								targetProperty['imageWidth'] = targetProperty['imageWidth'] === -1 ? this.naturalWidth - 0 : targetProperty['imageWidth'];
								targetProperty['imageHeight'] = targetProperty['imageHeight'] === -1 ? this.naturalHeight - 0 : targetProperty['imageHeight'];
								targetProperty['masterImageWidth'] = this.naturalWidth - 0;
								targetProperty['masterImageHeight'] = this.naturalHeight - 0;
								targetProperty['prevImagePath'] = targetProperty['imagePath'];

								targetProperty['imageWidth'] = targetProperty['masterImageWidth'] < targetProperty['imageWidth'] ? targetProperty['masterImageWidth'] : targetProperty['imageWidth'];
								targetProperty['imageHeight'] = targetProperty['masterImageHeight'] < targetProperty['imageHeight'] ? targetProperty['masterImageHeight'] : targetProperty['imageHeight'];

								// console.log('画像を読み込んだんのでサイズを反映')
								$(thisObj).trigger('onLoadCompleteImage', [elementId, 'Image', $.extend(true, {}, targetProperty)]);
							});
					method();
				}
			} else {
				method();
			}
		}
	}
});
