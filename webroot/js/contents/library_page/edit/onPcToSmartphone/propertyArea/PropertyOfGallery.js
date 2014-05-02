

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示するギャラリープロパティ管理クラス
	 * eventName
	 */
	MYNAMESPACE.namespace('modules.PropertyOfGallery');
	MYNAMESPACE.modules.PropertyOfGallery = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfGallery.prototype = {
		_isEnabled						: false
		,_hasSaveData					: false
		,_isChangeSlideOnProgram		: false
		,_isChangedContents				: false
		,_eventArr						: []
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_timerId						: null
		,_currentVal					: {}
		// ,_methodObj						: {}

		/*
		 * コンストラクタ
		 * @param	id 		プロパティを表示するエレメントのID
		 * @return	void
		 */
		,initialize: function(instances, id) {
		// ,initialize: function(id, methodObj) {
			var thisObj = this;
			console.log('0');
			_.bindAll(
				this
				,'getElem'
				,'getProperty'
				,'createElement'
				,'refreshStyle'
				,'setSortable'
				,'onChangeSlider'
				,'onChangeText'
				,'onChangeRadioButtonHandler'
				,'onChangeCheckboxHandler'
				,'onClickDelButtonHandler'
				// ,'open'
				,'setEvent'
			);

			// this._targetId = id;
			// this._methodObj = methodObj;
			// var propertyElement = this.createElement(id);
			this._targetId = id;
			this._elementType = 'Gallery';
			this._instances = instances;
			this._instances['Util'] = new MYNAMESPACE.modules.helper.Util();
			this._instances['InsertImageModalManager'] = new MYNAMESPACE.modules.InsertImageModalManager('modal-' + new Date().getTime(), {'ignoreWhitespace':false});
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'			: propertyElement,
				'slideshowSpeedInput'		: propertyElement.find(".slideshowSpeedWrapper input[type='text']"),
				'animationSpeedInput'		: propertyElement.find(".animationSpeedWrapper input[type='text']")
			}
			this.setSortable();
	// 		console.log('9');
	// var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
	// console.log(allElementDataObj);
		//	this.attachEvent();
		//	this.refreshStyle();
		}

		/*
		 * このクラスが管理するエレメント返すメソッド
		 * @param	void
		 * @return	このクラスが管理するエレメント
		 */
		,getElem: function() {
			var thisObj = this;
			return thisObj._elems['propertyElement'];
		}

		/*
		 * このクラスが管理するエレメントのプロパティを返すメソッド
		 * @param	void
		 * @return	このクラスが管理するエレメントのプロパティ
		 */
		,getProperty: function() {
			var thisObj = this;
			return {key:thisObj._elementType, val:thisObj._currentVal};
		}

		/*
		 * このクラスが管理するエレメントを作成し、作成したエレメントを返すメソッド
		 * @param	id 		このクラスが管理するエレメントのコンてナのID
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id) {
			var thisObj = this;
			var elem				= $("#" + id);
			var targetElem				= $("#" + thisObj._targetId).find('> .gallery');
			// var animationType			= targetElem.attr('data-animation') === 'slide' ? 'slide' : 'fade';
			// var isAutoPlay				= targetElem.attr('data-slideshow') === 'false' ? false : true;
			// var isLoopPlay				= targetElem.attr('data-animation-loop') === 'false' ? false : true;
			// var slideshowSpeed			= !isNaN(targetElem.attr('data-slideshow-speed') - 0) ? targetElem.attr('data-slideshow-speed') - 0 : 5;
			// var animationSpeed			= !isNaN(targetElem.attr('data-animation-speed') - 0) ? targetElem.attr('data-animation-speed') - 0 : 1;
			// var animationType			= 'fade';
			// var isAutoPlay				= false;
			// var isLoopPlay				= true;
			// var slideshowSpeed			= 5;
			// var animationSpeed			= 1;

			console.log('---------------------');
			console.log('PropertyOfGallery :: createElement :: bigin');
			console.log('	thisObj._currentVal');
			console.log(thisObj._currentVal);
			console.log('---------------------');

			var prop = {
				'slideshowSpeed'		: {
					'min'			: 1,
					'max'			: 15
				},
				'animationSpeed'	: {
					'min'			: 0.1,
					'max'			: 5
				}
			}
			// thisObj._currentVal = {
			// 	'animationType'					: animationType,
			// 	'isAutoPlay'					: isAutoPlay,
			// 	'isLoopPlay'					: isLoopPlay,
			// 	'slideshowSpeed'				: slideshowSpeed,
			// 	'animationSpeed'				: animationSpeed
			// }

			var images = [];
			var images = thisObj._currentVal['contents'];
			// $("#" + thisObj._targetId + ' .flexslider > ul > li > img').each(function(i) {
			// 	images.push($(this).attr('src'));
			// });

			var source = '\
						<div class="propertyElement forGalleryElement">\
							<p class="elementTitle">ギャラリー</p>\
							<div class="contentWrapper">\
								<div class="imagesWrapper">\
									<div class="control-group">\
										<label class="control-label">ギャラリーに表示する画像</label>\
										<button class="btn btn-primary add-image-btn"><span><i data-icon=""></i>画像を追加する</span></button>\
										<div class="controls">\
											<ul class="clearfix">';
				for (var i=0, len=images.length; i<len; i++) {
					source += '\
						<li>\
							<img src="' + images[i] + '" />\
							<button type="button" class="btn btn-danger del-btn" data-placement="bottom" data-original-title="クリックするとこの画像をギャラリーから削除します。"><span><i data-icon=""></i>削除</span></button>\
						</li>\
					';
				}
				source += '\
											</ul>\
										</div>\
									</div>\
								</div>\
								<div class="animationTypeWrapper">\
									<div class="control-group">\
										<label class="control-label">アニメーションタイプ</label>\
										<div class="controls">\
											<div class="btn-hole">\
												<div class="btn-group" data-toggle="buttons-radio">\
													<button type="button" class="btn btn-primary isFade' + (thisObj._currentVal['animationType'] === 'fade' ? ' active' : '') + '" data-item-name="fade" data-placement="bottom" data-original-title="フェードアニメーションで写真を切り替えます"><span><i data-icon=""></i>フェード</span></button>\
													<button type="button" class="btn btn-primary isSlide' + (thisObj._currentVal['animationType'] === 'slide' ? ' active' : '') + '" data-item-name="slide" data-placement="bottom" data-original-title="スライドアニメーションで写真を切り替えます"><span><i data-icon=""></i>スライド</span></button>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="playOptionWrapper">\
									<div class="control-group">\
										<label class="control-label">再生オプション</label>\
										<div class="controls">\
											<div class="btn-hole">\
												<div class="btn-group" data-toggle="buttons-checkbox">\
													<button type="button" class="btn btn-primary isAutoPlay' + (thisObj._currentVal['isAutoPlay'] === true ? ' active' : '') + '" data-item-name="isAutoPlay" data-placement="bottom" data-original-title="ギャラリー表示時に写真を自動で再生させます。"><span><i data-icon=""></i>自動再生させる</span></button>\
													<button type="button" class="btn btn-primary isLoopPlay' + (thisObj._currentVal['isLoopPlay'] === true ? ' active' : '') + '" data-item-name="isLoopPlay" data-placement="bottom" data-original-title="写真の表示をループさせます。最後の写真の次には最初の写真が表示されます。"><span><i data-icon=""></i>ループ再生させる</span></button>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="slideshowSpeedWrapper">\
									<div class="control-group">\
										<label class="control-label">写真を表示する秒数</label>\
										<div class="controls">\
											<div class="box">\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['slideshowSpeed'] + '" data-item-name="slideshowSpeed" data-min="' + prop['slideshowSpeed']['min'] + '" data-max="' + prop['slideshowSpeed']['max'] + '"/>\
												<span class="unit">秒</span>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="animationSpeedWrapper">\
									<div class="control-group">\
										<label class="control-label">アニメーションにかかる秒数</label>\
										<div class="controls">\
											<div class="box">\
												<div class="sliderWrapper">\
													<div class="slider"></div>\
												</div>\
												<input type="text" value="' + thisObj._currentVal['animationSpeed'] + '" data-item-name="animationSpeed" data-min="' + prop['animationSpeed']['min'] + '" data-max="' + prop['animationSpeed']['max'] + '"/>\
												<span class="unit">秒</span>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';

			var elem = $(source);

			elem
				.find(".slideshowSpeedWrapper .slider").slider(
					{
						range	: 'min',
						min		: prop['slideshowSpeed']['min'],
						max		: prop['slideshowSpeed']['max'],
						step	: 0.5,
						value	: thisObj._currentVal['slideshowSpeed'],
						slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'slideshowSpeed');},
						stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'slideshowSpeed');}
					}
				)
				.end()
				.find(".animationSpeedWrapper .slider").slider(
					{
						range	: 'min',
						min		: prop['animationSpeed']['min'],
						max		: prop['animationSpeed']['max'],
						step	: 0.1,
						value	: thisObj._currentVal['animationSpeed'],
						slide	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'animationSpeed');},
						stop	: function(event, ui) {thisObj.onChangeSlider(event, ui, 'animationSpeed');}
					}
				);

				var modla = '\
					<div id="responsive" class="modal hide fade" tabindex="-1" data-width="760">\
						<div class="modal-header">\
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
							<h3>ギャラリー用画像追加</h3>\
						</div>\
						<div class="modal-body">\
							<div class="row-fluid">\
								<div class="span12">\
									<h4>画像ファイルパス</h4>\
									<p><input type="text" class="span12" value=""></p>\
								</div>\
							</div>\
						</div>\
						<div class="modal-footer">\
							<button type="button" data-dismiss="modal" class="btn"><i data-icon=""></i>キャンセル</span></button>\
							<button type="button" class="btn btn-primary"><span><i data-icon=""></i>追加</span></button>\
						</div>\
					</div>\
				';
				$('body').append(modla);
			return elem;
		}

		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			/*
			var targetElem = $("#" + thisObj._targetId);
			var images = [];
			thisObj._elems['propertyElement'].find('.imagesWrapper ul > li > img').each(function(i) {
				images.push($(this).attr('src'));
			});
			console.log(images);
			var params = {
					smoothHeight			: true,
					animation				: thisObj._currentVal['animationType'],
					nakedSlideshowSpeed		: thisObj._currentVal['slideshowSpeed'],
					slideshowSpeed			: (thisObj._currentVal['slideshowSpeed'] + thisObj._currentVal['animationSpeed']) * 1000,
					nakedAnimationSpeed		: thisObj._currentVal['animationSpeed'],
					animationSpeed			: thisObj._currentVal['animationSpeed'] * 1000,
					animationLoop			: thisObj._currentVal['isLoopPlay'],
					slideshow				: thisObj._currentVal['isAutoPlay']
			}
			var PreviewAreaElementSourceManager = new MYNAMESPACE.modules.PreviewAreaElementSourceManager();
			var obj = PreviewAreaElementSourceManager.getSource('gallery', {images:images, params:params});
			targetElem
				.find('> .gallery')
					.remove()
				.end()
				.append(obj['source']);

			$('.flexslider', targetElem).flexslider(params);
			*/
			// $('.flexslider', targetElem).flexslider(
			// 	{
			// 		smoothHeight		: true,
			// 		animation			: thisObj._currentVal['animationType'],
			// 		slideshowSpeed		: (thisObj._currentVal['slideshowSpeed'] + thisObj._currentVal['animationSpeed']) * 1000,
			// 		animationSpeed		: thisObj._currentVal['animationSpeed'] * 1000,
			// 		animationLoop		: thisObj._currentVal['isLoopPlay'],
			// 		slideshow			: thisObj._currentVal['isAutoPlay']
			// 	}
			// );
			// thisObj._methodObj['onRefreshPrevElements'](thisObj._targetId, isEnforcement);

			if (thisObj._isChangedContents === true) {
				var source = '';
				for (var i=0, len=thisObj._currentVal['contents'].length; i<len; i++) {
					source += '\
						<li>\
							<img src="' + thisObj._currentVal['contents'][i] + '" />\
							<button type="button" class="btn btn-danger delBtn" data-placement="bottom" data-original-title="クリックするとこの画像をギャラリーから削除します。"><span><i data-icon=""></i>削除</span></button>\
						</li>\
					';
				}
				thisObj._elems['propertyElement']
					.find('.imagesWrapper ul')
					.find('> *')
					.remove()
					.end()
					.append(source);
				thisObj._isChangedContents = false;
			}

			var selector = ['slideshowSpeed', 'animationSpeed'];
			for (var i=0,len=selector.length; i<len; i++) {
				thisObj._isChangeSlideOnProgram = true;
				var wrapperElem = thisObj._elems['propertyElement'].find('.' + selector[i] + 'Wrapper');
				wrapperElem
					.find('.slider')
						.slider('value', thisObj._currentVal[selector[i]])
					.end()
					.find('input[data-item-name="' + selector[i] + '"]')
						.val(thisObj._currentVal[selector[i]]);
			}

	// var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
	// console.log(allElementDataObj);
	// console.log('開始');
			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
	// console.log('終了');
			if (isEnforcement === true) {
				console.log('ギャラリーデータ保存');
				for (var key in thisObj._currentVal) {
					console.log('	thisObj._currentVal[' + key + '] = ' + thisObj._currentVal[key]);
				}
	// var allElementDataObj = thisObj._instances['DataManager'].getAllElementDataObj();
	// console.log(allElementDataObj);
				thisObj._hasSaveData = false;
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * ギャラリーに表示する画像のsortableをセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,setSortable: function(isSet) {
			var thisObj = this;

			thisObj._elems['propertyElement'].find('.imagesWrapper ul').sortable(
				{
					forceHelperSize			: true,
					forcePlaceholderSize	: true,
					tolerance				: 'pointer',
					placeholder				: 'placeholder',
					update					: function(event, ui) {
						var arr = [];
						thisObj._elems['propertyElement'].find('.imagesWrapper ul > li > img').each(function(i) {
							console.log($(this).attr('src'));
							arr.push($(this).attr('src'));
						})
						thisObj._currentVal['contents'] = arr;
						thisObj._hasSaveData = true;
						thisObj.refreshStyle(true);
					}
				}
			).sortable('disable');
		}

		/*
		 * 写真を表示する秒数/アニメーションにかかる秒数スライダーが動かされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	ui			{handle, value, values}を持つオブジェクト
		 * @param	type		"slideshowSpeed"===写真を表示する秒数スライダーが動かされた。"animationSpeed"===アニメーションにかかる秒数スライダーが動かされた。
		 * @return	void
		 */
		,onChangeSlider: function(event, ui, type) {
			var thisObj = this;
			var val = ui.value;
			thisObj._currentVal[type] = val;

			thisObj._eventArr.unshift(event.type);
			if (2 < thisObj._eventArr.length) {
				thisObj._eventArr.pop();
			}
			// console.log('onChangeSlider :: val = ' + val);
			// console.log('	._eventArr[1] === slide = ' + (thisObj._eventArr[1] === 'slide'));
			// console.log('	._eventArr[0] === slidestop = ' + (thisObj._eventArr[0] === 'slidestop'));
			thisObj._hasSaveData = thisObj._eventArr[1] === 'slide' && thisObj._eventArr[0] === 'slidestop' ? true : false;
			if (thisObj._isChangeSlideOnProgram === false) {
				thisObj.refreshStyle(thisObj._hasSaveData);
			}
			thisObj._isChangeSlideOnProgram = false;

			// thisObj._hasSaveData = true;
			// thisObj.refreshStyle(true);
		}

		/*
		 * 写真を表示する秒数/アニメーションにかかる秒数の値が変わった時にコールされるメソッド
		 * @param	type		"slideshowSpeed"===写真を表示する秒数の値が変わった。"animationSpeed"===アニメーションにかかる秒数の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(type) {
			var thisObj = this;
			// var val = thisObj._elems[type + 'Input'].val() - 0;
			// var min = thisObj._elems[type + 'Input'].attr('data-min') - 0;
			// var max = thisObj._elems[type + 'Input'].attr('data-max') - 0;
			// if (min <= val && val <= max && thisObj._currentVal[type] !== val) {
			// 	thisObj._instances['slider'][type + 'Slider'].slider('value', val);
			// 	thisObj._currentVal[type] = val;
			// 	thisObj.refreshStyle(true);
			// }
		}

		/*
		 * フェード/スライドのラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeRadioButtonHandler: function(event) {
			var thisObj = this;
			thisObj._currentVal['animationType'] = $(event.currentTarget).attr('data-item-name');
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * 自動再生させる/ループ再生させるの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeCheckboxHandler: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var checked = elem.hasClass('active') ? false : true;
			thisObj._currentVal[itemName] = checked;
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * 削除ボタン押下時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickDelButtonHandler: function(event) {
			var thisObj = this;
			var ulElement = $(event.currentTarget).closest('ul');
			var liElement = $(event.currentTarget).closest('li');
			var index = ulElement.children().index(liElement);
			liElement.remove();
			$("div.tooltip").remove();
			thisObj._currentVal['contents'].splice(index, 1);
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				thisObj._elems['propertyElement']
					.on('click', '[data-toggle="buttons-radio"] > .btn', thisObj.onChangeRadioButtonHandler)
					.on('click', '[data-toggle="buttons-checkbox"] > .btn', thisObj.onChangeCheckboxHandler)
					.on('click', '.imagesWrapper .delBtn', thisObj.onClickDelButtonHandler)
					.on('click', '.add-image-btn', function(event) {
						thisObj._instances['InsertImageModalManager'].open({imagePath:''});
					})

				$(thisObj._instances['InsertImageModalManager'])
					.on('onAssignmentImage', function(event, val) {
						thisObj._currentVal['contents'].push(val);
						thisObj._isChangedContents = true;
						thisObj._hasSaveData = true;
						thisObj.refreshStyle(true);
					});

				thisObj._elems['propertyElement'].find('.imagesWrapper ul').sortable('enable');
			/*

				thisObj._elems['propertyElement']
					.find('.imagesWrapper .delBtn')
						.on('click', function(event) {
							$(this).parent().remove();
							$(".tooltip").remove();
							thisObj.refreshStyle();
						})
					.end()
					.find('div[data-toggle="buttons-checkbox"] > .btn')
						.on('click', function(event) {
							thisObj.onCheckHandler(event);
						})
					.end()
					.find('div[data-toggle="buttons-radio"] > .btn')
						.on('click', function(event) {
							thisObj.onClickRadioButton(event);
						});

				thisObj._elems['slideshowSpeedInput']
					.on('change', function(event) {
						thisObj.onChangeText('slideshowSpeed');
					})
					.on('focus', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event) {thisObj.onChangeText('slideshowSpeed');}, 100);
					})
					.on('blur', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						var elem = $(this);
						var val = elem.val() - 0;
						var min = elem.attr('data-min') - 0;
						var max = elem.attr('data-max') - 0;
						if (!val || val < min || max < val) {
							elem.val(thisObj._currentVal['slideshowSpeed']);
							thisObj._instances['slider']['slideshowSpeedSlider'].slider('value', thisObj._currentVal['slideshowSpeed']);
						}
					});

				thisObj._elems['animationSpeedInput']
					.on('change', function(event) {
						thisObj.onChangeText('animationSpeed');
						return false;
					})
					.on('focus', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						thisObj._timerId = setInterval(function(event) {thisObj.onChangeText('animationSpeed');}, 100);
					})
					.on('blur', function(event) {
						if (thisObj._timerId) {
							clearInterval(thisObj._timerId);
						}
						var elem = $(this);
						var val = elem.val() - 0;
						var min = elem.attr('data-min') - 0;
						var max = elem.attr('data-max') - 0;
						if (!val || val < min || max < val) {
							elem.val(thisObj._currentVal['animationSpeed']);
							thisObj._instances['slider']['animationSpeedSlider'].slider('value', thisObj._currentVal['animationSpeed']);
						}
					});

				for (var key in thisObj._instances['slider']) {
					thisObj._instances['slider'][key].slider('enable');
				}

				$(thisObj._instances['imageDropper'])
					.on('onErrorOverSupportFileNum', function(event, droppedFileNum) {
						var title = 'ドロップされたファイルが多すぎます。';
						var message = droppedFileNum + '個のファイルがドロップされました。<br />一度にドロップできるのは1つだけです。';
						thisObj.open(title, message, false);
					})
					.on('onErrorDifferentFileType', function(event, droppedFileExt) {
						var title = '画像以外のファイルがドロップされました。';
						var message = droppedFileExt + 'ファイルがドロップされました。<br />ドロップできるのは画像ファイル(拡張子jpg、jpeg、gif、png)だけです。';
						thisObj.open(title, message, false);
					})
					.on('onErrorOverFileSize', function(event, droppedFileSize) {
						var title = 'ドロップされたファイルサイズが大きすぎます。';
						var message = 'ファイルサイズが' + (droppedFileSize / 1000) + 'KBのファイルがドロップされました。<br />ファイルサイズは100KBまでにしてください。';
						thisObj.open(title, message, false);
					})
					.on('onDropFile', function(event, droppedFile) {
						console.log('追加可能');
						console.log(droppedFile);
					//	FRKManager.parse(droppedFile);
					});
				thisObj._instances['imageDropper'].setEvent(true);

				$("#fileUploaderModal")
					.on('click', '.closeBtn', function(event) {
						$("#fileUploaderModal").trigger('reveal:close');
						return;
					});
*/

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

/*
				thisObj._elems['propertyElement']
					.find('.imagesWrapper .delBtn')
						.off('click')
					.end()
					.find('div[data-toggle="buttons-checkbox"] > .btn')
						.off('click')
					.end()
					.find('div[data-toggle="buttons-radio"] > .btn')
						.off('click');

				thisObj._elems['slideshowSpeedInput']
					.off('change')
					.off('focus')
					.off('blur');

				thisObj._elems['animationSpeedInput']
					.off('change')
					.off('focus')
					.off('blur');

				for (var key in thisObj._instances['slider']) {
					thisObj._instances['slider'][key].slider('disable');
				}

				$(thisObj._instances['imageDropper'])
					.off('onErrorOverSupportFileNum')
					.off('onErrorDifferentFileType')
					.off('onErrorOverFileSize')
					.off('onDropFile');
				thisObj._instances['imageDropper'].setEvent(false);

				$("#fileUploaderModal")
					.off('click');
		*/
			}
		}
	}
});
