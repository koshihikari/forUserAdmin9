

jQuery.noConflict();
jQuery(document).ready(function($){
	var Util									= new MYNAMESPACE.modules.helper.Util();
	var DataManager								= new MYNAMESPACE.modules.DataManager();
	// var AccessManager							= new MYNAMESPACE.modules.AccessManager(DataManager);
	var PageManager								= new MYNAMESPACE.modules.PageManager(DataManager);
	var RenderingManager						= new MYNAMESPACE.modules.library_page.edit.RenderingManager();
	var ConcretePageManager						= new MYNAMESPACE.modules.helper.ConcretePageManager(
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

	$(PageManager)
		.on('onClickCreateBtn', function(event) {
			DataManager.insert();
		})
		.on('onClickDeleteBtn', function(event, recordId) {
			PageManager.setEvent(false);
			DataManager.delete(recordId);
		})
		.on('onCompleteRender', function(event, data) {
			PageManager.setEvent(true);
			// setCanvas();
			console.log('サムネイル更新開始')
			ConcretePageManager.renderThumbnail();
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
		.on('onChangePageTitle', function(event, savingTitle) {
			console.log('編集');
			// console.log(PageManager.getSavingTitles());
			// DataManager.updatePage(PageManager.getSavingTitles());
			DataManager.update(savingTitle);
		})
		.on('onClickPublishBtn', function(event, pageId) {
			ConcretePageManager.publish(pageId, true);
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
		})
		.on('onCompleteDelete', function(event, deletedRecordId) {
			Util.setStatus(true, 'データ削除完了', 500);
			// console.log('onInitInsert :: 削除完了', 500);
			PageManager.remove(deletedRecordId);
		})
		.on('onInitUpdate', function(event) {
			Util.setStatus(true, 'データ更新中・・・');
			// console.log('onInitUpdate :: 更新中');
		})
		.on('onCompleteUpdate', function(event) {
			Util.setStatus(true, 'データ更新完了', 500);
			// console.log('更新完了');
			PageManager.reset();
		});

	DataManager.request();
});

