


jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ディレクトリView/ライブラリView管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.Mediator');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'addView'
				,'hasView'
				// ,'listenViewEvent'
				,'setEvent'
			);

			this._instances = instances;
			this._instances['view'] = {};
		}

		/*
		 * Viewインスタンスを追加するメソッド
		 * @param	viewName		Viewインスタンス名
		 * @param	view			追加するViewインスタンス
		 * @return	void
		 */
		,addView: function(viewName, view) {
			var thisObj = this;
			console.log('Mediator :: addView :: viewName = ' + viewName);
			if (thisObj.hasView(viewName) === false) {
				console.log('	' + viewName + 'を追加しました。');
				thisObj._instances['view'][viewName] = view;
				// thisObj.listenViewEvent(viewName, view);
			}
		}

		/*
		 * Viewインスタンスが既に追加されているかを返すメソッド
		 * @param	viewName		追加されているか調べるViewインスタンス名
		 * @return	true===既に追加されている
		 */
		,hasView: function(viewName) {
			var thisObj = this;
			// console.log('Mediator :: hasView :: ' + viewName + 'は' + (thisObj._instances['view'][viewName] ? '既に登録されています' : 'まだ登録されていません'));
			return thisObj._instances['view'][viewName] ? true : false;
		}

		/*
		 * このクラス内で管理するViewインスタンスのイベントリスニングメソッド
		 * @param	viewName		Viewインスタンス名
		 * @param	view			Viewインスタンス
		 * @return	void
		 */
					/*
		,listenViewEvent: function(viewName, view) {
			var thisObj = this;

			if (viewName === 'ResidenceView') {
				$(view)
					.on('onClickResidence',
						function(event, id) {
							console.log('Mediator :: setEvent :: onClickResidence :: id = ' + id);
							// thisObj._instances['AppModel'].setResidenceId(id);
							// thisObj._instances['AppModel'].requestResidence(id);
						}
					)
			} else if (
				viewName.indexOf('SpPageViewOf') !== -1 ||
				viewName.indexOf('FpPageViewOf') !== -1
			) {
				$(view)
					.on('onClickAddPageBtn',
						function(event, residenceId, deviceType) {
							thisObj._instances['AppModel'].addPage(residenceId, deviceType);
						}
					)
					.on('onClickDelPageBtn',
						function(event, pageId, deviceType) {
							thisObj._instances['AppModel'].delPage(pageId, deviceType);
						}
					)
					.on('onChangeText',
						function(event, id, deviceType, key, val) {
							thisObj._instances['AppModel'].changePageString(id, deviceType, key, val);
						}
					)
					.on('onUpdateOrder',
						function(event, id, deviceType, order) {
							thisObj._instances['AppModel'].reorderPage(id, deviceType, order);
						}
					)
			}
		}
					*/

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$(thisObj._instances['AppModel'])
					.on(
						'onInitRequest onCompleteRequest onErrorRequest\
						onInitAddDirectory onCompleteAddDirectory onErrorAddDirectory\
						onInitDuplicateDirectory onCompleteDuplicateDirectory onErrorDuplicateDirectory\
						onInitDelDirectory onCompleteDelDirectory onErrorDelDirectory\
						onInitReorderDirectory onCompleteReorderDirectory onErrorReorderDirectory\
						onInitRenameDirectory onCompleteRenameDirectory onErrorRenameDirectory\
						onInitAddLibrary onCompleteAddLibrary onErrorAddLibrary\
						onInitDuplicateLibrary onCompleteDuplicateLibrary onErrorDuplicateLibrary\
						onInitDelLibrary onCompleteDelLibrary onErrorDelLibrary\
						onInitReorderLibrary onCompleteReorderLibrary onErrorReorderLibrary\
						onInitRenameLibrary onCompleteRenameLibrary onErrorRenameLibrary\
						onInitMoveLibrary onCompleteMoveLibrary onErrorRenameLibrary\
						',
						function(event) {
							thisObj._instances['UtilManager'].showStatusMessage(event);
						}
					)
					/*
					.on('onInitAccess',
						function(event) {
							// thisObj._instances['ResidenceManager'].setEvent(false);
							// thisObj._instances['SmartphonePageManager'].setEvent(false);
							// thisObj._instances['ResidencePageManager'].setEvent(false);
						}
					)
					.on('onChangeCurrentResidenceId',
						function(event) {
							var id = thisObj._instances['AppModel'].getResidenceId();
							console.log('Mediator :: onChangeCurrentResidenceId :: id = ' + id);
							for (var key in thisObj._instances['view']) {
								thisObj._instances['view'][key].onChangeCurrentElement();
							}
							// thisObj._instances['view']['ResidenceView'].onChangeCurrentElement();
							// thisObj._instances['PageWrapperManager'].onChangeCurrentElement(event, id);
						}
					)
					*/
					.on('onSetData onUpdateData',
					// .on('onUpdateData',
						function(event, key) {
							console.log('Mediator :: onUpdateData :: key = ' + key);
							// var data = thisObj._instances['AppModel'].getData(key);
							var id = thisObj._instances['AppModel'].getResidenceId();

							if (key === 'ResidenceData') {
								thisObj._instances['view']['ResidenceView'].render();
								// thisObj._instances['view']['ResidenceView'].render();
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
					/*
					.on('onSetData',
						function(event, key) {
							// console.log('Mediator :: onSetData :: key = ' + key);

							if (key === 'ResidenceData') {
								thisObj._instances['view']['ResidenceView'].render();
								// thisObj._instances['ResidenceManager'].render(data, id);
								// thisObj._instances['PageWrapperManager'].render(data, id);
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
							// if (key === 'page') {
							// 	var data = thisObj._instances['AppModel'].getData(key);
							// 	var id = thisObj._instances['AppModel'].getResidenceId();
							// 	thisObj._instances['ResidenceManager'].render(data, id);
							// 	thisObj._instances['SmartphonePageManager'].render(data, id);
							// }
						}
					);
*/
			// console.log('Mediator :: setEvent ');

				$(thisObj._instances['view']['ResidenceView'])
					/*
					.on('onClickAddDirectoryBtn',
						function(event) {
							thisObj._instances['AppModel'].addDirectory();
						}
					)
					.on('onClickDuplicateDirectoryBtn',
						function(event, id) {
							thisObj._instances['AppModel'].duplicateDirectory(id);
						}
					)
					.on('onClickDelDirectoryBtn',
						function(event, id) {
							thisObj._instances['AppModel'].delDirectory(id);
						}
					)
					.on('onUpdateOrder',
						function(event, id, order) {
							thisObj._instances['AppModel'].reorderDirectory(id, order);
						}
					)
					.on('onClickResidence',
						function(event, id) {
							console.log('Mediator :: setEvent :: onClickResidence :: id = ' + id);
							thisObj._instances['AppModel'].setResidenceId(id);
							thisObj._instances['AppModel'].requestResidence(id);
						}
					)
					.on('onChangeDirectoryName',
						function(event, id, val) {
							thisObj._instances['AppModel'].renameDirectory(id, val);
						}
					)
					.on('onChangeStatus',
						function(event, id, val) {
							// var ResidenceManagerStatus = thisObj._instances['ResidenceManager'].getStatus();
							// var PageManagerStatus = thisObj._instances['SmartphonePageManager'].getStatus();
							// thisObj._instances['ResidencePageManager'].onChangeStatusHandler(event, ResidenceManagerStatus, PageManagerStatus);
						}
					);
					*/

				/*
				$(thisObj._instances['SmartphonePageManager'])
					.on('onClickAddLibraryBtn',
						function(event) {
							thisObj._instances['AppModel'].addLibrary(thisObj._instances['AppModel'].getResidenceId());
						}
					)
					.on('onClickDuplicateLibraryBtn',
						function(event, id) {
							thisObj._instances['AppModel'].duplicateLibrary(id);
						}
					)
					.on('onClickDelDirectoryBtn',
						function(event, id) {
							thisObj._instances['AppModel'].delLibrary(id);
						}
					)
					.on('onUpdateOrder',
						function(event, id, order) {
							thisObj._instances['AppModel'].reorderLibrary(id, order);
						}
					)
					.on('onUpdateOrder',
						function(event, id, val) {
							thisObj._instances['AppModel'].renameLibrary(id, val);
						}
					)
					.on('onChangeLibraryName',
						function(event, id, val) {
							thisObj._instances['AppModel'].renameLibrary(id, val);
						}
					)
					.on('onChangeStatus',
						function(event, id, val) {
							var ResidenceManagerStatus = thisObj._instances['ResidenceManager'].getStatus();
							var PageManagerStatus = thisObj._instances['SmartphonePageManager'].getStatus();
							thisObj._instances['ResidencePageManager'].onChangeStatusHandler(event, ResidenceManagerStatus, PageManagerStatus);
						}
					);

				$(thisObj._instances['ResidencePageManager'])
					.on('onDropLibrary',
						function(event, libraryId, directoryId) {
							thisObj._instances['AppModel'].moveLibrary(libraryId, directoryId);
						}
					)

				$(window)
					.on('resize',
						function(event) {
							thisObj._instances['ResidenceManager'].onResizeWindow(event);
							// thisObj._instances['SmartphonePageManager'].onResizeWindow(event);
						}
					);
*/

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$(thisObj._instances['AppModel'])
					.off(
						'onInitRequest onCompleteRequest onErrorRequest\
						onInitAddDirectory onCompleteAddDirectory onErrorAddDirectory\
						onInitDuplicateDirectory onCompleteDuplicateDirectory onErrorDuplicateDirectory\
						onInitDelDirectory onCompleteDelDirectory onErrorDelDirectory\
						onInitReorderDirectory onCompleteReorderDirectory onErrorReorderDirectory\
						onInitRenameDirectory onCompleteRenameDirectory onErrorRenameDirectory\
						onInitAddLibrary onCompleteAddLibrary onErrorAddLibrary\
						onInitDuplicateLibrary onCompleteDuplicateLibrary onErrorDuplicateLibrary\
						onInitDelLibrary onCompleteDelLibrary onErrorDelLibrary\
						onInitReorderLibrary onCompleteReorderLibrary onErrorReorderLibrary\
						onInitRenameLibrary onCompleteRenameLibrary onErrorRenameLibrary\
						onInitMoveLibrary onCompleteMoveLibrary onErrorRenameLibrary\
						'
					)
					.off('onInitAccess')
					.off('onChangeCurrentDirectoryId')
					.off('onSetData');

				$(thisObj._instances['ResidenceManager'])
					.off('onClickAddDirectoryBtn')
					.off('onClickDuplicateDirectoryBtn')
					.off('onClickDelDirectoryBtn')
					.off('onUpdateOrder')
					.off('onClickDirectory')
					.off('onChangeDirectoryName');

				$(thisObj._instances['SmartphonePageManager'])
					.off('onClickAddLibraryBtn')
					.off('onClickDuplicateLibraryBtn')
					.off('onClickDelDirectoryBtn')
					.off('onUpdateOrder')
					.off('onUpdateOrder');

				$(window)
					.off('resize');
			}
		}
	}
});
