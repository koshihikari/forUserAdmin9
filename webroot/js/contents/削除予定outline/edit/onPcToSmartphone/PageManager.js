

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.outline.edit.PageManager');
	MYNAMESPACE.modules.outline.edit.PageManager = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.outline.edit.PageManager.prototype = {
		_isEnabled						: false
		// ,_instances						: {}
		,_timers						: {}
		// ,_pageTitle						: {}
		,_hasSaveData					: false
		,_timerObj						: {}
		,_currentVal					: {}
		,_hasSaveData					: false
		,_isUpdateThrough				: false
		
		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'showFRK'
				,'insert'
				,'delete'
				,'update'
				,'setSortableInstance'
				,'onSortField'
				,'onClickVisibilityButton'
				,'onClickControllButton'
				,'onChangeFocus'
				,'onChangeText'
				,'onFocusInputArea'
				,'onBlurInputArea'
				,'onClickChangeResidenceNumBtn'
				,'setEvent'
			);

			this._instances = {
				'DataManager'						: DataManager,
				'ChangeResidenceNumModalManager'	: new MYNAMESPACE.modules.ChangeResidenceNumModalManager()
			};
			this._timerObj = {
				'forUpdate'		: {
					'timerId'		: null,
					'recordId'		: null,
					'data'			: null
				},
				'forCheck'		: null
			}
			$("#fieldsWrapper > ul.body > li").each(function(i) {
				var recordId = $(this).attr('data-record-id');
				var hasTextArea = 0 < $(this).find('.fieldVal > textarea').length ? true : false;
				thisObj._currentVal['recordId_' + recordId] = {
					'name'	: $(this).find('.fieldName > input[type="text"]').val(),
					'val'	: hasTextArea === true ? $(this).find('.fieldVal > textarea').val() : $(this).find('.fieldVal > input[type="text"]').val()
				}
			});
			// console.log(this._currentVal);
		}
		
		/*
		 * FRKデータを画面に表示するメソッド
		 * @param	frkDataArr		FRKデータ配列
		 * @return	void
		 */
		,showFRK: function(frkDataArr) {
			// console.log('showFRKData');
			// console.log(frkDataArr);
			var thisObj = this;
			var diffObj = {};
			var isDifferent = false;
			var ulElem = $('#fieldsWrapper > ul.body');
			$(thisObj).trigger('onInitShowFRK');

			for (var i=0, len=frkDataArr.length; i<len; i++) {
				var elem = ulElem.find('li[data-frk-index="' + i + '"]');
				if (elem.length) {
					var oldVal = frkDataArr[i];
					var newVal = frkDataArr[i];
					
					if (elem.find('.fieldVal > input[type="text"]').length) {
						var elem2 = elem.find('.fieldVal > input[type="text"]');
						oldVal = elem2.val();
						elem2.val(newVal);
					} else if (elem.find('.fieldVal > textarea').length) {
						var elem2 = elem.find('.fieldVal > textarea');
						oldVal = elem2.val();
						elem2.val(newVal);
					}
					
					if (oldVal !== newVal) {
						isDifferent = true;
						var frkKey = elem.attr('data-frk-key');
						var recordId = elem.attr('data-record-id');
						diffObj['frk-index_' + i] = {'id':recordId, 'key':frkKey, 'oldVal':oldVal, 'newVal':newVal};
						thisObj._currentVal['recordId_' + recordId]['val'] = newVal;
					}
				}
			}
			
			$(thisObj).trigger('onCompleteShowFRK', isDifferent === true ? diffObj : null);
		}

		/*
		 * Tooltip更新メソッド
		 * @param	void
		 * @return	void
		 */
		,refreshTooltip: function() {
			var thisObj = this;
			$(".tooltip").remove();
			$('[data-placement][data-original-title]').tooltip();
		}

		/*
		 * フィールド追加メソッド
		 * @param	targetOrder		フィールドを追加する位置
		 * @return	void
		 */
		,insert: function(tmpElementId, targetOrder) {
			var thisObj = this;
			// console.log('tmpElementId = ' + tmpElementId);
			// console.log('targetOrder = ' + targetOrder);
			var method = function(recordId) {
				// console.log('recordId = ' + recordId);
				var source = '\
					<li class="isShow" data-record-id="' + recordId + '" data-frk-index="-1">\
						<div class="statusWrapper">\
							<div class="btn-hole">\
								<div class="btn-group" data-toggle="buttons-radio">\
									<button type="button" class="btn btn-test showBtn active" data-placement="bottom" data-original-title="物件概要パーツにこのフィールドを表示します。"><span><i data-icon=""></i>表示</span></button>\
									<button type="button" class="btn btn-test hideBtn" data-item-name="isHide" data-placement="bottom" data-original-title="このフィールドを物件概要パーツでは表示しません。"><span><i data-icon=""></i>非表示</span></button>\
								</div>\
							</div>\
						</div>\
						<div class="dataWrapper">\
							<div class="fieldName"><input type="text"></div>\
							<div class="fieldVal">\
								<textarea></textarea>\
							</div>\
						</div>\
						<div class="isFrk">&nbsp;</div>\
						<div class="controller">\
							<button type="button" class="btn btn-primary btn-bright btn-test addBtn" data-placement="left" data-original-title="このフィールドの下に新しいフィールドを追加します。"><span><i data-icon=""></i></span></button>\
							<button type="button" class="btn btn-danger btn-bright btn-test delBtn" data-placement="left" data-original-title="このフィールドを削除します。"><span><i data-icon=""></i></span></button>\
						</div>\
					</li>\
				';
				thisObj.refreshTooltip();
				return $(source);
			}
			$('#fieldsWrapper ul.body > li').eq(targetOrder).after(method(tmpElementId));
			thisObj._currentVal[tmpElementId] = {
				'name'	: '',
				'val'	: ''
			}
		}
		
		/*
		 * フィールド削除メソッド
		 * @param	recordId		削除するフィールドエレメントのレコードID
		 * @return	void
		 */
		,delete: function(recordId) {
			var thisObj = this;
			$('li[data-record-id="' + recordId + '"]').remove();
			thisObj.refreshTooltip();
		}
		
		/*
		 * フィールド更新メソッド
		 * @param	recordId		更新するフィールドエレメントのレコードIID
		 * @param	data			更新後のフィールドエレメントのデータ
		 * @return	void
		 */
		,update: function(recordId, data) {
			var thisObj = this;
			if (thisObj._isUpdateThrough === true) {
				thisObj._isUpdateThrough = false;
				return;
			}
			var targetLiElem = $('li[data-record-id="' + recordId + '"]');

			if (data['recordId']) {
				delete thisObj._currentVal[recordId];
				targetLiElem.attr('data-record-id', data['recordId']);
				thisObj._currentVal['recordId_' + data['recordId']] = {
					'name'	: '',
					'val'	: ''
				}
			}
			if (data['name']) {
				if (data['name'] !== thisObj._currentVal['recordId_' + recordId]['name'])  {
					targetLiElem.find('.fieldName > input').val(data['name']);
					thisObj._currentVal['recordId_' + recordId] = thisObj._currentVal['recordId_' + recordId] || {};
					thisObj._currentVal['recordId_' + recordId]['name'] = data['name'];
				}
			}
			if (data['val']) {
				if (data['val'] !== thisObj._currentVal['recordId_' + recordId]['val'])  {
					var targetDiv = targetLiElem.find('.fieldVal');
					if (targetDiv.find('>input[type="text"]')) {
						targetDiv.find('>input[type="text"]').val(data['val']);
					} else if (targetDiv.find('>textarea')) {
						targetDiv.find('>textarea').html(data['val']);
					}
					thisObj._currentVal['recordId_' + recordId] = thisObj._currentVal['recordId_' + recordId] || {};
					thisObj._currentVal['recordId_' + recordId]['val'] = data['val'];
				}
			}
			if (data['visibility']) {
				targetLiElem.removeClass('isShow isHide').addClass(data['visibility']);
				var targetBtnClass = data['visibility'] === 'isShow' ? 'showBtn' : 'hideBtn';
				targetLiElem.find('.statusWrapper').find('button').removeClass('active').end().find('button.'+targetBtnClass).addClass('active');
			}
			thisObj.refreshTooltip();
		}
		
		/*
		 * sortableクラスのインスタンス作成メソッド
		 * @param	void
		 * @return	void
		 */
		,setSortableInstance: function() {
			var thisObj = this;
			$("#fieldsWrapper > ul.body").sortable(
				{
					axis			: 'y',
					placeholder		: "placeholder",
					revert			: 100,
					tolerance		: 'pointer',
					start			: function(event, ui) {
						var elem = $(ui.item);
						$('.placeholder').height(elem.height());
					},
					update			: thisObj.onSortField,
					deactivate: function(event, ui) {
						// console.log('deactivate');
					}
				}
			);
		}
		
		/*
		 * 表示/非表示ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onSortField: function(event, ui) {
			var thisObj = this;
			var liElement = $(ui.item);
			var targetRecordId = liElement.attr('data-record-id');
			var targetOrder = liElement.parent().children().index(liElement[0]);
			$(thisObj).trigger('onChangeOrder', [targetRecordId, targetOrder]);
		}

		/*
		 * 表示/非表示ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickVisibilityButton: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);

			var liElement = element.parent().parent().parent().parent();
			var targetRecordId = liElement.attr('data-record-id')
			var data = {
				'visibility' 		: element.hasClass('showBtn') ? 'isShow' : 'isHide',
				'mtr_status_id'		: element.hasClass('showBtn') ? $('input[name="visibleId"]').val() : $('input[name="invisibleId"]').val()
			}
			$(thisObj).trigger('onChangeData', [targetRecordId, data]);
		}
		
		/*
		 * 追加/削除ボタン押下時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickControllButton: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);
			var liElement = element.parent().parent();

			if (element.hasClass('delBtn')) {
				if (element.hasClass('btn-disable') === false) {
					var targetRecordId = liElement.attr('data-record-id');
					$(thisObj).trigger('onClickDelBtn', targetRecordId);
				}
			} else {
				var targetOrder = liElement.parent().children().index(liElement[0]);
				$(thisObj).trigger('onClickAddBtn', targetOrder);
			}
		}
		
		/*
		 * Formエレメントにフォーカスがあたった/外れた時にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onChangeFocus: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);
			var listElem = element.parent().parent().parent();
			if (element[0].nodeName === 'BUTTON') {
				if (element.parent().hasClass('btn-group')) {
					listElem = element.parent().parent().parent().parent();
				} else {
					listElem = element.parent().parent();
				}
			}
			listElem.removeClass('current').addClass(event.type === 'focusin' ? 'current' : '');
		}
		
		/*
		 * フォントサイズ/行間の値が変わった時にコールされるメソッド
		 * @param	event		Eventオブジェクト
		 * @param	type		"fontSize"===フォントサイズの値が変わった。"lineHeight"===行間の値が変わった。
		 * @return	void
		 */
		,onChangeText: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			var element = $(event.currentTarget);
			var parentElem = element.parent();
			var listElem = element.parent().parent().parent();
			var targetRecordId = listElem.attr('data-record-id');
			var currentFieldVal = element.val();
			var data = {};

			if (parentElem.hasClass('fieldName')) {
				if (currentFieldVal !== thisObj._currentVal['recordId_' + targetRecordId]['name'])  {
					thisObj._currentVal['recordId_' + targetRecordId]['name'] = currentFieldVal;
					data = {'name':currentFieldVal};
					thisObj._hasSaveData = true;
					thisObj._isUpdateThrough = true;
					thisObj._currentVal['recordId_' + targetRecordId]['name'] = currentFieldVal;
					// console.log('timer始動');
				} else {
					return false;
				}

			} else if (parentElem.hasClass('fieldVal')) {
				if (currentFieldVal !== thisObj._currentVal['recordId_' + targetRecordId]['val'])  {
					thisObj._currentVal['recordId_' + targetRecordId]['val'] = currentFieldVal;
					data = {'val':currentFieldVal};
					thisObj._hasSaveData = true;
					thisObj._isUpdateThrough = true;
					thisObj._currentVal['recordId_' + targetRecordId]['val'] = currentFieldVal;
					// console.log('timer始動');
				} else {
					return false;
				}
			} else {
				// console.log('none');
				return false;
			}

			if (thisObj._hasSaveData === true) {
				// console.log('timerセット');
				if (thisObj._timerObj['forUpdate']['timerId']) {
					if (thisObj._timerObj['forUpdate']['recordId'] !== targetRecordId) {
						$(thisObj).trigger('onChangeData', [thisObj._timerObj['forUpdate']['recordId'], thisObj._timerObj['forUpdate']['data']]);
					}
					clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
				}

				thisObj._timerObj['forUpdate']['recordId'] = targetRecordId;
				// thisObj._timerObj['forUpdate']['data'] = {'val':currentFieldVal};
				thisObj._timerObj['forUpdate']['data'] = data;
				thisObj._timerObj['forUpdate']['timerId'] = setTimeout(
					function(event2) {
						clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
						thisObj._timerObj['forUpdate']['timerId'] = null;;
						$(thisObj).trigger('onChangeData', [thisObj._timerObj['forUpdate']['recordId'], thisObj._timerObj['forUpdate']['data']]);
						thisObj._hasSaveData = false;
					},
					3000
				);
			}
		}

		/*
		 * Text/TextAreaにフォーカスがあたった際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onFocusInputArea: function(event) {
			var thisObj = this;
			thisObj.onChangeFocus(event);
			if (thisObj._timerObj['forCheck']) {
				clearInterval(thisObj._timerObj['forCheck']);
				thisObj._timerObj['forCheck'] = null;
			}
			var element = $(event.currentTarget);
			var nodeName = element[0].nodeName;
			if (nodeName === 'INPUT' && element.attr('type') === "text") {
				thisObj._timerObj['forCheck'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
			} else if (nodeName === 'TEXTAREA') {
				thisObj._timerObj['forCheck'] = setInterval(function(event2) {thisObj.onChangeText(event);}, 100);
			}
		}

		/*
		 * Text/TextAreaからフォーカスが外れた際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onBlurInputArea: function(event) {
			var thisObj = this;
			thisObj.onChangeFocus(event);
			if (thisObj._timerObj['forCheck']) {
				clearInterval(thisObj._timerObj['forCheck']);
				thisObj._timerObj['forCheck'] = null;
			}
			if (thisObj._hasSaveData === true) {
				clearTimeout(thisObj._timerObj['forUpdate']['timerId']);
				thisObj._timerObj['forUpdate']['timerId'] = null;;
				$(thisObj).trigger('onChangeData', [thisObj._timerObj['forUpdate']['recordId'], thisObj._timerObj['forUpdate']['data']]);
				thisObj._hasSaveData = false;
			}
		}

		/*
		 * 物件番号変更ボタンがクリックされた際にコールされるイベントハンドラ
		 * @param	event		Eventオブジェクト
		 * @return	void
		 */
		,onClickChangeResidenceNumBtn: function(event) {
			var thisObj = this;
			event.preventDefault();
			event.stopPropagation();
			// var element = $(event.currentTarget);
			$(thisObj._instances['ChangeResidenceNumModalManager']).on('onOpenModal', function(event) {
				$(thisObj._instances['ChangeResidenceNumModalManager']).off('onOpenModal');
				thisObj.refreshTooltip();

				$(thisObj._instances['ChangeResidenceNumModalManager']).on('onChangeResidenceNum', function(event, newResidenceNum) {
					console.log('部県番号が変わった :: newResidenceNum = ' + newResidenceNum);
					thisObj._instances['DataManager'].setData('residenceNum', newResidenceNum);
					$(".residenceNum").text(newResidenceNum);
					$(thisObj).trigger('onChangeResidenceNum', newResidenceNum);
				});
				
				$(thisObj._instances['ChangeResidenceNumModalManager']).on('onCloseModal', function(event) {
					$(thisObj._instances['ChangeResidenceNumModalManager']).off('onCloseModal');
					$(thisObj._instances['ChangeResidenceNumModalManager']).off('onChangeResidenceNum');
					thisObj.refreshTooltip();
				});
			})
			thisObj._instances['ChangeResidenceNumModalManager'].open(thisObj._instances['DataManager'].getData()['residenceNum']);
		}

		/*
		 * このクラスで管理するページ/エレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(isEnabled) {
			var thisObj = this;
			if (isEnabled === true && thisObj._isEnabled === false) {
				thisObj._isEnabled = true;

				$('#container')
					.on('click', '.changeResidenceNumBtn', thisObj.onClickChangeResidenceNumBtn);

				$("#fieldsWrapper")
					.on('click', '.statusWrapper button', thisObj.onClickVisibilityButton)
					.on('focus', '.statusWrapper button', thisObj.onChangeFocus)
					.on('blur', '.statusWrapper button', thisObj.onChangeFocus)

					.on('click', '.controller button', thisObj.onClickControllButton)
					.on('focus', '.controller button', thisObj.onChangeFocus)
					.on('blur', '.controller button', thisObj.onChangeFocus)

					.on('focus', 'input[type="text"], textarea', thisObj.onFocusInputArea)
					.on('blur', 'input[type="text"], textarea', thisObj.onBlurInputArea);

				thisObj.setSortableInstance();

			} else if (isEnabled === false && thisObj._isEnabled === true){
				thisObj._isEnabled = false;
			}
		}
	}
});
