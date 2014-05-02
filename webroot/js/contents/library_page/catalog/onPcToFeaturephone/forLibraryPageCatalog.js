

jQuery.noConflict();
jQuery(document).ready(function($){
	var Gateway									= new MYNAMESPACE.modules.helper.Gateway();
	var Util									= new MYNAMESPACE.modules.helper.Util();
	var AlertModalManager						= new MYNAMESPACE.modules.AlertModalManager();
	var ConfirmModalManager						= new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager();
	var DataManager								= new MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.DataManager(
		{
			'Gateway'		: Gateway
		}
	);
	// var AccessManager							= new MYNAMESPACE.modules.AccessManager(DataManager);
	var PageManager								= new MYNAMESPACE.modules.library_page.catalog.onPcToFeaturephone.PageManager(DataManager);
	// var RenderingManager						= new MYNAMESPACE.modules.library_page.edit.RenderingManager();
	// var RenderingManager						= new MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager();
	var ConcretePageManager						= new MYNAMESPACE.modules.helper.ConcretePageManagerForFeaturephone(
		{
			'DataManager'		: DataManager
			// 'RenderingManager'		: RenderingManager
		}
	);
	var bulkPublishData = {
		'idArr'			: [],
		'count'			: 0
	};
	var pageData = [];
	// RenderingManager.setEvent(true);
	// RenderingManager.render();

	// function renderThumbnail() {
	// 	ConcretePageManager.on('onCompletePublish', function(event, pageId) {

	// 	})
	// 	ConcretePageManager.publish(135, false);
	// }

	$(PageManager)
		.on('onClickAddPageBtn', function(event) {
			PageManager.setEvent(false);
			DataManager.insert();
		})
		.on('onClickDeleteBtn', function(event, recordId) {
			var targetItemName = $('#record-id_' + recordId).find('input[type="text"][name="title"]').val();
			console.log($('#record-id_' + recordId).html());
			console.log('recordId = ' + recordId);
			console.log('targetItemName = ' + targetItemName);
			ConfirmModalManager.open(
				{
					'title'									: '削除確認',
					'message'								: '「' + targetItemName + '」を削除しますか？',
					'close-btn-text'						: '<i data-icon=""></i>キャンセル',
					'agree-btn-text'						: '<i data-icon=""></i>削除する'
				},
				function() {
					PageManager.setEvent(false);
					DataManager.delete(recordId);
				}
			);
			// PageManager.setEvent(false);
			// DataManager.delete(recordId);
		})
		.on('onCompleteRender', function(event, data) {
			PageManager.setEvent(true);
			console.log('レンダリング完了');
			// $('#pageTable').footable();
			// $('table').footable();
			console.log('Table Sortable完了');
			/*
			$('#pageTable')
			.footable(
				{
					breakpoints: {
						phone	: 640,
						tablet	: 1600
					}
				}
			)
			.find('tbody')
			.sortable()
			.disableSelection();
			*/
			/*
			$('table tbody').sortable();
			$('table tbody').disableSelection();
			*/
			/*
			*/
			// setCanvas();
			// console.log('サムネイル更新開始')
			// ConcretePageManager.renderThumbnail();
		})
		.on('onCompleteCreateCapture', function(event, data) {
			// console.log('forCatalogPage :: onCreateComplete');
			// console.log(data);
		})
		.on('onCompleteRefresh', function(event, data) {
		// .on('onCompleteAdd', function(event, data) {
			console.log('更新完了');
			PageManager.setEvent(true);
			$('#pageTable').footable(
				{
					breakpoints: {
						phone	: 640,
						tablet	: 1600
					}
				}
			);
			// $('a[data-placement][data-original-title]').tooltip();
		})
		.on('onCompleteRemove', function(event, data) {
			// PageManager.setEvent(true);
			// console.log('エレメント削除完了');
			// PageManager.setEvent(true);
		})
		.on('onChangeTitle', function(event, recordId, title) {
			console.log('タイトル編集');
			var prop = DataManager.getProp();
			var updateData = {
				'id'						: recordId,
				'title'						: title,
				'user_id'					: prop['userId']
			}
			DataManager.update(recordId, updateData);
		})
		.on('onChangePath', function(event, recordId, path) {
			console.log('パス編集');
			var prop = DataManager.getProp();
			var updateData = {
				'id'						: recordId,
				'path'						: path,
				'user_id'					: prop['userId']
			}
			DataManager.update(recordId, updateData);
		})
		.on('onClickPublishBtn', function(event, pageId, title, path) {
			PageManager.setEvent(false);
			console.log('ConcretePageManagerを呼ぶ');
			Util.showCurtain('ページ書き出し開始', 300);
			var bulkPublishData = {
				'idArr'			: [],
				'count'			: 0
			};
			// var prop = DataManager.getProp();
			// var url = prop['currentUrl'] + 'Page/publishConcretePage/';
			// ConcretePageManager.publish(pageId, title, path, prop['userId'], prop['companyId'], prop['residenceId'] , url);
			ConcretePageManager.publish(pageId, title, path);
		})
		.on('onClickBulkPublishBtn', function(event) {
			var recordIdArr = [];
			$('[name="record-id"]:checked').each(function(i) {
				recordIdArr.push($(this).val());
			});
			if (0 < recordIdArr.length) {
				bulkPublishData = {
					'idArr'			: recordIdArr,
					'count'			: 0
				};
				console.log(bulkPublishData);
				PageManager.setEvent(false);
				bulkPublish();
			} else {
				AlertModalManager.open('ERROR!', '書きだすページを選択してください。');
			}
			/*
			*/
		});
	function bulkPublish() {
		console.log('forLibraryPageCatalog :: bulkPublish :: bulkPublishData.count = ' + bulkPublishData['count']);
		if (bulkPublishData['count'] < bulkPublishData['idArr'].length) {
		// if (0 < bulkPublishData['idArr'].length) {
			// if (0 < bulkPublishData['count']) {
			// 	bulkPublishData['idArr'].shift();
			// }
			Util.showCurtain('ページID :: ' + bulkPublishData['idArr'][bulkPublishData['count']] + '書き出し開始(' + (bulkPublishData['count'] + 1) + '/' + bulkPublishData['idArr'].length + ')', 300);
			var pageId = bulkPublishData['idArr'][bulkPublishData['count']];
			var targetElement = $('#record-id_' + pageId);
			var title = targetElement.find('input[type="text"][name="title"]').val();
			var path = targetElement.find('input[type="text"][name="path"]').val();
			ConcretePageManager.publish(pageId, title, path);
			bulkPublishData['count'] ++;
		} else {
			if (0 < pageData.length) {
				PageManager.refresh(pageData);
			}
			Util.hideCurtain();
			Util.setStatus(true, '本番ページ書き出し完了', 500);
			PageManager.setEvent(true);
		}
	}
		/*
		.on('onChangePageTitle', function(event, recordId, pageTitle) {
			// console.log('ページタイトルが変わった :: recordId = ' + recordId + ', pageTitle = ' + pageTitle);
			// var array = [{'id':recordId, 'name':pageTitle}];
			// console.log(array);
			var prop = DataManager.getProp;
			DataManager.updatePage([{'id':recordId, 'title':pageTitle, 'user_id':prop['userId']}]);
		});
		*/

	// $(ConcretePageManager)
	// 	.on('onCompletePublish', function(event, pageId) {

	// 	});

	$(DataManager)
		.on('onInitRequest', function(event, data) {
			Util.setStatus(true, 'データリクエスト中・・・');
		})
		.on('onCompleteRequest', function(event, data) {
			Util.setStatus(true, 'データリクエスト完了', 500);
			// console.log('リクエスト完了');
			PageManager.render(data);
		})
		.on('onInitInsert', function(event) {
			Util.setStatus(true, 'データ保存中・・・');
			// console.log('onInitInsert :: 追加中');
		})
		.on('onCompleteInsert', function(event, data) {
			Util.setStatus(true, 'データ保存完了', 500);
			// console.log('onCompleteInsert :: 追加完了');
			PageManager.refresh(data);
			// PageManager.add(data);
		})
		.on('onInitDelete', function(event, deletedRecordId) {
			Util.setStatus(true, 'データ削除中・・・');
			// console.log('onInitInsert :: 削除中');
			PageManager.remove(deletedRecordId);
		})
		.on('onCompleteDelete', function(event, deletedRecordId) {
			Util.setStatus(true, 'データ削除完了', 500);
			PageManager.setEvent(true);
			// console.log('onInitInsert :: 削除完了', 500);
		})
		.on('onInitUpdate', function(event) {
			Util.setStatus(true, 'データ更新中・・・');
			// console.log('onInitUpdate :: 更新中');
		})
		.on('onCompleteUpdate', function(event) {
			Util.setStatus(true, 'データ更新完了', 500);
			// console.log('更新完了');
			PageManager.reset('title');
			PageManager.reset('path');
		})
		.on('onErrorUpdate', function(event) {
			Util.setStatus(true, 'データ更新失敗');
		});


	$(ConcretePageManager)
		.on('onInitPublishConcretePage', function(event, recordId) {
			Util.setStatus(true, '本番ページ書き出し中・・・');
			// console.log('onInitInsert :: 削除中');
			// PageManager.remove(recordId);
		})
		.on('onCompletePublishConcretePage', function(event, data) {
		// .on('onCompletePublishConcretePage', function(event, recordId) {
			// PageManager.refresh(data);
			// PageManager.refresh(data);
			pageData = data;
			bulkPublish();
			// PageManager.refresh(data);
			// Util.setStatus(true, '本番ページ書き出し完了', 500);
			// console.log('onInitInsert :: 削除完了', 500);
		})
		.on('onErrorPublishConcretePage', function(event, recordId, XMLHttpRequest, textStatus, errorThrown) {
			Util.setStatus(true, '本番ページ書き出し失敗');
		});

	DataManager.request();
});

