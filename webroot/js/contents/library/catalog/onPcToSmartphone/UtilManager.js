

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Utility管理クラス
	 */
	MYNAMESPACE.namespace('modules.library.catalog.onPcToSmartphone.UtilManager');
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.UtilManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.library.catalog.onPcToSmartphone.UtilManager.prototype = {
		_isEnabled						: false
		,_isOnceEventEnabled			: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'showStatusMessage'
			);

			this._instances = {
				'Util'		: new MYNAMESPACE.modules.helper.Util()
			}
		}

		/*
		 * ステータスメッセージを表示するメソッド
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,showStatusMessage: function(event) {
			var thisObj = this;
			var message = '';
			console.log(event.type);

			switch (event.type) {
				case 'onInitRequest':
					message = 'データリクエスト中・・・';
					break;
				case 'onCompleteRequest':
					message = 'データリクエスト完了';
					break;
				case 'onErrorRequest':
					message = 'データリクエスト失敗';
					break;

				case 'onInitAddDirectory':
					message = 'フォルダ追加中・・・';
					break;
				case 'onCompleteAddDirectory':
					message = 'フォルダ追加完了';
					break;
				case 'onErrorAddDirectory':
					message = 'フォルダ追加失敗';
					break;

				case 'onInitDuplicateDirectory':
					message = 'フォルダコピー中・・・';
					break;
				case 'onCompleteDuplicateDirectory':
					message = 'フォルダコピー完了';
					break;
				case 'onErrorDuplicateDirectory':
					message = 'フォルダコピー失敗';
					break;

				case 'onInitDelDirectory':
					message = 'フォルダ削除中・・・';
					break;
				case 'onCompleteDelDirectory':
					message = 'フォルダ削除完了';
					break;
				case 'onErrorDelDirectory':
					message = 'フォルダ削除失敗';
					break;

				case 'onInitReorderDirectory':
					message = 'フォルダ並び替え中・・・';
					break;
				case 'onCompleteReorderDirectory':
					message = 'フォルダ並び替え完了';
					break;
				case 'onErrorReorderDirectory':
					message = 'フォルダ並び替え失敗';
					break;

				case 'onInitRenameDirectory':
					message = 'フォルダ名変更中・・・';
					break;
				case 'onCompleteRenameDirectory':
					message = 'フォルダ名変更完了';
					break;
				case 'onErrorRenameDirectory':
					message = 'フォルダ名変更失敗';
					break;

				case 'onInitAddLibrary':
					message = '共通パーツ追加中・・・';
					break;
				case 'onCompleteAddLibrary':
					message = '共通パーツ追加完了';
					break;
				case 'onErrorAddLibrary':
					message = '共通パーツ追加失敗';
					break;

				case 'onInitDuplicateLibrary':
					message = '共通パーツコピー中・・・';
					break;
				case 'onCompleteDuplicateLibrary':
					message = '共通パーツコピー完了';
					break;
				case 'onErrorDuplicateLibrary':
					message = '共通パーツコピー失敗';
					break;

				case 'onInitDelLibrary':
					message = '共通パーツ削除中・・・';
					break;
				case 'onCompleteDelLibrary':
					message = '共通パーツ削除完了';
					break;
				case 'onErrorDelLibrary':
					message = '共通パーツ削除失敗';
					break;

				case 'onInitReorderLibrary':
					message = '共通パーツ並び替え中・・・';
					break;
				case 'onCompleteReorderLibrary':
					message = '共通パーツ並び替え完了';
					break;
				case 'onErrorReorderLibrary':
					message = '共通パーツ並び替え失敗';
					break;

				case 'onInitRenameLibrary':
					message = '共通パーツ名変更中・・・';
					break;
				case 'onCompleteRenameLibrary':
					message = '共通パーツ名変更完了';
					break;
				case 'onErrorRenameLibrary':
					message = '共通パーツ名変更失敗';
					break;

				case 'onInitMoveLibrary':
					message = '共通パーツ移動中・・・';
					break;
				case 'onCompleteMoveLibrary':
					message = '共通パーツ移動完了';
					break;
				case 'onErrorMoveLibrary':
					message = '共通パーツ移動失敗';
					break;

				default:
					return;
			}

			if (event.type.indexOf('onComplete') !== -1) {
				thisObj._instances['Util'].setStatus(true, message, 500);
			} else {
				thisObj._instances['Util'].setStatus(true, message);
			}
		}
	}
});
