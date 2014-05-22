

var outlineArr = [];
jQuery.noConflict();
jQuery(document).ready(function($){
	var DataManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.DataManager();
	outlineArr = DataManager.getProp()['outlines'];
	var date = new Date();
	var id = 'id_' + date.getTime();
	var GsTagLibrary					= new MYNAMESPACE.modules.helper.GsTagLibrary(id);
	var EditorManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager(outlineArr, GsTagLibrary, id, 'editPage');
	// var EditorManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager(outlineArr);
	EditorManager.defineCustomButton();
	EditorManager.doEnabled();
	var editor = EditorManager.getEditor();
	var Util							= new MYNAMESPACE.modules.helper.Util();
	var LayoutManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.LayoutManager(editor);
	var PageManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.PageManager(DataManager, editor, GsTagLibrary, id);
	LayoutManager.setOnceEvent();
	LayoutManager.setEvent(true);
	PageManager.setEvent(true);
	EditorManager.setEvent(true);
});