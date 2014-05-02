

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ディレクトリエレメント管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.ResidenceManager');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.ResidenceManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.ResidenceManager.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_isSortable					: false
		,_status						: ''
		,_instances						: {}
		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'setStatus'
				,'getStatus'
				,'setElement'
				,'onChangeCurrentElement'
				,'render'
				,'onResizeWindow'
				,'onClickAddDirectoryBtnHandler'
				,'onClickDuplicateDirectoryBtnHandler'
				,'onClickDelDirectoryBtnHandler'
				,'onUpdateOrderHandler'
				,'onClickResidenceHandler'
				,'onChangeDirectoryNameHandler'
				,'setOnceEvent'
				,'setEvent'
			);

			this._instances = {
				'DataManager'			: DataManager,
				'ConfirmModalManager'	: new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager(),
				'TextInputManager'		: new MYNAMESPACE.modules.helper.TextInputManager()
			};

			this.setOnceEvent();
		}

		/*
		 * このクラスのステータスをセットするメソッド
		 * @param	status		ステータス
		 * @return	void
		 */
		,setStatus: function(status) {
			var thisObj = this;
			if (thisObj._status !== status) {
				thisObj._status = status;
				$(thisObj).trigger('onChangeStatus');
			}
		}

		/*
		 * このクラスのステータスを返すメソッド
		 * @param	void
		 * @return	ステータス
		 */
		,getStatus: function() {
			var thisObj = this;
			return thisObj._status;
		}

		/*
		 * 物件エレメントを画面に配置するメソッド
		 * @param	data		エレメントデータ
		 * @return	void
		 */
		,setElement: function(data) {
			var thisObj = this;
			var prop = thisObj._instances['DataManager'].getProp();

			for (var i=0,len=data.length; i<len; i++) {
				var forTemplateData = {
					'residenceId'				: data[i]['residences']['id'],
					'residenceName'				: data[i]['residences']['name'],
					'residencePath'				: data[i]['residences']['path'],
					'smartphonePageCount'		: data[i]['residences']['smartphone_page_count'],
					'featurephonePageCount'		: data[i]['residences']['featurephone_page_count'],
					'companyUrl'				: prop['concreteUrl'],
					'checked'					: false
				}
				$('#residences > ul').append($(_.template($('#residence-item-template').text(), forTemplateData)));
			}
		}

		/*
		 * カレントなIDのディレクトリをアクティブにするメソッド
		 * @param	event			Eventオブジェクト
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		,onChangeCurrentElement: function(event, id) {
			var thisObj = this;
			var liElem = $('#residences > ul > li');
			if (0 < liElem.length) {
				thisObj.setEvent(false);
				liElem.removeClass('current');
				$('#residence-id_' + id).addClass('current');
				thisObj.setEvent(true);
			}
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		,render: function(data, id) {
			var thisObj = this;

			thisObj.setStatus('onInitRender');
			$(thisObj).trigger('onInitRender');

			thisObj.setEvent(false);
			$('#residences > ul.residence-list > li').remove();
			thisObj.setElement(data);
			thisObj.onChangeCurrentElement({}, id);
			thisObj.setEvent(true);

			thisObj.setStatus('onCompleteRender');
			$(thisObj).trigger('onCompleteRender');
		}

		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var height = $(window).height() - 96;
			$('#directories > ul').height(height);
		}

		/*
		 * ディレクトリ追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAddDirectoryBtnHandler: function(event) {
			var thisObj = this;
			$(thisObj).trigger('onClickAddDirectoryBtn');
		}

		/*
		 * ディレクトリ複製ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDuplicateDirectoryBtnHandler: function(event) {
			var thisObj = this;
			var id = $(event.currentTarget).closest('li').attr('id').replace('directory-id_', '');
			$(thisObj).trigger('onClickDuplicateDirectoryBtn', id);
		}

		/*
		 * ディレクトリ削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDelDirectoryBtnHandler: function(event) {
			var thisObj = this;
			var directoryElem = $(event.currentTarget).closest('li');
			var directoryId = directoryElem.attr('id').replace('directory-id_', '');
			var directoryName = directoryElem.find('.name input[type="text"]').val();
			var libraryCount = directoryElem.find('.count').text();
			var message = '「' + directoryName + '」を削除しますか？';
			message = 0 < libraryCount ? message + '<br /><p class="caution">' + directoryName + 'を削除すると、' + libraryCount + '個の共通パーツも同時に削除されます。' : message;

			thisObj._instances['ConfirmModalManager'].open(
				{
					'title'									: '削除確認',
					'message'								: message,
					'close-btn-text'						: '<i data-icon=""></i>キャンセル',
					'agree-btn-text'						: '<i data-icon=""></i>削除する'
				},
				function() {
					$(thisObj).trigger('onClickDelDirectoryBtn', directoryId);
				}
			);
		}

		/*
		 * ディレクトリの並び替え完了時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @return	void
		 */
		,onUpdateOrderHandler: function(event, ui) {
			var thisObj = this;
			var updateElem = $(ui.item);
			var id = updateElem.attr('id').replace('directory-id_', '');
			var order = updateElem.parent().children().index(updateElem) + 1;
			if (0 < order) {
				$(thisObj).trigger('onUpdateOrder', [id, order]);
			}
		}

		/*
		 * 物件クリック時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickResidenceHandler: function(event) {
			var thisObj = this;
			var id = $(event.currentTarget).attr('id').replace('residence-id_', '');
			$(thisObj).trigger('onClickResidence', id);
		}

		/*
		 * ディレクト名変更時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	targetElem		ディレクトリ名が変更されたInputエレメント
		 * @param	val				変更後のディレクトリ名
		 * @return	void
		 */
		,onChangeDirectoryNameHandler: function(event, targetElem, val) {
			var thisObj = this;
			var directoryElem = targetElem.closest('li');
			var id = directoryElem.attr('id').replace('directory-id_', '');
			$(thisObj).trigger('onChangeDirectoryName', [id, val]);
		}

		/*
		 * このクラス内で1度だけ有効にするイベントをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(thisObj._instances['TextInputManager'])
					.on('onChangeValue', thisObj.onChangeDirectoryNameHandler);
			}
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var baseElem = $('#residences');

			/*
			*/
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				/*
				if (thisObj._isSortable === false) {
					thisObj._isSortable = true;
					baseElem.find('>ul')
						.sortable(
							{
								'containment'				: $('#directories > ul'),
								'placeholder'				: 'placeholder',
								'axis'						: 'y',
								'forcePlaceholderSize'		: true,
								'opacity'					: 0.5,
								'update'					: thisObj.onUpdateOrderHandler
							}
						);
				}
				*/
				baseElem
					.on('click', '.residence-item', thisObj.onClickResidenceHandler)	// 物件選択
					// .on('click', '.btn-add-directory', thisObj.onClickAddDirectoryBtnHandler)	// ディレクトリ追加
					// .on('click', '.btn-duplicate-directory', thisObj.onClickDuplicateDirectoryBtnHandler)	// ライブラリ複製
					// .on('click', '.btn-del-directory', thisObj.onClickDelDirectoryBtnHandler)	// ディレクトリ削除

			} else if (isEnabled === false && thisObj._isEnabled === true){
				/*
				thisObj._isEnabled = false;
					if (thisObj._isSortable === true) {
						thisObj._isSortable = false;
						baseElem.find('>ul').sortable('destroy');
					}
				*/
				baseElem
					.off('click', '> ul > li')
					// .off('click', '.btn-add-directory')
					// .off('click', '.btn-duplicate-directory')	// ライブラリ複製
					// .off('click', '.btn-del-directory');

				// $('[data-placement][data-original-title]').tooltip('destroy');
			}

			thisObj._instances['TextInputManager'].setEvent(baseElem.find('.name input[type="text"]'), isEnabled);
			/*
			*/
		}
	}
});
