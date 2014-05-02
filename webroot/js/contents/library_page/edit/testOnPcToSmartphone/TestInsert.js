

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.edit.test.TestInsert');
	MYNAMESPACE.modules.edit.test.TestInsert = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.edit.test.TestInsert.prototype = {
		_instances							: {}
		,_insertData						: {}
		,_callback							: null
		,_count								: 0
		,_targetCount						: 3
		,_itemNames							: []
		
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
				,'judgeTestSerialInsert'
				,'testInsert'
				,'onCompleteInsertElement'
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
		,testInsert: function(itemName, order) {
			var thisObj = this;
			// thisObj._callback = null;
			thisObj._insertData = {
				'elementId'				: 'id-' + new Date().getTime(),
				'parentId'				: 'spContent',
				'smartphoneLibraryId'	: undefined,
				'itemName'				: itemName || 'Text',
				'order'					: order || 1,
			}
			console.log('TestInsert :: 追加開始 :: itemName = ' + thisObj._insertData['itemName'] + ', order = ' + thisObj._insertData['order']);
			thisObj._instances['DataManager'].insertElement(thisObj._insertData['elementId'], thisObj._insertData['parentId'], thisObj._insertData['smartphoneLibraryId'], thisObj._insertData['itemName'], thisObj._insertData['order']);
		}

		/*
		 * アコーディオンのヘッダーがクリックされた時にコールされるイベントハンドラ
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,onCompleteInsertElement: function(event, elementId, obj) {
			var thisObj = this;
			console.log('------------------------------------------');
			console.log('TestInsert :: 追加完了');
			console.log('サーバから返ってきたデータ');
			console.log(event.type);
			console.log(elementId);
			console.log(obj);
			var itemData = thisObj._instances['DataManager'].getItemDataObj(thisObj._insertData['itemName']);
			var correceObj = {
				'result'	: true,
				'data'		: {}
			}
			correceObj['data'][thisObj._insertData['elementId']] = {
				'smartphonePageElementId'		: obj['data'][thisObj._insertData['elementId']]['smartphonePageElementId'],
				// 'smartphoneLibraryElementId'	: '',
				'smartphoneLibraryId'			: 0,
				'order'							: thisObj._insertData['order'],
				'parentId'						: thisObj._insertData['parentId'],
				'itemName'						: thisObj._insertData['itemName'],
				'isLibrary'						: false,
				'property'						: itemData['components']
			}
			console.log('正しいはずのデータ');
			console.log(correceObj);
			console.log('比較 :: ' + (_.isEqual(obj, correceObj)));
			console.log('------------------------------------------');
			if (thisObj._callback) {
				thisObj._callback();
			} else {
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
				.on('onCompleteInsertElement', thisObj.onCompleteInsertElement);
		}
	}
});
