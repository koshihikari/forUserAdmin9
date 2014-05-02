

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.helper.ConcretePageManager.SpConcretePageManager');
	MYNAMESPACE.modules.helper.ConcretePageManager.SpConcretePageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.ConcretePageManager.SpConcretePageManager.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_libraryPageIds				: []

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			console.log('ConcretePageManager.SpConcretePageManager :: initialize');
			thisObj._instances = instances;
			_.bindAll(
				this
				,'renderThumbnail'
				,'doRenderingThumbnail'
				,'publish'
			);
		}
		/*
		 * 本番ページを書きだすメソッド
		 * @param	pageId		書きだすページID
		 * @return	void
		 */
		,renderThumbnail: function() {
			var thisObj = this;
			$('#pageList > li').each(function(i) {
				if ($(this).attr('id')) {
					thisObj._libraryPageIds.push($(this).attr('id').replace('record-id_', ''));
				}
			});
			$(thisObj).on('onCompletePublish', thisObj.doRenderingThumbnail);
			thisObj.doRenderingThumbnail();
		}
		/*
		 * 本番ページを書きだすメソッド
		 * @param	pageId		書きだすページID
		 * @return	void
		 */
		,doRenderingThumbnail: function() {
			var thisObj = this;
			if (thisObj._libraryPageIds.length) {
				thisObj.publish(thisObj._libraryPageIds.shift(), false);
			} else {
				$(thisObj).off('onCompletePublish');
				console.log('終わり');
			}
		}

		/*
		 * 本番ページを書きだすメソッド
		 * @param	recordId				書きだすページのレコードID
		 * @param	isPublishStaticPage		true===静的ページ書き出し
		 * @return	void
		 */
		// ,publish: function(residenceId, recordId, isPublishStaticPage) {
		,publish: function(residenceId, recordId, title, path, isPublishStaticPage) {
			var thisObj = this;
			// console.log('ConcretePageManagerForSmartphone :: publish :: recordId = ' + recordId);
			// var spContentElement;
			// if (0 < $('#spContent').length) {
			// 	spContentElement = $('#spContent');
			// 	spContentElement.empty();
			// } else {
			var tmpElement = $('<div>', {'id' : 'tmp'});
			var displayAreaElement = $('<div>', {'id' : 'displayArea'});
			var spContentElement = $('<div>', {'id' : 'spContent'});

				displayAreaElement.append(spContentElement);
				tmpElement.append(displayAreaElement);
				tmpElement.prependTo('body').hide();
				// tmpElement.prependTo('body');
			// console.log('spContentElement = ' + spContentElement.html());
			// console.log('tmpElement = ' + tmpElement.html());
			// console.log('displayAreaElement = ' + displayAreaElement.html());
				// displayAreaElement.prependTo('body').hide();
				// spContentElement.prependTo('body').hide();
			// }
			// var spContentElement = $('<div>').attr('id', 'spContent');
			// $('body').prepend(spContentElement);
			// thisObj._instances['RenderingManager'] = new MYNAMESPACE.modules.library_page.edit.RenderingManager();
			thisObj._instances['RenderingManager'].setEvent(false);
			thisObj._instances['RenderingManager'].setEvent(true);
			// $('#record-id_' + recordId).find('.thumb').empty();
			// spContentElement.prependTo($('body'));
			$(thisObj._instances['RenderingManager']).on('onCompleteRender', function(event) {
				$(thisObj._instances['RenderingManager']).off('onCompleteRender');
				// console.log('レンダリング完了');
				// console.log(spContentElement);
				// console.log(tmpElement.html());
				// console.log(tmpElement.find('.flexslider').length);
				// var pageSource = spContentElement.html();
				// spContentElement.find('> *').appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
				// $('#record-id_' + recordId).find('.thumb').append(spContentElement.find('> *'));
				// $('#record-id_' + recordId).find('.thumb').html(spContentElement.html());
				if (0 < tmpElement.find('.flexslider').length) {

					tmpElement.find('.flexslider').each(function(i) {
						var elem = $(this);
						// var animation					= elem.attr('data-animation');
						// var isAutoPlay					= elem.attr('data-slideshow') === '1' ? true: false;
						// var slideshowSpeed				= elem.attr('data-slideshowSpeed') - 0;
						// var animationDuration			= elem.attr('data-animationDuration') - 0;
						// var isLoopPlay					= elem.attr('data-animationLoop') === '1' ? true: false;
						if (elem.attr('data-contents') === undefined) {return;}
						var contents						= elem.attr('data-contents').split(',');
						var hasContents						= 0 < contents.length ? true : false;
						// var animation
						// 		'data-animation'			: targetProperty['animationType'],
						// 		'data-slideshow'			: targetProperty['isAutoPlay'] === true ? 1 : 0,
						// 		'data-slideshowSpeed'		: targetProperty['slideshowSpeed'] * 1000,
						// 		'data-animationDuration'	: targetProperty['animationSpeed'] * 1000,
						// 		'data-animationLoop'		: targetProperty['isLoopPlay'] === true ? 1 : 0,
						// 		'data-contents'				: targetProperty['contents'].join(',')
						var source ='';
						if (hasContents) {
							source +='\
								<ul class="slides">\
							';
							for (var j=0,len=contents.length; j<len; j++) {
								source += '\
									<li>\
										<img src="' + contents[j] + '" />\
									</li>\
								';
							}
							source +='\
								</ul>\
							';
						}
						elem
							.find('> *')
							.remove()
							.end()
							.append(source);
					});
				}

				// console.log('isPublishStaticPage = ' + isPublishStaticPage);
				if (isPublishStaticPage === true) {
				// console.log(spContentElement);
				// console.log(spContentElement.html());
					// var path = $('#record-id_' + recordId).find('input[name="path"]').val();
					// var title = $('#record-id_' + recordId).find('input[name="title"]').val();
					var companyId = $('input[type="hidden"][name="companyId"]').val();
					// var residenceId = $('input[type="hidden"][name="residenceId"]').val();
				// return;
					// thisObj._instances['RenderingManager'].publishConcretePage(recordId, companyId, residenceId, path, title, tmpElement.html(), function(event, recordId) {
					thisObj._instances['RenderingManager'].publishConcretePage(recordId, companyId, residenceId, path, title, tmpElement.html(), function(event, data) {
					tmpElement.remove();
					// thisObj._instances['RenderingManager'].publishConcretePage(recordId, path, title, spContentElement.html(), function(event, recordId) {
						// console.log(recordId + ' :: 本番ページ書き込み完了');
						// console.log(data['id'] + ' :: 本番ページ書き込み完了');
						$(thisObj).trigger('onCompleteStaticPagePublish', data);
						// $(thisObj).trigger('onCompleteStaticPagePublish', recordId);
					});
				} else {
					$('#record-id_' + recordId).find('.thumb').empty();
					displayAreaElement.attr('id', '').find('#spContent').attr('id', '').end().appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
					tmpElement.remove();
					// displayAreaElement.attr('id', '').show().find('#spContent').attr('id', '').end().appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
					// $('#displayArea').attr('id', '').show().find('#spContent').attr('id', '').end().appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
					// spContentElement.find('> *').appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
					$(thisObj).trigger('onCompletePublish', recordId);
				}
				// $(thisObj).trigger('onCompletePublish', recordId);
				// spContentElement.remove();
			});
			// console.log('');
			// console.log('');
			// console.log('今から静的ページ書き出し処理開始 :: isPublishStaticPage = ' + isPublishStaticPage);
			// console.log('');
			// console.log('');
			// $(thisObj).trigger('onInitPublish', recordId);
			thisObj._instances['RenderingManager'].render(recordId, isPublishStaticPage, residenceId);

			return;
		}
	}
});
