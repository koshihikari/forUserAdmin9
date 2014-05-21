

jQuery.noConflict();
jQuery(document).ready(function($){
	var date = new Date();
	var id = 'id_' + date.getTime();
	var GsTagLibrary					= new MYNAMESPACE.modules.helper.GsTagLibrary(id);
	var EditorManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager([], GsTagLibrary, id, false);
	EditorManager.setEvent(true);
	var code = $('body').html();
	GsTagLibrary.execute(code);

	// function refreshCode() {
	// 	var gsData = window.GsManager['getGsData']();
	// 	console.log('WYSIWYGモードなら、GSタグを展開する');
	// 	console.log(gsData);
	// 	for (var spreadsheet_id in gsData) {
	// 		// console.log('spreadsheet_id = ' + spreadsheet_id);
	// 		var key = 'https://docs.google.com/spreadsheet/ccc?key=' + gsData[spreadsheet_id]['master']['key'] + '&usp=drive_web#gid=' + gsData[spreadsheet_id]['master']['gid'];
	// 		var tmpGsData = {}
	// 		tmpGsData[key] = {
	// 			'source'	: thisObj.createHtmlSource(gsData[spreadsheet_id]['data'], gsData[spreadsheet_id]['pageType'])
	// 		};
	// 		console.log('key = ' + key);
	// 		console.log('tmpGsData');
	// 		console.log(tmpGsData);
	// 		if (tmpGsData[key]['source'] !== '') {
	// 			code = $('#input').val();
	// 			console.log('code = ' + code);
	// 			console.log('');
	// 			insertedCode = thisObj._instances[('GsTagLibrary_' + thisObj._id)].convertGsToHtml(code, tmpGsData, gsData[spreadsheet_id]['pageType']);
	// 			console.log('insertedCode = ' + insertedCode);
	// 			console.log('');
	// 			thisObj._prevCode = insertedCode;
	// 			$('#input').val(insertedCode);
	// 			thisObj._editor.updateFrame();
	// 		}
	// }
	// GsTagLibrary.on('onCompleteExpandGsTag_'+id, refreshCode);

});

