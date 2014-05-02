

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.edit.test.TestReorder');
	MYNAMESPACE.modules.edit.test.TestReorder = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.edit.test.TestReorder.prototype = {
		_instances							: {}
		,_insertData						: {}
		,_callback							: null
		,_count								: 0
		,_targetCount						: 3
		,_baseElementDataObj				: null
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(instances) {
			var thisObj = this;
			_.bindAll(
				this
				,'testSerialInsert'
				,'testReorder'
				,'onCompleteReorderElement'
				,'setEvent'
			);
			this._instances = instances;
			this.setEvent(true);
			this._itemNames = ['Text', 'Map', 'Youtube'];
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,testSerialInsert: function() {
			var thisObj = this;
			thisObj._callback = thisObj.judgeTestSerialInsert;
			thisObj.judgeTestSerialInsert();
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,judgeTestSerialInsert: function() {
			var thisObj = this;
			console.log('thisObj._count = ' + thisObj._count + ', thisObj._targetCount = ' + thisObj._targetCount);
			if (thisObj._targetCount < ++thisObj._count) {
				console.log('testSerialInsert終了');
				$(thisObj).trigger('onCompleteTestSerialInsert');
			} else {
				var randnum = Math.floor(Math.random() * thisObj._itemNames.length);
				// randnum = 0;
				thisObj.testInsert(thisObj._itemNames[randnum], 1);
			}
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,testReorder: function(elementId, newParentId, newOrder) {
			var thisObj = this;
			if (!thisObj._baseElementDataObj) {
				thisObj._baseElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
				console.log('thisObj._baseElementDataObj');
				console.log(thisObj._baseElementDataObj);
			}
			var oldParentId = thisObj._baseElementDataObj[elementId]['parentId'];
			var oldOrder = thisObj._baseElementDataObj[elementId]['order'];
			for (var tmpElementId in thisObj._baseElementDataObj) {
				if (tmpElementId !== 'displayArea' && tmpElementId !== elementId && thisObj._baseElementDataObj[tmpElementId]['parentId'] === oldParentId) {
					if (oldOrder < newOrder && oldOrder < thisObj._baseElementDataObj[tmpElementId]['order'] && thisObj._baseElementDataObj[tmpElementId]['order'] <= newOrder) {
						thisObj._baseElementDataObj[tmpElementId]['order'] = thisObj._baseElementDataObj[tmpElementId]['order'] - 1;
						console.log(tmpElementId + 'のorderを小さくする');
					}
					if (newOrder < oldOrder && newOrder <= thisObj._baseElementDataObj[tmpElementId]['order'] && thisObj._baseElementDataObj[tmpElementId]['order'] < oldOrder) {
						thisObj._baseElementDataObj[tmpElementId]['order'] = thisObj._baseElementDataObj[tmpElementId]['order'] + 1;
						console.log(tmpElementId + 'のorderを大きくする');
					}
				}
			}
			thisObj._baseElementDataObj[elementId]['parentId'] = newParentId;
			thisObj._baseElementDataObj[elementId]['order'] = newOrder;
			console.log('TestReorder :: 並び替え開始 :: elementId = ' + elementId + ', newParentId = ' + newParentId + ', order = ' + newOrder);
			thisObj._instances['DataManager'].reOrderData(elementId, newParentId, newOrder);
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,onCompleteReorderElement: function(event) {
			var thisObj = this;
			if (thisObj._callback) {
				thisObj._callback();
			} else {
				var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
				console.log('------------------------------------------');
				console.log('TestReorder :: 並び替え完了');
				console.log('allElementDataObj');
				console.log(allElementDataObj);
				console.log('thisObj._baseElementDataObj');
				console.log(thisObj._baseElementDataObj);
				console.log('比較 :: ' + (_.isEqual(allElementDataObj, thisObj._baseElementDataObj)));
				console.log('------------------------------------------');
				$(thisObj).trigger('onCompleteTestReorder');
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			$(thisObj._instances['DataManager'])
				.on('onCompleteReorderElement', thisObj.onCompleteReorderElement);
		}
	}
});
