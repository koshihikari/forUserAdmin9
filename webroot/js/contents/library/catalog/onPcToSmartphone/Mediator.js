

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ディレクトリView/ライブラリView管理クラス
	 */
	MYNAMESPACE.namespace('modules.library.catalog.onPcToSmartphone.Mediator');
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.Mediator = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.Mediator.prototype = {
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
				,'setEvent'
			);

			this._instances = instances;
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$(thisObj._instances['DataManager'])
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
					.on('onInitAccess',
						function(event) {
							thisObj._instances['DirectoryManager'].setEvent(false);
							thisObj._instances['LibraryManager'].setEvent(false);
							thisObj._instances['DirectoryLibraryManager'].setEvent(false);
						}
					)
					.on('onChangeCurrentDirectoryId',
						function(event) {
							var id = thisObj._instances['DataManager'].getDirectoryId();
							thisObj._instances['DirectoryManager'].onChangeCurrentElement(event, id);
							thisObj._instances['LibraryManager'].onChangeCurrentElement(event, id);
						}
					)
					.on('onSetData',
						function(event, key) {
							if (key === 'dirLib') {
								var data = thisObj._instances['DataManager'].getData(key);
								var id = thisObj._instances['DataManager'].getDirectoryId();
								thisObj._instances['DirectoryManager'].render(data, id);
								thisObj._instances['LibraryManager'].render(data, id);
							}
						}
					);

				$(thisObj._instances['DirectoryManager'])
					.on('onClickAddDirectoryBtn',
						function(event) {
							thisObj._instances['DataManager'].addDirectory();
						}
					)
					.on('onClickDuplicateDirectoryBtn',
						function(event, id) {
							thisObj._instances['DataManager'].duplicateDirectory(id);
						}
					)
					.on('onClickDelDirectoryBtn',
						function(event, id) {
							thisObj._instances['DataManager'].delDirectory(id);
						}
					)
					.on('onUpdateOrder',
						function(event, id, order) {
							thisObj._instances['DataManager'].reorderDirectory(id, order);
						}
					)
					.on('onClickDirectory',
						function(event, id) {
							thisObj._instances['DataManager'].setDirectoryId(id);
						}
					)
					.on('onChangeDirectoryName',
						function(event, id, val) {
							thisObj._instances['DataManager'].renameDirectory(id, val);
						}
					)
					.on('onChangeStatus',
						function(event, id, val) {
							var directoryManagerStatus = thisObj._instances['DirectoryManager'].getStatus();
							var libraryManagerStatus = thisObj._instances['LibraryManager'].getStatus();
							thisObj._instances['DirectoryLibraryManager'].onChangeStatusHandler(event, directoryManagerStatus, libraryManagerStatus);
						}
					);

				$(thisObj._instances['LibraryManager'])
					.on('onClickAddLibraryBtn',
						function(event) {
							thisObj._instances['DataManager'].addLibrary(thisObj._instances['DataManager'].getDirectoryId());
						}
					)
					.on('onClickDuplicateLibraryBtn',
						function(event, id) {
							thisObj._instances['DataManager'].duplicateLibrary(id);
						}
					)
					.on('onClickDelDirectoryBtn',
						function(event, id) {
							thisObj._instances['DataManager'].delLibrary(id);
						}
					)
					.on('onUpdateOrder',
						function(event, id, order) {
							thisObj._instances['DataManager'].reorderLibrary(id, order);
						}
					)
					.on('onUpdateOrder',
						function(event, id, val) {
							thisObj._instances['DataManager'].renameLibrary(id, val);
						}
					)
					.on('onChangeLibraryName',
						function(event, id, val) {
							thisObj._instances['DataManager'].renameLibrary(id, val);
						}
					)
					.on('onChangeStatus',
						function(event, id, val) {
							var directoryManagerStatus = thisObj._instances['DirectoryManager'].getStatus();
							var libraryManagerStatus = thisObj._instances['LibraryManager'].getStatus();
							thisObj._instances['DirectoryLibraryManager'].onChangeStatusHandler(event, directoryManagerStatus, libraryManagerStatus);
						}
					);

				$(thisObj._instances['DirectoryLibraryManager'])
					.on('onDropLibrary',
						function(event, libraryId, directoryId) {
							thisObj._instances['DataManager'].moveLibrary(libraryId, directoryId);
						}
					)

				$(window)
					.on('resize',
						function(event) {
							thisObj._instances['DirectoryManager'].onResizeWindow(event);
							thisObj._instances['LibraryManager'].onResizeWindow(event);
						}
					);

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$(thisObj._instances['DataManager'])
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

				$(thisObj._instances['DirectoryManager'])
					.off('onClickAddDirectoryBtn')
					.off('onClickDuplicateDirectoryBtn')
					.off('onClickDelDirectoryBtn')
					.off('onUpdateOrder')
					.off('onClickDirectory')
					.off('onChangeDirectoryName');

				$(thisObj._instances['LibraryManager'])
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
