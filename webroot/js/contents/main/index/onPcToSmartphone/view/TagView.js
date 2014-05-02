

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * タグ編集Viewクラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.view.TagView');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.TagView = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.TagView.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_instances						: {}
		,_delPageTag					: []
		// ,_data							: {}
		,_modal							: null
		,_targetResidenceId				: -1
		,_targetPageId					: -1

		/*
		 * コンストラクタ
		 * @param	appModel 		Modelインスタンス
		 * @return	void
		 */
		,initialize: function(appModel) {
			var thisObj = this;
			this._instances['AppModel'] = appModel;
			// this._instances['TextInputManager']		= new MYNAMESPACE.modules.helper.TextInputManager();

			_.bindAll(
				this
				,'confirm'
				,'onClickUpdateBtnHandler'
				,'onUpdateOrderHandler'
				,'onClickToggleBtnHandler'
				,'onChangeTextHandler'
				,'onClickAddTagBtnHandler'
				,'onClickDelTagBtnHandler'
				,'setOnceEvent'
				,'setEvent'
			);
		}

		/*
		 * タグ一括編集確認ダイアログ表示メソッド
		 * @param	event				Eventオブジェクト
		 * @param	data				一括編集するページデータ配列
		 * @return	void
		 */
		,confirm: function(event, data) {
			var thisObj	= this;
			thisObj._targetResidenceId = data['residenceId'];
			thisObj._targetPageId = data['id'];
			thisObj._delPageTag = [];

			var method = function(event, tagData) {
				// thisObj._data = data;

				if (thisObj._modal) {
					thisObj._modal
						.find('.tag-list > *').remove();
					thisObj.setEvent(false);
				} else {
					$(_.template($('#tag-edit-modal-template').text(), {'data':data})).appendTo('body');
					thisObj._modal = $('#tag-edit-modal');
				}

				if (tagData['result'] === true) {
					var tagInfo = {
						'tagInfo'	: []
					}
					for (var i=0,len=tagData['data'].length; i<len; i++) {
						tagInfo['tagInfo'].push(tagData['data'][i]['page_tags']);
					}
					console.log(tagInfo);
					$(_.template($('#tag-edit-modal-tag-item-template').text(), tagInfo)).appendTo(thisObj._modal.find('.tag-list'));
					$leftLi = thisObj._modal.find('.tag-list > li');
					if ($leftLi.length <= 1) {
						$leftLi.find('.btn-del-tag').addClass('disabled');
					}
				}

				thisObj.setOnceEvent();
				thisObj.setEvent(true);
				thisObj._modal.modal('show');
			};
			$(thisObj._instances['AppModel']).on('onSuccessCompleteGetPageTag', method);
			thisObj._instances['AppModel'].getPageTag(data['id']);
		}

		/*
		 * 更新ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickUpdateBtnHandler: function(event) {
			var thisObj = this;
			var pageTagData = [];
			thisObj._modal.find('.tag-list > li').each(function(i) {
				var $li = $(this);
				var tagId = +$li.attr('id').replace('tag-code-id_', '');
				var tagName = $li.find('input[type="text"][name="tag-name"]').val();
				var tagCode = $li.find('textarea').val();
				var order = i + 1;
				pageTagData.push(
					{
						'id'			: tagId,
						'device_num'	: 2,
						'page_id'		: thisObj._targetPageId,
						'tag_name'		: tagName,
						'tag_code'		: tagCode,
						'order'			: order
					}
				)
			});
			var isPublish = $('#is-publish').is(':checked');
			if (0 < pageTagData.length || 0 < thisObj._delPageTag.length) {
				// console.log('isPublish = ' + isPublish);
				var pageInfo = [];
				if ($('#is-publish').is(':checked') === true) {
					pageInfo.push(
						{
							'residenceId'	: thisObj._targetResidenceId,
							'pageId'		: thisObj._targetPageId,
							'deviceType'	: 'sp'
						}
					)
				}
				thisObj._instances['AppModel'].setPageTagData(pageTagData, thisObj._delPageTag, pageInfo);
			}
			/*
			var modified = $('#modified').val();
			var nextModified = $('#next-modified').val();
			// var modified = '1234';
			// var nextModified = '5678';
			var isPublish = $('#is-publish').is(':checked');
			var residenceIdArr = [];
			thisObj.setEvent(false);
			for (var key in thisObj._data['residenceInfo']) {
				residenceIdArr.push(thisObj._data['residenceInfo'][key]['id']);
			}
			// console.log('residenceIdArr');
			// console.log(residenceIdArr);
			// console.log('modified = ' + modified + ', nextModified = ' + nextModified + ', isPublish = ' + isPublish);
			thisObj._instances['AppModel'].bulkUpdateOutlineData(residenceIdArr, modified, nextModified, isPublish);
			*/
			/*
			var $li = $('#' + thisObj._deviceType + '-tab-content-in-residence-id_' + thisObj._residenceId + ' > ul > li');
			$li.find('.checkbox input[type="checkbox"]:checked').each(function(i) {
				// pageIdArr.push(+$(this).closest('li').attr('id').replace((thisObj._deviceType + '-page-item_'), ''));
				pageInfoArr.push(
					{
						'residenceId'		: thisObj._residenceId,
						'pageId'			: +$(this).closest('li').attr('id').replace((thisObj._deviceType + '-page-item_'), ''),
						'deviceType'		: thisObj._deviceType
					}
				);
			});
			if (0 < pageInfoArr.length) {
				$(thisObj).trigger('onClickBulkPublishBtn', [pageInfoArr]);
				// $(thisObj).trigger('onClickBulkPublishBtn', [thisObj._deviceType, pageIdArr]);
			}
			*/
			thisObj._modal.modal('hide');
		}

		/*
		 * タグリストの並び替え完了時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	ui				UIオブジェクト
		 * @return	void
		 */
		,onUpdateOrderHandler: function(event, ui) {
			var thisObj = this;
			var $updateElem = $(ui.item);
			var $liElem = $updateElem.closest('li');
			var tagId = +$liElem.attr('id').replace('tag-code-id_', '');
			var order = $updateElem.parent().children().index($updateElem) + 1;
			if (0 < order && tagId !== 0) {
				thisObj._instances['AppModel'].reorderPageTag(tagId, order, thisObj._targetPageId);
			}
		}

		/*
		 * タグリスト開閉ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickToggleBtnHandler: function(event) {
			var thisObj = this;
			$(event.currentTarget).closest('li').find('.li-body').slideToggle();
		}

		/*
		 * タグ追加ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickAddTagBtnHandler: function(event) {
			var thisObj = this;
			var $li = $(event.currentTarget).closest('li');
			var tagInfo = {
				'tagInfo'	: [
					{
						'tag_name'	: '',
						'tag_code'	: ''
					}
				]
			}
			$li.after($(_.template($('#tag-edit-modal-tag-item-template').text(), tagInfo)));
			thisObj._modal.find('.tag-list > li .btn-del-tag').removeClass('disabled');
			thisObj.setEvent(false);
			thisObj.setEvent(true);
		}

		/*
		 * タグ削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,onClickDelTagBtnHandler: function(event) {
			var thisObj = this;
			var $leftLi = thisObj._modal.find('.tag-list > li');
			if (1 < $leftLi.length) {
				var $li = $(event.currentTarget).closest('li');
				var tagId = +$li.attr('id').replace('tag-code-id_', '');
				if (tagId !== 0) {
					thisObj._delPageTag.push(tagId);
					// thisObj._instances['AppModel'].delPageTag(tagId);
				}
				$li.remove();
				$leftLi = thisObj._modal.find('.tag-list > li');
				if ($leftLi.length <= 1) {
					$leftLi.find('.btn-del-tag').addClass('disabled');
				}
			}
		}

		/*
		 * input[type="text"],textareaのvalue変更時にコールされるイベントハンドラ
		 * @param	event			Eventオブジェクト
		 * @param	$targetElem		valueが変更されたエレメント
		 * @param	val				変更後のvalue
		 * @return	void
		 */
		,onChangeTextHandler: function(event, $targetElem, val) {
			/*
			var thisObj = this;
			var $li = $targetElem.closest('li');
			var tagId = +$li.attr('id').replace('tag-code-id_', '');
			var tagName = $li.find('input[type="text"][name="tag-name"]').val();
			var tagCode = $li.find('textarea').val();
			var order = $li.parent().children().index($li) + 1;
			// console.log('page_id = ' + thisObj._targetPageId + ', tagId = ' + tagId + ', tagName = ' + tagName + ', tagCode = ' + tagCode + ', order = ' + order);
			thisObj._instances['AppModel'].setPageTag(thisObj._targetPageId, tagId, tagName, tagCode, order, function(editedTagId) {
				$li.attr('id', editedTagId);
			});
			*/
		}

		/*
		 * このクラス内で1度だけ有効にするイベントをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				thisObj._isOnceEventEnabled = true;
				// $(thisObj._instances['TextInputManager'])
				// 	.on('onChangeValue', thisObj.onChangeTextHandler);
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;

			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				// thisObj._modal
				$(thisObj._modal)
					.on('click', '.btn-add-tag', thisObj.onClickAddTagBtnHandler)
					.on('click', '.btn-del-tag', thisObj.onClickDelTagBtnHandler)
					.on('click', '.btn-update', thisObj.onClickUpdateBtnHandler)
					.on('click', '.btn-toggle', thisObj.onClickToggleBtnHandler)
					.find('ul.tag-list')
						.attr('data-is-sortable', 1)
						.sortable(
							{
								'placeholder'				: 'placeholder',
								'tolerance'					: 'pointer',
								'axis'						: 'y',
								'containment'				: '.tag-list',
								'cancel'					: ':input, textarea, .btn',
								'forcePlaceholderSize'		: true,
								'opacity'					: 0.5,
								'update'					: thisObj.onUpdateOrderHandler
							}
						);

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				thisObj._modal
				// $(thisObj._modal)
					.off('click', '.btn-add-tag')
					.off('click', '.btn-del-tag')
					.off('click', '.btn-update')
					.off('click', '.btn-toggle')
					.find('ul.tag-list[data-is-sortable="1"]')
						.sortable('destroy')
						.attr('data-is-sortable', 0);
			}
			// thisObj._instances['TextInputManager'].setEvent($(thisObj._modal).find('input[type="text"],textarea'), isEnabled);
		}
	}
});
