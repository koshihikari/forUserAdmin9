

jQuery.noConflict();
jQuery(document).ready(function($){
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
		// ,_notEditedMessage				: 'このページはページ追加後、まだ編集されていません。'
		// ,_notLatestMessage				: 'このページは書きだした後に編集されています。最新版ではない可能性があります。'

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'render'
				,'add'
				,'remove'
				,'onChangeText'
				,'reset'
				,'refresh'
				,'onClickBulkPublishBtnHandler'
				,'setEvent'
				// ,'getPageListSource'
				// ,'getAddPageSource'
			);

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
			var prop = thisObj._instances['DataManager'].getData();
			var libraryPageModelName = prop['isLibraryElementPage'] === true ? 'smartphone_libraries' : 'smartphone_pages';
			/*
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
			*/


			for (var i=0,len=data.length; i<len; i++) {
				var fixedData = {
					'Library_Page'					: data[i][libraryPageModelName],
					'editedUser'					: data[i]['editedUser'],
					'publishedUser'					: data[i]['publishedUser'],
					'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data[i]['smartphone_concrete_pages'],
					'MtrStatus'						: data[i]['mtr_statuses']
				}
				$("#pageList2").append(thisObj.getPageListElement(fixedData, prop));
			}
			$("#pageList2").append($(_.template($('#li-add-btn-template').text(), {})));

			$(thisObj).trigger('onCompleteRender');
		}

		,getPageListElement: function(data, prop) {
			var thisObj = this;
			var editUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library/' : 'Page/') + 'edit/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'];
			var concreteQrUrl = '';
			var previewUrl = '';
			var residenceId = $('input[type="hidden"][name="residenceId"]').val();
			var cautionMessage = '';

			// console.log('PageManager :: getPageListElement');
			// console.log('	data');
			// console.log(data);
			// console.log('	prop');
			// console.log(prop);
		// ,_notEditedMessage				: 'このページはページ追加後、まだ編集されていません。'
		// ,_notLatestMessage				: 'このページは書きだした後に編集されています。最新版ではない可能性があります。'

			if (prop['isLibraryElementPage'] === false) {
				var pagePath = data['Library_Page']['path'].match(/^\//) !== null ? data['Library_Page']['path'] : '/' + data['Library_Page']['path'];
				pagePath = prop['residencePath'] === '' ? pagePath.replace(/^\//, '') : pagePath;
				pagePath = pagePath === '/' ? '' : pagePath;
				concreteQrUrl = prop['concreteUrl'] + prop['residencePath'] + pagePath;
				concreteQrUrl = pagePath === '' && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
				previewUrl = $('input[type="hidden"][name="previewUrl"]').val() + 's/' + residenceId + '/' + data['Library_Page']['id'] + '/';
				previewUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library' : 'Page') + '/preview/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'] + '/?' + new Date().getTime();
				// cautionMessage = data['Library_Page']['is_latest_page'] === false ? 'このページは書きだした後に編集されています。最新版ではない可能性があります。' : '';
				// cautionMessage = data['Library_Page']['is_latest_page'] === false ? thisObj._notLatestMessage : '';
			}
			// var isEdited = !isNaN(data['Library_Page']['edited_user_id'] - 0) && 0 < (data['Library_Page']['edited_user_id'] - 0) ? true : false;
			// var isPublished = !isNaN(data['Library_Page']['published_user_id'] - 0) && 0 < (data['Library_Page']['published_user_id'] - 0) ? true : false;
			// var editedUserName = isEdited ? data['Library_Page']['edited_user_name'] : '-----';
			// var edited = isEdited ? data['Library_Page']['edited'] : '-----'
			// var publishedUserName = isPublished ? data['Library_Page']['published_user_name'] : '-----';
			// var published = isPublished ? data['Library_Page']['published'] : '-----';

			var isEdited = data['editedUser']['id'] ? true : false
			var editedUserName = data['editedUser']['name'] ? data['editedUser']['name'] : '-----';
			var edited = isEdited ? data['Library_Page']['edited'] : '-----'

			var isPublished = data['publishedUser']['id'] ? true : false
			var publishedUserName = data['publishedUser']['name'] ? data['publishedUser']['name'] : '-----';
			var published = isPublished ? data['Library_Page']['published'] : '-----';

			if (data['Library_Page']['is_latest_page'] === false) {
				cautionMessage = 'このページは書きだした後に編集されています。最新版ではない可能性があります。';
				if (isEdited === false) {
					cautionMessage = 'このページはページ追加後、まだ編集されていません。';
				} else if (isPublished === false) {
					cautionMessage = 'このページはページ編集後、まだ書きだされていません。';
				}
			}
			var forTemplateData = {
				'recordId'				: data['Library_Page']['id'],
				'pageTitle'				: data['Library_Page']['title'],
				'editUrl'				: editUrl,
				'concreteQrUrl'			: concreteQrUrl,
				'previewUrl'			: previewUrl,
				'pagePath'				: data['Library_Page']['path'],
				'editedUserName'		: editedUserName,
				'edited'				: edited,
				'pubhlishedUserName'	: publishedUserName,
				'pubhlished'			: published,
				'cautionMessage'		: cautionMessage
			}
			return $(_.template($('#li-template').text(), forTemplateData));
		}
		/*
		 * 引数で受け取ったデータのエレメントを追加するメソッド
		 * @param	data			追加エレメント作成用データ
		 * @return	void
		 */
		,add: function(data) {
			var thisObj = this;
			var prop = thisObj._instances['DataManager'].getData();
			/*
			var targetElem = $('#pageList > li.createPage');
			var fixedData = {
				'Library_Page'			: prop['isLibraryElementPage'] === true ? data['smartphone_libraries'] : data['smartphone_pages'],
				'smartphoneConcretePages'			: prop['isLibraryElementPage'] === true ? {} : data['smartphone_concrete_pages'],
				'User'					: data['users'],
				'MtrStatus'				: data['mtr_statuses']
			}
			targetElem.before(thisObj.getPageListSource(fixedData, prop));

			var targetElem = $('#pageList2 > li.createPage');
			var fixedData = {
				'Library_Page'					: prop['isLibraryElementPage'] === true ? data['smartphone_libraries'] : data['smartphone_pages'],
				'User'							: data['users'],
				'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data['smartphone_concrete_pages'],
				'MtrStatus'						: data['mtr_statuses']
			}
			targetElem.before(thisObj.getPageListElement(fixedData, prop));
			*/


			var targetElem = $('#pageList2 > li.createPage');
			// for (var i=0,len=data.length; i<len; i++) {
				var fixedData = {
					'Library_Page'					: prop['isLibraryElementPage'] === true ? data[0]['smartphone_libraries'] : data[0]['smartphone_pages'],
					'editedUser'					: data[0]['editedUser'],
					'publishedUser'					: data[0]['publishedUser'],
					'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data[0]['smartphone_concrete_pages'],
					'MtrStatus'						: data[0]['mtr_statuses']
				}
				targetElem.before(thisObj.getPageListElement(fixedData, prop));
			// }

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
			$('[data-record-id="' + deletedRecordId + '"]').remove();
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
			if (thisObj._timers[name]) {
				clearInterval(thisObj._timers[name]);
			}
		}
		// ,setSortableTable: function() {
		// 	var thisObj = this;
		// 	console.log('テーブル開始');
		// 	// $('#pageList2').tableSort(
		// 	// 	{
		// 	// 		// animation : 'slideLeft', //動き fade, sort, fadeAll, slideLeft, slideLeftAll, none
		// 	// 		speed: 300, //ソート速度
		// 	// 		distance: '200px', //ソート時に動く距離
		// 	// 		delay: 50　//各要素間のずれ
		// 	// 	}
		// 	// );
		// 	console.log('テーブル完了');
		// }

		/*
		 * ページリストを更新するメソッド
		 * @param	data			更新元ページデータ
		 * @return	void
		 */
		,refresh: function(data) {
			var thisObj = this;
			var prop = thisObj._instances['DataManager'].getData();
			var libraryPageModelName = prop['isLibraryElementPage'] === true ? 'smartphone_libraries' : 'smartphone_pages';
			var taregetElement = $('#record-id_' + data[libraryPageModelName]['id']);
			taregetElement
				.find('input [name="title"]').val(data[libraryPageModelName]['title'])
			.end()
				.find('input [name="path"]').val(data[libraryPageModelName]['path'])
			.end()
				.find('.editor').text((data['editedUser']['name'] ? data['editedUser']['name'] : '-----'))
			.end()
				.find('.edited').text((data[libraryPageModelName]['edited'] ? data[libraryPageModelName]['edited'] : '-----'))
			.end()
				.find('.publisher').text((data['publishedUser']['name'] ? data['publishedUser']['name'] : '-----'))
			.end()
				.find('.published').text((data[libraryPageModelName]['published'] ? data[libraryPageModelName]['published'] : '-----'));

			if (data[libraryPageModelName]['is_latest_page'] === true) {
				taregetElement
					.removeClass('notLatest')
					.find('.caution').html('');
			} else {
				taregetElement
					.addClass('notLatest')
					.find('.caution').html(thisObj._notLatestMessage);
			}
		}

		,onClickBulkPublishBtnHandler: function(event) {
			var thisObj = this;

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
				$('#container')
					.on('click', '.bulkPublishBtn', thisObj.onClickBulkPublishBtnHandler);
				/*
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
					*/
				$("#pageList2")
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
				/*
				$("#pageList")
					.find('input[type="text"][name="pageTitle"]')
						.off('change')
						.off('focus')
						.off('blur')
					.end()
					.off('click', '.btn-page-duplicate')
					.off('click', '.btn-page-delete')
					.off('click', '.btn-page-create');
					*/

				$('[data-placement][data-original-title]').tooltip('destroy');
			}
		}

		/*
		 * ページリストエレメントのソースを定義するメソッド
		 * @param	data
		 * @return	void
		 */
		,DEL_getPageListSource: function(data, prop) {
			var thisObj = this;
			// console.log('data');
			// console.log(data);
			// console.log('prop');
			// console.log(prop);
			var editUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library/' : 'Page/') + 'edit/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'];


			var residenceId = $('input[type="hidden"][name="residenceId"]').val();
			if (prop['isLibraryElementPage'] === false) {
				var pagePath = data['Library_Page']['path'].match(/^\//) !== null ? data['Library_Page']['path'] : '/' + data['Library_Page']['path'];
				pagePath = prop['residencePath'] === '' ? pagePath.replace(/^\//, '') : pagePath;
				pagePath = pagePath === '/' ? '' : pagePath;
				var concreteQrUrl = prop['concreteUrl'] + prop['residencePath'] + pagePath;
				concreteQrUrl = pagePath === '' && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
				// console.log('concreteUrl = ' + concreteQrUrl);
				// console.log('concreteUrl = ' + prop['concreteUrl']);
				// console.log('residencePath = ' + prop['residencePath']);
				// console.log('pagePath = ' + pagePath);
				// console.log('source = ' + data['Library_Page']['source']);
				// console.log('');
				// console.log('-------');
				var previewUrl = $('input[type="hidden"][name="previewUrl"]').val() + 's/' + residenceId + '/' + data['Library_Page']['id'] + '/';
				previewUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library' : 'Page') + '/preview/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'] + '/?' + new Date().getTime();
			}

			var retSource = '\
				<li id="record-id_' + data['Library_Page']['id'] + '" class="' + (prop['isLibraryElementPage'] === false && data['Library_Page']['is_latest_page'] === false ? 'notLatest' : '') + '">\
					<input type="hidden" name="pageId" value="' + data['Library_Page']['id'] + '" />\
					<div>\
							<!--<div class="thumb">-->';
			/*
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
				if (data['Library_Page']['source'] !== '') {
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
							<dt>更新ユーザ</dt>\
							<dd class="editor">' + data['Library_Page']['edited_user_name'] + '</dd>\
							<dt>最終更新日時</dt>\
							<dd class="edited">' + (data['Library_Page']['edited'] === '' ? '-----' : data['Library_Page']['edited']) + '</dd>';
			if (prop['isLibraryElementPage'] === false) {
				retSource += '\
							<dt>書き出しユーザ</dt>\
							<dd class="publisher">' + data['Library_Page']['published_user_name'] + '</dd>\
							<dt>最終書き出し日時</dt>\
							<dd class="published">' + (data['Library_Page']['published'] === '' ? '-----' : data['Library_Page']['published']) + '</dd>\
							<dd class="caution">' + (data['Library_Page']['is_latest_page'] === false ? thisObj._notLatestMessage : '') + '</dd>';
			}
			retSource += '\
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
		,DEL_getAddPageSource: function() {
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
