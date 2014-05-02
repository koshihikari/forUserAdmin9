

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.edit.test.TestDelete');
	MYNAMESPACE.modules.edit.test.TestDelete = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.edit.test.TestDelete.prototype = {
		_instances							: {}
		,_insertData						: {}
		,_callback							: null
		,_count								: 0
		,_targetCount						: 0
		,_deleteElementIdArr				: null
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
				,'testSerialDelete'
				,'judgeTestSerialDelete'
				,'testDelete'
				,'onCompleteDeleteElement'
				,'setEvent'
			);
			this._instances = instances;
			this.setEvent(true);
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,testSerialDelete: function() {
			var thisObj = this;
			var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
			thisObj._deleteElementIdArr = [];
			for (var elementId in allElementDataObj) {
				if (elementId !== 'displayArea') {
					thisObj._targetCount ++;
					thisObj._deleteElementIdArr.push(elementId);
				}
			}
			thisObj._targetCount --;
			thisObj._callback = thisObj.judgeTestSerialDelete;
			thisObj.judgeTestSerialDelete();
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,judgeTestSerialDelete: function() {
			var thisObj = this;
			console.log('thisObj._count = ' + thisObj._count + ', thisObj._targetCount = ' + thisObj._targetCount);
			if (thisObj._targetCount < ++thisObj._count) {
				var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
				console.log('testSeriaDelete終了');
				console.log('------------------------------------------');
				console.log('TestDelete :: 削除完了');
				console.log('allElementDataObj');
				console.log(allElementDataObj);
				console.log('thisObj._baseElementDataObj');
				console.log(thisObj._baseElementDataObj);
				console.log('比較 :: ' + (_.isEqual(allElementDataObj, thisObj._baseElementDataObj)));
				console.log('------------------------------------------');
				$(thisObj).trigger('onCompleteTestSerialDelete');
			} else {
				thisObj.testDelete(thisObj._deleteElementIdArr[thisObj._count - 1]);
			}
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,testDelete: function(elementId) {
			var thisObj = this;
			thisObj._baseElementDataObj = thisObj._baseElementDataObj || thisObj._instances['DataManager'].getAllElementDataObj();
			console.log('thisObj._baseElementDataObj');
			console.log(thisObj._baseElementDataObj);
			// thisObj._callback = null;
			thisObj._insertData = {
				'elementId'				: elementId
			}
			delete thisObj._baseElementDataObj[elementId];
			console.log('TestDelete :: 削除開始 :: elementId = ' + thisObj._insertData['elementId']);
			thisObj._instances['DataManager'].deleteElement(thisObj._insertData['elementId']);
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,onCompleteDeleteElement: function(event, elementId) {
			var thisObj = this;
			if (thisObj._callback) {
				thisObj._callback();
			} else {
				var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
				console.log('------------------------------------------');
				console.log('TestDelete :: 削除完了');
				console.log('サーバから返ってきたデータ');
				console.log(event.type);
				console.log(elementId);
				console.log('allElementDataObj');
				console.log(allElementDataObj);
				console.log('thisObj._baseElementDataObj');
				console.log(thisObj._baseElementDataObj);
				console.log('比較 :: ' + (_.isEqual(elementId, thisObj._insertData['elementId'])));
				console.log('比較 :: ' + (_.isEqual(allElementDataObj, thisObj._baseElementDataObj)));
				console.log('thisObj._callback = ' + thisObj._callback);
				console.log('------------------------------------------');
				$(thisObj).trigger('onCompleteTestInsert');
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
				.on('onCompleteDeleteElement', thisObj.onCompleteDeleteElement);
		}
	}
});
