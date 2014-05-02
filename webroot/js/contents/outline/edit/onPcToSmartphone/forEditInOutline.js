

jQuery.noConflict();
jQuery(document).ready(function($){
	var Util								= new MYNAMESPACE.modules.helper.Util();
	var AlertModalManager					= new MYNAMESPACE.modules.AlertModalManager();
	var DropUploader						= new MYNAMESPACE.modules.helper.DropUploader($(document), 'csv,xml', 100000, 1);
	var DataManager							= new MYNAMESPACE.modules.outline.edit.DataManager();
	var PageManager							= new MYNAMESPACE.modules.outline.edit.PageManager(DataManager);

	// var residenceNum						= DataManager.getData()['residenceNum'];

	var FRKManager							= new MYNAMESPACE.modules.helper.FRKManager();
	var CustomXMLManager					= new MYNAMESPACE.modules.helper.CustomXMLManager();
	// var FRKManager							= new MYNAMESPACE.modules.FRKManager(residenceNum);


	$(PageManager)
		.on('onAddCategory', function(event, data, callback) {
			console.log('onAddCategory');
			console.log(data);
			DataManager.sendData('addCategory', data, callback);
		})
		.on('onDelCategory', function(event, data, callback) {
			console.log('onDelCategory');
			console.log(data);
			DataManager.sendData('delCategory', data, callback);
		})
		.on('onAddItem', function(event, data, callback) {
			console.log('onAddItem');
			console.log(data);
			DataManager.sendData('addItem', data, callback);
		})
		.on('onDelItem', function(event, data, callback) {
			console.log('onDelItem');
			console.log(data);
			DataManager.sendData('delItem', data, callback);
		})
		.on('onChangeOrder', function(event, data, callback) {
			console.log('data');
			console.log(data);
			DataManager.sendData('reorder', data, callback);
		})
		.on('onChangeData', function(event, type, data, callback) {
			switch (type) {
				case 'residence':
					DataManager.sendData('changeResidence', data, callback);
					break;

				case 'category':
					DataManager.sendData('changeCategory', data, callback);
					break;

				case 'item':
					DataManager.sendData('changeItem', data, callback);
					break;
			}
		})
		;

	$(DataManager)
		.on('onInitGetFieldList', function(event) {
			Util.setStatus(true, 'データ取得中・・・');
		})
		.on('onCompleteGetFieldList', function(event) {
			Util.setStatus(true, 'データ取得完了', 500);
		})
		.on('onErrorGetFieldList', function(event) {
			Util.setStatus(true, 'データ取得失敗');
			Util.showCurtain('データの取得に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitUpdateResidence', function(event) {
			Util.setStatus(true, '物件データ保存中・・・');
		})
		.on('onCompleteUpdateResidence', function(event) {
			Util.setStatus(true, '物件データ保存完了', 500);
		})
		.on('onErrorUpdateResidence', function(event) {
			Util.setStatus(true, '物件データ保存失敗');
			Util.showCurtain('物件データの保存に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitReorder', function(event) {
			Util.setStatus(true, 'データ並び替え中・・・');
		})
		.on('onCompleteReorder', function(event) {
			Util.setStatus(true, 'データ並び替え完了', 500);
		})
		.on('onErrorReorder', function(event) {
			Util.setStatus(true, 'データ並び替え失敗');
			Util.showCurtain('データの並び替えに失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitAddCategory', function(event) {
			Util.setStatus(true, 'カテゴリ追加中・・・');
		})
		.on('onCompleteAddCategory', function(event) {
			Util.setStatus(true, 'カテゴリ追加完了', 500);
		})
		.on('onErrorAddCategory', function(event) {
			Util.setStatus(true, 'カテゴリ追加失敗');
			Util.showCurtain('カテゴリの追加に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitDelCategory', function(event) {
			Util.setStatus(true, 'カテゴリ削除中・・・');
		})
		.on('onCompleteDelCategory', function(event) {
			Util.setStatus(true, 'カテゴリ削除完了', 500);
		})
		.on('onErrorDelCategory', function(event) {
			Util.setStatus(true, 'カテゴリ削除失敗');
			Util.showCurtain('カテゴリの削除に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitUpdateCategory', function(event) {
			Util.setStatus(true, 'カテゴリ更新中・・・');
		})
		.on('onCompleteUpdateCategory', function(event) {
			Util.setStatus(true, 'カテゴリ更新完了', 500);
		})
		.on('onErrorUpdateCategory', function(event) {
			Util.setStatus(true, 'カテゴリ更新失敗');
			Util.showCurtain('カテゴリの更新に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitAddItem', function(event) {
			Util.setStatus(true, 'アイテム追加中・・・');
		})
		.on('onCompleteAddItem', function(event) {
			Util.setStatus(true, 'アイテム追加完了', 500);
		})
		.on('onErrorAddItem', function(event) {
			Util.setStatus(true, 'アイテム追加失敗');
			Util.showCurtain('アイテムの追加に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitDelItem', function(event) {
			Util.setStatus(true, 'アイテム削除中・・・');
		})
		.on('onCompleteDelItem', function(event) {
			Util.setStatus(true, 'アイテム削除完了', 500);
		})
		.on('onErrorDelItem', function(event) {
			Util.setStatus(true, 'アイテム削除失敗');
			Util.showCurtain('アイテムの削除に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitUpdateItem', function(event) {
			Util.setStatus(true, 'アイテム更新中・・・');
		})
		.on('onCompleteUpdateItem', function(event) {
			Util.setStatus(true, 'アイテム更新完了', 500);
		})
		.on('onErrorUpdateItem', function(event) {
			Util.setStatus(true, 'アイテム更新失敗');
			Util.showCurtain('アイテムの更新に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		})

		.on('onInitReplaceData', function(event) {
			Util.setStatus(true, 'データ更新中・・・');
		})
		.on('onCompleteReplaceData', function(event) {
			Util.setStatus(true, 'データ更新完了', 500);
		})
		.on('onErrorReplaceData', function(event) {
			Util.setStatus(true, 'データ更新失敗');
			Util.showCurtain('データの更新に失敗しました。<br />申し訳ありませんがブラウザをリロードして再度操作をしてみてください。');
		});

	$(DropUploader)
		.on('onErrorOverSupportFileNum', function(event, droppedFileNum) {
			var title = 'ドロップされたファイルが多すぎます。';
			var message = droppedFileNum + '個のファイルがドロップされました。<br />一度にドロップできるのは1つだけです。';
			AlertModalManager.open(title, message);
		})
		.on('onErrorDifferentFileType', function(event, droppedFileExt) {
			var title = 'FRKまたは、XML以外のファイルがドロップされました。';
			var message = droppedFileExt + 'ファイルがドロップされました。<br />ドロップできるのはcsvか、xmlファイルだけです。';
			AlertModalManager.open(title, message);
		})
		.on('onErrorOverFileSize', function(event, droppedFileSize) {
			var title = 'ドロップされたファイルサイズが大きすぎます。';
			var message = 'ファイルサイズが' + (droppedFileSize / 1000) + 'KBのファイルがドロップされました。<br />ファイルサイズは100KBまでにしてください。';
			AlertModalManager.open(title, message);
		})
		.on('onDropFile', function(event, droppedFile, ext) {
			if (ext === 'xml') {
				console.log('XML');
				CustomXMLManager.parse(droppedFile, PageManager.getResidenceNum());
			} else if (ext === 'csv') {
				console.log('CSV');
				console.log('物件番号 = ' + PageManager.getResidenceNum());
				FRKManager.parse(droppedFile, PageManager.getResidenceNum());
			}
		});

	$(FRKManager)
		.on('onStartParse', function(event) {
			Util.setStatus(true, 'FRK解析中・・・');
		})
		.on('onCompleteParse', function(event, frkDataArr) {
			Util.setStatus(true, 'FRK解析完了', 500);
			console.log(frkDataArr);
			var result = FRKManager.compare(DataManager.getProp()['mtrOutlines'], frkDataArr);
			if (result['isSame'] === true) {
				var title = '物件情報は最新です。';
				var message = 'ドロップされたFRKファイルと現在の物件情報に違いはありませんでした。';
				AlertModalManager.open(title, message);
			} else {
				// return;
				PageManager.setEvent(false);
				DataManager.sendData('replaceData', result['renewalData'], function(result2) {
					console.log(result2);
					PageManager.replaceAllData(result2['data']);
					var title = '物件情報更新完了';
					var message = '物件情報の更新が完了しました。';
					AlertModalManager.open(title, message);
				});
			}
		})
		.on('onErrorParse', function(event) {
			Util.setStatus(true, 'FRK解析失敗');
			var title = 'FRKの解析処理に失敗しました。';
			var message = 'ドロップされたFRKファイルの解析ができませんでした。<br />お手数ですが、ドロップされたファイルを確認してみて下さい。';
			AlertModalManager.open(title, message);
		});

	$(CustomXMLManager)
		.on('onStartParse', function(event) {
			Util.setStatus(true, 'XML解析中・・・');
		})
		.on('onCompleteParse', function(event, xmlData) {
			Util.setStatus(true, 'XML解析完了', 500);
			console.log(xmlData);
			var result = CustomXMLManager.compare(DataManager.getProp()['mtrOutlines'], xmlData);
			if (result['isSame'] === true) {
				var title = '物件情報は最新です。';
				var message = 'ドロップされたXMLファイルと現在の物件情報に違いはありませんでした。';
				AlertModalManager.open(title, message);
			} else {
				console.log('XMLでデータをリプレイス');
				console.log('renewalData');
				console.log(result['renewalData']);
				PageManager.setEvent(false);
				DataManager.sendData('replaceData', result['renewalData'], function(result2) {
					console.log(result2);
					PageManager.replaceAllData(result2['data']);
					var title = '物件情報更新完了';
					var message = '物件情報の更新が完了しました。';
					AlertModalManager.open(title, message);
				});
			}
		})
		.on('onErrorParse', function(event) {
			Util.setStatus(true, 'XML解析失敗');
			var title = 'XMLの解析処理に失敗しました。';
			var message = 'ドロップされたXMLファイルの解析ができませんでした。<br />お手数ですが、ドロップされたファイルを確認してみて下さい。';
			AlertModalManager.open(title, message);
		});

	DropUploader.setEvent(true);
	PageManager.setEvent(true);
});

