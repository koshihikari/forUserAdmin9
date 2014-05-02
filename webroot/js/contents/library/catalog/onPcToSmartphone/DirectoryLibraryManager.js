

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ディレクトリView/ライブラリView管理クラス
	 */
	MYNAMESPACE.namespace('modules.library.catalog.onPcToSmartphone.DirectoryLibraryManager');
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.DirectoryLibraryManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.DirectoryLibraryManager.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'onChangeStatusHandler'
				,'onDropLibraryHandler'
				,'setEvent'
			);

			this._instances = {
				'DataManager'			: DataManager
			};
		}

		/*
		 * Viewクラスのステータス変更時にコールされるメソッド
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onChangeStatusHandler: function(event, directoryManagerStatus, libraryManagerStatus) {
			var thisObj = this;

			if (directoryManagerStatus === 'onInitRender' || libraryManagerStatus === 'onInitRender') {
				thisObj.setEvent(false);
			} else if (directoryManagerStatus === 'onCompleteRender' && libraryManagerStatus === 'onCompleteRender') {
				thisObj.setEvent(true);
			}
		}

		/*
		 * ディレクトリにライブラリパーツがドロップされた時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @param	item			ライブラリがドロップされたディレクトリエレメント
		 * @return	void
		 */
		,onDropLibraryHandler: function(event, ui, item) {
			var thisObj = this;
			var directoryElem = $(item);
			var directoryId = directoryElem.attr('id').replace('directory-id_', '');
			var libraryElem = $(ui.helper);
			var libraryId = libraryElem.attr('id').replace('library-id_', '');
			libraryElem.remove();
			$(thisObj).trigger('onDropLibrary', [libraryId, directoryId]);
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var droppableElem = $('#directories > ul > li');
			var id = thisObj._instances['DataManager'].getDirectoryId();

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
					droppableElem
						.droppable(
							{
								'accept'					: $('.library-element'),
								'tolerance'					: 'pointer',
								'hoverClass'				: 'on-hover',
								'drop'						: function(event, ui) { thisObj.onDropLibraryHandler(event, ui, this); }
							}
						)
						.attr('data-is-droppable', 1);

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				droppableElem.find('[data-is-droppbale="1"]').droppable('destroy').attr('data-is-droppable', 0);
			}
		}
	}
});
