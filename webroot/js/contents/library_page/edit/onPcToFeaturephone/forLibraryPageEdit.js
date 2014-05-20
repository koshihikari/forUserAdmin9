

var outlineArr = [];
jQuery.noConflict();
jQuery(document).ready(function($){
	console.log('a');

	/*
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
		buttonClick: helloClick
	};
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
					<input type="text" name="url" value="" placeholder="GSのURLを入力してください">\
				</div>\
				<div class="group gs-page-type">\
					<p>ページタイプ</p>\
					<div class="btn-group" data-toggle="buttons-radio" data-item-name="type">\
						<button type="button" class="btn btn-primary isInformation active" data-item-name="information" data-placement="bottom" data-original-title="インフォメーションページ用エレメントを挿入します。"><span>インフォメーション</span></button>\
						<button type="button" class="btn btn-primary isAbout" data-item-name="about" data-placement="bottom" data-original-title="物件詳細ページ用エレメントを挿入します。"><span>物件概要</span></button>\
						<button type="button" class="btn btn-primary isMPlan" data-item-name="plan" data-placement="bottom" data-original-title="間取りページ用エレメントを挿入します。"><span>間取り</span></button>\
						<button type="button" class="btn btn-primary isModelroom" data-item-name="modelroom" data-placement="bottom" data-original-title="モデルルームページ用エレメントを挿入します。"><span>モデルルーム</span></button>\
						<button type="button" class="btn btn-primary isAppearance" data-item-name="appearance" data-placement="bottom" data-original-title="外観ページ用エレメントを挿入します。"><span>外観</span></button>\
						<button type="button" class="btn btn-primary isMap" data-item-name="map" data-placement="bottom" data-original-title="現地案内図ページ用エレメントを挿入します。"><span>現地案内図</span></button>\
					</div>\
				</div>\
				<input id="btn-submit-gs-insert" class="btn btn-primary" type="button" value="挿入">\
			</div>\
			',
		buttonClick: gsInsertClick
	};

	// Add the button to the default controls before the bold button
	$.cleditor.defaultOptions.controls = $.cleditor.defaultOptions.controls
		.replace("bold", "gsInsert hello bold");

	// GS挿入ボタンがクリックされた時にコールされるメソッド
	function gsInsertClick(e, data) {
		// Wire up the submit button click event
		$(data.popup).find("#btn-submit-gs-insert")
			.unbind("click")
			.bind("click", function(e) {
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
				console.log('あいうえお');
				console.log('url = ' + url);
				console.log('pageType = ' + pageType);
				console.log('gsTag = ' + gsTag);
				// GSタグを挿入したらイベントをtriggerする。windowは使いたくないが、CLEditorのオブジェクトのとり方がわからないのでwindowで代用
				$(window).trigger('inssertGs');
			});
	}

	// Handle the hello button click event
	function helloClick(e, data) {

		// Wire up the submit button click event
		$(data.popup).children(":button")
			.unbind("click")
			.bind("click", function(e) {

				var popupElem = $(data.popup);
				var border = popupElem.find('input[type="text"][name="border"]').val();
				var cellSpacing = popupElem.find('input[type="text"][name="cell-spacing"]').val();
				var cellPadding = popupElem.find('input[type="text"][name="cell-padding"]').val();

				var categoryFontSize = popupElem.find('select[name="category-font-size"]').val();
				// var categoryFontSize = popupElem.find('input[type="text"][name="category-font-size"]').val();
				// var categoryFontSize = 'large';
				var categoryFontColor = popupElem.find('input[type="text"][name="category-font-color"]').val();
				var categoryBgColor = popupElem.find('input[type="text"][name="category-bg-color"]').val();

				var keyFontSize = popupElem.find('select[name="key-font-size"]').val();
				// var keyFontSize = popupElem.find('input[type="text"][name="val-font-size"]').val();
				// var keyFontSize = 'medium';
				var keyFontColor = popupElem.find('input[type="text"][name="key-font-color"]').val();
				var keyBgColor = popupElem.find('input[type="text"][name="key-bg-color"]').val();
				// var keyWidth = popupElem.find('input[type="text"][name="key-width"]').val();

				var valFontSize = popupElem.find('select[name="val-font-size"]').val();
				// var valFontSize = popupElem.find('input[type="text"][name="val-font-size"]').val();
				// var valFontSize = 'medium';
				var valFontColor = popupElem.find('input[type="text"][name="val-font-color"]').val();
				var valBgColor = popupElem.find('input[type="text"][name="val-bg-color"]').val();
				// var valWidth = popupElem.find('input[type="text"][name="val-width"]').val();

				var sourceArr = [];

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
				console.log(outlineSource);

				// Get the editor
				var editor = data.editor;

				// Get the entered name
				// var name = $(data.popup).find(":text").val();

				// Insert some html into the document
				// var html = "Hello " + name;
				// var html = "Hello " + name + ' :: ' + outlineSource;
				// editor.execCommand(data.command, html, null, data.button);
				editor.execCommand(data.command, outlineSource, null, data.button);

				// Hide the popup and set focus back to the editor
				editor.hidePopups();
				editor.focus();

			});

	}
	var editor = $("#input").cleditor(
		{
			width:'480',
			height:'100%'
		}
	)[0].focus();
	*/
	var DataManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.DataManager();
	outlineArr = DataManager.getProp()['outlines'];
	console.log(outlineArr);
	var EdirotManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EdirotManager(outlineArr);
	var editor = EdirotManager.getEditor();
	var Util							= new MYNAMESPACE.modules.helper.Util();
	var LayoutManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.LayoutManager(editor);
	var PageManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.PageManager(DataManager, editor);
	LayoutManager.setOnceEvent();
	LayoutManager.setEvent(true);
	PageManager.setEvent(true);
	EdirotManager.setEvent(true);

	/*
	var date = new Date();
	var id = 'id_' + date.getTime();
	var instances = {};
	instances[('GsTagLibrary_' + id)] = new MYNAMESPACE.modules.helper.GsTagLibrary(id);
	var prevCode = $('#input').val();
	convertData = function(data) {
		var len = data && data.length ? data.length : 0;
		if (0 < len) {
			var sources = [];
			sources.push('<dl>');
			for (var i=0; i<len; i++) {
				// タイトルのデータが存在するなら、タイトル用ソースを作成
				len2 = data[i]['titles'] && data[i]['titles'].length ? data[i]['titles'].length : 0;
				if (0 < len2) {
					for (var j=0; j<len2; j++) {
						sources.push('<dt>' + data[i]['titles'][j] + '</dt>');
					}
				}

				// 本文のデータが存在するなら、本文用ソースを作成
				len2 = data[i]['messages'] && data[i]['messages'].length ? data[i]['messages'].length : 0;
				if (0 < len2) {
					for (var j=0; j<len2; j++) {
						sources.push('<dd>' + data[i]['messages'][j] + '</dd>');
					}
				}
			}
			sources.push('</dl>');
			return sources.join('');
		} else {
			return '';
		}
	}
	$(instances[('GsTagLibrary_' + id)]).on('onCompleteExpandGsTag_'+id, function(event) {
		// console.log('GS展開済み');
		var gsData = window.GsManager['getGsData']();
		console.log(gsData);
		var code = $('#input').val();
		for (var spreadsheetId in gsData) {
			// console.log('spreadsheetId = ' + spreadsheetId);
			var key = 'https://docs.google.com/spreadsheet/ccc?key=' + gsData[spreadsheetId]['master']['key'] + '&usp=drive_web#gid=' + gsData[spreadsheetId]['master']['gid'];
			var tmpGsData = {}
			tmpGsData[key] = {
				'source'	: convertData(gsData[spreadsheetId]['data'], gsData[spreadsheetId]['pageType'])
				// 'source'	: convertData(gsData[spreadsheetId]['data'], gsData[spreadsheetId]['master']['gid'])
				// 'master'	: data
			};
			var insertedCode = instances[('GsTagLibrary_' + id)].insertGSDataToHTML(code, tmpGsData, gsData[spreadsheetId]['pageType']);
			// console.log('tmpGsData');
			// console.log(tmpGsData);
			// console.log('insertedCode = ' + insertedCode);
			// console.log('');
			$('#input').val(insertedCode);
			editor.updateFrame();
			prevCode = insertedCode;
		}
	});
	$(editor).on('change', function(event) {
		// console.log('change');
		var code = $('#input').val();
		if (prevCode !== code) {
			instances[('GsTagLibrary_' + id)].execute(code);
		}
	})
*/
	/*
	$(window).on('inssertGs', function(event) {
		// editor.updateTextArea();
		editor.updateFrame();
		console.log('insserFrametGs');
		console.log($('#input').val());
		console.log($('#input').text());
		console.log($('#input').html());
		console.log(editor.$area.val());
		console.log($(editor.doc.body).html());
		// instances[('GsTagLibrary_' + id)].execute();
	// }).on('focused', function(event) {
	// 	console.log('focused');
	});
	*/


	// (function() {
	// 	var sourceArr = [];
	// 	for(var i=0,len=outlineArr.length; i<len; i++) {
	// 		if (outlineArr[i]['items'] && 0 < outlineArr[i]['items'].length) {
	// 			sourceArr.push('<table>');
	// 			sourceArr.push('<tr><td colspan="2">' + outlineArr[i]['category']['key'] + '</td></tr>');
	// 			for (j=0,len2=outlineArr[i]['items'].length; j<len2; j++) {
	// 				sourceArr.push('<tr>');
	// 				sourceArr.push('<td>' + outlineArr[i]['items'][j]['key'] + '</td>');
	// 				sourceArr.push('<td>' + outlineArr[i]['items'][j]['val'] + '</td>');
	// 				sourceArr.push('</tr>');
	// 			}
	// 			sourceArr.push('</table>');
	// 		}
	// 	}
	// 	outlineSource = sourceArr.join("\n");
	// })();
});


