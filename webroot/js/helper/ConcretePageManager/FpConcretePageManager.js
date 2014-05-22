

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.helper.ConcretePageManager.FpConcretePageManager');
	MYNAMESPACE.modules.helper.ConcretePageManager.FpConcretePageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.ConcretePageManager.FpConcretePageManager.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_libraryPageIds				: []
		,_id							: -1

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(AppModel) {
			var thisObj = this;
			// thisObj._instances = instances;
			_.bindAll(
				this
				,'publish'
			);
			var date = new Date();
			thisObj._id = 'id_' + date.getTime();
			var GsTagLibrary = new MYNAMESPACE.modules.helper.GsTagLibrary(thisObj._id);
			thisObj._instances = {
				AppModel			: AppModel,
				GsTagLibrary		: GsTagLibrary,
				EditorManager		: new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager([], GsTagLibrary, thisObj._id, 'concretePage')
			}
			thisObj._instances['EditorManager'].setEvent(true);
		}

		/*
		 * 本番ページを書きだすメソッド
		 * @param	recordId				書きだすページのレコードID
		 * @param	isPublishStaticPage		true===静的ページ書き出し
		 * @return	void
		 */
		,publish: function(residenceId, recordId, title, path) {
			var thisObj = this;
			var tmpElement = $('<div>', {'id' : 'tmp'});	// 本番ページをレンダリングするための仮エレメント
			var displayAreaElement = $('<div>', {'id' : 'displayArea'});
			var spContentElement = $('<div>', {'id' : 'spContent'});

			// ガラケーページレンダリング用エレメントを作成し、配置
			displayAreaElement.append(spContentElement);
			tmpElement.append(displayAreaElement);
			// tmpElement.prependTo('body').hide();
			tmpElement.prependTo('body');
			console.log('');
			console.log('----------');
			console.log('FpConcretePageManager.js :: publishメソッド');
			console.log('residenceId = ' + residenceId);
			console.log('recordId = ' + recordId);
			console.log('title = ' + title);
			console.log('path = ' + path);
			console.log('----------');

			$(thisObj._instances['AppModel']).on('onSuccessGetPageData', function(event, data) {
				$(thisObj._instances['AppModel']).off('onSuccessGetPageData');
				console.log('');
				console.log('----------');
				console.log('FpConcretePageManager.js :: publishメソッド :: handler');
				console.log('data');
				console.log(data);
				console.log('----------');
				$(thisObj._instances['EditorManager']).on('onCompleteRefreshCode', function(event, code) {
					$(thisObj._instances['EditorManager']).off('onCompleteRefreshCode');
					console.log('');
					console.log('----------');
					console.log('FpConcretePageManager.js :: publishメソッド :: handler :: handler');
					console.log('code');
					console.log(code);
					console.log('----------');
					// GSタグの置換処理が終われば、置換したコードをDBに書き込む
					$(thisObj._instances['AppModel']).on('onSuccessPublishConcretePageForFp', function(event) {
						$(thisObj._instances['AppModel']).off('onSuccessPublishConcretePageForFp');
						console.log('');
						console.log('----------');
						console.log('FpConcretePageManager.js :: publishメソッド :: handler :: handler :: handler');
						console.log('----------');
						$(thisObj).trigger('onCompleteStaticPagePublish');
					})
					thisObj._instances['AppModel'].publishFpPage(residenceId, recordId, title, path, code);

					/*
					var companyId = $('input[type="hidden"][name="companyId"]').val();
					thisObj._instances['RenderingManager'].publishConcretePage(recordId, companyId, residenceId, path, title, tmpElement.html(), function(event, data) {
						// tmpElement.remove();
						$(thisObj).trigger('onCompleteStaticPagePublish', data);
					});
					*/
				});
				tmpElement.html(data['preview_source']);
				// プレビューコードを取得したら、GSタグの置換処理を行う
				thisObj._instances['GsTagLibrary'].execute(data['preview_source']);
			});
			// 指定されたrecordIdのデータを取得
			thisObj._instances['AppModel'].getPageData(recordId, 'Featurephone');
			// thisObj.getPageData(recordId, 'Featurephpne');



			/*
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
			*/
		}
	}
});
