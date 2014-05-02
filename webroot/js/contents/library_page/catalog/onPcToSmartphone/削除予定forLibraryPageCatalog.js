

jQuery.noConflict();
jQuery(document).ready(function($){
	var Gateway									= new MYNAMESPACE.modules.helper.Gateway();
	var DataManager								= new MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.DataManager();
	var Duplicater								= new MYNAMESPACE.modules.helper.Duplicater.Duplicater(
			{
				'DataManager'			: DataManager,
				'Gateway'				: Gateway
			}
	);
	var Util									= new MYNAMESPACE.modules.helper.Util();
	var ConfirmModalManager						= new MYNAMESPACE.modules.helper.Modal.ConfirmModalManager();
	var LibraryPageCopyModalManager				= new MYNAMESPACE.modules.helper.Modal.LibraryPageCopyModalManager(
			{
				'DataManager'			: DataManager,
				'Duplicater'			: Duplicater
			}
	);
	// var AccessManager							= new MYNAMESPACE.modules.AccessManager(DataManager);
	var PageManager								= new MYNAMESPACE.modules.library_page.catalog.onPcToSmartphone.PageManager(DataManager);
	var RenderingManager						= new MYNAMESPACE.modules.library_page.edit.onPcToSmartphone.RenderingManager();
	var ConcretePageManager						= new MYNAMESPACE.modules.helper.ConcretePageManagerForSmartphone(
		{
			'RenderingManager'		: RenderingManager
		}
	);
	// RenderingManager.setEvent(true);
	// RenderingManager.render();

	// function renderThumbnail() {
	// 	ConcretePageManager.on('onCompletePublish', function(event, pageId) {

	// 	})
	// 	ConcretePageManager.publish(135, false);
	// }

	var prop = DataManager.getProp();
	Duplicater.setProp(prop['userId'], prop['currentUrl'], 2);

	$(PageManager)
		.on('onClickCreateBtn', function(event) {
			DataManager.insert();
		})
		.on('onClickDeleteBtn', function(event, recordId) {
			var targetItemName = $('#record-id_' + recordId).find('input[type="text"][name="title"]').val();
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
			/*
			PageManager.setEvent(false);
			DataManager.delete(recordId);
			*/
		})
		.on('onCompleteRender', function(event, data) {
			PageManager.setEvent(true);
			// setCanvas();
			if (DataManager.getData()['isLibraryElementPage'] === true) {
				console.log('サムネイル更新開始');
				ConcretePageManager.renderThumbnail();
			}
		})
		.on('onCompleteCreateCapture', function(event, data) {
			// console.log('forCatalogPage :: onCreateComplete');
			// console.log(data);
		})
		.on('onCompleteAdd', function(event, data) {
			console.log('追加完了');
			PageManager.setEvent(true);
			// $('a[data-placement][data-original-title]').tooltip();
		})
		.on('onCompleteRemove', function(event, data) {
			// PageManager.setEvent(true);
			// console.log('エレメント削除完了');
			PageManager.setEvent(true);
		})
		.on('onChangeTitle', function(event, recordId, title) {
			console.log('タイトル編集');
			var prop = DataManager.getData();
			var updateData = {
				'id'						: recordId,
				'title'						: title,
				'user_id'					: prop['userId']
			}
			DataManager.update(recordId, updateData);
		})
		.on('onChangePath', function(event, recordId, path) {
			console.log('パス編集');
			var prop = DataManager.getData();
			var updateData = {
				'id'						: recordId,
				'path'						: path,
				'user_id'					: prop['userId']
			}
			DataManager.update(recordId, updateData);
		})
		.on('onClickDuplicateBtn', function(event, recordId) {
			// LibraryPageCopyModalManager.copy();
			// LibraryPageCopyModalManager.open({'id':recordId});
		})
		.on('onClickPublishBtn', function(event, recordId) {
			ConcretePageManager.publish(recordId, true);
		});
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
			PageManager.add(data);
		})
		.on('onInitDelete', function(event, deletedRecordId) {
			Util.setStatus(true, 'データ削除中・・・');
			// console.log('onInitInsert :: 削除中');
			PageManager.remove(deletedRecordId);
		})
		.on('onCompleteDelete', function(event, deletedRecordId) {
			Util.setStatus(true, 'データ削除完了', 500);
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

	DataManager.request();
});

