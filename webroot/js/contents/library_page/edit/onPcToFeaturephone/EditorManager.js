

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * エディタ管理クラス
	 */
	MYNAMESPACE.namespace('modules.library_page.edit.onPcToFeaturephone.EditorManager');
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager = function() {
		var date = new Date();
		this._instances = [];
		this._outlineArr = [];
		this._id = 'id_' + date.getTime();
		this._editor = null;
		this._prevCode = '';
		this._isEventEnabled = false;
		this._pageType = '';
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager.prototype = {

		/*
		 * コンストラクタ
		 * @param	outlineArr 			物件概要データ配列
		 * @param	gsTagLibrary		GSタグライブラリのインスタンス
		 * @param	id 					ID
		 * @param	pageType 			editPage === このクラスのインスタンスが作られたのはガラケー用ページ編集画面、previewPage === このクラスのインスタンスが作られたのはガラケー用ページプレビュー画面、concretePage === このクラスのインスタンスが作られたのはガラケー用静的ページ出力画面
		 * @return	void
		 */
		initialize: function(outlineArr, gsTagLibrary, id, pageType) {
			var thisObj = this;
			this._outlineArr = outlineArr;
			this._id = id;
			this._pageType = pageType;
			this._instances = {};
			this._instances['GsTagLibrary_' + this._id] = gsTagLibrary;
			// this._instances['GsTagLibrary_' + thisObj._id] = new MYNAMESPACE.modules.helper.GsTagLibrary(thisObj._id);
			_.bindAll(
				this
				,'doEnabled'
				,'getEditor'
				,'defineCustomButton'
				,'onClickGsInsert'
				,'onClickInsertAbout'
				,'createHtmlSource'
				,'refreshCode'
				,'setEvent'
			);
			// this.defineCustomButton();
			// this.doEnabled();
		}

		/*
		 * エディタを有効にするメソッド
		 * @param	void
		 * @return	void
		 */
		,doEnabled: function() {
			var thisObj = this;
			thisObj._editor = $("#input").cleditor(
				{
					width:'480',
					height:'100%'
				}
			)[0].focus();

			if ($('#input').val() !== '') {
				console.log('テキスト有り');
				var code = $('#input').val();
				thisObj._instances[('GsTagLibrary_' + thisObj._id)].execute(code);
				// thisObj.refreshCode();
				// thisObj._editor.updateFrame();
			}
		}

		/*
		 * エディタオブジェクトを返すメソッド
		 * @param	void
		 * @return	void
		 */
		,getEditor: function() {
			var thisObj = this;
			return thisObj._editor;
		}

		/*
		 * カスタムボタンを定義するメソッド
		 * @param	void
		 * @return	void
		 */
		,defineCustomButton: function() {
			var thisObj = this;
			// Define the hello button
			$.cleditor.buttons.hello = {
				name: "hello",
				image: "yt_logo.png",
				title: "物件概要",
				command: "inserthtml",
				popupName: "hello",
				popupClass: "cleditorPrompt",
				popupContent: '\
					<table class="outlineInfoPopup">\
						<tr class="category">\
							<td colspan="3" class="category-header">見出し</td>\
						</tr>\
						<tr>\
							<td class="key">文字サイズ</td>\
							<td class="key">文字色</td>\
							<td class="key">背景色</td>\
						</tr>\
						<tr>\
							<td class="val">\
								<select name="category-font-size">\
									<option value="1">1</option>\
									<option value="2">2</option>\
									<option value="3" selected>3</option>\
									<option value="4">4</option>\
									<option value="5">5</option>\
									<option value="6">6</option>\
									<option value="7">7</option>\
								</select>\
							</td>\
							<td class="val"><input type="text" name="category-font-color" value="#000000" size="10"></td>\
							<td class="val"><input type="text" name="category-bg-color" value="#ffffff" size="10"></td>\
						</tr>\
					</table>\
					<table class="outlineInfoPopup">\
						<tr class="category">\
							<td colspan="3" class="category-header">項目名</td>\
						</tr>\
						<tr>\
							<td class="key">文字サイズ</td>\
							<td class="key">文字色</td>\
							<td class="key">背景色</td>\
							<!--\
							<td class="key">幅</td>\
							-->\
						</tr>\
						<tr>\
							<td class="val">\
								<select name="key-font-size">\
									<option value="1">1</option>\
									<option value="2" selected>2</option>\
									<option value="3">3</option>\
									<option value="4">4</option>\
									<option value="5">5</option>\
									<option value="6">6</option>\
									<option value="7">7</option>\
								</select>\
							</td>\
							<td class="val"><input type="text" name="key-font-color" value="#000000" size="10"></td>\
							<td class="val"><input type="text" name="key-bg-color" value="#e9e9e9" size="10"></td>\
							<!--\
							<td class="val"><input type="text" name="key-width" value="30" size="10">%</td>\
							-->\
						</tr>\
					</table>\
					<table class="outlineInfoPopup">\
						<tr class="category">\
							<td colspan="3" class="category-header">項目値</td>\
						</tr>\
						<tr>\
							<td class="key">文字サイズ</td>\
							<td class="key">文字色</td>\
							<td class="key">背景色</td>\
							<!--\
							<td class="key">幅</td>\
							-->\
						</tr>\
						<tr>\
							<td class="val">\
								<select name="val-font-size">\
									<option value="1">1</option>\
									<option value="2" selected>2</option>\
									<option value="3">3</option>\
									<option value="4">4</option>\
									<option value="5">5</option>\
									<option value="6">6</option>\
									<option value="7">7</option>\
								</select>\
							</td>\
							<td class="val"><input type="text" name="val-font-color" value="#000000" size="10"></td>\
							<td class="val"><input type="text" name="val-bg-color" value="#ffffff" size="10"></td>\
							<!--\
							<td class="val"><input type="text" name="val-width" value="70" size="10">%</td>\
							-->\
						</tr>\
					</table>\
					<table class="outlineInfoPopup">\
						<tr class="category">\
							<td colspan="3" class="category-header">Table</td>\
						</tr>\
						<tr>\
							<td class="key">Cell Spacing</td>\
							<td class="key">Cell Padding</td>\
							<td class="key">Border</td>\
						</tr>\
						<tr>\
							<td class="val"><input type="text" name="cell-spacing" value="0" size="10"></td>\
							<td class="val"><input type="text" name="cell-padding" value="2" size="10"></td>\
							<td class="val"><input type="text" name="border" value="1" size="10"></td>\
						</tr>\
					</table>\
					<input id="btn-submit-outline" class="btn btn-primary" type="button" value="挿入">',
				buttonClick: thisObj.onClickInsertAbout
			};
			// var gsUrl = 'https://docs.google.com/spreadsheet/ccc?key=0AtvxJEe7IC7ndFNfbjhXZnIwQnVNOGFraFVGOEtUaHc&usp=drive_web#gid=4';
			var gsUrl = '';
			$.cleditor.buttons.gsInsert = {
				name: "gsInsert",
				image: "spreadsheets-icon.png",
				title: "GS挿入",
				command: "inserthtml",
				popupName: "gsInsert",
				popupClass: "cleditorPrompt",
				popupContent: '\
					<div class="gs-insert-popup">\
						<div class="group gs-url">\
							<p>Google SpreadsheetのURL</p>\
							<input type="text" name="url" value="' + gsUrl + '" placeholder="GSのURLを入力してください">\
						</div>\
						<div class="group gs-page-type">\
							<p>ページタイプ</p>\
							<div class="btn-group" data-toggle="buttons-radio" data-item-name="type">\
								<button type="button" class="btn btn-primary isAbout active" data-item-name="about" data-placement="bottom" data-original-title="物件詳細ページ用エレメントを挿入します。"><span>物件概要</span></button>\
								<button type="button" class="btn btn-primary isMap" data-item-name="map" data-placement="bottom" data-original-title="現地案内図ページ用エレメントを挿入します。"><span>現地案内図</span></button>\
							</div>\
						</div>\
						<input id="btn-submit-gs-insert" class="btn btn-primary" type="button" value="挿入">\
					</div>\
					',
				buttonClick: thisObj.onClickGsInsert
			};

			// Add the button to the default controls before the bold button
			$.cleditor.defaultOptions.controls = $.cleditor.defaultOptions.controls.replace("bold", "gsInsert hello bold");
		}

		/*
		 * GS挿入ボタンがクリックされた際にコールされるメソッド
		 * @param	event 			Eventオブジェクト
		 * @param	data 			CLEditorオブジェクト
		 * @return	void
		 */
		,onClickGsInsert: function(event, data) {
			var thisObj = this;
			$(data.popup).find("#btn-submit-gs-insert")
				.unbind("click")
				.bind("click", function(event2) {
					var popupElem = $(data.popup);
					var url = popupElem.find('input[name="url"]').val();
					var pageType = popupElem.find('.gs-page-type button.active').attr('data-item-name');
					var gsTag = '';
					switch (pageType) {
						case 'information':
							gsTag = '<!--insert_gs_to_information(' + url + ')-->';
							break;
						case 'about':
							gsTag = '<!--insert_gs_to_about(' + url + ')-->';
							break;
						case 'plan':
							gsTag = '<!--insert_gs_to_plan(' + url + ')-->';
							break;
						case 'modelroom':
							gsTag = '<!--insert_gs_to_modelroom(' + url + ')-->';
							break;
						case 'appearance':
							gsTag = '<!--insert_gs_to_appearance(' + url + ')-->';
							break;
						case 'map':
							gsTag = '<!--insert_gs_to_map(' + url + ')-->';
							break;
					}
					var editor = data.editor;
					editor.execCommand(data.command, gsTag, null, data.button);
					editor.hidePopups();
					editor.focus();
					thisObj._editor.updateTextArea();
					// var code = $('#input').val();
					// console.log('code = ' + code);
					// thisObj.refreshCode(true);
					// console.log('あいうえお');
					// console.log('editor');
					// console.log(editor);
					// console.log('url = ' + url);
					// console.log('pageType = ' + pageType);
					// console.log('gsTag = ' + gsTag);
					// console.log($('#input').val());
				});
		}

		/*
		 * 物件概要挿入ボタンがクリックされた際にコールされるメソッド
		 * @param	event 			Eventオブジェクト
		 * @param	data 			CLEditorオブジェクト
		 * @return	void
		 */
		,onClickInsertAbout: function(event, data) {
			var thisObj = this;
			$(data.popup).children(":button")
				.unbind("click")
				.bind("click", function(event2) {
					var popupElem = $(data.popup);
					var border = popupElem.find('input[type="text"][name="border"]').val();
					var cellSpacing = popupElem.find('input[type="text"][name="cell-spacing"]').val();
					var cellPadding = popupElem.find('input[type="text"][name="cell-padding"]').val();
					var categoryFontSize = popupElem.find('select[name="category-font-size"]').val();
					var categoryFontColor = popupElem.find('input[type="text"][name="category-font-color"]').val();
					var categoryBgColor = popupElem.find('input[type="text"][name="category-bg-color"]').val();
					var keyFontSize = popupElem.find('select[name="key-font-size"]').val();
					var keyFontColor = popupElem.find('input[type="text"][name="key-font-color"]').val();
					var keyBgColor = popupElem.find('input[type="text"][name="key-bg-color"]').val();
					var valFontSize = popupElem.find('select[name="val-font-size"]').val();
					var valFontColor = popupElem.find('input[type="text"][name="val-font-color"]').val();
					var valBgColor = popupElem.find('input[type="text"][name="val-bg-color"]').val();
					var sourceArr = [];
					var outlineArr = thisObj._outlineArr;
					for(var i=0,len=outlineArr.length; i<len; i++) {
						if (outlineArr[i]['items'] && 0 < outlineArr[i]['items'].length) {
							var tmpSourceArr = [];
							tmpSourceArr.push('<!-- OutlineTableBigin,');
							tmpSourceArr.push('categoryFontSize=' + categoryFontSize + ',');
							tmpSourceArr.push('categoryFontColor=' + categoryFontColor + ',');
							tmpSourceArr.push('categoryBgColor=' + categoryBgColor + ',');
							tmpSourceArr.push('keyFontSize=' + keyFontSize + ',');
							tmpSourceArr.push('keyFontColor=' + keyFontColor + ',');
							tmpSourceArr.push('keyBgColor=' + keyBgColor + ',');
							tmpSourceArr.push('valFontSize=' + valFontSize + ',');
							tmpSourceArr.push('valFontColor=' + valFontColor + ',');
							tmpSourceArr.push('valBgColor=' + valBgColor + ',');
							tmpSourceArr.push('cellSpacing=' + cellSpacing + ',');
							tmpSourceArr.push('cellPadding=' + cellPadding + ',');
							tmpSourceArr.push('border=' + border + ' -->');
							tmpSourceArr.push('<table width="100%" border="' + border + '" cellpadding="' + cellPadding + '" cellspacing="' + cellSpacing + '">');
							tmpSourceArr.push('<tr><td bgcolor="' + categoryBgColor + '"><font size="' + categoryFontSize + '" color="' + categoryFontColor + '">' + outlineArr[i]['category']['key'] + '</font></td></tr>');
							for (j=0,len2=outlineArr[i]['items'].length; j<len2; j++) {
								tmpSourceArr.push('<tr>');
								tmpSourceArr.push('<td bgcolor="' + keyBgColor + '"><font size="' + keyFontSize + '" color="' + keyFontColor + '">■' + outlineArr[i]['items'][j]['key'] + '</font></td>');
								tmpSourceArr.push('</tr>');
								tmpSourceArr.push('<tr>');
								tmpSourceArr.push('<td bgcolor="' + valBgColor + '"><font size="' + valFontSize + '" color="' + valFontColor + '">' + outlineArr[i]['items'][j]['val'] + '</font></td>');
								tmpSourceArr.push('</tr>');
							}
							tmpSourceArr.push('</table>');
							tmpSourceArr.push('<!-- OutlineTableEnd -->');
							sourceArr.push(tmpSourceArr.join("\n"));
						}
					}
					outlineSource = sourceArr.join("<br />\n");
					var editor = data.editor;
					editor.execCommand(data.command, outlineSource, null, data.button);
					editor.hidePopups();
					editor.focus();

				});
		}

		/*
		 * HTMLソース作成メソッド
		 * @param	data			データオブジェクト
		 * @param	pageType		GSデータのページタイプ
		 * @return	void
		 */
		,createHtmlSource: function(data, pageType) {
			var thisObj = this;
			var len = data && data.length ? data.length : 0;
			if (0 < len) {
				var sources = [];
				if (pageType === 'about') {
					var border = 1;
					var cellSpacing = 0;
					var cellPadding = 2;
					var categoryFontSize = 3;
					var categoryFontColor = '#000';
					var categoryBgColor = '#fff';
					var keyFontSize = 2;
					var keyFontColor = '#000';
					var keyBgColor = '#e9e9e9';
					var valFontSize = 2;
					var valFontColor = '#000';
					var valBgColor = '#fff';
					for (var i=0; i<len; i++) {
						var tmpArr = [];
						sources.push('<div class="group">');
						if (data[i]['title']) {
							tmpArr.push('<tr><td bgcolor="' + categoryBgColor + '"><font size="' + categoryFontSize + '" color="' + categoryFontColor + '">' + data[i]['title'] + '</font></td></tr>');
						}
						if (data[i]['keyVal'] && data[i]['keyVal'].length) {
							var len2 = data[i]['keyVal'].length;
							for (var j=0; j<len2; j++) {
								tmpArr.push('<tr><td bgcolor="' + keyBgColor + '"><font size="' + keyFontSize + '" color="' + keyFontColor + '">' + data[i]['keyVal'][j]['key'] + '</font></td></tr>');
								tmpArr.push('<td bgcolor="' + valBgColor + '"><font size="' + valFontSize + '" color="' + valFontColor + '">' + data[i]['keyVal'][j]['val'] + '</font></td></tr>');
							}
							sources.push('<table  width="100%" border="' + border + '" cellpadding="' + cellPadding + '" cellspacing="' + cellSpacing + '"><tbody>' + tmpArr.join('') + '</tbody></table><br>');
						}
						if (data[i]['note'] && data[i]['note'].length) {
							sources.push('<div class="note">' + data[i]['note'].join('<br>') + '</div>');
						}
						sources.push('</div>');
					}

				} else if (pageType === 'map') {
					for (var i=0; i<len; i++) {
						// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapを埋め込む
						if (data[i]['lat']) {
							sources.push('<div>');
							sources.push('<h3 style="text-align:center;">' + data[i]['title'] + '</h3>');
							sources.push('<div><img src="http://maps.google.com/maps/api/staticmap?center=' + data[i]['lat'] + ',' + data[i]['lng'] + '&zoom=' + data[i]['zoom'] + '&format=gif&markers=' + data[i]['lat'] + ',' + data[i]['lng'] + '&size=232x240&sensor=false" width="100%"></div>');
							sources.push('<div style="text-align:center;"><font face="Arial, Verdana" size="2">' + data[i]['address'] + '</font></div>');
							sources.push('</div>');
							sources.push('<br>');
						}




						// var tmpArr = [];
						// sources.push('<div class="group">');
						// if (data[i]['title']) {
						// 	tmpArr.push('<tr><td bgcolor="' + categoryBgColor + '"><font size="' + categoryFontSize + '" color="' + categoryFontColor + '">' + data[i]['title'] + '</font></td></tr>');
						// 	// sources.push('<h3>' + data[i]['title'] + '</h3>');
						// }
						// if (data[i]['keyVal'] && data[i]['keyVal'].length) {
						// 	var len2 = data[i]['keyVal'].length;
						// 	// var tmpArr = [];
						// 	for (var j=0; j<len2; j++) {
						// 		tmpArr.push('<tr><td bgcolor="' + keyBgColor + '"><font size="' + keyFontSize + '" color="' + keyFontColor + '">' + data[i]['keyVal'][j]['key'] + '</font></td></tr>');
						// 		tmpArr.push('<td bgcolor="' + valBgColor + '"><font size="' + valFontSize + '" color="' + valFontColor + '">' + data[i]['keyVal'][j]['val'] + '</font></td></tr>');
						// 		// tmpArr.push('<tr><td class="key">' + data[i]['keyVal'][j]['key'] + '</td><td class="val">' + data[i]['keyVal'][j]['val'] + '</td></tr>');
						// 	}
						// 	sources.push('<table  width="100%" border="' + border + '" cellpadding="' + cellPadding + '" cellspacing="' + cellSpacing + '"><tbody>' + tmpArr.join('') + '</tbody></table><br>');
						// 	// sources.push('<table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table>');
						// }
						// if (data[i]['note'] && data[i]['note'].length) {
						// 	sources.push('<div class="note">' + data[i]['note'].join('<br>') + '</div>');
						// }
						// sources.push('</div>');
					}
				}
				return sources.join('');
			} else {
				return '';
			}
		}

		/*
		 * 編集中のHTMLのコードを更新するメソッド
		 * @param	void
		 * @return	void
		 */
		,refreshCode: function() {
			var thisObj = this;
			var code = '';
			var insertedCode = '';
			// var isWysiwygMode = thisObj._isEditPage === false ? false : !thisObj._editor.sourceMode();
			var isWysiwygMode = thisObj._pageType === 'editPage' ? !thisObj._editor.sourceMode() : false;
			// console.log('');
			// console.log('');
			// console.log('isWysiwygMode = ' + isWysiwygMode);
			// WYSIWYGモードなら、GSタグを展開する
			if (isWysiwygMode === true || thisObj._pageType !== 'editPage') {
				// console.log('GS展開済み');
				var gsData = window.GsManager['getGsData']();
				// console.log('WYSIWYGモードなら、GSタグを展開する');
				// console.log(gsData);
				for (var spreadsheet_id in gsData) {
					// console.log('spreadsheet_id = ' + spreadsheet_id);
					var key = 'https://docs.google.com/spreadsheet/ccc?key=' + gsData[spreadsheet_id]['master']['key'] + '&usp=drive_web#gid=' + gsData[spreadsheet_id]['master']['gid'];
					var tmpGsData = {}
					tmpGsData[key] = {
						'source'	: thisObj.createHtmlSource(gsData[spreadsheet_id]['data'], gsData[spreadsheet_id]['pageType'])
					};
					// console.log('key = ' + key);
					// console.log('tmpGsData');
					// console.log(tmpGsData);
					if (tmpGsData[key]['source'] !== '') {
						// このクラスのインスタンスが作られたのはガラケー用ページ編集画面の場合、WYSIWYGエディタを更新する
						if (thisObj._pageType === 'editPage') {
							code = $('#input').val();
							// console.log('code = ' + code);
							// console.log('');;
							insertedCode = thisObj._instances[('GsTagLibrary_' + thisObj._id)].convertGsToHtml(code, tmpGsData, gsData[spreadsheet_id]['pageType']);
							// console.log('insertedCode = ' + insertedCode);
							// console.log('');
							thisObj._prevCode = insertedCode;
							$('#input').val(insertedCode);
							thisObj._editor.updateFrame();
						// このクラスのインスタンスが作られたのはガラケー用ページプレビュー画面の場合、bodyのコードを更新する
						} else if (thisObj._pageType === 'previewPage') {
							code = $('body').html();
							insertedCode = thisObj._instances[('GsTagLibrary_' + thisObj._id)].convertGsToHtml(code, tmpGsData, gsData[spreadsheet_id]['pageType']);
							$('body').html(insertedCode);
						// このクラスのインスタンスが作られたのはガラケー用本番ページ書き出し画面の場合、コードを返す
						} else if (thisObj._pageType === 'concretePage') {
							code = $('#tmp').html();
							insertedCode = thisObj._instances[('GsTagLibrary_' + thisObj._id)].convertGsToHtml(code, tmpGsData, gsData[spreadsheet_id]['pageType']);
							$(thisObj).trigger('onCompleteRefreshCode', insertedCode);
							// $('body').html(insertedCode);
						}
					}
				}
				// console.log('---------------------');
				// console.log('');
			// コード編集モードなら、GSタグを収束する
			} else {
				// console.log('code = ' + code);
				code = $('#input').val();
				insertedCode = thisObj._instances[('GsTagLibrary_' + thisObj._id)].convertHtmlToGs(code);
				$('#input').val(insertedCode);
				thisObj._editor.updateFrame();
				// console.log('コード編集モードなら、GSタグを収束する');
				// console.log('insertedCode = ' + insertedCode);
				// console.log('');
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEventEnabled === false) {
				$(thisObj._instances[('GsTagLibrary_' + thisObj._id)]).on('onCompleteExpandGsTag_'+thisObj._id, thisObj.refreshCode);
				if (thisObj._isEditPage === true) {
					$('.cleditorToolbar > div > div').on('click', function(event) {
						var targetElement = $(event.currentTarget);
						if (targetElement.attr('title') === 'Show Source' || targetElement.attr('title') === 'Show Rich Text') {
							thisObj.refreshCode();
						}
					});
					$(thisObj._editor).on('change', function(event) {
						var code = $('#input').val();
						// console.log('changeイベントを受信');
						// console.log('thisObj._id = ' + thisObj._id);
						// console.log('thisObj._prevCode = ' + thisObj._prevCode);
						// console.log('code = ' + code);
						if (thisObj._prevCode !== code) {
							thisObj._instances[('GsTagLibrary_' + thisObj._id)].execute(code);
						}
					});
				}

			} else if (isEnabled === false && thisObj._isEventEnabled === true) {
				$(instances[('GsTagLibrary_' + thisObj._id)]).off('onCompleteExpandGsTag_'+thisObj._id);
				if (thisObj._isEditPage === true) {
					$('.cleditorToolbar > div > div').on('click');
					$(thisObj._editor).off('change');
				}
			}
		}
	}
});
