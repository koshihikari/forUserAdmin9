

jQuery.noConflict();
jQuery(document).ready(function($){
	var AppModel					= new MYNAMESPACE.modules.main.index.onPcToSmartphone.model.AppModel();
	var Mediator					= new MYNAMESPACE.modules.main.index.onPcToSmartphone.Mediator({'AppModel':AppModel});

	Mediator.setEvent(true);
	AppModel.request();
});

