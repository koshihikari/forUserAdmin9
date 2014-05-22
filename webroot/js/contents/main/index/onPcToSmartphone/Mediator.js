

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Mediatorクラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.Mediator');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_pageData						: []
		,_bulkPublishData				: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'publish'
				,'bulkPublish'
				,'addView'
				,'hasView'
				,'setEvent'
			);

			this._instances = instances;
			this._instances['UtilManager'] = new MYNAMESPACE.modules.main.index.onPcToSmartphone.UtilManager();
			this._instances['view'] = {
				'TagView'		: new MYNAMESPACE.modules.main.index.onPcToSmartphone.view.TagView(thisObj._instances['AppModel'])
			};
			this._instances['SpConcretePageManager'] = new MYNAMESPACE.modules.helper.ConcretePageManager.SpConcretePageManager(
				{
					'RenderingManager'		: new MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager()
				}
			);
			this._instances['FpConcretePageManager'] = new MYNAMESPACE.modules.helper.ConcretePageManager.FpConcretePageManager(thisObj._instances['AppModel']);
		}

		/*
		 * 本番ページ書き出しメソッド
		 * @param	event			Eventオブジェクト
		 * @param	pageInfo		書き出すページIDとそのページの属する物件ID、デイバイスタイプ(sp || fp)を保持した配列
		 * @return	void
		 */
		,publish: function(event, pageInfo) {
			var thisObj = this;
			console.log('');
			console.log('----------');
			console.log('Mediator.js :: publishメソッド');
			console.log('pageInfo');
			console.log(pageInfo);
			if (0 < pageInfo.length) {
				thisObj._bulkPublishData = {
					'pageInfo'		: pageInfo,
					'count'			: 0
				};
				console.log('書き出し');
				console.log('thisObj._bulkPublishData');
				console.log(thisObj._bulkPublishData);
				for (var viewName in thisObj._instances['view']) {
					thisObj._instances['view'][viewName].setEvent(false);
				}
				console.log('----------');
				thisObj.bulkPublish();
			} else {
				console.log('ERROR!', '書きだすページを選択してください。');
				console.log('----------');
			}
		}

		/*
		 * 本番ページ一括書き出しメソッド
		 * @param	void
		 * @return	void
		 */
		,bulkPublish: function() {
			var thisObj = this;
			console.log('');
			console.log('----------');
			console.log('Mediator.js :: bulkPublishメソッド');
			console.log('パブリッシュした回数 :: thisObj._bulkPublishData.count = ' + thisObj._bulkPublishData['count']);
			console.log('パブリッシュしないといけない回数 :: thisObj._bulkPublishData.length = ' + thisObj._bulkPublishData['pageInfo'].length);
			if (thisObj._bulkPublishData['count'] < thisObj._bulkPublishData['pageInfo'].length) {
				thisObj._instances['UtilManager'].showCurtain('ページID :: ' + thisObj._bulkPublishData['pageInfo'][thisObj._bulkPublishData['count']]['pageId'] + '書き出し開始(' + (thisObj._bulkPublishData['count'] + 1) + '/' + thisObj._bulkPublishData['pageInfo'].length + ')', 300);
				var residenceId = thisObj._bulkPublishData['pageInfo'][thisObj._bulkPublishData['count']]['residenceId'];
				var pageId = thisObj._bulkPublishData['pageInfo'][thisObj._bulkPublishData['count']]['pageId'];
				var deviceType = thisObj._bulkPublishData['pageInfo'][thisObj._bulkPublishData['count']]['deviceType'];
				var $elem = $('#' + deviceType + '-page-item_' + pageId);
				var title = $elem.find('.title input[type="text"]').val();
				var path = $elem.find('.path input[type="text"]').val();
				var currentInfo = thisObj._instances['AppModel'].getCurrentInfo();
				var concretePageManager = null;

				if (deviceType === 'sp') {
					console.log('----------');
					thisObj._instances['SpConcretePageManager'].publish(residenceId, pageId, title, path, true);
				} else if (deviceType === 'fp') {
					console.log('----------');
					thisObj._instances['FpConcretePageManager'].publish(residenceId, pageId, title, path);
					// thisObj._instances['AppModel'].publishFpPage(residenceId, pageId, title, path);
				} else {
					console.log('SPでもFPでも無いページをパブリッシュしようとしています。');
					console.log('----------');
					return;
				}

				thisObj._bulkPublishData['count'] ++;

			} else {
				console.log('パブリッシュ完了');
				console.log('----------');
				thisObj._instances['UtilManager'].hideCurtain();
				thisObj._instances['UtilManager'].setStatus(true, '本番ページ書き出し完了', 500);
				for (var viewName in thisObj._instances['view']) {
					thisObj._instances['view'][viewName].setEvent(true);
				}
				var currentInfo = thisObj._instances['AppModel'].getCurrentInfo();
				thisObj._instances['AppModel'].request(currentInfo['residenceId']);
			}
		}

		/*
		 * Viewインスタンスを追加するメソッド
		 * @param	viewName		Viewインスタンス名
		 * @param	view			追加するViewインスタンス
		 * @return	void
		 */
		,addView: function(viewName, view) {
			var thisObj = this;
			// console.log('Mediator :: addView :: viewName = ' + viewName);
			if (thisObj.hasView(viewName) === false) {
				console.log('	' + viewName + 'を追加しました。');
				thisObj._instances['view'][viewName] = view;
				if (viewName === 'ResidenceView') {
					$(thisObj._instances['view'][viewName])
						.on('onClickBulkEditOutlineBtn', thisObj._instances['view']['BulkEditOutlineView'].confirm);
				} else if (viewName.indexOf('PageViewOf') !== -1) {
					$(thisObj._instances['view'][viewName])
						.on('onClickBulkPublishBtn', thisObj.publish)
						.on('onClickEditTagBtn', thisObj._instances['view']['TagView'].confirm);
				}
			}
		}

		/*
		 * Viewインスタンスが既に追加されているかを返すメソッド
		 * @param	viewName		追加されているか調べるViewインスタンス名
		 * @return	true===既に追加されている
		 */
		,hasView: function(viewName) {
			var thisObj = this;
			return thisObj._instances['view'][viewName] ? true : false;
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var appModelEventNames = {
				'severAccessEvents'		: [
					'onInitRequest', 'onCompleteRequest', 'onErrorRequest',
					'onInitAddResidence', 'onCompleteAddResidence', 'onErrorAddResidence',
					'onInitDuplicateResidence', 'onCompleteDuplicateResidence', 'onErrorDuplicateResidence',
					'onInitDelResidence', 'onCompleteDelResidence', 'onErrorDelResidence',
					'onInitReorderResidence', 'onCompleteReorderResidence', 'onErrorReorderResidence',
					'onInitChangeResidenceString', 'onCompleteChangeResidenceString', 'onErrorChangeResidenceString',
					'onInitBulkUpdateOutlineData', 'onCompleteBulkUpdateOutlineData', 'onErrorBulkUpdateOutlineData',
					'onInitAddPage', 'onCompleteAddPage', 'onErrorAddPage',
					'onInitDuplicatePage', 'onCompleteDuplicatePage', 'onErrorDuplicatePage',
					'onInitDelPage', 'onCompleteDelPage', 'onErrorDelPage',
					'onInitReorderPage', 'onCompleteReorderPage', 'onErrorReorderPage',
					'onInitChangePageString', 'onCompleteChangePageString', 'onErrorChangePageString',
					'onInitMovePage', 'onCompleteMovePage', 'onErrorRenamePage',
					'onInitPublishConcretePage',
					'onErrorPublishConcretePage',
					'onInitGetPageTag', 'onCompleteGetPageTag', 'onErrorGetPageTag',
					'onInitSetPageTagData', 'onCompleteSetPageTagData', 'onErrorSetPageTagData'
				]
			}

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$(thisObj._instances['AppModel'])
					.on(
						appModelEventNames['severAccessEvents'].join(' '),
						function(event) {
							console.log('イベント受信');
							thisObj._instances['UtilManager'].showStatusMessage(event);
						}
					)
					.on(
						'onCompleteUpdateOutlineData',
						function(event, isPublish, deviceType, spOutlineInfo) {
							console.log('一括書き出し完了 :: isPublish = ' + isPublish);
							if (isPublish === true && 0 < spOutlineInfo.length) {
								thisObj.publish({}, spOutlineInfo);
							} else {
								thisObj._instances['UtilManager'].showStatusMessage(event);
							}
						}
					)
					.on('doBulkPublish', function(event, deviceType, pageIdArr) {
						thisObj._pageData = data;
						thisObj.publish(event, deviceType, pageIdArr);
					})
					.on('onSuccessPublishConcretePageForFp', function(event, data) {
						console.log('ガラケー書き出し完了');
						thisObj.bulkPublish();
					})
					.on(
						'onSuccessSetPageTagData',
						function(event, publishPageInfo) {
							if (0 < publishPageInfo.length) {
								thisObj.publish({}, publishPageInfo);
							} else {
								thisObj._instances['UtilManager'].showStatusMessage(event);
							}
						}
					)
					.on('onCallback',
						function(event, residenceId) {
							// 物件ViewがMediatorに追加されてなければ追加
							var instanceNameOfResidence = 'ResidenceView';
							if (thisObj.hasView(instanceNameOfResidence) === false) {
								var bulkEditOutlineView = new MYNAMESPACE.modules.main.index.onPcToSmartphone.view.BulkEditOutlineView(thisObj._instances['AppModel']);
								thisObj.addView('BulkEditOutlineView', bulkEditOutlineView);
								var residenceView = new MYNAMESPACE.modules.main.index.onPcToSmartphone.view.ResidenceView(thisObj._instances['AppModel']);
								thisObj.addView(instanceNameOfResidence, residenceView);
							}
							// スマホViewがMediatorに追加されてなければ追加
							var instanceNameOfSp = 'SpPageViewOf' + residenceId;
							if (thisObj.hasView(instanceNameOfSp) === false) {
								var spPageView = new MYNAMESPACE.modules.main.index.onPcToSmartphone.view.PageView(thisObj._instances['AppModel'], 'sp', residenceId);
								thisObj.addView(instanceNameOfSp, spPageView);
							}
							// フィーチャーフォンViewがMediatorに追加されてなければ追加
							var instanceNameOfFp = 'FpPageViewOf' + residenceId;
							if (thisObj.hasView(instanceNameOfFp) === false) {
								var fpPageView = new MYNAMESPACE.modules.main.index.onPcToSmartphone.view.PageView(thisObj._instances['AppModel'], 'fp', residenceId);
								thisObj.addView(instanceNameOfFp, fpPageView);
							}
						}
					)
					.on('onSetData onUpdateData',
						function(event, key) {
							if (key === 'ResidenceData') {
								thisObj._instances['view']['ResidenceView'].render();
							} else if (
								key.indexOf('SpPageDataOf') !== -1 ||
								key.indexOf('FpPageDataOf') !== -1
							) {
								var residenceId = -1;
								var viewName = '';
								if (key.indexOf('SpPageDataOf') !== -1) {
									residenceId = +(key.replace('SpPageDataOf', ''));
									viewName = 'SpPageViewOf' + residenceId;
								} else {
									residenceId = +(key.replace('FpPageDataOf', ''));
									viewName = 'FpPageViewOf' + residenceId;
								}
								thisObj._instances['view'][viewName].render();
							}

						}
					)
				$(thisObj._instances['SpConcretePageManager'])
					.on('onCompleteStaticPagePublish',
						function(event) {
							thisObj.bulkPublish();
						}
					)
				$(thisObj._instances['FpConcretePageManager'])
					.on('onCompleteStaticPagePublish',
						function(event) {
							thisObj.bulkPublish();
						}
					)
			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$(thisObj._instances['AppModel'])
					.off(
						appModelEventNames['severAccessEvents'].join(' ')
					)
					.off('onCallback')
					.off('onSetData onUpdateData');
			}
		}
	}
});
