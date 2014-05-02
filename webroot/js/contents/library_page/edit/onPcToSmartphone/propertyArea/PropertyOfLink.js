

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * プロパティエリアに表示するリンクプロパティ管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.PropertyOfLink');
	MYNAMESPACE.modules.PropertyOfLink = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PropertyOfLink.prototype = {
		_isEnabled						: false
		,_elementType					: ''
		,_currentVal					: {}
		,_targetId						: null
		,_instances						: {}
		,_elems							: {}
		,_timers						: {}
		,_hasSaveData					: false
		,_instances						: {}
		,_timerId						: null

		/*
		 * コンストラクタ
		 * @param	dataManager 	データ管理クラスのインスタンス
		 * @param	id 				プロパティを表示するエレメントのID
		 * @param	methodObj 		メソッド保持オブジェクト
		 * @param	properties 		このクラスで管理するプロパティエレメントのプロパティオブジェクト
		 * @return	void
		 */
		,initialize: function(instances, id) {
			var thisObj = this;

			_.bindAll(
				this
				,'getElem'
				,'getProperty'
				,'createElement'
				,'refreshStyle'
				,'onChangeText'
				,'onClickRadioButton'
				,'switchActiveArea'
				,'onChangeEnableUnderlineHandler'
				,'setEvent'
			);
			this._targetId = id;
			this._elementType = 'Link';
			this._instances = instances;
			this._instances['SelectLinkPageModalManager'] = new MYNAMESPACE.modules.helper.Modal.SelectLinkPageModalManager('modal-' + new Date().getTime(), {DataManager:this._instances['DataManager']});
			var elementProperty = this._instances['DataManager'].getElementDataObj(this._targetId);
			this._currentVal = elementProperty['property'][this._elementType] || {};
			var propertyElement = this.createElement(id);
			this._elems		= {
				'propertyElement'		: propertyElement
			}
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
		 * @param	currentVal 		このクラスが管理するエレメントのプロパティデータ
		 * @return	このクラスが管理するエレメント
		 */
		,createElement: function(id, currentVal) {
			var thisObj			= this;
			var targetElem		= $("#" + thisObj._targetId);
			var baseType = '';
			// console.log('---------------');
			// console.log('PropertyOfLink :: createElement');
			// console.log(thisObj._currentVal);
			switch (thisObj._currentVal['baseType']) {
				case 'mapAddress':
					baseType = 'mapAddress';
					break;
				case 'page':
					baseType = 'page';
					break;
				default:
					baseType = 'url';
					break;
			}
			thisObj._currentVal['baseType'] = baseType;
			thisObj._currentVal['mapUrl'] = thisObj._currentVal['mapUrl'] === undefined ? '' : thisObj._currentVal['mapUrl'];
			// console.log(thisObj._currentVal);
			// console.log('---------------');
			var source = '\
						<div class="propertyElement forLinkElement">\
							<p class="elementTitle">リンク</p>\
							<div class="contentWrapper">\
								<div class="control-group urlWrapper">\
									<div class="controls">\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn linkUrlBtn' + (thisObj._currentVal['baseType'] === 'url' ? ' active' : '') + '" data-item-name="linkUrlBtn" data-placement="bottom" data-original-title="リンク先URLを直接入力します。"><span><i data-icon=""></i>リンク先URLを指定</span></button>\
											</div>\
											<div class="linkUrl">\
												<div class="controls">\
													<label class="control-label">リンク先URL</label>\
													<input type="text" name="linkUrl" value="' + thisObj._currentVal['linkUrl'] + '">\
												</div>\
												<div class="control-group linkTypeWrapper">\
													<div class="controls">\
														<label class="control-label">リンクタイプ</label>\
														<div class="btn-hole">\
															<div class="btn-group" data-toggle="buttons-radio" data-item-name="linkType">\
																<button type="button" class="btn btn-primary isUrl' + (thisObj._currentVal['linkType'] === 'url' ? ' active' : '') + '" data-item-name="isUrl" data-placement="bottom" data-original-title="ウェブページへのリンクを設定します。"><span><i data-icon=""></i>通常リンク</span></button>\
																<button type="button" class="btn btn-primary isMail' + (thisObj._currentVal['linkType'] === 'mail' ? ' active' : '') + '" data-item-name="isMail" data-placement="bottom" data-original-title="メールリンクを設定します。"><span><i data-icon=""></i>メールリンク</span></button>\
																<button type="button" class="btn btn-primary isPhoneNum' + (thisObj._currentVal['linkType'] === 'phoneNum' ? ' active' : '') + '" data-item-name="isPhoneNum" data-placement="bottom" data-original-title="電話リンクを設定します。"><span><i data-icon=""></i>電話リンク</span></button>\
															</div>\
														</div>\
														<p class="caution">\
															リンクタイプに「メールリンク」か「電話リンク」を選択した場合、\
															リンク先URLの開き方は無視されます。<br />\
															「通常リンク」を選択した場合、リンク先URLにはページのURLを入力して下さい。<br />\
															「メールリンク」を選択した場合、リンク先URLにはメールアドレスを入力して下さい。<br />\
															「電話リンク」を選択した場合、リンク先URLには電話番号を入力して下さい。\
														</p>\
													</div>\
												</div>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn linkPageBtn' + (thisObj._currentVal['baseType'] === 'page' ? ' active' : '') + '" data-item-name="linkPageBtn" data-placement="bottom" data-original-title="サイト内のページをリンク先として選択します。"><span><i data-icon=""></i>リンク先ページを選択</span></button>\
											</div>\
											<div class="linkPage">\
												<div class="controls">\
													<label class="control-label">リンク先ページID</label>\
													<input type="text" name="linkPageId" value="' + thisObj._currentVal['linkPageId'] + '">\
												</div>\
												<div class="btn-hole">\
													<button type="button" class="btn btn-primary selectPageBtn" data-item-name="selectPageBtn" data-placement="bottom" data-original-title="サイト内のページを一覧表示します。<br />リンク先のページを指定して下さい。"><span><i data-icon=""></i>ページを指定</span></button>\
												</div>\
											</div>\
										</div>\
										<div class="group">\
											<div class="btn-hole">\
												<button type="button" class="btn btn-primary switchBtn mapUrlBtn' + (thisObj._currentVal['baseType'] === 'mapAddress' ? ' active' : '') + '" data-item-name="mapUrlBtn" data-placement="bottom" data-original-title="リンク先住所を入力します。"><span><i data-icon=""></i>リンク先住所を指定</span></button>\
											</div>\
											<div class="mapUrl">\
												<div class="controls">\
													<label class="control-label">リンク先住所</label>\
													<input type="text" name="mapUrl" value="' + thisObj._currentVal['mapUrl'] + '">\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="control-group targetWrapper">\
									<label class="control-label">リンク先URLの開き方</label>\
									<div class="controls">\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-radio" data-item-name="target">\
												<button type="button" class="btn btn-primary isSelf' + (thisObj._currentVal['target'] === '_self' ? ' active' : '') + '" data-item-name="isSelf" data-placement="bottom" data-original-title="リンク先を同一のウインドウで開きます。"><span><i data-icon=""></i>同一ウインドウで開く</span></button>\
												<button type="button" class="btn btn-primary isBlank' + (thisObj._currentVal['target'] === '_blank' ? ' active' : '') + '" data-item-name="isBlank" data-placement="bottom" data-original-title="リンク先を新しいウインドウで開きます。"><span><i data-icon=""></i>新規ウインドウで開く</span></button>\
											</div>\
										</div>\
									</div>\
								</div>\
								<div class="control-group targetWrapper">\
									<label class="control-label">&nbsp;</label>\
									<div class="controls">\
										<div class="btn-hole">\
											<div class="btn-group" data-toggle="buttons-checkbox">\
												<button type="button" class="btn btn-primary isEnabledUnderline' + (thisObj._currentVal['isEnabledUnderline'] === true ? ' active' : '') + '" data-item-name="isEnabledUnderline" data-placement="bottom" data-original-title="リンクテキストに下線を表示します"><span><i data-icon=""></i>リンクテキストに下線を表示する</span></button>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
			';
			var elem = $(source);
			var passiveAreaName = '';
			switch (thisObj._currentVal['baseType']) {
				case 'mapAddress':
					passiveAreaName = '.linkUrl, .linkPage';
					break;
				case 'page':
					passiveAreaName = '.linkUrl, .mapUrl';
					break;
				default:
					passiveAreaName = '.linkPage, .mapUrl';
					break;
			}
			elem.find(passiveAreaName).css('display', 'none');

			return elem;
		}

		/*
		 * このクラスで管理するエレメントのスタイルを更新するメソッド
		 * @param	isEnforcement		true===このクラスで管理するスタイル変更時に強制的にデータを保存する
		 * @return	void
		 */
		,refreshStyle: function(isEnforcement) {
			var thisObj = this;
			thisObj._elems['propertyElement']
				.find('input[type="text"][name="linkPageId"]').val(thisObj._currentVal['linkPageId'])

			$(thisObj).trigger('onCompleteRefreshStyle', [thisObj._targetId, thisObj._elementType, $.extend(true, {}, thisObj._currentVal)]);
			if (isEnforcement === true) {
				console.log('Linkデータ保存');
				thisObj._hasSaveData = false;
				console.log(thisObj._currentVal);
				thisObj._instances['DataManager'].updateData(thisObj._targetId, thisObj._elementType, thisObj._currentVal);
			}
		}

		/*
		 * リンク先URLの値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"url"===URLの値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event) {
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var val = currentTarget.val();

			if (
				currentTarget.attr('name') === 'linkUrl' ||
				currentTarget.attr('name') === 'linkPageId' ||
				currentTarget.attr('name') === 'mapUrl'
			) {
				// var key = currentTarget.attr('name') === 'linkUrl' ? 'linkUrl' : 'mapUrl';
				var key = currentTarget.attr('name');
				if (thisObj._currentVal[key] !== val) {
					thisObj._currentVal[key] = val;
					thisObj._hasSaveData = true;
					thisObj.refreshStyle();

					if (thisObj._timers[key]) {
						clearTimeout(thisObj._timers[key]);
					}
					thisObj._timers[key] = setTimeout(
						function(event) {
							if (thisObj._hasSaveData === true) {
								thisObj.refreshStyle(true);
							}
						},
						3000
					);
				}
			}
		}

		/*
		 * リンクの開き方のラジオボタンがクリックされた時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickRadioButton: function(event) {
			var thisObj = this;
			var elem = $(event.currentTarget);
			var itemName = elem.attr('data-item-name');
			var parentItemName = elem.parent().attr('data-item-name');
			var obj = {
				'isSelf'		: '_self',
				'isBlank'		: '_blank',
				'isUrl'			: 'url',
				'isMail'		: 'mail',
				'isPhoneNum'	: 'phoneNum'
			}
			thisObj._currentVal[parentItemName] = obj[itemName];
			thisObj._hasSaveData = true;
			thisObj.refreshStyle(true);
		}

		/*
		 * 住所を指定/緯度/経度を指定領域の切り替えメソッド
		 * @param	activeAreaName		linkUrl===URL入力エリアをアクティブ。linkPage===ページ選択エリアをアクティブ
		 * @return	void
		 */
		,switchActiveArea: function(event) {
			var thisObj = this;
			var currentTarget = $(event.currentTarget);
			var activeBtnClassName, activeAreaName, passiveAreaName, baseType;

			if (currentTarget.hasClass('linkUrlBtn')) {
				activeBtnClassName = '.linkUrlBtn';
				activeAreaName = '.linkUrl';
				passiveAreaName = '.linkPage, .mapUrl';
				baseType = 'url';

			} else if (currentTarget.hasClass('linkPageBtn')) {
				activeBtnClassName = '.linkPageBtn';
				activeAreaName = '.linkPage';
				passiveAreaName = '.linkUrl, .mapUrl';
				baseType = 'page';

			} else if (currentTarget.hasClass('mapUrlBtn')) {
				activeBtnClassName = '.mapUrlBtn';
				activeAreaName = '.mapUrl';
				passiveAreaName = '.linkUrl, .linkPage';
				baseType = 'mapAddress';

			} else {
				return;
			}

			thisObj._currentVal['baseType'] = baseType;
			thisObj._hasSaveData = true;

			thisObj._elems['propertyElement']
				.find('.switchBtn')
					.removeClass('active')
				.end()
				.find(activeBtnClassName)
					.addClass('active');

			thisObj._elems['propertyElement']
				.find(passiveAreaName).slideUp()
				.end()
				.find(activeAreaName).slideDown();

			thisObj.refreshStyle(true);
		}

		/*
		 * リンクテキストの下線有効/無効ボタンクリック時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeEnableUnderlineHandler: function(event) {
			var thisObj = this;
			var targetElement = $(event.currentTarget);

			thisObj._currentVal['isEnabledUnderline'] = !targetElement.hasClass('active');
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
					.find("input[type='text'][name='linkUrl'], input[type='text'][name='linkPageId'], input[type='text'][name='mapUrl']")
						.on('change', function(event) {
							thisObj.onChangeText(event);
						})
						.on('focus', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							thisObj._timerId = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
						})
						.on('blur', function(event) {
							if (thisObj._timerId) {
								clearInterval(thisObj._timerId);
							}
							if (thisObj._hasSaveData === true) {
								thisObj.refreshStyle(true);
							}
						})
				.end()
						.on('click', '.switchBtn', thisObj.switchActiveArea)
						.on('click', '[data-toggle="buttons-radio"] > .btn', thisObj.onClickRadioButton)
						.on('click', '.selectPageBtn', function(event) {
							thisObj._instances['SelectLinkPageModalManager'].open({linkPageId:thisObj._currentVal['linkPageId'], linkUrl:thisObj._currentVal['linkUrl']});
						})
				.on('click', '.isEnabledUnderline', function(event) {
					thisObj.onChangeEnableUnderlineHandler(event);
				})

				$(thisObj._instances['SelectLinkPageModalManager'])
					.on('onSelectLinkPage', function(event, data) {
						if (
							thisObj._currentVal['linkPageId'] !== data['id']
						) {
							thisObj._currentVal['linkPageId'] = data['id'];
							thisObj._currentVal['linkPageTitle'] = data['title'];
							thisObj._hasSaveData = true;
							thisObj.refreshStyle(true);
						} else if (
							thisObj._currentVal['linkPageTitle'] !== data['title']
						) {
							thisObj._currentVal['linkPageId'] = data['id'];
							thisObj._currentVal['linkPageTitle'] = data['title'];
							thisObj._hasSaveData = false;
							thisObj.refreshStyle(false);
						}
					})
					.on('noPage', function(event) {
						thisObj._instances['AlertModalManager'].open('リンクさせるページが存在しません。', 'リンクさせるページを作成してください。');
					})

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;

				thisObj._elems['propertyElement']
					.find(".targetUrlWrapper input[type='text']")
						.off('change')
						.off ('focus')
						.off('blur')
				.end()
					.find('[data-toggle="buttons-radio"] > .btn')
						.off('click');
			}
		}
	}
});
