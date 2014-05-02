

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * ページ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.library_page.catalog.onPcToFeaturephone.PageManager');
	MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.PageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.PageManager.prototype = {
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
			_.bindAll(
				this
				,'getPageListElement'
				,'render'
				,'refresh'
				,'remove'
				,'onChangeText'
				,'reset'
				,'setEvent'
				// ,'getPageListSource'
				// ,'getAddPageSource'
			);
			var tableElem = $(_.template($('#page-table-template').text(), {}))
			$('#container .controller:first-child').after(tableElem);

			this._instances = {
				'DataManager'	: DataManager
			};
		}

		,getPageListElement: function(data, prop) {
			var thisObj = this;
			// console.log(data);
			// console.log(prop);
			var editUrl = prop['currentUrl'] + 'Page/' + 'edit/f/' + data['Library_Page']['id'];
			// var editUrl = prop['currentUrl'] + 'Page/' + 'edit/f/' + prop['residenceId'] + '/' + data['Library_Page']['id'];
			var pagePath = data['Library_Page']['path'].match(/^\//) !== null ? data['Library_Page']['path'] : '/' + data['Library_Page']['path'];
			pagePath = prop['residencePath'] === '' ? pagePath.replace(/^\//, '') : pagePath;
			pagePath = pagePath === '/' ? '' : pagePath;
			var concreteQrUrl = prop['concreteUrl'] + prop['residencePath'] + pagePath;
			concreteQrUrl = pagePath === '' && concreteQrUrl.match(/\/$/) === null ? concreteQrUrl + '/' : concreteQrUrl;
			var previewUrl = prop['currentUrl'] + 'Page/preview/f/' + prop['residenceId'] + '/' + data['Library_Page']['id'] + '/?' + new Date().getTime();
			previewUrl = previewUrl.replace('https://', 'http://');

			var isEdited = data['editedUser']['id'] ? true : false
			var editedUserName = data['editedUser']['name'] ? data['editedUser']['name'] : '-----';
			var edited = isEdited ? data['Library_Page']['edited'] : '-----'

			var isPublished = data['publishedUser']['id'] ? true : false
			var publishedUserName = data['publishedUser']['name'] ? data['publishedUser']['name'] : '-----';
			var published = isPublished ? data['Library_Page']['published'] : '-----';

			var cautionMessage = '';
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
				'publishedUserName'		: publishedUserName,
				'published'				: published,
				'cautionMessage'		: cautionMessage
			}
			return $(_.template($('#page-tr-template').text(), forTemplateData));
		}

		/*
		 * 引数で受け取ったデータからエレメントを作成するメソッド
		 * @param	data			エレメント作成用データ
		 * @return	void
		 */
		,render: function(data, isSilent) {
			var thisObj = this;
			var prop = thisObj._instances['DataManager'].getProp();
			for (var i=0,len=data.length; i<len; i++) {
				var fixedData = {
					'Library_Page'					: data[i]['featurephone_pages'],
					'editedUser'					: data[i]['editedUser'],
					'publishedUser'					: data[i]['publishedUser'],
					// 'User'							: data[i]['users'],
					'MtrStatus'						: data[i]['mtr_statuses']
				}
				// $("#pageList").append(thisObj.getPageListSource(fixedData, prop));
				$("#pageTable").append(thisObj.getPageListElement(fixedData, prop));
			}
			// $("#pageList").append(thisObj.getAddPageSource());

			if (isSilent !== true) {
				$(thisObj).trigger('onCompleteRender');
			}
		}

		/*
		 * 引数で受け取ったデータのエレメントを追加するメソッド
		 * @param	data			追加エレメント作成用データ
		 * @return	void
		 */
		,refresh: function(data) {
			var thisObj = this;
			$('#pageTable').remove();
			var tableElem = $(_.template($('#page-table-template').text(), {}))
			$('#container .controller:first-child').after(tableElem);
			thisObj.render(data, true);
			$(thisObj).trigger('onCompleteRefresh');
		}

		/*
		 * 引数で受け取ったレコードIDのエレメントを削除するメソッド
		 * @param	deletedRecordId			削除されたエレメントのレコードID
		 * @return	void
		 */
		,remove: function(deletedRecordId) {
			var thisObj = this;
			$("#record-id_" + deletedRecordId).remove();
			$('.btn-page-delete[data-record-id="' + deletedRecordId + '"]').closest('tr').remove();
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

			// console.log('name = ' + name + ', currentVal = ' + currentVal + ', prevVal = ' + prevVal);
			if (currentVal !== prevVal) {
			// if (currentVal !== prevVal && currentVal !== '') {
				// if (name === 'pageTitle') {
				// 	elem.attr('data-prev-title', currentVal);
				// } else {
				// 	elem.attr('data-prev-path', currentVal);
				// }
				// console.log('currentVal = ' + currentVal);
				// console.log('prevVal = ' + prevVal);
				// thisObj.reset(name);
				elem.attr('data-prev-' + name, currentVal);
				var recordId = elem.attr('data-record-id');
				var prop = thisObj._instances['DataManager'].getProp();
				thisObj._hasSaveData[name] = true;
				// console.log('保存するかも')
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
			if (thisObj._timers[name]) {
				clearInterval(thisObj._timers[name]);
			}
		}

		/*
		 * ページ編集ページのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			console.log('setEvent :: isEnabled = ' + isEnabled);
			// return ;
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;
				$(".controller")
					.on('click', '.btn-check-all', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$('#pageTable > tbody > tr > td input[type="checkbox"][name="record-id"]').each(function(i) {
							$(this).attr('checked', 'checked');
						});
						return false;
					})
					.on('click', '.btn-uncheck-all', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$('#pageTable > tbody > tr > td input[type="checkbox"][name="record-id"]').each(function(i) {
							$(this).removeAttr('checked');
						});
						return false;
					})
					.on('click', '.btn-not-latest-check-all', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$('#pageTable > tbody > tr > td input[type="checkbox"][name="record-id"]').each(function(i) {
							$(this).removeAttr('checked');
						});
						$('#pageTable > tbody > tr.notLatest > td input[type="checkbox"][name="record-id"]').each(function(i) {
							$(this).attr('checked', 'checked');
						});
						return false;
					})
					.on('click', '.btn-bulk-publish', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickBulkPublishBtn');
						return false;
					})
					.on('click', '.btn-add-page', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickAddPageBtn')
						return false;
					})
				$("#pageTable")
					.on('change', 'input[type="text"][name="title"]', function(event) {
						thisObj.onChangeText(event);
					})
					.on('focus', 'input[type="text"][name="title"]', function(event) {
						event.preventDefault();
						event.stopPropagation();
						if (thisObj._timers['focusToTitle']) {
							clearInterval(thisObj._timers['focusToTitle']);
						}
						thisObj._timers['focusToTitle'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
						return false;
					})
					.on('blur', 'input[type="text"][name="title"]', function(event) {
						if (thisObj._timers['focusToTitle']) {
							clearInterval(thisObj._timers['focusToTitle']);
						}
						if (thisObj._hasSaveData['title'] === true) {
							$(thisObj).trigger('onChangeTitle', [thisObj._updateData['title']['id'], thisObj._updateData['title']['title']]);
							thisObj.reset('title');
						}
					})
					.on('change', 'input[type="text"][name="path"]', function(event) {
						thisObj.onChangeText(event);
					})
					.on('focus', 'input[type="text"][name="path"]', function(event) {
						event.preventDefault();
						event.stopPropagation();
						if (thisObj._timers['focusToPath']) {
							clearInterval(thisObj._timers['focusToPath']);
						}
						thisObj._timers['focusToPath'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
						return false;
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
						event.preventDefault();
						event.stopPropagation();
						return false;
					})
					.on('click', '.btn-page-delete', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickDeleteBtn', $(this).attr('data-record-id'))
						return false;
					})
					.on('click', '.btn-page-create', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$("div.tooltip").remove();
						$(thisObj).trigger('onClickCreateBtn')
						return false;
					})
					.on('click', '.btn-page-publish', function(event) {
						event.preventDefault();
						event.stopPropagation();
						$("div.tooltip").remove();
						var pageId = $(this).attr('data-record-id');
						var clickedPageElem = $('#record-id_' + pageId);
						var title = clickedPageElem.find('input[type="text"][name="title"]').val();
						var path = clickedPageElem.find('input[type="text"][name="path"]').val();
						$(thisObj).trigger('onClickPublishBtn', [pageId, title, path]);
						return false;
					});

				$('#pageTable')
					.footable(
						{
							breakpoints: {
								phone	: 640,
								tablet	: 1600
							}
						}
					)
					// .find('tbody')
					// 	.sortable()
						// .disableSelection();
				$('.dropdown-toggle').dropdown();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				// $('[data-placement][data-original-title]').tooltip('destroy');
			}
		}
	}
});
