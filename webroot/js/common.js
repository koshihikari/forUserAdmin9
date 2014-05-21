

jQuery.noConflict();
jQuery(document).ready(function($){
	var timerId = setTimeout(function() {
		operable();
	}, 3000);
	$('#flashMessage').on('click', function(event) {
		operable();
	});
	function operable() {
		clearTimeout(timerId);
		$('#flashMessage').fadeOut("fast");
	}
	$('*[data-placement][data-original-title]').tooltip();


	if (0 < $('#simple-menu').length) {
		$('#simple-menu')
			.sidr()
			.on('click', function(event) {
				$("div.tooltip").remove();
				$(this).toggleClass('open');
				if ($(this).hasClass('open')) {
					console.log('開いている');
					if (0 < $('[data-placement][data-original-title]').length) {
						$('[data-placement][data-original-title]').tooltip('destroy');
					}
				} else {
					console.log('閉じている');
					$('[data-placement][data-original-title]').tooltip();
				}
			});
	}
});
(function () {
	if (typeof window.console === "undefined") {
		window.console = {}
	}
	if (typeof window.console.log !== "function") {
		window.console.log = function () {}
	}
})();
