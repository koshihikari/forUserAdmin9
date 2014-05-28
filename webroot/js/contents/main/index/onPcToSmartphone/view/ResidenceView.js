

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * 物件エレメント管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.view.ResidenceView');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.ResidenceView = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.ResidenceView.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_isSortable					: false
		,_residenceId					: -1
		,_status						: ''
		,_instances						: {}
		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}
		,_$focusedElem					: null

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(AppModel) {
			var thisObj = this;
			_.bindAll(
				this
				,'setStatus'
				,'getStatus'
				,'setElement'
				,'onChangeCurrentInfo'
				,'render'
				,'onResizeWindow'
				,'onClickSwitchBtnHandler'
				,'onClickAddResidenceBtnHandler'
				,'onClickDuplicateResidenceBtnHandler'
				,'onClickDelResidenceBtnHandler'
				,'onUpdateOrderHandler'
				,'onClickResidenceHandler'
				,'onChangeTextHandler'
				,'onSetFocusHandler'
				,'onDropPageHandler'
				,'onClickCheckboxHandler'
				,'setBulkBtnState'
				,'onChangeCheckedBtnHandler'
				,'onClickBulkEditOutlineBtnHandler'
				,'onFocusTextInputHandler'
				,'setOnceEvent'
				,'setEvent'
			);

			this._instances = {
				'AppModel'				: AppModel,
				'ConfirmModalManager'	: new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager(),
				'TextInputManager'		: new MYNAMESPACE.modules.helper.TextInputManager()
			};

			this.setOnceEvent();
			this.onResizeWindow();
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
		,setElement: function() {
			var thisObj = this;
			var data = thisObj._instances['AppModel'].getData('ResidenceData');
			var prop = thisObj._instances['AppModel'].getProp();
			var $targetElem = $('#residences');
			var residencesNames = {};
			var pageWrapperNames = {};

			// 画面上に描画されているページリストエレメントのIDをオブジェクトに保持(dataからリスト作成後、このオブジェクト内に残っているIDのエレメントを削除する)
			$targetElem.find('.residence-item').each(function(i) {
				residencesNames[$(this).attr('id')] = true;
			});
			$('#pages > .page-wrapper').each(function(i) {
				pageWrapperNames[$(this).attr('id')] = true;
			});

			for (var i=0,len=data.length; i<len; i++) {
				var listElementId = 'residence-id_' + data[i]['residences']['id'];
				var $liElem = $('#' + listElementId);
				var forTemplateData = {
					'isCompanySite'				: +data[i]['residences']['is_company_site'] === 0 ? false : true,
					'residenceId'				: data[i]['residences']['id'],
					'residenceName'				: data[i]['residences']['name'],
					'residencePath'				: data[i]['residences']['path'],
					'outlineUrl'				: prop['currentUrl'] + 'Outline/edit/' + data[i]['residences']['id'],
					'smartphonePageCount'		: data[i]['residences']['smartphone_page_count'],
					'featurephonePageCount'		: data[i]['residences']['featurephone_page_count'],
					'companyUrl'				: prop['concreteUrl'],
					'checked'					: false,
					'isLatest'					: data[i]['residences']['is_latest']
				}

				if (0 < $liElem.length) {	// 既にエレメントが存在する場合は修正
					// 前回描画したエレメントID保持オブジェクトから、修正対象エレメントのIDをオブジェクトから削除
					if (residencesNames[listElementId] === true) {
						delete residencesNames[listElementId];
					}
					if ($liElem.find('.name > input[type="text"]').val() !== data[i]['residences']['name']) {
						$liElem.find('.name > input[type="text"]').val(data[i]['residences']['name']);
					}
					if ($liElem.find('.path > input[type="text"]').val() !== data[i]['residences']['path']) {
						$liElem.find('.path > input[type="text"]').val(data[i]['residences']['path']);
					}
					if ($liElem.find('.smartphone-page-count').html() !== data[i]['residences']['smartphone_page_count']) {
						$liElem.find('.smartphone-page-count').html(data[i]['residences']['smartphone_page_count']);
					}
					if ($liElem.find('.featurephone-page-count').html() !== data[i]['residences']['featurephone_page_count']) {
						$liElem.find('.featurephone-page-count').html(data[i]['residences']['featurephone_page_count']);
					}

				} else {	// エレメントが存在しない場合は作成
					$('#residences > ul').append($(_.template($('#residence-item-template').text(), forTemplateData)));
				}

				var pageWrapperId = 'page-wrapper-in-residence-id_' + data[i]['residences']['id'];
				if (pageWrapperNames[pageWrapperId] === true) {
					delete pageWrapperNames[pageWrapperId];
				}
				if (0 === $('#' + pageWrapperId).length) {
					$('#pages').append($(_.template($('#page-wrapper-template').text(), forTemplateData)));
				}
			}

			// 前回描画したが、最新のデータでは存在しないエレメントを削除する
			for (var idName in residencesNames) {
				$('#' + idName).remove();
			}
			for (var idName in pageWrapperNames) {
				$('#' + idName).remove();
			}

			// 作成/修正したエレメントの並び順をdataと一致させる
			var $ul = $targetElem.find('> ul.residence-list');
			for (var i=0,len=data.length; i<len; i++) {
				var listElementId = 'residence-id_' + data[i]['residences']['id'];
				var $li = $('#' + listElementId);
				$ul.append($li);
			}

			// フォーカスされていた要素があれば、その要素にフォーカスを当てる
			if (thisObj._$focusedElem && 0 < thisObj._$focusedElem.length) {
				thisObj._$focusedElem.focus();
			}
		}

		/*
		 * カレントな物件ID、デバイスタイプが変わった際にコールされるメソッド
		 * @param	void
		 * @return	void
		 */
		,onChangeCurrentInfo: function() {
			var thisObj = this;
			var $elem = null;
			var currentInfo = thisObj._instances['AppModel'].getCurrentInfo();
			var id = currentInfo['residenceId'];

			if (id !== thisObj._residenceId) {
				thisObj._residenceId = id;

				$elem = $('#residences > ul > li');
				if (0 < $elem.length) {
					thisObj.setEvent(false);
					$elem.removeClass('current');
					$('#residence-id_' + id).addClass('current');
					thisObj.setEvent(true);
				}

				$elem = $('#pages > .page-wrapper');
				if (0 < $elem.length) {
					thisObj.setEvent(false);
					$elem.removeClass('current');
					$('#page-wrapper-in-residence-id_' + id).addClass('current');
					thisObj.setEvent(true);
				}
			}
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @param	id				カレントなディレクトリId
		 * @return	void
		 */
		// ,render: function(data, id) {
		,render: function() {
			console.log('ResidenceView :: render');
			var thisObj = this;

			thisObj.setStatus('onInitRender');
			$(thisObj).trigger('onInitRender');

			thisObj.setEvent(false);
			thisObj.setElement();
			thisObj.onChangeCurrentInfo();
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
			var prop = thisObj._instances['AppModel'].getProp();
			var height = $(window).height() - (prop['isCustomer'] === true ? 60 : 161);
			$('#residences > ul.residence-list').height(height);
		}

		/*
		 * 表示切り替えボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickSwitchBtnHandler: function(event) {
			event.stopPropagation();
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var residenceLiElem = currentTarget.closest('li');
			var residenceId = residenceLiElem.attr('id').replace('residence-id_', '');
			var isVisible = residenceLiElem.attr('data-is-visible') === '1' ? true : false;
			residenceLiElem.attr('data-is-visible', isVisible === true ? '0' : '1');
			console.log('onClickSwitchBtnHandler :: residenceId = ' + residenceId + ', isVisible = ' + isVisible);
			$(thisObj).trigger('onSwitchResidenceVisible', [residenceId, !isVisible]);
		}

		/*
		 * 物件追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAddResidenceBtnHandler: function(event) {
			event.stopPropagation();
			var thisObj = this;
			thisObj._instances['AppModel'].addResidence();
		}

		/*
		 * 物件複製ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDuplicateResidenceBtnHandler: function(event) {
			event.stopPropagation();
			var thisObj = this;
			var residenceId = $(event.currentTarget).closest('li').attr('id').replace('residence-id_', '');
			thisObj._instances['AppModel'].duplicateResidence(residenceId);
		}

		/*
		 * 物件削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDelResidenceBtnHandler: function(event) {
			event.stopPropagation();
			var thisObj = this;
			var $residence = $(event.currentTarget).closest('li');
			var residenceId = $residence.attr('id').replace('residence-id_', '');
			var residenceName = $residence.find('.name input[type="text"]').val();
			var message = '「' + residenceName + '」を削除しますか？';
			var spPageCount = $residence.find('.smartphone-page-count').text();
			var fpPageCount = $residence.find('.featurephone-page-count').text();
			var messages = [];
			0 < spPageCount ? messages.push(spPageCount + 'ページのスマホ向けページ') : '';
			0 < fpPageCount ? messages.push(fpPageCount + 'ページのフィーチャーフォン向けページ') : '';
			message = 0 < messages.length ? message + '<br /><p class="caution">' + residenceName + 'に含まれる、' + messages.join('と') + 'も同時に削除されます。' : message;
			thisObj._instances['ConfirmModalManager'].open(
				{
					'title'									: '削除確認',
					'message'								: message,
					'close-btn-text'						: '<i data-icon=""></i>キャンセル',
					'agree-btn-text'						: '<i data-icon=""></i>削除する'
				},
				function() {
					thisObj._instances['AppModel'].delResidence(residenceId);
				}
			);
		}

		/*
		 * 物件の並び替え完了時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @return	void
		 */
		,onUpdateOrderHandler: function(event, ui) {
			var thisObj = this;
			var $item = $(ui.item);
			var id = +$item.attr('id').replace('residence-id_', '');
			var order = $item.parent().children().index($item) + 1;
			if (0 < order) {
				thisObj._instances['AppModel'].reorderResidence(id, order);
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
			thisObj._$focusedElem = $('#residences li.residence-item input[type="text"]:focus');
			thisObj._instances['AppModel'].request(id);
		}

		/*
		 * input[type="text"]のvalue変更時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	$targetElem		valueが変更されたInputエレメント
		 * @param	val				変更後のvalue
		 * @return	void
		 */
		,onChangeTextHandler: function(event, $targetElem, val) {
			var thisObj = this;
			var directoryElem = $targetElem.closest('li');
			var key = $targetElem.attr('name');
			var id = directoryElem.attr('id').replace('residence-id_', '');
			thisObj._instances['AppModel'].changeResidenceString(id, key, val);
		}

		/*
		 * inputのフォーカスがセットされた時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onSetFocusHandler: function(event) {
			var thisObj = this;
			thisObj._$focusedElem = $('#residences li.residence-item input[type="text"]:focus');
		}

		/*
		 * 物件にページがドロップされた時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @param	item			ページがドロップされた物件エレメント
		 * @return	void
		 */
		,onDropPageHandler: function(event, ui, item) {
			var thisObj = this;
			var $residence = $(item);
			var residenceId = $residence.attr('id').replace('residence-id_', '');
			var $page = $(ui.helper);
			var pageId = $page.attr('id');
			var deviceType = '';
			if (pageId.indexOf('sp-') !== -1) {
				pageId = +pageId.replace('sp-page-item_', '');
				deviceType = 'sp';
			} else {
				pageId = +pageId.replace('fp-page-item_', '');
				deviceType = 'fp';
			}
			$page.remove();
			thisObj._instances['AppModel'].movePage(pageId, deviceType, residenceId);
		}

		/*
		 * チェックボックス押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickCheckboxHandler: function(event) {
			var thisObj = this;
			event.stopPropagation();
			var $currentTarget = $(event.currentTarget);
			var $liElem = $currentTarget.closest('li');
			var isChecked = $currentTarget.attr('checked') === 'checked' ? true : false;

			if (isChecked === true) {
				$liElem.addClass('active');
			} else {
				$liElem.removeClass('active');
			}
			thisObj.setBulkBtnState();
		}

		/*
		 * 一括編集ボタンのステートをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setBulkBtnState: function() {
			var thisObj = this;
			// var $tabPane = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId);
			var $bulkBtn = $('#residences .btn-bulk-edit-outline');
			0 < $('#residences > ul > li .checkbox input[type="checkbox"]:checked').length ? $bulkBtn.removeClass('disabled') : $bulkBtn.addClass('disabled');
		}

		/*
		 * 全てチェックする/全てのチェックを外すボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onChangeCheckedBtnHandler: function(event) {
			var thisObj = this;
			var isChekced = $(event.currentTarget).hasClass('btn-checked-all') ? true : false;
			$('#residences .residence-item input[type="checkbox"]').attr('checked', isChekced);
			thisObj.setBulkBtnState();
		}

		/*
		 * チェックした物件の物件概要を一括編集するボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickBulkEditOutlineBtnHandler: function(event) {
			var thisObj = this;
			// var residenceIdArr = [];
			var residenceInfo = [];
			$('#residences > ul > li .checkbox input[type="checkbox"]:checked').each(function(i) {
				// residenceIdArr.push(+$(this).closest('li').attr('id').replace('residence-id_', ''));
				var $li = $(this).closest('li');
				residenceInfo.push(
					{
						'id'		: +($li.attr('id').replace('residence-id_', '')),
						'name'		: $li.find('.name input[type="text"][name="name"]').val()
					}
				);
			});
			if (0 < residenceInfo.length) {
				$(thisObj).trigger('onClickBulkEditOutlineBtn', [residenceInfo]);
			}
		}

		/*
		 * テキストボックスにフォーカスがあたった際にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onFocusTextInputHandler: function(event) {
			event.stopPropagation();
		}

		/*
		 * このクラス内で1度だけ有効にするイベントをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(thisObj._instances['AppModel'])
					.on('onChangeCurrentInfo', thisObj.onChangeCurrentInfo);
				$(thisObj._instances['TextInputManager'])
					.on('onSetFocus', thisObj.onSetFocusHandler)
					.on('onChangeValue', thisObj.onChangeTextHandler);
				$(window)
					.on('resize',thisObj.onResizeWindow);
			}
		}

		/*
		 * このクラス内で管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			var $baseElem = $('#residences');
			var prop = thisObj._instances['AppModel'].getProp();

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$baseElem
					.on('click', 'input[type="text"]', thisObj.onFocusTextInputHandler)	// テキストボックス
					.on('click', '.residence-item', thisObj.onClickResidenceHandler)	// 物件選択
					.on('click', '.btn-switch-residence', thisObj.onClickSwitchBtnHandler)	// 表示切り替え
					.on('click', '.btn-add-residence', thisObj.onClickAddResidenceBtnHandler)	// 物件追加
					.on('click', '.btn-duplicate-residence', thisObj.onClickDuplicateResidenceBtnHandler)	// 物件複製
					.on('click', '.btn-del-residence', thisObj.onClickDelResidenceBtnHandler)	// 物件削除
					.on('click', ':checkbox, label', thisObj.onClickCheckboxHandler)	// チェックボックス
					.on('click', '.btn-checked-all', thisObj.onChangeCheckedBtnHandler)	// 全てチェックする
					.on('click', '.btn-released-all', thisObj.onChangeCheckedBtnHandler)	// 全てのチェックを外す
					.on('click', '.btn-bulk-edit-outline', thisObj.onClickBulkEditOutlineBtnHandler)	// チェックした物件の物件概要を一括編集する

				// ログインユーザが顧客でなければ、物件リストのドラッグイベントを有効にする
				if (prop['isCustomer'] === false) {
					$baseElem
						.find('ul.residence-list')
							.attr('data-is-sortable', 1)
							.sortable(
								{
									'placeholder'				: 'placeholder',
									'tolerance'					: 'pointer',
									'forcePlaceholderSize'		: true,
									'opacity'					: 0.5,
									'update'					: thisObj.onUpdateOrderHandler
								}
							)
						.find('> li')
							.attr('data-is-droppable', 1)
							.droppable(
								{
									'accept'				: $('.page-item'),
									'tolerance'				: 'pointer',
									'hoverClass'			: 'on-hover',
									'drop'					: function(event, ui) { thisObj.onDropPageHandler(event, ui, this); }
								}
							)
				}

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$baseElem
					.off('click', 'input[type="text"]')	// テキストボックス
					.off('click', '.residence-item')	// 物件選択
					.off('click', '.btn-switch-residence')	// 表示切り替え
					.off('click', '.btn-add-residence')	// 物件追加
					.off('click', '.btn-duplicate-residence')	// 物件複製
					.off('click', '.btn-del-residence')	// 物件削除
					.off('click', ':checkbox label')	// チェックボックス
					.off('click', '.btn-checked-all')	// 全てチェックする
					.off('click', '.btn-released-all')	// 全てのチェックを外す
					.off('click', '.btn-bulk-edit-outline')	// チェックした物件の物件概要を一括編集する
				// ログインユーザが顧客でなければ、物件リストのドラッグイベントを無効にする
				if (prop['isCustomer'] === false) {
					$baseElem
						.find('ul.residence-list[data-is-sortable="1"]')
							.sortable('destroy')
							.attr('data-is-sortable', 0);
				}
			}

			thisObj._instances['TextInputManager'].setEvent($baseElem.find('input[type="text"]'), isEnabled);
		}
	}
});
