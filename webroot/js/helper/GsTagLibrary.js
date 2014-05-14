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
		this._gsData = {};
		this._code = '';
		this._id = '';
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.GsTagLibrary.prototype = {
		_isAccess						: false
		// ,_timerId						: -1
		// ,_gsData						: {}
		// ,_code							: ''

		// コンストラクタ
		,initialize: function(id) {
			var thisObj = this;
			thisObj._id = id;
			_.bindAll(
				this
				,'getGsData'
				,'execute'
				,'expandGsTag'
				,'getGSInfo'
				,'convertData'
			);
		}

		/*
		 * GoogleSpredsheetから取得したデータを返すメソッド
		 * @param	key 				GoogleSpreadsheetのURL
		 * @return	GoogleSpredsheetから取得したデータオブジェクト
		 */
		,getGsData: function(key) {
			var thisObj = this;
			var retObj = {};
			if (thisObj._gsData[key]) {
				retObj = thisObj._gsData[key];
			}
			return $.extend(true, {}, retObj);
		}

		/*
		 * GSタグ展開メソッド
		 * @param	code 				GSタグが記述されているHTMLソース
		 * @return	void
		 */
		,execute: function(code) {
			var thisObj = this;
			// console.log('---------');
			// console.log('GsTagLibrary :: execute :: code = ' + code);
			// console.log('---------');
			thisObj._code = code;
			if (thisObj._timerId) {
				clearInterval(thisObj._timerId);
			}
			thisObj._timerId = setInterval(
				function(event) {
					if (window.getGSData) {
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
			// console.log('code = ' + code);
			// console.log('gsInfo');
			// console.log(gsInfo);
			// console.log('**********');
			// console.log('GsTagLibrary :: expandGsTag :: _code = ' + thisObj._code);
			// console.log('**********');
			// Google Spreadsheetのキーが見つかった場合、下記の処理を行う
			if (0 < gsInfo.length) {
				var counter = 0, complete = gsInfo.length;
				$(window).off(('onCompleteRequestData_' + thisObj._id));
				$(window).on(('onCompleteRequestData_' + thisObj._id), function(event, data) {
				// $(window).off('onCompleteRequestData');
				// $(window).on('onCompleteRequestData', function(event, data) {
					var key = 'https://docs.google.com/spreadsheet/ccc?key=' + data.key + '&usp=drive_web#gid=' + data.gid;
					// thisObj._gsData[key]['source'] = thisObj.convertData(data['data'], data['gid'], thisObj._gsData[key]['pageType']);
					var obj = thisObj.convertData(data['data'], data['gid'], thisObj._gsData[key]['pageType']);
					thisObj._gsData[key]['source'] = obj['source'] ? obj['source'] : undefined;
					thisObj._gsData[key]['data'] = obj['data'] ? obj['data'] : undefined;
					thisObj._gsData[key]['master'] = data;
					// thisObj._gsData[key] = {
					// 	'source'	: thisObj.convertData(data['data'], data['gid']),
					// 	'master'	: data
					// };
					counter ++;
					// console.log('**********');
					// console.log('GsTagLibrary :: expandGsTag :: _code = ' + thisObj._code);
					// console.log('**********');
					// console.log('thisObj._gsData[' + key + ']');
					// console.log(thisObj._gsData[key]);
					// console.log('complete = ' + complete);
					// console.log('counter = ' + counter);
					// console.log('');
					if (counter === complete) {
						$(window).off(('onCompleteRequestData_' + thisObj._id));
						// $(window).off('onCompleteRequestData');
						console.log('全てのGSデータ取得完了');
						$(thisObj).trigger(('onCompleteExpandGsTag_' + thisObj._id));
						// $(thisObj).trigger('onCompleteExpandGsTag', thisObj._id);
						// $scope.$apply(function() {
						// 	_wysiwygCode = insertGSDataToHTML(code, _gsData);
						// 	_code = code;
						// });
						// $('.summernote').code(_wysiwygCode);    // WYSIWYGエディタにコードを挿入する
						// $('.code-view').val(_code);             // 置換したコードでソースエディタを更新する
					}
				});
				for (var i=0; i<complete; i++) {
					var key = 'https://docs.google.com/spreadsheet/ccc?key=' + gsInfo[i].key + '&usp=drive_web#gid=' + gsInfo[i].gid;
					if (thisObj._gsData[key]) {
						thisObj._gsData[key]['pageType'] = gsInfo[i]['pageType'];
						counter++;
						// $(window).trigger(('onCompleteRequestData_' + thisObj._id), [thisObj._gsData[key].master]);
					} else {
						thisObj._gsData[key] = {
							'pageType' :	gsInfo[i]['pageType']
						};
						window.getGSData(thisObj._id, gsInfo[i].key, gsInfo[i].gid);
					}
				}
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
			console.log('dateData');
			console.log(dateData);
			if (dateData !== null) {
				var maxRow = dateData.getNumberOfRows();;
				var tmpArr = [];
				var retObj = {};
				console.log('map :: maxRow = ' + maxRow);
				// var retStr = '';
				switch (pageType) {
					case 'about':
						for (row = 1; row < maxRow; row++) {
							// var tmpArr = [dateData.getValue(row, 0), dateData.getValue(row, 1)];
							tmpArr.push('<tr><td class="key">' + dateData.getValue(row, 0) + '</td><td class="val">' + dateData.getValue(row, 1) + '</td></tr>');
						}
						retObj['source'] = '<table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table>';
						// retStr = '<table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table>';
						break;

					case 'map':
						retObj['data'] = [];
						// console.log('dateData');
						// console.log(dateData);
						for (row = 0; row < maxRow; row++) {
							var tmpObj = {
								title		: dateData.getValue(row, 0),
								lat			: dateData.getValue(row, 1),
								lng			: dateData.getValue(row, 2),
								zoom		: dateData.getValue(row, 3),
								address		: dateData.getValue(row, 4)
							}
							console.log('row = ' + row);
							console.log(tmpObj);
							console.log('');
							retObj['data'].push(tmpObj);
							// var tmpArr = [dateData.getValue(row, 0), dateData.getValue(row, 1)];
							// tmpArr.push('<tr><td class="key">' + dateData.getValue(row, 0) + '</td><td class="val">' + dateData.getValue(row, 1) + '</td></tr>');
						}
						// retStr = '<table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table>';


					/*
					var myOptions = {
						zoom			: targetProperty['mapScale'],
						center			: new google.maps.LatLng(lat, lng),
						mapTypeId		: google.maps.MapTypeId.ROADMAP,
						scaleControl	: true,
						draggable		: false,
						scrollwheel		: false
					};
					thisObj._gMapObj['map'] = new google.maps.Map($("#" + elementId).find('.map')[0], myOptions);
					var marker = new google.maps.Marker({
						position	: new google.maps.LatLng(lat, lng),
						map			: thisObj._gMapObj['map'],
						title		: ''
					});
					*/
						break;
				}
				return retObj;
				// return retStr;
			} else {
				return {};
				// return '';
			}
		}
	}
});
