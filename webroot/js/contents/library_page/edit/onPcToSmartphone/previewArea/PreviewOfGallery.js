

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfGallery');
	MYNAMESPACE.modules.PreviewOfGallery = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfGallery.prototype = {
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

			console.log('-------------');
			console.log('PreviewOfGallery :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			console.log('targetProperty');
			console.log(targetProperty);
			console.log('-------------');

			var hasContents = targetProperty && targetProperty['contents'] && 0 < targetProperty['contents'].length ? true : false;
			var source ='\
				<div class="flexslider">\
				';
			if (hasContents) {
				source +='\
					<ul class="slides">\
				';
				for (var i=0,len=targetProperty['contents'].length; i<len; i++) {
					source += '\
						<li>\
							<img src="' + targetProperty['contents'][i] + '" />\
						</li>\
					';
				}
				source +='\
					</ul>\
				';
			}
			source +='\
				</div>\
			';
			targetElem
				.find('.contentWrapper')
				.find('> *')
				.remove()
				.end()
				.append(source);

			if (hasContents) {
				$('.flexslider')
					.removeClass('empty')
					.attr(
						{
							'data-animation'			: targetProperty['animationType'],
							'data-slideshow'			: targetProperty['isAutoPlay'] === true ? 1 : 0,
							'data-slideshowSpeed'		: targetProperty['slideshowSpeed'] * 1000,
							'data-animationDuration'	: targetProperty['animationSpeed'] * 1000,
							'data-animationLoop'		: targetProperty['isLoopPlay'] === true ? 1 : 0,
							'data-contents'				: targetProperty['contents'].join(',')
						}
					)
					.flexslider({
						animation				: targetProperty['animationType'],
						slideshow				: targetProperty['isAutoPlay'],
						slideshowSpeed			: targetProperty['slideshowSpeed'] * 1000,
						animationDuration		: targetProperty['animationSpeed'] * 1000,
						animationLoop			: targetProperty['isLoopPlay'],
						smoothHeight			: true
					});
			} else {
				$('.flexslider').addClass('empty');
			}

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
