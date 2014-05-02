

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfAbout');
	MYNAMESPACE.modules.PreviewOfAbout = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfAbout.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		,_methodObj								: {}
		// ,_hasFRKData							: false
		// ,_FRKData								: []

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager, methodObj) {
			var thisObj = this;
			this._instances = {
				'DataManager'		: DataManager
			}
			this._methodObj = methodObj;
			_.bindAll(
				this
				,'setStyle'
				,'refreshStyle'
				,'build'
				,'setEvent'
			);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,setStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElem = $("#" + elementId);
			// console.log('PreviewOfAbout :: setStyle :: elementId = ' +  elementId + ', itemName = ' + itemName);
			// console.log('	 length = ' + targetElem.find('> .contentWrapper > .Table > table > tbody *').length);
			if (targetElem.find('> .contentWrapper > .Table > table > tbody *').length < 1) {
				thisObj.build(elementId);
			}
			// console.log('thisObj._FRKData');
			// console.log(thisObj._FRKData);
			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			thisObj.setStyle(elementId, itemName, targetProperty);
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,build: function(elementId) {
			var thisObj = this;
			var targetElem = $("#" + elementId + '> .contentWrapper > .Table');
			targetElem.find('> *').remove();
			var sourceArr = [];
			var FRKData = thisObj._instances['DataManager'].getFRK();
			console.log('PreviewOfAbout :: build');
			console.log(FRKData);
			for (var i=0,len=FRKData.length; i<len; i++) {
				var sourceStr = '<table><tbody>';
				// console.log(i + ' :: category.key = ' + FRKData[i]['category']['key']);
				if (FRKData[i]['category']['key'] !== '') {
					// console.log('出力');
					sourceStr += '<tr>';
					sourceStr += '<td id="' + elementId + '_category" data-item-name="AboutTd" class="category editable tdForAbout" colspan="2">' + FRKData[i]['category']['key'] + '</td>';
					sourceStr += '</tr>';
				}

				if (FRKData[i]['items'] && FRKData[i]['items'].length) {
					// console.log('len = ' + FRKData[i]['items'].length);
					for (var j=0,len2=FRKData[i]['items'].length; j<len2; j++) {
						var attrStrForKeyTd = i === 0 ? ' id="' + elementId + '_0-0" data-item-name="AboutTd"' : '';
						var attrStrForValTd = i === 0 ? ' id="' + elementId + '_0-1" data-item-name="AboutTd"' : '';
						sourceStr += '<tr>';
						sourceStr += '<td class="key editable tdForAbout"' + attrStrForKeyTd + '>' + FRKData[i]['items'][j]['key'] + '</td>';
						sourceStr += '<td class="val editable tdForAbout"' + attrStrForValTd + '>' + FRKData[i]['items'][j]['val'] + '</td>';
						sourceStr += '</tr>';
					}
				}
				sourceStr += '</tbody></table>';

				sourceArr.push(sourceStr);

			}
			// console.log(sourceArr.join(''));
			targetElem.append(sourceArr.join('<br />'));
			thisObj.setEvent(elementId, false);
			thisObj.setEvent(elementId, true);
		}

		/*
		 * このクラスで管理するエレメントのイベント有効/無効メソッド
		 * @param	isEnabled		true===イベント有効
		 * @return	void
		 */
		,setEvent: function(elementId, isEnabled) {
			var thisObj = this;
			var targetElem = $("#" + elementId).find('> .contentWrapper > .Table > table > tbody > tr');

			if (isEnabled === true && thisObj._isEventEnabled === false) {
				thisObj._isEventEnabled = true;

				$(targetElem)
					.on('click', '.editable', function(event) {
						event.stopPropagation();
						event.preventDefault();
						var currentElem = $(this);
						if (currentElem.hasClass('tdForAbout') === true) {
							// console.log('attr = ');
							// console.log(currentElem.attr('class'));

							var tdElementId = '';
							if (currentElem.hasClass('category') === true) {
								tdElementId = elementId + '_category';

							} else if (currentElem.hasClass('key') === true) {
								tdElementId = elementId + '_0-0';

							} else if (currentElem.hasClass('val') === true) {
								tdElementId = elementId + '_0-1';

							} else {
								var index = currentElem.parent().children().index(currentElem);
								tdElementId = elementId + '_0-' + index;
								// console.log(thisObj._instances['DataManager'].getElementDataObj(tdElementId)['itemName']);
								if (thisObj._instances['DataManager'].getElementDataObj(tdElementId)['itemName'] === undefined) {
									var allElementObj = thisObj._instances['DataManager'].getAllElementDataObj();
									// console.log('更新前');
									// console.log(allElementObj);
									var tmpItemData = thisObj._instances['DataManager'].getItemDataObj('Td');
									var obj = {
										'order'								: 0,
										'smartphonePageElementId'			: '',
										'smartphoneLibraryElementId'		: '',
										'smartphoneLibraryId'				: '',
										'itemName'							: 'AboutTd',
										'isLibrary'							: false,
										'property'							: tmpItemData['components']
									};
									thisObj._instances['DataManager'].replaceElementDataObj(tdElementId, obj);
									var allElementObj = thisObj._instances['DataManager'].getAllElementDataObj();
									// console.log('更新後');
									// console.log(allElementObj);
								}
							}
							thisObj._methodObj['onClick'](event, tdElementId);
						}
					})

			} else if (isEnabled === false && thisObj._isEventEnabled === true){
				thisObj._isEventEnabled = false;

				$(targetElem)
					.off('mouseenter', 'td.editable')
					.off('mouseleave', 'td.editable');
			}
		}
	}
});
