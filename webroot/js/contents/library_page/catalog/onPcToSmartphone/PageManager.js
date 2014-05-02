

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
		,_isOnceEventEnabled			: false
		,_instances						: {}
		,_timers						: {}
		,_updateData					: {}
		,_hasSaveData					: {}
		,_currentDirectoryIndex			: 0

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'setLibraryListElement'
				,'setActiveDirectory'
				,'render'
				,'add'
				,'remove'
				,'onChangeText'
				,'reset'
				,'refresh'
				,'onClickBulkPublishBtnHandler'
				,'onResizeWindow'
				,'setOnceEvent'
				,'setEvent'
			);

			this._instances = {
				'DataManager'	: DataManager
			};
			this.setOnceEvent();
			$(window).trigger('resize');
			// this.onResizeWindow();
		}

		/*
		 * ライブラリエレメントを画面に配置する目sッド
		 * @param	data		ライブラリエレメントデータ
		 * @param	prop		プロパティデータ
		 * @return	void
		 */
		,setLibraryListElement: function(data, prop) {
			var thisObj = this;

			for (var i=0,len=data.length; i<len; i++) {
				var forDirectoryTemplateData = {
					'directoryId'				: data[i]['smartphone_library_directories']['id'],
					'directoryName'				: data[i]['smartphone_library_directories']['name']
				}
				$('#directories > ul').append($(_.template($('#directory-template').text(), forDirectoryTemplateData)));

				var libraryContainerElement = $(_.template($('#library-container-template').text(), forDirectoryTemplateData));
				$('#libraries > ul').append(libraryContainerElement);

				for (var j=0,len2=data[i]['smartphone_libraries'].length; j<len2; j++) {
					var forLibraryTemplateData = {
						'libraryId'				: data[i]['smartphone_libraries'][j]['id'],
						'libraryName'			: data[i]['smartphone_libraries'][j]['title'],
						'editPageUrl'			: '#',
						'editedUserName'		: data[i]['smartphone_libraries'][j]['edited_user_name'],
						'edited'				: data[i]['smartphone_libraries'][j]['edited']
					}

					var libraryElement = $(_.template($('#library-template').text(), forLibraryTemplateData));
					libraryContainerElement.find('>ul').append(libraryElement);
				}
			}
		}

		/*
		 * 指定されたインデックスのディレクトリをアクティブにするメソッド
		 * @param	index			アクティブにするディレクトリのインデックス
		 * @return	void
		 */
		,setActiveDirectory: function(index) {
			var thisObj = this;
			$('#directories > ul > li').removeClass('current').eq(index).addClass('current');
			$('#libraries > ul > li').removeClass('current').eq(index).addClass('current');
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @return	void
		 */
		,render: function(data) {
			var thisObj = this;
			console.log(data);
			var prop = thisObj._instances['DataManager'].getData();

			if (prop['isLibraryElementPage'] === true) {
				thisObj.setLibraryListElement(data, prop);
				thisObj.setActiveDirectory(thisObj._currentDirectoryIndex);

			} else {
				// var libraryPageModelName = prop['isLibraryElementPage'] === true ? 'smartphone_libraries' : 'smartphone_pages';

				for (var i=0,len=data.length; i<len; i++) {
					var fixedData = {
						'Library_Page'					: data[i]['smartphone_pages'],
						'users'							: data[i]['users'],
						'editedUser'					: data[i]['editedUser'],
						'publishedUser'					: data[i]['publishedUser'],
						'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data[i]['smartphone_concrete_pages'],
						'MtrStatus'						: data[i]['mtr_statuses']
					}
					$("#pageList2").append(thisObj.getPageListElement(fixedData, prop));
				}
				$("#pageList2").append($(_.template($('#li-add-btn-template').text(), {})));
			}

			$(thisObj).trigger('onCompleteRender');
		}

		,getPageListElement: function(data, prop) {
			var thisObj = this;
			// var editUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library/' : 'Page/') + 'edit/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'];
			var editUrl = prop['currentUrl'] + 'Page/edit/s/' + data['Library_Page']['id'];
			var concreteQrUrl = '';
			var previewUrl = '';
			var residenceId = $('input[type="hidden"][name="residenceId"]').val();
			var cautionMessage = '';
			var isEdited = false;
			var editedUserName = '';
			var edited = '';
			var isPublished = false;
			var publishedUserName = '';
			var published = '';

			if (prop['isLibraryElementPage'] === true) {
				editedUserName = data['users']['name'] ? data['users']['name'] : '-----';
				edited = data['Library_Page']['edited'] !== '' ? data['Library_Page']['edited'] : '-----';
			} else {
				var pagePath = data['Library_Page']['path'].match(/^\//) !== null ? data['Library_Page']['path'] : '/' + data['Library_Page']['path'];
				pagePath = prop['residencePath'] === '' ? pagePath.replace(/^\//, '') : pagePath;
				pagePath = pagePath === '/' ? '' : pagePath;
				concreteQrUrl = prop['concreteUrl'] + prop['residencePath'] + pagePath;
				concreteQrUrl = pagePath === '' && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
				previewUrl = $('input[type="hidden"][name="previewUrl"]').val() + 's/' + residenceId + '/' + data['Library_Page']['id'] + '/';
				previewUrl = prop['currentUrl'] + (prop['isLibraryElementPage'] === true ? 'Library' : 'Page') + '/preview/s/' + prop['residenceId'] + '/' + data['Library_Page']['id'] + '/?' + new Date().getTime();

				isEdited = data['editedUser']['id'] ? true : false
				editedUserName = data['editedUser']['name'] ? data['editedUser']['name'] : '-----';
				edited = isEdited ? data['Library_Page']['edited'] : '-----'

				isPublished = data['publishedUser']['id'] ? true : false
				publishedUserName = data['publishedUser']['name'] ? data['publishedUser']['name'] : '-----';
				published = isPublished ? data['Library_Page']['published'] : '-----';
			}

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
			var targetElem = $('#pageList2 > li.createPage');
			var fixedData = {
				'Library_Page'					: prop['isLibraryElementPage'] === true ? data[0]['smartphone_libraries'] : data[0]['smartphone_pages'],
				'editedUser'					: data[0]['editedUser'],
				'publishedUser'					: data[0]['publishedUser'],
				'smartphoneConcretePages'		: prop['isLibraryElementPage'] === true ? {} : data[0]['smartphone_concrete_pages'],
				'MtrStatus'						: data[0]['mtr_statuses']
			}
			targetElem.before(thisObj.getPageListElement(fixedData, prop));

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
			$("div.tooltip").remove();
			var publishedIdArr = [];
			$("#pageList2 > li:not(.createPage)").each(function(i) {
				publishedIdArr.push($(this).attr('data-record-id'));
			})
			$(thisObj).trigger('onClickBulkPublishBtn', [publishedIdArr]);
			return false;
		}

		/*
		 * ウインドウリサイズ時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onResizeWindow: function(event) {
			var thisObj = this;
			var height = $(window).height() - 95;
			console.log('height = ' + height);

			$('#directories > ul').height(height);
			$('#libraries > ul').height(height);
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	void
		 * @return	void
		 */
		,setOnceEvent: function() {
			var thisObj = this;
			if (thisObj._isOnceEventEnabled === false) {
				$(window)
					.on('resize', thisObj.onResizeWindow)
			}
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
				$('#libraries')
					.on('click', '.btn-add-parents', thisObj.onClickBulkPublishBtnHandler);



				$('#contentForUserAdmin')
					.on('click', '.bulkPublishBtn', thisObj.onClickBulkPublishBtnHandler);
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
	}
});
