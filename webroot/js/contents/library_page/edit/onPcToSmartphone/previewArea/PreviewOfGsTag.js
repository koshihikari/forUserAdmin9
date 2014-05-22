

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
				,'insertGallery'
				,'insertMap'
				,'insertInformation'
				,'insertPlan'
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
			console.log('targetProperty');
			console.log(targetProperty);
			if (targetProperty['url'] === '' || targetProperty['isPreview'] === false) {
				targetElem.find('> .contentWrapper').empty();
				// targetElem.find('> .contentWrapper').empty().addClass('empty');
			} else {
				var gsDataInstace = thisObj._instances[('GsTagLibrary_' + thisObj._id)];
				$(gsDataInstace).on(('onCompleteExpandGsTag_' + thisObj._id), function(event) {
					$(gsDataInstace).off(('onCompleteExpandGsTag_' + thisObj._id));
					var gsData = window.GsManager['getGsData'](targetProperty['url']);
					var contentWrapperElement = targetElem.attr('data-eleent-type', '').find('> .contentWrapper');
					contentWrapperElement.empty();
					if (gsData['data']) {
						targetElem.attr('data-element-type', gsData['pageType']);

						switch (gsData['pageType']) {
							case 'about':
								thisObj.insertAbout(contentWrapperElement, gsData['data']);
								break;
							case 'appearance':
							case 'modelroom':
								thisObj.insertGallery(contentWrapperElement, gsData['data']);
								break;
							case 'map':
								thisObj.insertMap(contentWrapperElement, gsData['data']);
								break;
							case 'information':
								thisObj.insertInformation(contentWrapperElement, gsData['data']);
								break;
							case 'plan':
								thisObj.insertPlan(contentWrapperElement, gsData['data']);
								break;
						}
					}
					$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
				});
				$(gsDataInstace).on(('notIncludeGsTag_' + thisObj._id), function(event) {
					console.log('そんなGSない');
					targetElem.find('> .contentWrapper').empty().addClass('empty');
				});
				gsDataInstace.execute(targetProperty['tag']);
			}
			// $(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
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
					source += '<div class="group">';
					if (data[aboutNum]['title']) {
						source += '<h3>' + data[aboutNum]['title'] + '</h3>';
					}
					if (data[aboutNum]['keyVal'] && data[aboutNum]['keyVal'].length) {
						var rowLen = data[aboutNum]['keyVal'].length;
						var tmpArr = [];
						for (var row=0; row<rowLen; row++) {
							tmpArr.push('<tr><td class="key">' + data[aboutNum]['keyVal'][row]['key'] + '</td><td class="val">' + data[aboutNum]['keyVal'][row]['val'] + '</td></tr>');
						}
						source += '<table class="table table-bordered for-about"><tbody>' + tmpArr.join('') + '</tbody></table>';
					}
					if (data[aboutNum]['note'] && data[aboutNum]['note'].length) {
						source += '<div class="note">' + data[aboutNum]['note'].join('<br>') + '</div>';
					}
					source += '</div>';
				}
			}
			targetElem.html(source);
		}

		/*
		 * 指定したエレメントにギャラリーを挿入するメソッド
		 * @param	targetElem		ギャラリーを挿入するエレメント
		 * @param	data			ギャラリーのデータオブジェクト
		 * @return	void
		 */
		,insertGallery: function(targetElem, data) {
			var thisObj = this;
			var len = data.length;
			if (0 < len) {
				var source = '', len2 = 0;
				var animationType = 'slide';
				var isAutoPlay = true;
				var slideshowSpeed = 6;
				var animationSpeed = 1;
				var isLoopPlay = true;
				for (var i=0; i<len; i++) {
					// 画像データが存在するなら、ギャラリー用ソースを作成
					len2 = data[i]['images'] && data[i]['images'].length ? data[i]['images'].length : 0;
					if (0 < len2) {
						var images = [];
						var contents = [];
						for (var j=0; j<len2; j++) {
							contents.push('<li><img src="' + data[i]['images'][j] + '" /></li>')
							images.push(data[i]['images'][j]);
						}
						var tmpSource ='<div class="flexslider"\
							"data-animation="' + animationType + '"\
							"data-slideshow="' + (isAutoPlay === true ? 1 : 0) + '"\
							"data-slideshowSpeed="' + (slideshowSpeed * 1000) + '"\
							"data-animationDuration="' + (animationSpeed * 1000) + '"\
							"data-animationLoop="' + (isLoopPlay === true ? 1 : 0) + '"\
							"data-contents="' + images.join(',') + '"\
						><ul class="slides">';
						source += tmpSource + contents.join('') + '</ul></div>';
					}

					// キャッチコピーのデータが存在するなら、キャッチコピー用ソースを作成
					len2 = data[i]['chatchCopies'] && data[i]['chatchCopies'].length ? data[i]['chatchCopies'].length : 0;
					if (0 < len2) {
						var catchCopies = [];
						for (var j=0; j<len2; j++) {
							catchCopies.push(data[i]['chatchCopies'][j]);
						}
						source += '<div class="catchcopy">' + catchCopies.join('<br>') + '</div>';
					}

					// ボディコピーのデータが存在するなら、ボディコピー用ソースを作成
					len2 = data[i]['bodyCopies'] && data[i]['bodyCopies'].length ? data[i]['bodyCopies'].length : 0;
					if (0 < len2) {
						var bodyCopies = [];
						for (var j=0; j<len2; j++) {
							bodyCopies.push(data[i]['bodyCopies'][j]);
						}
						source += '<div class="bodyCopy">' + bodyCopies.join('<br>') + '</div>';
					}

					// キャプションのデータが存在するなら、キャプション用ソースを作成
					len2 = data[i]['captions'] && data[i]['captions'].length ? data[i]['captions'].length : 0;
					if (0 < len2) {
						var captions = [];
						for (var j=0; j<len2; j++) {
							captions.push(data[i]['captions'][j]);
						}
						source += '<div class="caption">' + captions.join('<br>') + '</div>';
					}
				}
				targetElem.append(source);
				$('.flexslider')
					.flexslider({
						animation				: animationType,
						slideshow				: isAutoPlay,
						slideshowSpeed			: slideshowSpeed * 1000,
						animationDuration		: animationSpeed * 1000,
						animationLoop			: isLoopPlay,
						smoothHeight			: true
					});
			}
		}

		/*
		 * 指定したエレメントにインフォメーションを挿入するメソッド
		 * @param	targetElem		インフォメーションを挿入するエレメント
		 * @param	data			インフォメーションのデータオブジェクト
		 * @return	void
		 */
		,insertInformation: function(targetElem, data) {
			var thisObj = this;
			var len = data.length;
			if (0 < len) {
				var sources = [];
				sources.push('<dl>');
				// var source = '', len2 = 0;
				// var animationType = 'slide';
				// var isAutoPlay = true;
				// var slideshowSpeed = 6;
				// var animationSpeed = 1;
				// var isLoopPlay = true;
				for (var i=0; i<len; i++) {
					// タイトルのデータが存在するなら、タイトル用ソースを作成
					len2 = data[i]['titles'] && data[i]['titles'].length ? data[i]['titles'].length : 0;
					if (0 < len2) {
						// var images = [];
						// var contents = [];
						for (var j=0; j<len2; j++) {
							// contents.push('<li><img src="' + data[i]['images'][j] + '" /></li>')
							// images.push(data[i]['images'][j]);
							sources.push('<dt>' + data[i]['titles'][j] + '</dt>');
						}
						// var tmpSource ='<div class="flexslider"\
						// 	"data-animation="' + animationType + '"\
						// 	"data-slideshow="' + (isAutoPlay === true ? 1 : 0) + '"\
						// 	"data-slideshowSpeed="' + (slideshowSpeed * 1000) + '"\
						// 	"data-animationDuration="' + (animationSpeed * 1000) + '"\
						// 	"data-animationLoop="' + (isLoopPlay === true ? 1 : 0) + '"\
						// 	"data-contents="' + images.join(',') + '"\
						// ><ul class="slides">';
						// source += tmpSource + contents.join('') + '</ul></div>';
					}

					// 本文のデータが存在するなら、本文用ソースを作成
					len2 = data[i]['messages'] && data[i]['messages'].length ? data[i]['messages'].length : 0;
					if (0 < len2) {
						// var catchCopies = [];
						for (var j=0; j<len2; j++) {
							// catchCopies.push(data[i]['chatchCopies'][j]);
							sources.push('<dd>' + data[i]['messages'][j] + '</dd>');
						}
						// source += '<div class="catchcopy">' + catchCopies.join('<br>') + '</div>';
					}
				}
				sources.push('</dl>');
				targetElem.append(sources.join(''));
			}
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
			// targetElem
			// 	.removeClass('empty')
			// 	.find(' > .contentWrapper')
			// 	.find('.group')
			// 		.remove();
			// var containerElem = targetElem.find(' > .contentWrapper');
			// GSに記述されているデータをGoogleMap用とボタン用に分ける為に一度データを検証する
			for (var i=0; i<len; i++) {
				// タイトル、緯度、経度、ズームレベル、住所が入力されていればGoogleMapを埋め込む
				if (data[i]['lat']) {
					var groupElem = $('<div>').addClass('group').appendTo(targetElem);
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
				// データが配列なら、メニューエレメントを作成する
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
					targetElem.append(tagArr.join(''));
				}
			};
		}

		/*
		 * 指定したエレメントに間取りエレメントを挿入するメソッド
		 * @param	targetElem		間取りエレメントを挿入するエレメント
		 * @param	data			間取りエレメントのデータオブジェクト
		 * @return	void
		 */
		,insertPlan: function(targetElem, data) {
			var thisObj = this;
			var source = '';
			var tmpArr = [];
			var len = data.length;
			if (0 < len) {
				if (len === 1) {
					tmpArr.push('<tr><td><a href="' + data[0]['url'] + '" target="_blank"><img src="' + data[0]['img'] + '" /></a></td></tr>');
				} else {
					if ((len % 2) !== 0) {
						data.push({});
					}
					for (var i=0; i<len; i+=2) {
						tmpArr.push('<tr>');
						tmpArr.push('<td><a href="' + data[i]['url'] + '" target="_blank"><img src="' + data[i]['img'] + '" /></a></td>');
						if (data[i+1]['url']) {
							tmpArr.push('<td><a href="' + data[i+1]['url'] + '" target="_blank"><img src="' + data[i+1]['img'] + '" /></a></td>');
						} else {
							tmpArr.push('<td>&nbsp;</td>');
						}
						tmpArr.push('</tr>');
					}
				}
				source += '<table class="table table-bordered for-plan"><tbody>' + tmpArr.join('') + '</tbody></table>';
			}
			targetElem.html(source);
		}
	}
});
