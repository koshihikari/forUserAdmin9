

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * カスタムXML管理クラス
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
	MYNAMESPACE.namespace('modules.helper.CustomXMLManager');
	MYNAMESPACE.modules.helper.CustomXMLManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.CustomXMLManager.prototype = {
		_isEnabled						: false
		,_isAccess						: false
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'parse'
				,'checkFormat'
				,'compare'
			);
		}
		
		/*
		 * カスタムXMLをパースするメソッド
		 * @param	xmlFile				カスタムXMLファイルのFileオブジェクト
		 * @param	residenceNum		物件番号
		 * @return	void
		 */
		,parse: function(xmlFile, residenceNum) {
			var thisObj = this;
			console.log(xmlFile);
			$(thisObj).trigger('onStartParse');
			var reader = new FileReader();
			reader.onload = function (event) {
				var strData = event.target.result;
				// console.log('strData');
				// console.log(strData);
				// console.log(typeof strData);
				// console.log($(strData).find('item:eq(0) key').text());
				$(thisObj).trigger('onCompleteParse', [$(strData)]);
				/*
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
				*/
			}
			reader.readAsText(xmlFile, "utf-8");
		}
		
		/*
		 * XMLのフォーマットが正しいかチェックするメソッド
		 * @param	xmlObj			XMLオブジェクト
		 * @return	XMLのフォーマットが正しくない場合に表示されるメッセージ保持配列
		 */
		,checkFormat: function(xmlObj) {
			var thisObj = this;
			/*
			var rootNode = xmlObj.find('data:eq(0)');
			var errorMessages = [];

			// residenceノードチェック
			var residenceNode = rootNode.find('> residence');
			if (residenceNode.length < 1) {
				errorMessages.push('<data>ノード直下に<residence>ノードが存在しません。');
			}
			residenceNode.each(function(i) {

			})
			if (rootNode.find('> residence[name][frk_num]').length < 1) {
				errorMessages.push('nameか、frk_numが指定されていない<residence>ノードが存在します。');
			}

			// contentノードチェック
			if (rootNode.find('> residence[name="*"][frk_num="*"] > content').length < 1) {
				errorMessages.push('<residence>ノード直下に<content>ノードが存在しません。');
			}
			if (rootNode.find('> residence[name="*"][frk_num="*"] > content[name="*"]').length < 1) {
				errorMessages.push('nameが指定されていない<content>ノードが存在します。');
			}
			// contnetノードの子ノードに必須項目のitemノードが全ての存在するかチェック
			*/
		}
		
		/*
		 * 面上のデータとXMLを比較するメソッド
		 * @param	xmlData		XMLデータ
		 * @return	{'isSame':面上のデータとXMLが同じならtrueを、異なるならfalse, 'renewalData':面上のデータとXMLが異なる場合、上書きするデータ配列}
		 */
		,compare: function(mtrOutlineData, xmlData) {
			var thisObj = this;

			// 画面上のデータとXMLを比較し、内容が同じ場合にtrueを返す
			var compareXMLData = function(baseXml) {
				var isSame = true;
				var categoriyNodes = baseXml.find('> residence > category');
				var categoriyElements = $('#outline-container > dl.category');
				if (categoriyNodes.length !== categoriyElements.length) {
					isSame = false;
				} else if (
					$('#outline-container > .residence-name').find('input[type="text"][name="residence-name"]').val() !== baseXml.find('> residence:eq(0)').attr('name') ||
					$('#outline-container > .residence-name').find('input[type="text"][name="frk-num"]').val() !== baseXml.find('> residence:eq(0)').attr('frk_num')
				) {
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
			var getRenewalData = function(mtrOutlines, baseXml) {
				// 物件概要マスタのデータから、FRKのインデックスをキーにしたオブジェクトを作成
				var outlinesObj = {};
				for (var i=0,len=mtrOutlines.length; i<len; i++) {
					if (mtrOutlines[i]['frk_index'] !== '') {
						var key = 'id-' + mtrOutlines[i]['frk_index'];
						// outlinesObj[key] = mtrOutlines[i]['id'];
						outlinesObj[key] = mtrOutlines[i];
					}
				}
				var residenceNode = baseXml.find('> residence:eq(0)');
				var obj = {
					'residence_name'	: residenceNode.attr('name'),
					'frk_num'			: residenceNode.attr('frk_num'),
					'outlines'			: []
				};
				var arr = [];
				// console.log(baseXml.find('> residence').length);
				residenceNode.find('> category').each(function(i) {
					var categoryNode = $(this);
					// カテゴリデータを取得
					var obj = {
						'id'					: '',
						'mtr_outline_id'		: 0,
						'key'					: categoryNode.attr('name'),
						'val'					: '',
						'is_required'			: 0,
						'frk_index'				: '',
						'order'					: (i + 1),
						'parent_category_id'	: '0'
					};
					arr.push(obj);

					// アイテムデータを取得
					categoryNode.find('> item').each(function(j) {
						var itemNode = $(this);
						var obj = {
							'id'					: '',
							'mtr_outline_id'		: outlinesObj['id-' + itemNode.attr('frk_column_num')] ? outlinesObj['id-' + itemNode.attr('frk_column_num')]['id'] : 0,
							'key'					: itemNode.find('> key').text(),
							'val'					: itemNode.find('> val').text(),
							'is_required'			: itemNode.attr('is_required') === 'true' ? 1 : 0,
							'frk_index'				: itemNode.attr('frk_column_num'),
							'order'					: (j + 1),
							'parent_category_id'	: ''
						};
						arr.push(obj);
					});
				});
				obj['outlines'] = arr;
				return obj;
			}

			// デフォルトの物件概要のデータと比較
			// 物件概要のvalの値はチェックせず、項目の並び順やデフォルトの項目以外の項目があればfalseを返す
			var isSame = true;
			var renewalData = [];
			if (compareXMLData(xmlData) === false) {
				isSame = false;
				console.log(mtrOutlineData);
				renewalData = getRenewalData(mtrOutlineData, xmlData);
			}
			return {'isSame':isSame, 'renewalData':renewalData};
		}
	}
});













