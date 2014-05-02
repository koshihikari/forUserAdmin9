/*!
 * jQuery ScrollTrigger plugin v0.0.1
 * http://www.koikikukan.com/archives/2012/07/12-003333.php
 *
 * Copyright 2012, Yujiro Araki
 */
(function($){
	jQuery.fn.scrolltrigger = function(options) {
		var defaults = {
			trigger: '', // trigger name(id, class, element)
			callback: '', // callback function name
			parameter: '' // callback function parameter
		};
		var setting = jQuery.extend(defaults, options);
		var pullTrigger = 0;
		if (!(jQuery(setting.trigger).get(0))) {
			return this;
		}
		jQuery(window).scroll(function(){
			if (!pullTrigger &&
				(jQuery(window).scrollTop() > (jQuery(setting.trigger).offset().top - jQuery(window).height()))) {
				pullTrigger = 1;
				var strFunction = setting.callback;
				var fn = window[strFunction];
				if (!fn) {
					return this;
				}
				if (setting.parameter) {
					fn(setting.parameter);
				} else {
					fn();
				}
			}
		});
		return this;
	};
})(jQuery)