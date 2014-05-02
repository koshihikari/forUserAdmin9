/**
 * ...
 * 下記ページを参照
 * http://mymo.blog8.fc2.com/blog-entry-58.html
 * @author DefaultUser
 */

	/*
	 * ファイルドロップクラス
	 * eventName
	 * 		onErrorOverSupportFileNum, onErrorDifferentFileType, onErrorOverFileSize
	 * 		onDropFile
	 */
jQuery.noConflict();
jQuery(document).ready(function($){
	MYNAMESPACE.namespace('modules.helper.DropUploader');
	MYNAMESPACE.modules.helper.DropUploader = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.DropUploader.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false
		,_uploadInfo					: {}
		,_elems							: {}
		,_file							: null
		
		// コンストラクタ
		,initialize: function(dropTarget, fileType, fileSize, supportFileNum) {
			var thisObj = this;
			
			_.bindAll(
				this,
				'checkDropFile',
				'attachEvent',
				'setEvent'
			);
			this._elems = {
				'dropTarget'			: dropTarget,
				'fileUploaderModal'		: $("#fileUploaderModal")
			}
			this._uploadInfo = {
				fileType			: fileType,
				fileSize			: fileSize,
				supportFileNum		: supportFileNum
			}
			
			this.attachEvent();
		}
		
		/*
		 * ドロップされたファイルをチェックするメソッド
		 * @param	files		ドロップされたファイル
		 * @return	void
		 */
		,checkDropFile: function(files, event) {
			var thisObj = this;
			var isCorrect = false;
			var message = "";
			var arr = files[0].name.split(".");
			var ext = arr[arr.length - 1];
			
			if (thisObj._uploadInfo["supportFileNum"] < files.length) {
				$(thisObj).trigger('onErrorOverSupportFileNum', files.length)
			} else if (thisObj._uploadInfo.fileType.indexOf(ext) === -1) {
				$(thisObj).trigger('onErrorDifferentFileType', ext)
			} else if (thisObj._uploadInfo["fileSize"] < files[0].size) {
				$(thisObj).trigger('onErrorOverFileSize', files[0].size)
			} else {
				$(thisObj).trigger('onDropFile', [files[0], ext])
			}
		}
		
		/*
		 * このクラスで管理するエレメントのイベント定義メソッド
		 * @param	void
		 * @return	void
		 */
		,attachEvent: function() {
			var thisObj = this;
			
			// console.log('thisObj._elems["dropTarget"]');
			// console.log(thisObj._elems['dropTarget']);
			// console.log('thisObj._isOnceEventEnabled = ' + thisObj._isOnceEventEnabled);
			if (thisObj._isOnceEventEnabled === false) {
				thisObj._isOnceEventEnabled = true;
			//	$(document)
				thisObj._elems['dropTarget']
					.on("dragover", function(event){
						return false;
						// console.log('dragover');
					})
					.on("dragend", function(event){
						return false;
						// console.log('dragend');
					})
					.on("drop", function(event){
						event.preventDefault();
						event.stopPropagation();
						// console.log('drop');
						if (thisObj._isEnabled === true) {
							thisObj.checkDropFile(event.originalEvent.dataTransfer.files, event);
						}
						return false;
					});
			}
		}
		
		/*
		 * イベント有効メソッド
		 * @param	isEnabled			true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			thisObj._isEnabled = isEnabled;
		}
	}
//})();
});
