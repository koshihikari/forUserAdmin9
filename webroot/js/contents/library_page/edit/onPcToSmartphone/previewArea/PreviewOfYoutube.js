

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfYoutube');
	MYNAMESPACE.modules.PreviewOfYoutube = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfYoutube.prototype = {
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
			$("#"+elementId).addClass('empty');
			$(thisObj).trigger('onCompleteBuild', elementId);
		}
		
		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty, isPublishStaticPage) {
			var thisObj = this;
			var targetElem = $("#" + elementId);

			isPublishStaticPage = isPublishStaticPage === true ? true : false;

			// console.log('---------------------');
			// console.log('PreviewOfYoutube :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('---------------------');

			if (isPublishStaticPage === true) {
				var url = '';
				if (targetProperty['url'] !== '' && targetProperty['url'].indexOf('http://www.youtube.com/') !== -1) {
					var url = targetProperty['url'].replace('/watch?v=', '/embed/');
					var split = targetProperty['url'].split('?');
					if (split.length === 2) {
						var split2 = split[1].split('&');
						for (var key in split2) {
							var split3 = split2[key].split('=');
							if (split3[0] === 'v') {
								url = split3[1];
								break;
							}
						}
					}
				}
				targetElem.attr(
					{
						'data-youtube-url'		: url
					}
				);
			} else {
				// if (targetProperty['url'] !== '') {
					targetElem.addClass('empty');
					if (targetProperty['url'] === '' || targetProperty['url'].indexOf('http://www.youtube.com/') === -1) {
						targetElem.attr('data-youtube-url', '').find('.youtube > *').remove();
						// targetElem.attr('data-youtube-url', '').find('.youtube > *').remove().end().addClass('empty');
					} else {
						var url = targetProperty['url'].replace('/watch?v=', '/embed/');
						var split = targetProperty['url'].split('?');
						if (split.length === 2) {
							var split2 = split[1].split('&');
							for (var key in split2) {
								var split3 = split2[key].split('=');
								if (split3[0] === 'v') {
									url = split3[1];
									break;
								}
							}
							var src = '<iframe dmle_widget="dudaYouTubeId" class="youtubeExt dmNoMark" src="http://www.youtube.com/embed/' + url + '?html5=1&amp;wmode=Opaque" frameborder="0" allowfullscreen="" id="1510038864" duda_id="1510038864" dmle_insert="true"></iframe>';
							targetElem.attr('data-youtube-url', targetProperty['url']).find('.youtube > *').remove().end().removeClass('empty').find('.youtube').append(src);
						}
					}
				// }
				
				targetElem
					.find('iframe')
						.css(
							{
								'width'			: '100%',
								'height'		: Math.round(targetElem.width() * 180 / 320) + 30
							}
						);
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