/*
(function($) {
	console.log('b');

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
		buttonClick: helloClick
	};
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
					<input type="text" name="url" value="" placeholder="GSのURLを入力してください">\
				</div>\
				<div class="group gs-page-type">\
					<p>ページタイプ</p>\
					<div class="btn-group" data-toggle="buttons-radio" data-item-name="type">\
						<button type="button" class="btn btn-primary isInformation active" data-item-name="information" data-placement="bottom" data-original-title="インフォメーションページ用エレメントを挿入します。"><span>インフォメーション</span></button>\
						<button type="button" class="btn btn-primary isAbout" data-item-name="about" data-placement="bottom" data-original-title="物件詳細ページ用エレメントを挿入します。"><span>物件概要</span></button>\
						<button type="button" class="btn btn-primary isMPlan" data-item-name="plan" data-placement="bottom" data-original-title="間取りページ用エレメントを挿入します。"><span>間取り</span></button>\
						<button type="button" class="btn btn-primary isModelroom" data-item-name="modelroom" data-placement="bottom" data-original-title="モデルルームページ用エレメントを挿入します。"><span>モデルルーム</span></button>\
						<button type="button" class="btn btn-primary isAppearance" data-item-name="appearance" data-placement="bottom" data-original-title="外観ページ用エレメントを挿入します。"><span>外観</span></button>\
						<button type="button" class="btn btn-primary isMap" data-item-name="map" data-placement="bottom" data-original-title="現地案内図ページ用エレメントを挿入します。"><span>現地案内図</span></button>\
					</div>\
				</div>\
				<input id="btn-submit-gs-insert" class="btn btn-primary" type="button" value="挿入">\
			</div>\
			',
		buttonClick: gsInsertClick
	};

	// Add the button to the default controls before the bold button
	$.cleditor.defaultOptions.controls = $.cleditor.defaultOptions.controls
		.replace("bold", "gsInsert hello bold");

	// GS挿入ボタンがクリックされた時にコールされるメソッド
	function gsInsertClick(e, data) {
		// Wire up the submit button click event
		$(data.popup).find("#btn-submit-gs-insert")
			.unbind("click")
			.bind("click", function(e) {
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
				console.log('あいうえお');
				console.log('url = ' + url);
				console.log('pageType = ' + pageType);
				console.log('gsTag = ' + gsTag);
				// GSタグを挿入したらイベントをtriggerする。windowは使いたくないが、CLEditorのオブジェクトのとり方がわからないのでwindowで代用
				$(window).trigger('inssertGs');
			});
	}

	// Handle the hello button click event
	function helloClick(e, data) {

		// Wire up the submit button click event
		$(data.popup).children(":button")
			.unbind("click")
			.bind("click", function(e) {

				var popupElem = $(data.popup);
				var border = popupElem.find('input[type="text"][name="border"]').val();
				var cellSpacing = popupElem.find('input[type="text"][name="cell-spacing"]').val();
				var cellPadding = popupElem.find('input[type="text"][name="cell-padding"]').val();

				var categoryFontSize = popupElem.find('select[name="category-font-size"]').val();
				// var categoryFontSize = popupElem.find('input[type="text"][name="category-font-size"]').val();
				// var categoryFontSize = 'large';
				var categoryFontColor = popupElem.find('input[type="text"][name="category-font-color"]').val();
				var categoryBgColor = popupElem.find('input[type="text"][name="category-bg-color"]').val();

				var keyFontSize = popupElem.find('select[name="key-font-size"]').val();
				// var keyFontSize = popupElem.find('input[type="text"][name="val-font-size"]').val();
				// var keyFontSize = 'medium';
				var keyFontColor = popupElem.find('input[type="text"][name="key-font-color"]').val();
				var keyBgColor = popupElem.find('input[type="text"][name="key-bg-color"]').val();
				// var keyWidth = popupElem.find('input[type="text"][name="key-width"]').val();

				var valFontSize = popupElem.find('select[name="val-font-size"]').val();
				// var valFontSize = popupElem.find('input[type="text"][name="val-font-size"]').val();
				// var valFontSize = 'medium';
				var valFontColor = popupElem.find('input[type="text"][name="val-font-color"]').val();
				var valBgColor = popupElem.find('input[type="text"][name="val-bg-color"]').val();
				// var valWidth = popupElem.find('input[type="text"][name="val-width"]').val();

				var sourceArr = [];

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
				console.log(outlineSource);

				// Get the editor
				var editor = data.editor;

				// Get the entered name
				// var name = $(data.popup).find(":text").val();

				// Insert some html into the document
				// var html = "Hello " + name;
				// var html = "Hello " + name + ' :: ' + outlineSource;
				// editor.execCommand(data.command, html, null, data.button);
				editor.execCommand(data.command, outlineSource, null, data.button);

				// Hide the popup and set focus back to the editor
				editor.hidePopups();
				editor.focus();

			});

	}

})(jQuery);
*/