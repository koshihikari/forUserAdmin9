

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
		,publish: function(residenceId, recordId, title, path, isPublishStaticPage) {
			var thisObj = this;
			var tmpElement = $('<div>', {'id' : 'tmp'});	// 本番ページをレンダリングするための仮エレメント
			var displayAreaElement = $('<div>', {'id' : 'displayArea'});
			var spContentElement = $('<div>', {'id' : 'spContent'});

			displayAreaElement.append(spContentElement);
			tmpElement.append(displayAreaElement);
			// tmpElement.prependTo('body').hide();
			tmpElement.prependTo('body');
			thisObj._instances['RenderingManager'].setEvent(false);
			thisObj._instances['RenderingManager'].setEvent(true);

			console.log('');
			console.log('----------');
			console.log('SpConcretePageManager.js :: publishメソッド');
			console.log('----------');
			$(thisObj._instances['RenderingManager']).on('onCompleteRender', function(event) {
				$(thisObj._instances['RenderingManager']).off('onCompleteRender');
				if (0 < tmpElement.find('.flexslider').length) {

					tmpElement.find('.flexslider').each(function(i) {
						var elem = $(this);
						if (elem.attr('data-contents') === undefined) {return;}
						var contents						= elem.attr('data-contents').split(',');
						var hasContents						= 0 < contents.length ? true : false;
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

				console.log('');
				console.log('----------');
				console.log('SpConcretePageManager.js :: publishメソッド :: handler');
				console.log('isPublishStaticPage = ' + isPublishStaticPage);
				console.log('tmpElement');
				console.log(tmpElement);
				console.log('tmpElement.html()');
				console.log(tmpElement.html());
				// if (0 < tmpElement.find(''))
				if (isPublishStaticPage === true) {
					console.log('本番書き出し');
					console.log('----------');
					var companyId = $('input[type="hidden"][name="companyId"]').val();
					thisObj._instances['RenderingManager'].publishConcretePage(recordId, companyId, residenceId, path, title, tmpElement.html(), function(event, data) {
						// tmpElement.remove();
						$(thisObj).trigger('onCompleteStaticPagePublish', data);
					});
				} else {
					console.log('本番書き出しではない');
					console.log('----------');
					$('#record-id_' + recordId).find('.thumb').empty();
					displayAreaElement.attr('id', '').find('#spContent').attr('id', '').end().appendTo($('#record-id_' + recordId).find('.thumb')).find('.youtube > iframe').css('height', 'auto');
					tmpElement.remove();
					$(thisObj).trigger('onCompletePublish', recordId);
				}
			});
			thisObj._instances['RenderingManager'].render(recordId, isPublishStaticPage, residenceId);

			return;
		}
	}
});
