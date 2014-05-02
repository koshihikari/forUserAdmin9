

jQuery.noConflict();
jQuery(document).ready(function($){
	var RenderingManager					= new MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager();
	RenderingManager.setEvent(true);
	RenderingManager.render();
});

(function () {
    if (typeof window.console === "undefined") {
         window.console = {}
    }
    if (typeof window.console.log !== "function") {
         window.console.log = function () {}
    }
})();