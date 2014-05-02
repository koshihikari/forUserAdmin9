

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.catalog.onPcToSmartphone.PageManager');
	MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.PageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.PageManager.prototype = {
		_isEnabled						: false
		,_instances						: {}
		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(this, 'render', 'add', 'remove', 'onChangeText', 'reset', 'setEvent', 'getPageListSource', 'getAddPageSource');

			this._instances = {
				'DataManager'	: DataManager
			};
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @return	void
		 */
		,render: function(data) {
			var thisObj = this;
			// return;
			// var prop = thisObj._instances['DataManager'].getData('prop');
			var prop = thisObj._instances['DataManager'].getData();
			var libraryPageModelName = prop['isLibraryElementPage'] === true ? 'smartphone_libraries' : 'smartphone_pages';
			// for (var i=4,len=data.length; i<6; i++) {
			for (var i=0,len=data.length; i<len; i++) {
				var fixedData = {
					'Library_Page'					: data[i][libraryPageModelName],
					'User'							: data[i]['users'],
					'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data[i]['smartphone_concrete_pages'],
					'MtrStatus'						: data[i]['mtr_statuses']
				}
				$("#pageList").append(thisObj.getPageListSource(fixedData, prop));
			}
			$("#pageList").append(thisObj.getAddPageSource());
			$(thisObj).trigger('onCompleteRender');
		}

		/*
		 * 引数で受け取ったデータのエレメントを追加するメソッド
		 * @param	data			追加エレメント作成用データ
		 * @return	void
		 */
		,add: function(data) {
			var thisObj = this;
			var targetElem = $('#pageList > li.createPage');
			var prop = thisObj._instances['DataManager'].getData();
			var fixedData = {
				'Library_Page'			: prop['isLibraryElementPage'] === true ? data['smartphone_libraries'] : data['smartphone_pages'],
				'smartphoneConcretePages'			: prop['isLibraryElementPage'] === true ? {} : data['smartphone_concrete_pages'],
				'User'					: data['users'],
				'MtrStatus'				: data['mtr_statuses']
			}
			targetElem.before(thisObj.getPageListSource(fixedData, prop));
			$(thisObj).trigger('onCompleteAdd');
		}

		/*
		 * 引数で受け取ったレコードIDのエレメントを削除するメソッド
		 * @param	deletedRecordId			削除されたエレメントのレコードID
		 * @return	void
		 */
		,remove: function(deletedRecordId) {
			var thisObj = this;
			$("#record-id_" + deletedRecordId).remove();
			$(thisObj).trigger('onCompleteRemove');
		}

		/*
		 * input[type="text"]の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"address"===住所の値が変わった。"latitude"===緯度の値が変わった。"longitude"===経度の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var name = elem.attr('name');
			var currentVal = elem.val();
			var prevVal = elem.attr('data-prev-' + name);

			if (currentVal !== prevVal) {
			// if (currentVal !== prevVal && currentVal !== '') {
				// if (name === 'pageTitle') {
				// 	elem.attr('data-prev-title', currentVal);
				// } else {
				// 	elem.attr('data-prev-path', currentVal);
				// }
				// console.log('currentVal = ' + currentVal);
				// console.log('prevVal = ' + prevVal);
				elem.attr('data-prev-' + name, currentVal);
				var recordId = elem.attr('data-record-id');
				var prop = thisObj._instances['DataManager'].getData();
				thisObj._hasSaveData[name] = true;
				if (name === 'title') {
					thisObj._updateData['title'] = {id:recordId, title:currentVal, user_id:prop['userId']};
					if (thisObj._timers['title']) {
						clearTimeout(thisObj._timers['title']);
					}
					thisObj._timers['title'] = setTimeout(
						function(event) {
							if (thisObj._hasSaveData[name] === true) {
								$(thisObj).trigger('onChangeTitle', [thisObj._updateData['title']['id'], thisObj._updateData['title']['title']]);
								// $(thisObj).trigger('onChangecurrentVal', thisObj._updateData);
								thisObj.reset('title');
							}
						},
						3000
					);

				} else {
					thisObj._updateData['path'] = {id:recordId, path:currentVal, user_id:prop['userId']};
					if (thisObj._timers['path']) {
						clearTimeout(thisObj._timers['path']);
					}
					thisObj._timers['path'] = setTimeout(
						function(event) {
							if (thisObj._hasSaveData[name] === true) {
								$(thisObj).trigger('onChangePath', [thisObj._updateData['path']['id'], thisObj._updateData['path']['path']]);
								thisObj.reset('path');
							}
						},
						3000
					);
				}
			}
		}

		/*
		 * 保存するデータとタイマーをリセットするメソッド
		 * @param	void
		 * @return	void
		 */
		,reset: function(name) {
			var thisObj = this;
			thisObj._hasSaveData[name] = false;
			thisObj._updateData[name] = {};
			// for (var key in thisObj._timers[name]) {
				if (thisObj._timers[name]) {
					clearInterval(thisObj._timers[name]);
				}
			// }
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
				$("#pageList")
					.on('change', 'input[type="text"][name="title"]', function(event) {
						thisObj.onChangeText(event);
					})
					.on('focus', 'input[type="text"][name="title"]', function(event) {
						if (thisObj._timers['focusToTitle']) {
							clearInterval(thisObj._timers['focusToTitle']);
						}
						thisObj._timers['focusToTitle'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
					})
					.on('blur', 'input[type="text"][name="title"]', function(event) {
						// for (var key in thisObj._timers) {
							if (thisObj._timers['focusToTitle']) {
								clearInterval(thisObj._timers['focusToTitle']);
							}
						// }
						if (thisObj._hasSaveData['title'] === true) {
							$(thisObj).trigger('onChangeTitle', [thisObj._updateData['title']['id'], thisObj._updateData['title']['title']]);
							thisObj.reset('title');
						}
					})
					.on('change', 'input[type="text"][name="path"]', function(event) {
						thisObj.onChangeText(event);
					})
					.on('focus', 'input[type="text"][name="path"]', function(event) {
						if (thisObj._timers['focusToPath']) {
							clearInterval(thisObj._timers['focusToPath']);
						}
						thisObj._timers['focusToPath'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
					})
					.on('blur', 'input[type="text"][name="path"]', function(event) {
						if (thisObj._timers['focusToPath']) {
							clearInterval(thisObj._timers['focusToPath']);
						}
						if (thisObj._hasSaveData['path'] === true) {
							$(thisObj).trigger('onChangePath', [thisObj._updateData['path']['id'], thisObj._updateData['path']['path']]);
							thisObj.reset('path');
						}
					})
					.on('click', '.btn-page-duplicate', function(event) {
						$("div.tooltip").remove();
						var recordId = $(event.currentTarget).closest('li').attr('id').replace('record-id_', '');
						console.log('recordId = ' + recordId);
						$(thisObj).trigger('onClickDuplicateBtn', recordId);
						return false;
					})
					.on('click', '.btn-page-delete', function(event) {
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickDeleteBtn', $(this).attr('data-record-id'));
						return false;
					})
					.on('click', '.btn-page-create', function(event) {
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickCreateBtn')
						return false;
					})
					.on('click', '.btn-page-publish', function(event) {
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickPublishBtn', $(this).attr('data-record-id'))
						return false;
					});

				$('.dropdown-toggle').dropdown();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
				$("#pageList")
					.find('input[type="text"][name="pageTitle"]')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.off('click', '.btn-page-duplicate')
					.off('click', '.btn-page-delete')
					.off('click', '.btn-page-create');

				$('[data-placement][data-original-title]').tooltip('destroy');
			}
		}

		/*
		 * ページリストエレメントのソースを定義するメソッド
		 * @param	data
		 * @return	void
		 */
		,getPageListSource: function(data, prop) {
			var thisObj = this;
			// var prop = thisObj._instances['DataManager'].getData();
			// console.log('data');
			// console.log(data);
			// return;
			// console.log('prop');
			// console.log(prop);
			var editUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library/' : 'Page/') + 'edit/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'];


			// var url = $('input[type="hidden"][name="currentUrl"]').val();
			// url += 'Page/edit/s/' + data['Library_Page']['residence_id'] + '/' + data['Library_Page']['id'];
			var residenceId = $('input[type="hidden"][name="residenceId"]').val();
			// var concreteQrUrl = $('input[type="hidden"][name="previewUrl"]').val() + 's/' + residenceId + '/' + data['Library_Page']['id'] + '/';
			if (prop['isLibraryElementPage'] === false) {
				var pagePath = data['Library_Page']['path'].match(/^\//) !== null ? data['Library_Page']['path'] : '/' + data['Library_Page']['path'];
				pagePath = prop['residencePath'] === '' ? pagePath.replace(/^\//, '') : pagePath;
				pagePath = pagePath === '/' ? '' : pagePath;
				var concreteQrUrl = prop['concreteUrl'] + prop['residencePath'] + pagePath;
				concreteQrUrl = pagePath === '' && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
				// concreteQrUrl = concreteQrUrl !== null && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
				console.log('concreteUrl = ' + concreteQrUrl);
				console.log('concreteUrl = ' + prop['concreteUrl']);
				console.log('residencePath = ' + prop['residencePath']);
				console.log('pagePath = ' + pagePath);
				console.log('');
				// concreteQrUrl = null;
				// var concreteQrUrl = data['Library_Page']['url'];
				// console.log('-------');
				// console.log("data['Library_Page']['path'] = " + data['Library_Page']['path']);
				// console.log('pagePath = ' + pagePath);
				// console.log('-------');
				var previewUrl = $('input[type="hidden"][name="previewUrl"]').val() + 's/' + residenceId + '/' + data['Library_Page']['id'] + '/';
				// data['smartphoneConcretePages']['id'] = null;
				previewUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library' : 'Page') + '/preview/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'] + '/?' + new Date().getTime();
				// previewUrl = 'http://www.prime-x.co.jp';
				// var pageSource = data['smartphoneConcretePages']['source'] ? data['smartphoneConcretePages']['source'] : '';
			}

			var retSource = '\
				<li id="record-id_' + data['Library_Page']['id'] + '">\
					<input type="hidden" name="pageId" value="' + data['Library_Page']['id'] + '" />\
					<div>';
					/*
					<div>\
							<div class="thumb">';
			if (prop['isLibraryElementPage'] === false) {
				if (concreteQrUrl !== null) {
					retSource += '\
									<iframe src="' + concreteQrUrl + '"></iframe>\
					';
				} else {
					retSource += '\
									<div class="no_source"></div>\
					';
				}
			}
			retSource += '\
							</div>';
			if (prop['isLibraryElementPage'] === true) {
				retSource += '<div class="cover"></div>';
			}
			*/
			retSource += '\
						<input type="text" name="title" value="' + data['Library_Page']['title'] + '" data-record-id="' + data['Library_Page']['id'] + '" data-prev-title="' + data['Library_Page']['title'] + '" />';

			if (prop['isLibraryElementPage'] === false) {
				retSource += '\
						<input type="text" name="path" value="' + data['Library_Page']['path'] + '" data-record-id="' + data['Library_Page']['id'] + '" data-prev-path="' + data['Library_Page']['path'] + '" />';
			}
			retSource += '\
					<div class="btn-hole">\
						<a href="' + editUrl + '" class="btn btn-primary btn-page-edit"\
							data-placement="top" data-original-title="「' + data['Library_Page']['title'] + '」ページを編集します。">\
							<span><i data-icon=""></i>編集する</span>\
						</a>';
			retSource += '\
						<button class="btn btn-primary btn-page-duplicate btn-disable"\
							data-placement="top" data-original-title="「' + data['Library_Page']['title'] + '」ページを複製します。">\
							<span><i data-icon=""></i>複製する</span>\
						</button>\
						<button class="btn btn-danger btn-page-delete" data-record-id="' + data['Library_Page']['id'] + '"\
							data-placement="bottom" data-original-title="「' + data['Library_Page']['title'] + '」ページを削除します。">\
							<span><i data-icon=""></i>削除する</span>\
						</button><br />';

			if (prop['isLibraryElementPage'] === false) {
				retSource += '\
							<div class="dropdownWrapper">\
								<button id="dropdown_' + data['Library_Page']['id'] + '" class="btn btn-primary btn-page-view dropdown-toggle btn-block" data-record-id="' + data['Library_Page']['id'] + '" \
									data-placement="bottom" data-original-title="プレビュー版：：「' + data['Library_Page']['title'] + '」ページを表示します。" \
									data-toggle="dropdown"><span><i data-icon=""></i>プレビューページ表示</span></button>\
								<ul class="dropdown-menu" role="menu" aria-labelledby="dropdown_' + data['Library_Page']['id'] + '">\
									<li>\
										<a href="' + previewUrl + '" target="_blank">' + data['Library_Page']['title'] + '</a>\
									</li>\
									<li>\
										<img src="http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=' + previewUrl + '" width="150" height="150" alt="' + data['Library_Page']['title'] + '"/>\
									</li>\
								</ul>\
							</div>\
							<button class="btn btn-primary btn-page-publish btn-disablea" data-record-id="' + data['Library_Page']['id'] + '"\
								data-placement="bottom" data-original-title="「' + data['Library_Page']['title'] + '」ページを書きだします。">\
								<span><i data-icon=""></i>本番ページ書き出し</span>\
							</button><br />';
				if (concreteQrUrl !== null) {
					retSource += '\
							<div class="dropdownWrapper">\
								<button id="dropdown_' + data['Library_Page']['id'] + '" class="btn btn-primary btn-page-view dropdown-toggle btn-block" data-record-id="' + data['Library_Page']['id'] + '" \
									data-placement="bottom" data-original-title="本番：：「' + data['Library_Page']['title'] + '」ページを表示します。" \
									data-toggle="dropdown"><span><i data-icon=""></i>本番ページ表示</span></button>\
								<ul class="dropdown-menu" role="menu" aria-labelledby="dropdown_' + data['Library_Page']['id'] + '">\
									<li>\
										<a href="' + concreteQrUrl + '" target="_blank">' + data['Library_Page']['title'] + '</a>\
									</li>\
									<li>\
										<img src="http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=' + concreteQrUrl + '" width="150" height="150" alt="' + data['Library_Page']['title'] + '"/>\
									</li>\
								</ul>\
							</div>';

				} else {
					retSource += '\
							<div class="dropdownWrapper">\
								<button id="dropdown_' + data['Library_Page']['id'] + '" class="btn  btn-page-view dropdown-toggle btn-disable btn-block" data-record-id="' + data['Library_Page']['id'] + '"><span><i data-icon=""></i>本番ページ表示</span></button>\
							</div>';
				}
			}
			retSource += '\
						</div>\
						<dl>\
							<dt>ステータス</dt>\
							<dd>' + data['MtrStatus']['name'] + '</dd>\
							<dt>更新者</dt>\
							<dd>' + data['User']['name'] + '</dd>\
							<dt>最終更新日時</dt>\
							<dd>' + data['Library_Page']['modified'].replace(' ', '<br />') + '</dd>\
						</dl>\
					</div>\
				</li>\
			';

			return $(retSource);
		}

		/*
		 * ページリストエレメントのソースを定義するメソッド
		 * @param	data
		 * @return	void
		 */
		,getAddPageSource: function() {
			var thisObj = this;
			return $('\
				<li class="createPage">\
					<div><i class="btn-page-create" data-placement="bottom" data-original-title="ページを追加します" data-icon=""></i></div>\
					<!--\
					<div><button class="btn-page-create" data-placement="bottom" data-original-title="ページを追加します"><i data-icon=""></i></button></div>\
					-->\
				</li>\
			');
		}
	}
});
