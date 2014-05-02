

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	$("#switchSidebar").on('click', function(event) {
		var elem = $("#wrapper");
		var targetMarginLeft = 0;
		var isShow = 1;
		if (elem.attr('data-is-show') === '1') {
			targetMarginLeft = -200;
			isShow = 0;
		}
		elem
			.stop(true)
			.attr('data-is-show', isShow)
			.animate(
				{
					'margin-left'	: targetMarginLeft
				},
				{
					'duration'	: 200,
					'easing'	: 'linear',
					'complete'	: function(event) {
					}
				}
			);

		return false;
	});
	*/
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


	// $('#simple-menu').sidr(
	// {
	// 	source : function(event) {
	// 		console.log('aaaaa');
	// 	}
	// }
	// );
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
})
