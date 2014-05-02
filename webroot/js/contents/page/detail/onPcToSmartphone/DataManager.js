

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.page.detail.DataManager');
	MYNAMESPACE.modules.page.detail.DataManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.page.detail.DataManager.prototype = {
		_isEnabled						: false
		,_prop							: {}
		,_isAccess						: false
		// ,_isAccesable					: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'sendData'
				,'getFieldList'


				// ,'setSeverAccessEnable'
				// ,'insertField'
				// ,'deleteField'
				// ,'update'
				// ,'reorder'
				// ,'saveFRK'



				,'setProp'
				,'getProp'
				// ,'setData'
				// ,'getData'
			);

			this.setProp();
			// this._isAccesable = true;
		}

		/*
		 * サーバアクセス可能/不可能セットメソッド
		 * @param	isEnable	true===サーバアクセス可能
		 * @return	void
		 */
		,sendData: function(action, updateData, callback) {
			var thisObj = this;
			var url = '', initEventName, successEventName, errorEventName;
			console.log('action = ' + action);
			switch (action) {
				case 'changeResidence':
					url = thisObj._prop['currentUrl'] + 'Outline/updateResidence/';
					initEventName = 'onInitUpdateResidence';
					successEventName = 'onCompleteUpdateResidence';
					errorEventName = 'onErrorUpdateResidence';
					break;

				case 'reorder':
					url = thisObj._prop['currentUrl'] + 'Outline/reorder/';
					initEventName = 'onInitReorder';
					successEventName = 'onCompleteReorder';
					errorEventName = 'onErrorReorder';
					break;

				case 'addCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/addCategory/';
					initEventName = 'onInitAddCategory';
					successEventName = 'onCompleteAddCategory';
					errorEventName = 'onErrorAddCategory';
					break;

				case 'delCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/delCategory/';
					initEventName = 'onInitDelCategory';
					successEventName = 'onCompleteDelCategory';
					errorEventName = 'onErrorDelCategory';
					break;

				case 'changeCategory':
					url = thisObj._prop['currentUrl'] + 'Outline/updateCategory/';
					initEventName = 'onInitUpdateCategory';
					successEventName = 'onCompleteUpdateCategory';
					errorEventName = 'onErrorUpdateCategory';
					break;

				case 'addItem':
					url = thisObj._prop['currentUrl'] + 'Outline/addItem/';
					initEventName = 'onInitAddItem';
					successEventName = 'onCompleteAddItem';
					errorEventName = 'onErrorAddItem';
					break;

				case 'delItem':
					url = thisObj._prop['currentUrl'] + 'Outline/delItem/';
					initEventName = 'onInitDelItem';
					successEventName = 'onCompleteDelItem';
					errorEventName = 'onErrorDelItem';
					break;

				case 'changeItem':
					url = thisObj._prop['currentUrl'] + 'Outline/updateItem/';
					initEventName = 'onInitUpdateItem';
					successEventName = 'onCompleteUpdateItem';
					errorEventName = 'onErrorUpdateItem';
					break;

				case 'replaceData':
					url = thisObj._prop['currentUrl'] + 'Outline/replaceData/';
					initEventName = 'onInitReplaceData';
					successEventName = 'onCompleteReplaceData';
					errorEventName = 'onErrorReplaceData';
					break;

				default:
					return;
			}
			var postData = {
				'base_data'			: {
					'user_id'				: thisObj._prop['userId'],
					'residence_id'			: thisObj._prop['residenceId']
				},
				'update_data'		: updateData
			}
			console.log('postData');
			console.log(postData);
			// return;
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;
				$(thisObj).trigger(initEventName);
				$.ajax(
					{
						type		: "POST",
						url			: url,
						data		: postData,
						dataType	: "json"
					})
					.done(function(obj) {
						console.log('成功');
						console.log(obj);
						thisObj._isAccess = false;
						$(thisObj).trigger(successEventName);
						if (callback) {
							callback(obj);
						}
					})
					.fail(function(obj) {
						console.log('失敗');
						console.log(obj);
						$(thisObj).trigger(errorEventName);
					})
			}
		}

		/*
		 * エレメントデータを取得するメソッド
		 * @param	ヴvoid
		 * @return	void
		 */
		,getFieldList: function() {
			var thisObj = this;

			// if (thisObj._isAccesable === true && thisObj._isAccess === false) {
			if (thisObj._isAccess === false) {
				thisObj._isAccess = true;

				$(thisObj).trigger('onInitGetFieldList');
				var postData = {
					'residence_id'		: thisObj._prop['residenceId'],
					'user_id'			: thisObj._prop['userId']
				}
				console.log(postData);
				$.ajax({
					type: "POST",
					url	: thisObj._prop['currentUrl'] + 'Outline/getFieldList/',
					data: postData,
					dataType: "json",
					success: function(obj){
						console.log('リクエスト完了');
						console.log("\n");
						console.log(obj);
						console.log("\n");

						thisObj._isAccess = false;
						if (obj['result'] === true) {
							/*
							var newObj = $.extend(true,{},obj['data']);
							var fixedClone = [];
							for (var key in newObj) {
								if (!isNaN(key) === true) {
									fixedClone[(key-0)] = newObj[key];
								}
							}
							$(thisObj).trigger('onCompleteGetFieldList', [fixedClone]);
							*/
							$(thisObj).trigger('onCompleteGetFieldList', [obj['data']]);
						} else {
							$(thisObj).trigger('onErrorGetFieldList');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert('エラーが発生しました。しばらくしてから再度試してみてください。');
						console.log('Error :: getFieldList');
						console.log('---------------------');
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						console.log('---------------------');
						thisObj._isAccess = false;
							$(thisObj).trigger('onErrorGetFieldList');
					}
				});
			}
		}

		/*
		 * HTMLのhiddenデータ保持メソッド
		 * @param	void
		 * @return	void
		 */
		,setProp: function() {
			var thisObj = this;

			thisObj._prop = {
				'currentUrl'				: $('input[type="hidden"][name="currentUrl"]') ? $('input[type="hidden"][name="currentUrl"]').val() : '',
				'userId'					: $('input[type="hidden"][name="userOd"]') ? $('input[type="hidden"][name="userId"]').val() - 0: -1,
				'residenceId'				: $('input[type="hidden"][name="residenceOd"]') ? $('input[type="hidden"][name="residenceId"]').val() - 0 : -1,
				'mtrOutlines'				: $('input[type="hidden"][name="mtrOutlines"]') ? $.parseJSON(eval("(" + $('input[type="hidden"][name="mtrOutlines"]').val() + ")")) : {}
			}

			console.log(thisObj._prop['mtrOutlines']);
		}

		/*
		 * データをDBに保存する際のプロパティを返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getProp: function() {
			var thisObj = this;
			var cloneElementData = $.extend(true, {}, thisObj._prop);
			return cloneElementData;
		}
	}
});
