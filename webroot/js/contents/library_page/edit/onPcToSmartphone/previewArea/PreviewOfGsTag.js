

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
				// console.log(elementId + ', GS展開');
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
					// console.log('-------------');
					// console.log('targetProperty');
					// console.log(targetProperty);
					// console.log('_id = ' + thisObj._id);
					// console.log(elementId + ', url = ' + targetProperty['url']);
					// console.log(elementId + ', gsData');
					// console.log(gsData);
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
			// GSに記述されているデータをGoogleMap用とボタン用に分ける為に一度データを検証する
			for (var i=0; i<len; i++) {
				// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapを埋め込む
				if (data[i]['lat']) {
				// if (
				// 	data[i]['title'] !== null && data[i]['title'] !== '' &&
				// 	data[i]['lat'] !== null && data[i]['lat'] !== '' &&
				// 	data[i]['lng'] !== null && data[i]['lng'] !== '' &&
				// 	data[i]['zoom'] !== null && data[i]['zoom'] !== '' &&
				// 	data[i]['address'] !== null && data[i]['address'] !== ''
				// ) {
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
					gMap['map'] = new google.maps.Map(mapElem[0], myOptions);
					var marker = new google.maps.Marker({
						position	: new google.maps.LatLng(data[i]['lat'], data[i]['lng']),
						map			: gMap['map'],
						title		: ''
					});

					var addressElem = '<div class="address"><a href="http://maps.apple.com/?q=' + data[i]['address'] + '" class="openmap" style="text-decoration: underline;"><span class="text">' + data[i]['address'] + '</span></a></div>';
					groupElem.append(addressElem);
					mapElem.css('height', 240);
				} else if (0 < data[i].length) {
					var tagArr = [];
					var menuCount = data[i].length;
					var spaceCount = menuCount - 1;
					var liWidth = ((100 - (spaceCount * 2)) / menuCount) + '%';
					tagArr.push('<ul class="menu">');
					for (var j=0; j<menuCount; j++) {
						tagArr.push('<li style="width:' + liWidth + ';"><a href="' + data[i][j]['url'] + '" target="' + data[i][j]['target'] + '">' + data[i][j]['btnName'] + '</a></li>');
					}
					tagArr.push('</ul>');
					containerElem.append(tagArr.join(''));
				}
			};
			/*
			for (var i=0; i<len; i++) {
				// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapを埋め込む
				if (
					data[i]['title'] !== null && data[i]['title'] !== '' &&
					data[i]['lat'] !== null && data[i]['lat'] !== '' &&
					data[i]['lng'] !== null && data[i]['lng'] !== '' &&
					data[i]['zoom'] !== null && data[i]['zoom'] !== '' &&
					data[i]['address'] !== null && data[i]['address'] !== ''
				) {
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
					gMap['map'] = new google.maps.Map(mapElem[0], myOptions);
					var marker = new google.maps.Marker({
						position	: new google.maps.LatLng(data[i]['lat'], data[i]['lng']),
						map			: gMap['map'],
						title		: ''
					});

					var addressElem = '<div class="address"><a href="http://maps.apple.com/?q=' + data[i]['address'] + '" class="openmap" style="text-decoration: underline;"><span class="text">' + data[i]['address'] + '</span></a></div>';
					groupElem.append(addressElem);
					mapElem.css('height', 240);
				} else if (
					data[i]['btnName'] !== null && data[i]['btnName'] !== '' &&
					data[i]['url'] !== null && data[i]['url'] !== ''
				) {




//<div id="id-1371777958056_797914321528" data-item-name="Table" data-item-type="container" class="not-editable" style="margin: 10px 5px 15px;"><div class="contentWrapper" style="background-color: transparent; padding: 0px; background-position: initial initial; background-repeat: initial initial;"><div class="Table"><table><tbody><tr><td id="id-1371777958056_797914321528_0-0" data-item-name="Td" class="hasChildren" style="border-style: outset; border-width: 3px 0px 3px 3px; border-top-left-radius: 5px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 5px; width: 40%; background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(255, 255, 255, 0.2)), to(rgba(0, 0, 0, 0.2))); background-color: rgb(255, 255, 255); text-align: left; border-color: rgb(153, 153, 153); margin: 0px auto; background-position: initial initial; background-repeat: initial initial;"><a href="https://enq.nisshinfudosan.co.jp/form/fm/honsya/mitaka?_ga=1.7253872.3360344.1395900698" target="_blank" style="text-decoration: none;"><div id="id-1377227050590_797914321528" data-item-name="Text" data-item-type="displayObject" class="" style="color: rgb(0, 0, 0); font-size: 16px; line-height: 14px; font-weight: bold; font-style: normal; text-decoration: none; text-shadow: rgb(255, 255, 255) 0px 1px 1px; text-align: left; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; margin: 0px auto;"><div class="contentWrapper" style="background-color: transparent; border-style: solid; border-width: 0px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; padding: 10px; background-position: initial initial; background-repeat: initial initial;"><span class="text">資料請求</span></div></div></a></td><td id="id-1371777958056_797914321528_0-1" data-item-name="Td" class="hasChildren" style="border-style: outset; border-width: 3px 3px 3px 0px; border-top-left-radius: 0px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 0px; width: 9%; background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(255, 255, 255, 0.2)), to(rgba(0, 0, 0, 0.2))); background-color: rgb(255, 255, 255); text-align: right; border-color: rgb(153, 153, 153); margin: 0px auto; background-position: initial initial; background-repeat: initial initial;"><a href="https://enq.nisshinfudosan.co.jp/form/fm/honsya/mitaka" target="_blank" style="text-decoration: none;"><div id="id-1377227061109_797914321528" data-item-name="Icon" data-item-type="displayObject" class="" style="color: rgb(0, 0, 0); font-size: 2.6rem; line-height: 2rem; font-weight: normal; font-style: normal; text-decoration: none; text-shadow: rgb(255, 255, 255) 0px 1px 1px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; margin: 0px auto;"><div class="contentWrapper" style="background-color: transparent; border-style: solid; border-width: 0px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; padding: 10px 3px 10px 0px; background-position: initial initial; background-repeat: initial initial;"><i data-icon=""></i></div></div></a></td><td id="id-1371777958056_797914321528_0-2" data-item-name="Td" class="" style="border: 0px solid rgb(153, 153, 153); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; width: 2%; background-color: transparent; text-align: left; margin: 0px auto; background-position: initial initial; background-repeat: initial initial;"></td><td id="id-1371777958056_797914321528_0-3" data-item-name="Td" class="hasChildren" style="border-style: outset; border-width: 3px 0px 3px 3px; border-top-left-radius: 5px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 5px; width: 40%; background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(255, 255, 255, 0.2)), to(rgba(0, 0, 0, 0.2))); background-color: rgb(255, 255, 255); text-align: left; border-color: rgb(153, 153, 153); margin: 0px auto; background-position: initial initial; background-repeat: initial initial;"><a href="https://enq.nisshinfudosan.co.jp/form/fm/honsya/mitaka_raijyo" target="_blank" style="text-decoration: none;"><div id="id-1377227070845_797914321528" data-item-name="Text" data-item-type="displayObject" class="" style="color: rgb(0, 0, 0); font-size: 16px; line-height: 14px; font-weight: bold; font-style: normal; text-decoration: none; text-shadow: rgb(255, 255, 255) 0px 1px 1px; text-align: left; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; margin: 0px auto;"><div class="contentWrapper" style="background-color: transparent; border-style: solid; border-width: 0px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; padding: 10px; background-position: initial initial; background-repeat: initial initial;"><span class="text">来場予約</span></div></div></a></td><td id="id-1371777958056_797914321528_0-4" data-item-name="Td" class="hasChildren" style="border-style: outset; border-width: 3px 3px 3px 0px; border-top-left-radius: 0px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 0px; width: 9%; background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(255, 255, 255, 0.2)), to(rgba(0, 0, 0, 0.2))); background-color: rgb(255, 255, 255); text-align: right; border-color: rgb(153, 153, 153); margin: 0px auto; background-position: initial initial; background-repeat: initial initial;"><a href="https://enq.nisshinfudosan.co.jp/form/fm/honsya/mitaka_raijyo" target="_blank" style="text-decoration: none;"><div id="id-1377227086991_797914321528" data-item-name="Icon" data-item-type="displayObject" class="" style="color: rgb(0, 0, 0); font-size: 2.6rem; line-height: 2rem; font-weight: normal; font-style: normal; text-decoration: none; text-shadow: rgb(255, 255, 255) 0px 1px 1px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; margin: 0px auto;"><div class="contentWrapper" style="background-color: transparent; border-style: solid; border-width: 0px; border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; padding: 10px 3px 10px 0px; background-position: initial initial; background-repeat: initial initial;"><i data-icon=""></i></div></div></a></td></tr></tbody></table></div></div></div>
				}
			};
			*/
		}
	}
});
