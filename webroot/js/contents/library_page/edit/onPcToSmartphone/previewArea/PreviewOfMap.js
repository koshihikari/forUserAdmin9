

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfMap');
	MYNAMESPACE.modules.PreviewOfMap = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfMap.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		,_gMapObj								: {}
		,_prevProperty							: {}
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			this._gMapObj = {
				geocoder	: new google.maps.Geocoder()
			}
			_.bindAll(
				this
				,'build'
				,'refreshStyle'
			);
		}
		
		/*
		 * このクラスで管理するエレメント構築ソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,build: function(elementId, targetProperty) {
			var thisObj = this;
			$("#"+elementId).addClass('empty');
			$(thisObj).trigger('onCompleteBuild', elementId);
		}
		
		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty, isPublishStaticPage) {
			var thisObj = this;
			var targetElem = $("#" + elementId);
			// $(thisObj).trigger('onCompleteRefreshStyle', elementId);
			// return;

			isPublishStaticPage = isPublishStaticPage === true ? true : false;

			// console.log('---------------------');
			// console.log('PreviewOfMap :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName + ', isPublishStaticPage = ' + isPublishStaticPage);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('thisObj._prevProperty[');
			// console.log(thisObj._prevProperty);
			// console.log('---------------------');

			var mapWidth = targetProperty['isFullWidth'] === true ? '100%' : targetProperty['mapWidth'] + 'px';
			if (
				thisObj._prevProperty['isFullWidth'] !== targetProperty['isFullWidth']
				 || thisObj._prevProperty['isFullWidth'] !== targetProperty['isFullWidth']
				 || thisObj._prevProperty['mapWidth'] !== targetProperty['mapWidth']
				 || thisObj._prevProperty['mapHeight'] !== targetProperty['mapHeight']
			) {
				targetElem
					.css(
						{
							width	: mapWidth,
							height	: targetProperty['mapHeight']
						}
					)
					.find('.map')
						.css(
							{
								height	: targetProperty['mapHeight']
							}
						);
			}
			// var isRenderingOnly = true;
			// var isRenderingOnly = false;
			// アクティブになっているのが住所なのに住所が入力されていない、もしくは、アクティブになっているのが緯度/経度なのに緯度/経度が空の場合、地図を破棄
			if (
				(targetProperty['currentArea'] === 'address' && targetProperty['address'] === '') ||
				(targetProperty['currentArea'] === 'latlong' && (targetProperty['latitude'] === '' || targetProperty['longitude'] === ''))
			) {
				// console.log('');
				// console.log('');
				// console.log('地図の中は空っぽ');
				// console.log('');
				// console.log('');
				// $("#" + elementId)
				targetElem
					.addClass('empty')
					.find(' > .contentWrapper')
					.find('.map')
						.remove()
					.end()
					.append('<div class="map"/>');
				thisObj._prevProperty = $.extend(true, {}, targetProperty);
				$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
				$(thisObj).trigger('onCompleteRenderMap', [elementId, 'Map', $.extend(true, {}, targetProperty)]);
					
			// 住所から地図を表示
			} else if (
				targetProperty['currentArea'] === 'address' && targetProperty['address'] !== ''
				&& (
					isPublishStaticPage === true
					|| (
						isPublishStaticPage === false
						&& (
							thisObj._prevProperty['address'] !== targetProperty['address']
							|| thisObj._prevProperty['mapScale'] !== targetProperty['mapScale']
							|| thisObj._prevProperty['mapHeight'] !== targetProperty['mapHeight']
						)
					)
				 )
			) {
				// console.log('住所から地図表示');
				thisObj._gMapObj['geocoder'].geocode({address: targetProperty['address']}, function(results, status) {
					// console.log('住所から緯度経度取得完了');
					// try {
						var latlng = results[0].geometry.location;
					// } catch(error) {
					// 	console.log(error);
					// 	console.log(results);
					// 	console.log('');
					// 	alert('error');
					// }
					lat = latlng.lat();
					lng = latlng.lng();

					if (isPublishStaticPage === true) {
				// console.log('');
				// console.log('');
				// console.log('地図の中はアドレス指定');
				// console.log('');
				// console.log('');
						targetElem.attr(
							{
								'data-zoom'				: targetProperty['mapScale'],
								'data-lat'				: lat,
								'data-lng'				: lng,
								'data-map-type-id'		: google.maps.MapTypeId.ROADMAP,
								'data-scale-control'	: true,
								'data-draggable'		: false,
								'data-scrollwheel'		: false,
								'data-map-width'		: mapWidth,
								'data-map-height'		: targetProperty['mapHeight']
							}
						);
					} else {
						targetProperty['latitude'] = lat;
						targetProperty['longitude'] = lng;
						
						var myOptions = {
							zoom			: targetProperty['mapScale'],
							center			: new google.maps.LatLng(lat, lng),
							mapTypeId		: google.maps.MapTypeId.ROADMAP,
							scaleControl	: true,
							draggable		: false,
							scrollwheel		: false
						};
						thisObj._gMapObj['map'] = new google.maps.Map($("#" + elementId).find('.map')[0], myOptions);
						var marker = new google.maps.Marker({
							position	: new google.maps.LatLng(lat, lng),
							map			: thisObj._gMapObj['map'], 
							title		: ''
						});
						targetElem
							.removeClass('empty')
							.find('.map')
								.css(
									{
										height	: targetProperty['mapHeight']
									}
								);
					}
					// console.log('');
					// console.log('');
					// console.log('地図のレンダリング完了');
					// console.log('');
					// console.log('');
					thisObj._prevProperty = $.extend(true, {}, targetProperty);
					$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
					$(thisObj).trigger('onCompleteRenderMap', [elementId, 'Map', $.extend(true, {}, targetProperty)]);
				});

			// 緯度/経度から地図を表示
			} else if (
				targetProperty['currentArea'] === 'latlong'
				&& targetProperty['latitude'] !== ''
				&& targetProperty['longitude'] !== ''
				&& (
					isPublishStaticPage === true
					|| (
						isPublishStaticPage === false
						&& (
							thisObj._prevProperty['latitude'] !== targetProperty['latitude']
							|| thisObj._prevProperty['longitude'] !== targetProperty['longitude']
							|| thisObj._prevProperty['mapScale'] !== targetProperty['mapScale']
						)
					)
					// thisObj._prevProperty['latitude'] !== targetProperty['latitude']
					// || thisObj._prevProperty['longitude'] !== targetProperty['longitude']
					// || thisObj._prevProperty['mapScale'] !== targetProperty['mapScale']
				)
			) {
				lat = targetProperty['latitude'];
				lng = targetProperty['longitude'];

				if (isPublishStaticPage === true) {
				// console.log('');
				// console.log('');
				// console.log('地図の中は緯度経度指定');
				// console.log('');
				// console.log('');
					targetElem.attr(
						{
							'data-zoom'				: targetProperty['mapScale'],
							'data-lat'				: lat,
							'data-lng'				: lng,
							'data-map-type-id'		: google.maps.MapTypeId.ROADMAP,
							'data-scale-control'	: true,
							'data-draggable'		: false,
							'data-scrollwheel'		: false,
							'data-map-width'		: mapWidth,
							'data-map-height'		: targetProperty['mapHeight']
						}
					);
				} else {
					var myOptions = {
						zoom			: targetProperty['mapScale'],
						center			: new google.maps.LatLng(lat, lng),
						mapTypeId		: google.maps.MapTypeId.ROADMAP,
						scaleControl	: true,
						draggable		: false,
						scrollwheel		: false
					};
					thisObj._gMapObj['map'] = new google.maps.Map($("#" + elementId).find('.map')[0], myOptions);
					var marker = new google.maps.Marker({
						position	: new google.maps.LatLng(lat, lng),
						map			: thisObj._gMapObj['map'], 
						title		: ''
					});
						targetElem
							.removeClass('empty')
							.find('.map')
								.css(
									{
										height	: targetProperty['mapHeight']
									}
								);
				}
				thisObj._prevProperty = $.extend(true, {}, targetProperty);
				$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
				$(thisObj).trigger('onCompleteRenderMap', [elementId, 'Map', $.extend(true, {}, targetProperty)]);
			}
				// $("#" + elementId)
				// 	.addClass('empty')
				// 	.find(' > .contentWrapper')
				// 	.find('.map')
				// 		.remove()
				// 	.end()
				// 	.append('<div class="map"/>')

			// $(thisObj).trigger('onCompleteRefreshStyle', elementId);
		}
	}
});
