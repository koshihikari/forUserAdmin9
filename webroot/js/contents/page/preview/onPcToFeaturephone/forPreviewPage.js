

jQuery.noConflict();
jQuery(document).ready(function($){
	var date = new Date();
	var id = 'id_' + date.getTime();
	var GsTagLibrary					= new MYNAMESPACE.modules.helper.GsTagLibrary(id);
	var EditorManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager([], GsTagLibrary, id, 'previewPage');
	EditorManager.setEvent(true);
	var code = $('body').html();
	GsTagLibrary.execute(code);
});

