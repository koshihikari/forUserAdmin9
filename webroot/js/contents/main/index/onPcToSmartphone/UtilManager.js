

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * Utility管理クラス
	 */
	MYNAMESPACE.namespace('modules.main.index.onPcToSmartphone.UtilManager');
	MYNAMESPACE.modules.main.index.onPcToSmartphone.UtilManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.main.index.onPcToSmartphone.UtilManager.prototype = {
		_isEnabled						: false
		,_instances						: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'showCurtain'
				,'hideCurtain'
				,'setStatus'
				,'showStatusMessage'
			);

			this._instances = {
				'Util'		: new MYNAMESPACE.modules.helper.Util()
			}
		}

		/*
		 * ページの最前面にメッセージ表示用Divを表示するメソッド
		 * @param	message				表示するメッセージ
		 * @param	duration			Divを表示するまでの時間
		 * @return	void
		 */
		,showCurtain: function(message, duration) {
			var thisObj = this;
			thisObj._instances['Util'].showCurtain(message, duration);
		}

		/*
		 * ページの最前面に表示したメッセージ表示用Divを非表示にするメソッド
		 * @param	duration			Divを非表示にするまでの時間
		 * @return	void
		 */
		,hideCurtain: function(duration) {
			var thisObj = this;
			thisObj._instances['Util'].hideCurtain(duration);
		}

		/*
		 * ステータス表示/非表示メソッド
		 * @param	isShow 		true===ステータス表示
		 * @param	message	 	表示するステータスメッセージ
		 * @param	time	 	メッセージを表示し続ける時間(ms)
		 * @return	変換後のカラーコードオブジェクト
		 */
		,setStatus: function(isShow, message, time) {
			var thisObj = this;
			thisObj._instances['Util'].setStatus(isShow, message, time);
		}

		/*
		 * ステータスメッセージを表示するメソッド
		 * @param	event			Eventオブジェクト
		 * @return	void
		 */
		,showStatusMessage: function(event) {
			var thisObj = this;
			var message = '';
			var duration = 300;
			// console.log(event.type);

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
				case 'onInitAddResidence':
					message = '物件追加中・・・';
					break;
				case 'onCompleteAddResidence':
					message = '物件追加完了';
					break;
				case 'onErrorAddResidence':
					message = '物件追加失敗';
					break;

				case 'onInitDuplicateResidence':
					message = '物件コピー中・・・';
					break;
				case 'onCompleteDuplicateResidence':
					message = '物件コピー完了';
					break;
				case 'onErrorDuplicateResidence':
					message = '物件コピー失敗';
					break;

				case 'onInitDelResidence':
					message = '物件削除中・・・';
					break;
				case 'onCompleteDelResidence':
					message = '物件削除完了';
					break;
				case 'onErrorDelResidence':
					message = '物件削除失敗';
					break;

				case 'onInitReorderResidence':
					message = '物件並び替え中・・・';
					break;
				case 'onCompleteReorderResidence':
					message = '物件並び替え完了';
					break;
				case 'onErrorReorderResidence':
					message = '物件並び替え失敗';
					break;

				case 'onInitChangeResidenceString':
					message = '物件名/パス変更中・・・';
					break;
				case 'onCompleteChangeResidenceString':
					message = '物件名/パス変更完了';
					break;
				case 'onErrorChangeResidenceString':
					message = '物件名/パス変更失敗';
					break;

				case 'onInitBulkUpdateOutlineData':
					message = '物件概要一括編集中・・・';
					break;
				case 'onErrorBulkUpdateOutlineData':
					message = '物件概要一括編集失敗';
					break;
				case 'onCompleteUpdateOutlineData':
					message = '物件概要一括編集完了(プレビューページのみ書き出し)';
					break;

				case 'onInitAddPage':
					message = 'ページ追加中・・・';
					break;
				case 'onCompleteAddPage':
					message = 'ページ追加完了';
					break;
				case 'onErrorAddPage':
					message = 'ページ追加失敗';
					break;

				case 'onInitDuplicatePage':
					message = 'ページコピー中・・・';
					break;
				case 'onCompleteDuplicatePage':
					message = 'ページコピー完了';
					break;
				case 'onErrorDuplicatePage':
					message = 'ページコピー失敗';
					break;

				case 'onInitDelPage':
					message = 'ページ削除中・・・';
					break;
				case 'onCompleteDelPage':
					message = 'ページ削除完了';
					break;
				case 'onErrorDelPage':
					message = 'ページ削除失敗';
					break;

				case 'onInitReorderPage':
					message = 'ページ並び替え中・・・';
					break;
				case 'onCompleteReorderPage':
					message = 'ページ並び替え完了';
					break;
				case 'onErrorReorderPage':
					message = 'ページ並び替え失敗';
					break;

				case 'onInitChangePageString':
					message = 'ページ名/パス変更中・・・';
					break;
				case 'onCompleteChangePageString':
					message = 'ページ名/パス変更完了';
					break;
				case 'onErrorChangePageString':
					message = 'ページ名/パス変更失敗';
					break;

				case 'onInitMovePage':
					message = 'ページ移動中・・・';
					break;
				case 'onCompleteMovePage':
					message = 'ページ移動完了';
					break;
				case 'onErrorMovePage':
					message = 'ページ移動失敗';
					break;

				case 'onInitPublishConcretePage':
					message = '本番ページ書き出し中・・・';
					break;
				case 'onErrorPublishConcretePage':
					message = '本番ページ書き出し失敗';
					break;

				case 'onInitGetPageTag':
					message = 'タグ取得中・・・';
					break;
				case 'onCompleteGetPageTag':
					message = 'タグ取得完了';
					break;
				case 'onErrorGetPageTag':
					message = 'タグ取得失敗';
					break;

				case 'onInitSetPageTagData':
					message = 'タグ修正中・・・';
					break;
				case 'onCompleteSetPageTagData':
					message = 'タグ修正完了';
					break;
				case 'onErrorSetPageTagData':
					message = 'タグ修正失敗';
					break;

				case 'onEmptyResidences':
					message = '現在この管理画面で閲覧が許可されている物件はありません。';
					break;
				default:
					return;
			}

			// console.log('event.type = ' + event.type + ', message = ' + message);
			if (event.type.indexOf('onComplete') !== -1) {
				thisObj._instances['Util'].setStatus(true, message, 500);
				thisObj._instances['Util'].hideCurtain();
			} else {
				thisObj._instances['Util'].setStatus(true, message);
				thisObj._instances['Util'].showCurtain(message, duration);
			}
		}
	}
});
