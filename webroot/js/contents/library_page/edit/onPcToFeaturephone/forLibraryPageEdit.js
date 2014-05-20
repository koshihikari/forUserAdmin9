

var outlineArr = [];
jQuery.noConflict();
jQuery(document).ready(function($){
	var DataManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.DataManager();
	outlineArr = DataManager.getProp()['outlines'];
	var EditorManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.EditorManager(outlineArr);
	var editor = EditorManager.getEditor();
	var Util							= new MYNAMESPACE.modules.helper.Util();
	var LayoutManager					= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.LayoutManager(editor);
	var PageManager						= new MYNAMESPACE.modules.library_page.edit.onPcToFeaturephone.PageManager(DataManager, editor);
	LayoutManager.setOnceEvent();
	LayoutManager.setEvent(true);
	PageManager.setEvent(true);
	EditorManager.setEvent(true);
});