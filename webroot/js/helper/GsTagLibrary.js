/**
 * ...
 * サーバアクセス制御クラス
 * @author DefaultUser
 */
jQuery.noConflict();
jQuery(document).ready(function($){
	MYNAMESPACE.namespace('modules.helper.GsTagLibrary');
	MYNAMESPACE.modules.helper.GsTagLibrary = function() {
		this._timerId = -1;
		this._code = '';
		this._id = '';
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.GsTagLibrary.prototype = {
		_isAccess						: false

		// コンストラクタ
		,initialize: function(id) {
			var thisObj = this;
			thisObj._id = id;
			_.bindAll(
				this
				,'execute'
				,'expandGsTag'
				,'getGSInfo'
				,'convertData'
			);
		}

		/*
		 * GSタグ展開メソッド
		 * @param	code 				GSタグが記述されているHTMLソース
		 * @return	void
		 */
		,execute: function(code) {
			var thisObj = this;
			thisObj._code = code;
			if (thisObj._timerId) {
				clearInterval(thisObj._timerId);
			}
			thisObj._timerId = setInterval(
				function(event) {
					if (window.GsManager['requestGsData']) {
						clearInterval(thisObj._timerId);
						console.log('GS展開の事前準備が完了しているので、実際の展開処理を実行');
						console.log('thisObj._code = ' + thisObj._code);
						thisObj.expandGsTag(thisObj._code);
					}
				},
				1000
			);
		}

		/*
		 * GSタグを展開したコードを作成するメソッド
		 * @param	code 				GSタグが記述されているHTMLソース
		 * @return	void
		 */
		,expandGsTag: function(code) {
			var thisObj = this;
			var gsInfo = thisObj.getGSInfo(code);   // WYSIWYGエディタに挿入するコードからGoogle Spreadsheetのキーを取得する
			if (0 < gsInfo.length) {
				var counter = 0, complete = gsInfo.length;
				$(window).off(('onCompleteRequestData_' + thisObj._id));
				$(window).on(('onCompleteRequestData_' + thisObj._id), function(event, data) {
					var spreadsheetId = window.GsManager['getSpreadsheetId'](data.key, data.gid);
					var gsData = window.GsManager['getGsData'](spreadsheetId);
					var obj = thisObj.convertData(data['data'], data['gid'], gsData['pageType']);
					// console.log('GsManagerに値をセット2');
					// window.GsManager['setGsData'](spreadsheetId, (obj['source'] ? obj['source'] : undefined), 'source');
					// console.log('GsManagerに値をセット3');
					window.GsManager['setGsData'](spreadsheetId, (obj['data'] ? obj['data'] : undefined), 'data');
					// console.log('GsManagerに値をセット4');
					window.GsManager['setGsData'](spreadsheetId, data, 'master');

					counter ++;
					if (counter === complete) {
						$(window).off(('onCompleteRequestData_' + thisObj._id));
						// $(window).off('onCompleteRequestData');
						var gsData = window.GsManager['getGsData'](spreadsheetId);
						console.log('全てのGSデータ取得完了');
						console.log('gsData');
						console.log(gsData);
						$(thisObj).trigger(('onCompleteExpandGsTag_' + thisObj._id));
					}
				});
				for (var i=0; i<complete; i++) {
					var spreadsheetId = window.GsManager['getSpreadsheetId'](gsInfo[i].key, gsInfo[i].gid);
					// console.log('GsManagerに値をセット1');
					window.GsManager['setGsData'](spreadsheetId, gsInfo[i]['pageType'], 'pageType');
					window.GsManager['requestGsData'](thisObj._id, gsInfo[i].key, gsInfo[i].gid);
				}
			} else {
				$(thisObj).trigger(('notIncludeGsTag_' + thisObj._id));
			}
		}

		/*
		 * GoogleSpreadsheetから取得したデータをHTMLのコードに変換するメソッド
		 * @param   data:Object			GoogleSpreadsheetから取得したデータ
		 * @param   gid:String 			取得したGoogleSpreadsheetのワークシートのID
		 * @param   pageType:String		ページタイプ
		 * @return  String				返還後のHTMLタグ
		 */
		,convertData: function(data, gid, pageType) {
			var thisObj = this;
			var row = 0;
			var dateData = data["gid" + gid];
			if (dateData !== null) {
				var maxRow = dateData.getNumberOfRows();;
				var tmpArr = [];
				var retObj = {};
				console.log('map :: maxRow = ' + maxRow);
				switch (pageType) {
					case 'about':
						retObj['data'] = [];
						var tmpArr = [];
						for (row = 1; row < maxRow; row++) {
							var title = dateData.getValue(row, 0);
							var key = title === '' ? dateData.getValue(row, 1) : '';
							var val = title === '' ? dateData.getValue(row, 2) : '';
							var note = title === '' ? dateData.getValue(row, 3) : '';

							if (title === '' && key === '' && val === '' && note === '') {
								continue;
							}
							if (title !== '') {
								// 新しい配列オブジェクトを作成して代入
								tmpArr.push({title:title});
							} else if (key !== '' && val !== '') {
								if (!tmpArr.length) {
									tmpArr.push({});
								}
								if (!tmpArr[tmpArr.length-1]['keyVal']) {
									tmpArr[tmpArr.length-1]['keyVal'] = [];
								}
								tmpArr[tmpArr.length-1]['keyVal'].push({key:key, val:val});
							} else if (note !== '') {
								if (!tmpArr.length) {
									tmpArr.push({});
								}
								if (!tmpArr[tmpArr.length-1]['note']) {
									tmpArr[tmpArr.length-1]['note'] = [];
								}
								tmpArr[tmpArr.length-1]['note'].push(note);
							}
						}
						retObj['data'] = tmpArr;
						break;

					case 'map':
						var obj = {data:[]};
						for (row = 0; row < maxRow; row++) {
							var tmpObj = {
								title		: dateData.getValue(row, 0),
								lat			: dateData.getValue(row, 1),
								lng			: dateData.getValue(row, 2),
								zoom		: dateData.getValue(row, 3),
								address		: dateData.getValue(row, 4),
								btnName		: dateData.getValue(row, 5),
								url			: dateData.getValue(row, 6),
								target		: dateData.getValue(row, 7)
							}
							tmpObj['target'] = tmpObj['target'] === '_blank' ? '_blank' : '_self'
							obj['data'].push(tmpObj);
						}
						// GSに記述されているデータをGoogleMap用とメニューボタン用に分ける為に再度データを検証する
						var len = obj['data'].length;
						retObj['data'] = [];
						for (var i=0; i<len; i++) {
							console.log('i = ' + i);
							// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapのデータ
							if (
								obj['data'][i]['title'] !== null && obj['data'][i]['title'] !== '' &&
								obj['data'][i]['lat'] !== null && obj['data'][i]['lat'] !== '' &&
								obj['data'][i]['lng'] !== null && obj['data'][i]['lng'] !== '' &&
								obj['data'][i]['zoom'] !== null && obj['data'][i]['zoom'] !== '' &&
								obj['data'][i]['address'] !== null && obj['data'][i]['address'] !== ''
							) {
								console.log('	GoogleMapのデータ');
								retObj['data'].push(obj['data'][i]);

							// ボタン名、URLが入力されていればリンクボタンのデータ
							} else {
								console.log('	リンクボタンのデータかも');
								var btnArr = [];
								for (i=i; i<len; i++) {
									console.log('		i = ' + i + ', リンクボタンのデータです');
									if (
										obj['data'][i]['btnName'] !== null && obj['data'][i]['btnName'] !== '' &&
										obj['data'][i]['url'] !== null && obj['data'][i]['url'] !== '' &&
										obj['data'][i]['target'] !== null && obj['data'][i]['target'] !== ''
									) {
										btnArr.push(obj['data'][i]);
									} else {
										i --;
										break;
									}
								}
								if (0 < btnArr.length) {
									retObj['data'].push(btnArr);
								}
							}
						};
						break;

					case 'appearance':
					case 'modelroom':
						var obj = {data:[]};
						var prevKey = '';
						var arr = [], prevArr = [];
						for (row = 1; row < maxRow; row++) {
							// GSの列の優先順位は、画像パス > キャッチコピー > ボディコピー > キャプションとし、有効な値はそれぞれの行で1列のみとする
							var img = dateData.getValue(row, 0);
							var chatchCopy = img === '' ? dateData.getValue(row, 1) : '';
							var bodyCopy = img === '' && chatchCopy === '' ? dateData.getValue(row, 2) : '';
							var caption = img === '' && chatchCopy === '' && bodyCopy === '' ? dateData.getValue(row, 3) : '';

							// GSのそれぞれの行に記述されている列に応じて変数keyの値を決める
							var key = '', val = '';
							if (img !== '') {
								key = 'images';
								val = img;
							} else if (chatchCopy !== '') {
								key = 'chatchCopies';
								val = chatchCopy;
							} else if (bodyCopy !== '') {
								key = 'bodyCopies';
								val = bodyCopy;
							} else if (caption !== '') {
								key = 'captions';
								val = caption;
							} else {
								continue;
							}

							// GSで1つ前の行と同じ列に値が記述されている場合、1つ前の行と同じ配列にpush
							if (key === prevKey) {
								prevArr.push(val);
							// GSで1つ前の行と異なる列に値が記述されている場合、新しくオブジェクト-配列を作って、push
							} else {
								var tmpObj = {};
								tmpObj[key] = [val];
								arr.push(tmpObj)
								prevArr = arr[arr.length-1][key];
							}
							prevKey = key;
						}
						retObj['data'] = arr;
						break;

					case 'plan':
						retObj['data'] = [];
						for (row = 0; row < maxRow; row++) {
							var isShow = dateData.getValue(row, 0);
							isShow = Number(isShow) === 1 ? true : false;
							if (isShow === true) {
								var img = dateData.getValue(row, 1);
								var url = dateData.getValue(row, 2);
								var tmpObj = {
									img		: img,
									url		: url
								}
								retObj['data'].push(tmpObj);
							}
						}
						break;

					case 'information':
						var obj = {data:[]};
						var prevKey = '';
						var arr = [], prevArr = [];
						for (row = 1; row < maxRow; row++) {
							// GSの列の優先順位は、タイトル > 本文とし、有効な値はそれぞれの行で1列のみとする
							var title = dateData.getValue(row, 0);
							var message = title === '' ? dateData.getValue(row, 1) : '';

							// GSのそれぞれの行に記述されている列に応じて変数keyの値を決める
							var key = '', val = '';
							if (title !== '') {
								key = 'titles';
								val = title;
							} else if (message !== '') {
								key = 'messages';
								val = message;
							} else {
								continue;
							}

							// GSで1つ前の行と同じ列に値が記述されている場合、1つ前の行と同じ配列にpush
							if (key === prevKey) {
								prevArr.push(val);
							// GSで1つ前の行と異なる列に値が記述されている場合、新しくオブジェクト-配列を作って、push
							} else {
								var tmpObj = {};
								tmpObj[key] = [val];
								arr.push(tmpObj)
								prevArr = arr[arr.length-1][key];
							}
							prevKey = key;
						}
						retObj['data'] = arr;
						break;
				}
				return retObj;
			} else {
				return {};
			}
		}

		/*
		 * 引数codeにGoogleSpreadsheet埋め込み用コードが含まれていれば、GSのURL、ワークシートのID等を返すメソッド
		 * @param   code:String      GSのコードが埋め込まれているか調べるソースコード
		 * @return  Array            GSのコードが埋め込まれていれば、GSのURL、ワークシートのID等を保持する配列
		 */
		,getGSInfo: function(code) {
			var thisObj = this;
			var retArr = [], tmpArr0 = [], tmpArr1 = [], tmpArr2 = [], tmpArr3 = [];
			var info = '';
			var result = code.match(/<!--insert_gs_to_(.+)\(.+?\)-->/g);
			// var result = code.match(/<!--insert_gs\(.+?\)-->/g);
			if (result !== null) {
				for (var i=0,len=result.length; i<len; i++) {
					code.match(/<!--insert_gs_to_(.+)\((.+?)\)-->/);
					// code.match(/<!--insert_gs\((.+?)\)-->/);
					// console.log(RegExp.$1);
					tmpArr0 = RegExp.$2.split('?');
					// console.log("tmpArr0");
					// console.log(tmpArr0);
					tmpArr1 = tmpArr0[1].split('#gid=');
					// console.log("tmpArr1");
					// console.log(tmpArr1);
					tmpArr2 = tmpArr1[0].split('&');
					// console.log("tmpArr2");
					// console.log(tmpArr2);
					var tmpObj = {
						pageType    : RegExp.$1,
						url         : tmpArr0[0],
						gid         : tmpArr1[1]
					};
					// console.log("tmpObj");
					// console.log(tmpObj);
					for (var j=0, len2=tmpArr2.length; j<len2; j++) {
						tmpArr3 = tmpArr2[j].split('=');
						tmpObj[tmpArr3[0]] = tmpArr3[1];
					}
					if (tmpObj) {
						retArr.push(tmpObj);
					}
					code = code.replace(/<!--insert_gs_to_(.+)\((.+?)\)-->/, "$1");
					// code = code.replace(/<!--insert_gs\((.+?)\)-->/, "$1");
				}
			}
			return retArr;
		}
	}
});
