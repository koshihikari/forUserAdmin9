

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
		this._instances = {};
		this._instances[('GsTagLibrary_' + this._id)] = new MYNAMESPACE.modules.helper.GsTagLibrary(this._id);
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfGsTag.prototype = {

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		initialize: function(DataManager) {
			var thisObj = this;
			this._instances['DataManager'] = DataManager;
			_.bindAll(
				this
				,'refreshStyle'
				,'insertAbout'
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
					console.log(elementId + ', gsData');
					console.log(gsData);
					if (gsData['data']) {
						var wrapperElement = targetElem.attr('data-element-type', gsData['pageType']).find('> .contentWrapper');

						switch (gsData['pageType']) {
							case 'about':
								thisObj.insertAbout(targetElem.find('> .contentWrapper'), gsData['data']);
								// wrapperElement.html(gsData['source']).removeClass('empty');
								break;
							case 'map':
								thisObj.insertMap(targetElem, gsData['data']);
								break;
						}
					} else {
						console.log('空にする');
						targetElem.attr('data-eleent-type', '').find('> .contentWrapper').empty();
					}
				})
				$(gsDataInstace).on(('notIncludeGsTag_' + thisObj._id), function(event) {
					console.log('そんなGSない');
					targetElem.find('> .contentWrapper').empty().addClass('empty');
				});
				gsDataInstace.execute(targetProperty['tag']);
			}
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}

		/*
		 * 指定したエレメントに物件概要を挿入するメソッド
		 * @param	targetElem		物件概要を挿入するエレメント
		 * @param	data			物件概要のデータオブジェクト
		 * @return	void
		 */
		,insertAbout: function(targetElem, data) {
			var thisObj = this;
			var source = '';
			var aboutLen = data.length;
			if (0 < aboutLen) {
				for (var aboutNum=0; aboutNum<aboutLen; aboutNum++) {
					var rowLen = data[aboutNum].length;
					if (0 < rowLen) {
						var tmpArr = [];
						for (var row=1; row<rowLen; row++) {
							tmpArr.push('<tr><td class="key">' + data[aboutNum][row]['key'] + '</td><td class="val">' + data[aboutNum][row]['val'] + '</td></tr>');
						}
						source += '<div class="group"><h3>' + data[aboutNum][0]['title'] + '</h3><table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table></div>';
					}
				}
			}
			targetElem.html(source);
		}

		/*
		 * 指定したエレメントにGoogleMapを挿入するメソッド
		 * @param	targetElem		GoogleMapを挿入するエレメント
		 * @param	data			GoogleMapのデータオブジェクト
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
			var containerElem = targetElem.find(' > .contentWrapper');
			// GSに記述されているデータをGoogleMap用とボタン用に分ける為に一度データを検証する
			for (var i=0; i<len; i++) {
				// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapを埋め込む
				if (data[i]['lat']) {
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
		}
	}
});
