

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfGsTag');
	MYNAMESPACE.modules.PreviewOfGsTag = function() {
		var date = new Date();
		this._id = 'id_' + date.getTime();
		this._elementId = '';
		// this._id = 'id_' + Math.random();
		this._instances = {};
		this._instances[('GsTagLibrary_' + this._id)] = new MYNAMESPACE.modules.helper.GsTagLibrary(this._id);
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfGsTag.prototype = {
		// _isEventEnabled							: false
		// // ,_instances								: {}
		// // ,_val								: Math.random()
		// ,_createdElement						: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		initialize: function(DataManager) {
			var thisObj = this;
			// console.log('+++++++++++++++++++++++++');
			// console.log('PreviewOfGsTag :: initialize');
			// console.log('val = ' + thisObj.val);
			// console.log('_val = ' + thisObj._val);
			// console.log('+++++++++++++++++++++++++');
			// this._instances = {
			// 	'DataManager'		: DataManager
			// }

			this._instances['DataManager'] = DataManager;
			// this._instances[('GsTagLibrary_' + thisObj.val)] = new MYNAMESPACE.modules.helper.GsTagLibrary();
			// this._instances = {
			// 	'DataManager'		: DataManager,
			// 	'GsTagLibrary'		: new MYNAMESPACE.modules.helper.GsTagLibrary()
			// }
			_.bindAll(
				this
				,'refreshStyle'
				,'insertMap'
			);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElem = $('#' + elementId);
			thisObj._elementId = elementId;
			// console.log('-------------------');
			// console.log('PreviewOfCode :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('val = ' + thisObj.val);
			// console.log('_val = ' + thisObj._val);
			// console.log('-------------------');
			if (targetProperty['url'] === '') {
				targetElem.find('> .contentWrapper').empty().addClass('empty');
			} else {
				var gsDataInstace = thisObj._instances[('GsTagLibrary_' + thisObj._id)];
				console.log(elementId + ', GS展開');
				// targetElem.find('> .contentWrapper').empty().html(targetProperty['tag']);
				$(gsDataInstace).on(('onCompleteExpandGsTag_' + thisObj._id), function(event) {
				// $(gsDataInstace).on('onCompleteExpandGsTag', function(event) {
				// $(thisObj._instances['GsTagLibrary']).on('onCompleteExpandGsTag', function(event) {
					$(gsDataInstace).off(('onCompleteExpandGsTag_' + thisObj._id));
					// $(gsDataInstace).off('onCompleteExpandGsTag');
					// $(thisObj._instances['GsTagLibrary']).off('onCompleteExpandGsTag');
					var gsData = window.GsManager['getGsData'](targetProperty['url']);
					// var gsData = gsDataInstace.getGsData(targetProperty['url']);
					// var gsData = thisObj._instances['GsTagLibrary'].getGsData(targetProperty['url']);
					console.log('-------------');
			console.log('targetProperty');
			console.log(targetProperty);
					console.log('_id = ' + thisObj._id);
					console.log(elementId + ', url = ' + targetProperty['url']);
					console.log(elementId + ', gsData');
					console.log(gsData);
					var wrapperElement = targetElem.attr('data-element-type', gsData['pageType']).find('> .contentWrapper');

					switch (gsData['pageType']) {
						case 'about':
							wrapperElement.html(gsData['source']).removeClass('empty');
							break;
						case 'map':
							thisObj.insertMap(targetElem, gsData['data']);
							break;
					}
				})
				gsDataInstace.execute(targetProperty['tag']);
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,insertMap: function(targetElem, data) {
			var thisObj = this;
			var len = data.length;
			targetElem
				.removeClass('empty')
				.find(' > .contentWrapper')
				.find('.group')
					.remove();
			// targetElem
			// 	.removeClass('empty')
			// 	.find(' > .contentWrapper')
			// 	.find('.map')
			// 		.remove();
			// var containerElem = targetElem.find(' > .contentWrapper').append('<div class="group">');
			// containerElem = containerElem.find('.group');
			var containerElem = targetElem.find(' > .contentWrapper');
			for (var i=0; i<len; i++) {
				// containerElem.append('<div class="group">');
				// var groupElem = containerElem.find('.group')[i];
				var groupElem = $('<div>').addClass('group').appendTo(containerElem);
				var myOptions = {
					zoom			: data[i]['zoom'],
					center			: new google.maps.LatLng(data[i]['lat'], data[i]['lng']),
					mapTypeId		: google.maps.MapTypeId.ROADMAP,
					scaleControl	: true,
					draggable		: false,
					scrollwheel		: false
				};
				var gMap = {
					geocoder	: new google.maps.Geocoder()
				}
				var mapElem = $('<div>').addClass('map').appendTo(groupElem);
				// var mapElem = groupElem.append('<div class="map"/>');
				// var mapElem = containerElem.append('<div class="map"/>');
				gMap['map'] = new google.maps.Map(mapElem[0], myOptions);
				// gMap['map'] = new google.maps.Map(mapElem.find('.map')[i], myOptions);
				// gMap['map'] = new google.maps.Map(targetElement.find('.map')[0], myOptions);
				var marker = new google.maps.Marker({
					// position	: new google.maps.LatLng('35.792326', '139.769705'),
					position	: new google.maps.LatLng(data[i]['lat'], data[i]['lng']),
					map			: gMap['map'],
					title		: ''
				});
				// targetElem
				// 	.removeClass('empty')
				// 	.find('.map')
				// 		.css(
				// 			{
				// 				height	: 240
				// 			}
				// 		);

				var addressElem = '<div class="address"><a href="http://maps.apple.com/?q=' + data[i]['address'] + '" class="openmap" style="text-decoration: underline;"><span class="text">' + data[i]['address'] + '</span></a></div>';
				groupElem.append(addressElem);
				// containerElem.append(addressElem);
				mapElem.css('height', 240);
			};
		}
	}
});
