

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * FRK管理クラス
	 * eventName
	 * 		onStartParse			パース開始時
	 * 		onCompleteParse			パース完了時
	 * 		onErrorParse			パース処理でエラーが発生
	 * 		onStarRefresh			FRKデータを画面に表示する処理開始時
	 * 		onCompleteRefresh		FRKデータを画面に表示する処理完了時
	 * 		onStartSave				保存処理開始時
	 * 		onCompleteSave			保存処理完了時
	 * 		onErrorSave				保存処理失敗時
	 */
	MYNAMESPACE.namespace('modules.helper.FRKManager');
	MYNAMESPACE.modules.helper.FRKManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.FRKManager.prototype = {
		_isEnabled						: false
		,_isAccess						: false
		// ,_propObj						: {}
		
		/*
		 * コンストラクタ
		 * @param	residenceId			物件ID
		 * @param	userId				ユーザID
		 * @param	frkId				FRKテーブルのID
		 * @param	residenceNum		FRKの物件番号
		 * @param	url					FRKデータ保存先URL
		 * @return	void
		 */
		,initialize: function() {
		// ,initialize: function(residenceId, userId, frkId, url) {
		// ,initialize: function(residenceNum, residenceId, userId, frkId, url) {
		// ,initialize: function(residenceId, userId, frkId, residenceNum, url) {
			var thisObj = this;
			_.bindAll(
				this
				,'parse'
				,'getResidenceData'
			);
			
			// this._propObj = {
			// 	'residenceId'		: residenceId,
			// 	'userId'			: userId,
			// 	'frkId'				: frkId,
			// 	'url'				: url
			// }
		}
		
		/*
		 * FRKをパースするメソッド
		 * @param	frkFile				FRKファイルのFileオブジェクト
		 * @param	residenceNum		物件番号
		 * @return	void
		 */
		,parse: function(frkFile, residenceNum) {
			var thisObj = this;
			
			$(thisObj).trigger('onStartParse');
			var reader = new FileReader();
			reader.onload = function (event) {
				var strData = event.target.result;
				strData = strData.replace( /\r\n/g , "\n" );		//IE対策　改行コード\r\nを\rに変換
				strData = strData.replace( /^(\n+)|(\n+)$/g , "" );	//文頭と文末の余計な改行を除去
				var lines = strData.split(/\n/);
				var residenceData = thisObj.getResidenceData(residenceNum, lines);
				// var residenceData = thisObj.getResidenceData(thisObj._propObj["residenceNum"], lines);
				
				if (residenceData.length) {
					$(thisObj).trigger('onCompleteParse', [residenceData]);
				} else {
					$(thisObj).trigger('onErrorParse');
				}
			}
			reader.readAsText(frkFile, "sjis");
		}
		
		/*
		 * FRKから引数に渡された物件番号のデータを取得するメソッド
		 * @param	residenceNum		FRKの物件番号
		 * @param	rowData				FRKデータ
		 * @return	void
		 */
		,getResidenceData: function(residenceNum, rowData) {
			var thisObj = this;
			var retArr = [];
			// console.log('--------------------------');
			// console.log('getResidenceData :: residenceNum = ' + residenceNum);
			for (var i=0, len=rowData.length; i<len; i++) {
				var columns = rowData[i].split(',');
				// var columns = rowData[i].match(/"[^"]*"|[^,]+/g);
				// console.log('	' + i + ', columns[0] = ' + columns[0]);
				if (columns[0] === residenceNum) {
					// 以下の処理はhttp://logicalerror.seesaa.net/article/140170418.htmlを参照
						var a = rowData[i].match(/"[^"]+"/g);	// まず、" で挟まれた文字列を取り出す
						var b = rowData[i].replace(/"[^"]+"/g,String.fromCharCode(0x1a));	// " で挟まれた文字列をデータ上存在しない文字で置き換える
						var y = b.split(",");	// その文字列をカンマで分割
						// 分割されたフィールドに置き換えられた文字列を戻す
						var n = 0;
						for( i = 0; i < y.length; i++ ) {
							// y[i] = y[i].replace(/'"'/g, '');
							if ( y[i] == String.fromCharCode(0x1a) ) {
								// y[i] = a[n].replace(/"/g, '');
								// y[i] = a[n].replace(/"[^"]+"/g, "$1");
								y[i] = a[n].replace(/"([^"]+)"/g, "$1");
								n++;
							}
						}
					retArr = y;
					// retArr = columns;
					break;
				} else {
					continue;
				}
			}

			// console.log(retArr);
			
			return retArr;
		}
		
		/*
		 * FRKデータを画面に表示するメソッド
		 * @param	frkDataArr		FRKデータ配列
		 * @return	void
		 */
		,compare: function(mtrOutlineData, frkDataArr) {
			// console.log('showFRKData');
			// console.log(frkDataArr);
			var thisObj = this;
			// thisObj.setEvent(false);
			// $(thisObj).trigger('onInitShowFRK');

			// 画面上のデータとマスタを比較し、内容が同じ場合にtrueを返す
			var compareMasterData = function(mtrOutlines) {
				// var baseElement = $('dl.category:eq(0)');
				var categoryElement = $('dl.category:eq(0) input[type="text"][name="category-name"]');
				var itemsElement = $('dl.category:eq(0) > dd > ul');
				var isSame = true;
				// console.log(mtrOutlines);
				for (var i=0,len=mtrOutlines.length; i<len; i++) {
					// console.log('	' + i + ' :: parent_category_id = ' + mtrOutlines[i]['parent_category_id']);
					if ((mtrOutlines[i]['parent_category_id']-0) === 0) {
						// カテゴリ名が一致するかチェック
						var categoryName = categoryElement.val();
						if (categoryName !== mtrOutlines[i]['key']) {
							isSame = false;
							// console.log('カテゴリ名が異なる');
							break;
						}
					} else {
						// アイテムの名前、順番、FRKインデックス、必須入力フラグが全て一致するかチェック
						var itemElement = itemsElement.find('> li:eq(' + (mtrOutlines[i]['order'] - 1) + ')');
						var itemName = itemElement.find('input[type="hidden"][name="key"]').val();
						var isRequired = itemElement.find('input[type="hidden"][name="is-required"]').val() - 0;
						var frkIndex = itemElement.find('input[type="hidden"][name="frk-index"]').val();
						if (
							itemName !== mtrOutlines[i]['key'] ||
							isRequired !== (mtrOutlines[i]['is_required']-0) ||
							frkIndex !== mtrOutlines[i]['frk_index']
						) {
							// console.log(itemName + 'か、' + isRequired + 'か、' + frkIndex + 'が異なる');
							isSame = false;
							break;
						}
					}
				}
				// $('dl.category:eq(0)')
				// console.log($('dl.category:eq(0)').html());
				return isSame;
			}

			// 画面上のデータとFRKを比較し、内容が同じ場合にtrueを返す
			var compareFRKData = function(dataArr) {
				var isSame = true;
				if (0 < $('li.empty-item').length) {
					isSame = false;
				} else if (
					$('#outline-container > .residence-name').find('input[type="text"][name="residence-name"]').val() !== dataArr[6] ||
					$('#outline-container > .residence-name').find('input[type="text"][name="frk-num"]').val() !== dataArr[0]
				) {
					isSame = false;
				} else {
					// console.log(dataArr);
					$('ul.items:eq(0)').find('> li').not('.empty-item').each(function(i) {
					// $('ul.items > li').each(function(i) {
						var itemElement = $(this);
						// console.log(itemElement.html());
						// console.log(itemElement.find('input[type="hidden"][name="frk-index"]').html());
						var frkIndexArr = itemElement.find('input[type="hidden"][name="frk-index"]').val().split('_');
						// console.log(i);
						// console.log(frkIndexArr);
						var frkVal = '';
						if (0 < frkIndexArr.length) {
							for (var j=0,len=frkIndexArr.length; j<len; j++) {
								var index = parseInt(frkIndexArr[j]) - 1;
								frkVal += dataArr[index] ? dataArr[index] : '';
								// console.log('	dataArr[' + index + '] = ' + dataArr[index]);
							}
						}
						if (itemElement.find('td.item-val > textarea').val() !== frkVal) {
							isSame = false;
						}
					});
				}
				return isSame;
			}

			// マスタデータとFRKデータから更新後のデータを作成する
			var getRenewalData = function(mtrOutlines, dataArr) {
				console.log(dataArr);
				var obj = {
					'residence_name'	: dataArr[6],
					'frk_num'			: dataArr[0],
					'outlines'			: []
				};
				var arr = [];
				var categoryCount = 0;
				var itemCount = 0;
				for (var i=0,len=mtrOutlines.length; i<len; i++) {
					console.log('	' + i + ' :: parent_category_id = ' + mtrOutlines[i]['parent_category_id']);
					// カテゴリデータを取得
					if ((mtrOutlines[i]['parent_category_id']-0) === 0) {
						var tmpObj = {
							'id'					: '',
							'mtr_outline_id'		: 0,
							'key'					: mtrOutlines[i]['key'],
							'val'					: '',
							'is_required'			: 0,
							'frk_index'				: '',
							'order'					: ++categoryCount,
							'parent_category_id'	: '0'
						};
						arr.push(tmpObj);

					// アイテムデータを取得
					} else {
						var frkIndexArr = mtrOutlines[i]['frk_index'].split('_');
						var frkVal = '';
						if (0 < frkIndexArr.length) {
							for (var j=0,len2=frkIndexArr.length; j<len2; j++) {
								var index = parseInt(frkIndexArr[j]) - 1;
								frkVal += dataArr[index] ? dataArr[index] : '';
							}
						}
						// categoryElement.find('.items > li').each(function(j) {
							var itemElement = $(this);
							var tmpObj = {
								'id'					: '',
								'mtr_outline_id'		: mtrOutlines[i]['id'],
								'key'					: mtrOutlines[i]['key'],
								'val'					: frkVal,
								'is_required'			: (mtrOutlines[i]['is_required'] - 0),
								'frk_index'				: mtrOutlines[i]['frk_index'],
								'order'					: ++itemCount,
								'parent_category_id'	: ''
							};
							arr.push(tmpObj);
						// });
					}
				}
				obj['outlines'] = arr;
				return obj;
			}

			// デフォルトの物件概要のデータと比較
			// 物件概要のvalの値はチェックせず、項目の並び順やデフォルトの項目以外の項目があればfalseを返す
			var isSame = true;
			// var isDifferent = false;
			var renewalData = [];
			if (compareMasterData(mtrOutlineData) === true) {
			// if (compareMasterData(thisObj._instances['DataManager'].getProp()['mtrOutlines']) === true) {
				if (compareFRKData(frkDataArr) === false) {
					isSame = false;
					// isDifferent = true;
					// renewalData = getRenewalData(thisObj._instances['DataManager'].getProp()['mtrOutlines'], frkDataArr);
					renewalData = getRenewalData(mtrOutlineData, frkDataArr);
				}
			} else {
				isSame = false;
				// isDifferent = true;
				// renewalData = getRenewalData(thisObj._instances['DataManager'].getProp()['mtrOutlines'], frkDataArr);
				renewalData = getRenewalData(mtrOutlineData, frkDataArr);
			}
			// thisObj.setEvent(true);
			// $(thisObj).trigger('onCompleteShowFRK', [isDifferent, renewalData]);
			return {'isSame':isSame, 'renewalData':renewalData};
		}
		
		/*
		 * 面上のデータとXMLを比較するメソッド
		 * @param	xmlData		XMLデータ
		 * @return	{'isSame':面上のデータとXMLが同じならtrueを、異なるならfalse, 'renewalData':面上のデータとXMLが異なる場合、上書きするデータ配列}
		 */
		 /*
		,compare: function(xmlData) {
			var thisObj = this;

			// 画面上のデータとXMLを比較し、内容が同じ場合にtrueを返す
			var compareXMLData = function(baseXml) {
				var isSame = true;
				var categoriyNodes = baseXml.find('> residence > category');
				var categoriyElements = $('#outline-container > dl.category');
				if (categoriyNodes.length !== categoriyElements.length) {
					isSame = false;
				} else {
					categoriyNodes.each(function(i) {
						var categoryNode = $(this);
						var categoryElement = categoriyElements.eq(i).find('> dt > input[name="category-name"]');
						if (categoryNode.attr('name') !== categoryElement.val()) {
							isSame = false;
							return;
						} else if (categoryNode.find('> item').length !== categoriyElements.eq(i).find('> dd > ul.items > li').length) {
							isSame = false;
							return;
						} else {
							categoryNode.find('> item').each(function(j) {
								var itemNode = $(this);
								var itemElement = categoriyElements.eq(i).find('> dd > ul.items > li').eq(j);
								if (
									itemNode.attr('frk_column_num') !== itemElement.find('input[type="hidden"][name="frk-index"]').val()
									||
									itemNode.attr('is_required') !== ((itemElement.find('input[type="hidden"][name="is-required"]').val() - 0) === 1 ? 'true' : 'false')
									||
									itemNode.find('> key').val() !== itemElement.find('input[type="hidden"][name="item-key"]').val()
									||
									itemNode.find('> val').val() !== itemElement.find('input[type="hidden"][name="item-val"]').val()
								) {
									isSame = false;
									return;
								}
							});
							if (isSame === false) {
								return;
							}
						}
					});
				}
				return isSame;
			}

			// XMLから更新後のデータを作成する
			var getRenewalData = function(baseXml) {
				var arr = [];
				return arr;
			}

			// デフォルトの物件概要のデータと比較
			// 物件概要のvalの値はチェックせず、項目の並び順やデフォルトの項目以外の項目があればfalseを返す
			var isSame = true;
			var renewalData = [];
			if (compareXMLData(xmlData) === false) {
				isSame = false;
				renewalData = getRenewalData(xmlData);
			}
			return {'isSame':isSame, 'renewalData':renewalData};
		}
		*/
	}
});
