

jQuery.noConflict();
jQuery(document).ready(function($){
	var Util								= new MYNAMESPACE.modules.helper.Util();
	var AlertModalManager					= new MYNAMESPACE.modules.AlertModalManager();
	var DropUploader						= new MYNAMESPACE.modules.DropUploader($(document), 'csv', 100000, 1);
	var DataManager							= new MYNAMESPACE.modules.outline.edit.DataManager();
	var PageManager							= new MYNAMESPACE.modules.outline.edit.PageManager(DataManager);

	var residenceNum						= DataManager.getData()['residenceNum'];
	
	var FRKManager							= new MYNAMESPACE.modules.FRKManager(residenceNum);


	$(DropUploader)
		.on('onErrorOverSupportFileNum', function(event, droppedFileNum) {
			var title = 'ドロップされたファイルが多すぎます。';
			var message = droppedFileNum + '個のファイルがドロップされました。<br />一度にドロップできるのは1つだけです。';
			AlertModalManager.open(title, message);
		})
		.on('onErrorDifferentFileType', function(event, droppedFileExt) {
			var title = 'FRK以外のファイルがドロップされました。';
			var message = droppedFileExt + 'ファイルがドロップされました。<br />ドロップできるのはcsvファイルだけです。';
			AlertModalManager.open(title, message);
		})
		.on('onErrorOverFileSize', function(event, droppedFileSize) {
			var title = 'ドロップされたファイルサイズが大きすぎます。';
			var message = 'ファイルサイズが' + (droppedFileSize / 1000) + 'KBのファイルがドロップされました。<br />ファイルサイズは100KBまでにしてください。';
			AlertModalManager.open(title, message);
		})
		.on('onDropFile', function(event, droppedFile) {
			FRKManager.parse(droppedFile, DataManager.getData()['residenceNum']);
		});

	$(FRKManager)
		.on('onStartParse', function(event) {
		})
		.on('onCompleteParse', function(event, frkDataArr) {
			// console.log(frkDataArr);
			PageManager.showFRK(frkDataArr);
		})
		.on('onErrorParse', function(event) {
			var title = 'FRKの解析処理に失敗しました。';
			var message = 'ドロップされたFRKファイルの解析ができませんでした。<br />お手数ですが、ドロップされたファイルを確認してみて下さい。';
			AlertModalManager.open(title, message);
		});

	$(PageManager)
		.on('onInitShowFRK', function(event) {
			// console.log('FRK表示開始');
		})
		.on('onCompleteShowFRK', function(event, diffObj) {
			// console.log('FRK表示完了');
			// console.log(diffObj);
			if (diffObj) {
				DataManager.setSeverAccessEnable(false);
				DataManager.saveFRK(diffObj);
			} else {
				var title = '物件情報は最新です。';
				var message = 'ドロップされたFRKファイルと現在の物件情報に違いはありませんでした。';
				AlertModalManager.open(title, message);
			}
		})
		.on('onClickAddBtn', function(event, targetOrder) {
			DataManager.insertField(targetOrder);
		})
		.on('onClickDelBtn', function(event, targetRecordId) {
			DataManager.deleteField(targetRecordId);
		})
		.on('onChangeData', function(event, targetRecordId, data) {
			DataManager.update(targetRecordId, data);
		})
		.on('onChangeOrder', function(event, targetRecordId, targetOrder) {
			DataManager.reorder(targetRecordId, targetOrder);
		})
		.on('onChangeResidenceNum', function(event, newResidenceNum) {
			DataManager.saveResidenceNum(newResidenceNum);
		});

	$(DataManager)
		// Field追加処理
		.on('onInitInsertField', function(event, tmpElementId, targetOrder) {
			// console.log('onInitInsertField :: tmpElementId = ' + tmpElementId);
			PageManager.insert(tmpElementId, targetOrder);
			Util.setStatus(true, 'データ保存中・・・');
		})
		.on('onCompleteInsertField', function(event, tmpElementId, recordId) {
			// console.log('onCompleteInsertField :: tmpElementId = ' + tmpElementId);
			PageManager.update(tmpElementId, {recordId:recordId});
			Util.setStatus(true, 'データ保存完了', 500);
		})
		.on('onErrorInsertField', function(event, tmpElementId) {
			// console.log('onErroInsertField :: tmpElementId = ' + tmpElementId);
			PageManager.delete(tmpElementId);
			Util.setStatus(true, 'データ保存処理でエラーが発生しました');
		})

		// Field削除処理
		.on('onInitDeleteField', function(event, targetRecordId) {
			PageManager.delete(targetRecordId);
			Util.setStatus(true, 'データ削除中・・・');
		})
		.on('onCompleteDeleteField', function(event, targetRecordId) {
			Util.setStatus(true, 'データ削除完了', 500);
		})
		.on('onErrorDeleteField', function(event, targetRecordId) {
			Util.setStatus(true, 'データ削除処理でエラーが発生しました');
		})

		// Field更新処理
		.on('onInitUpdateField', function(event, targetRecordId, data) {
			// console.log('onInitUpdateField :: targetRecordId = ' + targetRecordId);
			PageManager.update(targetRecordId, data);
			Util.setStatus(true, 'データ保存中・・・');
		})
		.on('onCompleteUpdateField', function(event, targetRecordId, data) {
			Util.setStatus(true, 'データ保存完了', 500);
		})
		.on('onErrorUpdateField', function(event, targetRecordId, data) {
			Util.setStatus(true, 'データ保存処理でエラーが発生しました');
		})

		// Field並べ替え処理
		.on('onInitReorder', function(event, targetRecordId, targetOrder) {
			Util.setStatus(true, 'データ保存中・・・');
		})
		.on('onCompleteReorder', function(event, targetRecordId, targetOrder) {
			Util.setStatus(true, 'データ保存完了', 500);
		})
		.on('onErrorReorder', function(event, targetRecordId, targetOrder) {
			Util.setStatus(true, 'データ保存処理でエラーが発生しました');
		})

		// FRKデータ保存処理
		.on('onInitSaveFRK', function(event) {
			Util.setStatus(true, 'データ保存中・・・');
			// console.log('FRK保存開始');
		})
		.on('onCompleteSaveFRK', function(event) {
			Util.setStatus(true, 'データ保存完了', 500);
			// console.log('FRK保存完了');
			DataManager.setSeverAccessEnable(true);
			var title = '物件情報を更新しました。';
			var message = 'ドロップされたFRKファイルをインポートし、物件情報を更新しました。';
			AlertModalManager.open(title, message);
		})
		.on('onErrorSaveFRK', function(event) {
			Util.setStatus(true, 'データ保存処理でエラーが発生しました');
			// console.log('FRK保存失敗');
		})

		// 物件番号保存処理
		.on('onInitSaveResidenceNum', function(event) {
			Util.setStatus(true, 'データ保存中・・・');
		})
		.on('onCompleteSaveResidenceNum', function(event) {
			Util.setStatus(true, 'データ保存完了', 500);
		})
		.on('onErrorSaveResidenceNum', function(event) {
			Util.setStatus(true, 'データ保存処理でエラーが発生しました');
		});

	DropUploader.setEvent(true);
	PageManager.setEvent(true);

	PageManager.refreshTooltip();
});

