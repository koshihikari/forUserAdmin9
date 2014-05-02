

jQuery.noConflict();
jQuery(document).ready(function($){
	var DataManager								= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.DataManager();
	var UtilManager								= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.UtilManager();
	var DirectoryManager						= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.DirectoryManager(DataManager);
	var LibraryManager							= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.LibraryManager(DataManager);
	var DirectoryLibraryManager					= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.DirectoryLibraryManager(DataManager);
	var Mediator								= new MYNAMESPACE.modules.library.catalog.onPcToSmartphone.Mediator(
		{
			'DataManager'					: DataManager,
			'DirectoryManager'				: DirectoryManager,
			'LibraryManager'				: LibraryManager,
			'DirectoryLibraryManager'		: DirectoryLibraryManager,
			'UtilManager'					: UtilManager
		}
	);

	DirectoryManager.setEvent(true);
	LibraryManager.setEvent(true);
	Mediator.setEvent(true);

	$(window).trigger('resize');

	DataManager.request();



});

