

jQuery.noConflict();
jQuery(document).ready(function($){
	var AppModel					= new MYNAMESPACE.modules.main.index.onPcToSmartphone.model.AppModel();
	var Mediator					= new MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator({'AppModel':AppModel});
	/*
	var RenderingManager			= new MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager();
	var ConcretePageManager			= new MYNAMESPACE.modules.helper.ConcretePageManagerForSmartphone(
		{
			'RenderingManager'		: RenderingManager
		}
	);
*/

	Mediator.setEvent(true);
	AppModel.request();
});

