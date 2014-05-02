

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * タグ一括書き出しViewクラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.view.BulkEditTagView');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.BulkEditTagView = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.BulkEditTagView.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_data							: {}
		,_modal							: null

		/*
		 * コンストラクタ
		 * @param	appModel 		Modelインスタンス
		 * @return	void
		 */
		,initialize: function(appModel) {
			var thisObj = this;
			this._instances['AppModel'] = appModel;

			_.bindAll(
				this
				,'confirm'
				,'onClickUpdateBtnHandler'
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
			thisObj._data = data;

			if (thisObj._modal) {
				thisObj._modal
					.find('.residence-list')
						.find('.id').html(thisObj._data['residenceInfo']['id'])
					.end()
						.find('.name').html(thisObj._data['residenceInfo']['name'])
					.end()
					.end()
					.find('.page-list > li').remove()
					.end()
					.find('.tag-list > *').remove();
				thisObj.setEvent(false);
			} else {
				$(_.template($('#bulk-edit-tag-modal-template').text(), thisObj._data)).appendTo('body');
				thisObj._modal = $('#bulk-edit-tag-modal');
			}
			thisObj.setEvent(true);

			if (1 < thisObj._data['pageInfo'].length) {
				// タグデータをリスト表示する
				var tagInfo = {
					'tagInfo': [
						{
							'name'	: '',
							'code'	: ''
						}
					]
				};
				console.log(tagInfo);
				$(_.template($('#bulk-edit-tag-modal-tag-item-template').text(), tagInfo)).appendTo(thisObj._modal.find('.tag-list'));
			}
			// ページ名をリスト表示する
			$(_.template($('#bulk-edit-tag-modal-page-item-template').text(), thisObj._data)).appendTo(thisObj._modal.find('.page-list'));

			thisObj._modal.modal('show');
		}

		/*
		 * 更新ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickUpdateBtnHandler: function(event) {
			/*
			var thisObj = this;
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
			thisObj._modal.modal('hide');
			*/
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
				$(thisObj._modal)
					.on('click', '.btn-update', thisObj.onClickUpdateBtnHandler)

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$(thisObj._modal)
					.off('click', '.btn-update')
			}
		}
	}
});
