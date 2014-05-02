

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * 物件概要一括書き出しViewクラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.view.BulkEditOutlineView');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.BulkEditOutlineView = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.view.BulkEditOutlineView.prototype = {
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
		 * 物件概要一括編集確認ダイアログ表示メソッド
		 * @param	event				Eventオブジェクト
		 * @param	residenceInfo		一括編集する物件データ配列
		 * @return	void
		 */
		,confirm: function(event, residenceInfo) {
			var thisObj	= this;

			if (thisObj._modal) {
				thisObj._modal.find('.residence-list > li').remove();
				thisObj.setEvent(false);
			} else {
				$(_.template($('#bulk-edit-outline-modal-template').text(), {})).appendTo('body');
					$('#modified, #next-modified')
						.datepicker(
							{
								'format'				: 'yyyy年m月d日',
								'autoclose'				: true,
								'todayBtn'				: true,
								'todayHighlight'		: true,
								'language'				: 'ja'
							}
						)
				thisObj._modal = $('#bulk-edit-outline-modal');
			}
			thisObj.setEvent(true);

			// 物件名をリスト表示する
			thisObj._data = {
				'residenceInfo'				: residenceInfo
			}
			$(_.template($('#bulk-edit-outline-modal-residence-item-template').text(), thisObj._data)).appendTo(thisObj._modal.find('.residence-list'));

			thisObj._modal.modal('show');
		}

		/*
		 * 更新ボタン押下時にコールされるイベントハンドラ
		 * @param	event				Eventオブジェクト
		 * @return	void
		 */
		,onClickUpdateBtnHandler: function(event) {
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
