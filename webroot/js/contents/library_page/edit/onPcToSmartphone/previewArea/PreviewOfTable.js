

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfTable');
	MYNAMESPACE.modules.PreviewOfTable = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfTable.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}
		// ,_wasArrived							: false

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			this._instances = {
				'DataManager'		: DataManager
			}
			_.bindAll(
				this
				,'build'
				,'refreshStyle'
			);
		}

		/*
		 * このクラスで管理するエレメント構築ソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,build: function(elementId, targetProperty, isSilent) {
			var thisObj = this;
			var targetElem = $("#" + elementId + ' > div.contentWrapper > div.Table > table');
			var addElementIdArr = [];
			var delElementIdArr = [];
			// console.log('PreviewOfTable :: build');
			// if (thisObj._wasArrived === true) return;
			// thisObj._wasArrived = true;

			// console.log('---------------------------');
			// console.log('elementId = ' + elementId + ', isSilent = ' + isSilent);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log(	'tr.length = ' + targetElem.find('> tbody > tr').length);

			if (targetElem.find('> tbody > tr').length === 0) {
				// console.log('a');
				// console.log('tr新規作成開始');
				for (var row=targetElem.find('> tbody > tr').length; row<targetProperty['row']; row++) {
					// console.log('a-1');
					// console.log('tr新規作成');
					// var cloneRowElem = targetElem.find('tr').eq(row-1).clone();
					targetElem.append('<tr></tr>');
				}
			} else if (targetElem.find('> tbody > tr').length < targetProperty['row']) {
				// console.log('b');
				// console.log('tr複製開始');
				for (var row=targetElem.find('> tbody > tr').length; row<targetProperty['row']; row++) {
					// console.log('b-1');
					// console.log('tr複製');
					var cloneRowElem = targetElem.find('> tbody > tr').eq(row-1).clone();
					var tmp = cloneRowElem.find('> td > *').remove().end().find('> td').removeClass('hasChildren');
					// console.log('cloneRowElem.length = ' + cloneRowElem.length);
					targetElem.append(cloneRowElem);
				}
			} else if (targetProperty['row'] < targetElem.find('> tbody > tr').length) {
				// console.log('c');
				while (targetProperty['row'] < targetElem.find('> tbody > tr').length) {
					// console.log('c-1');
					targetElem.find('> tbody > tr:last-child > td').each(function(i) {
						// console.log('c-2');
						delElementIdArr.push($(this).attr('id'));
					});
					targetElem.find('> tbody > tr').remove('tr:last-child');
				}
			}

			/*
			*/
			// console.log('	td.length = ' + targetElem.find('tr:last-child > td').length);
			if (targetElem.find('> tbody > tr:last-child > td').length < targetProperty['col']) {
				// console.log('d');
				// console.log('td追加開始 :: tr.length = ' + targetElem.find('tr').length);
				for (var row=0,rowLen=targetElem.find('> tbody > tr').length; row<rowLen; row++) {
					// console.log('d-1');
					for (var col=0; col<targetProperty['col']; col++) {
						// console.log('d-2');
						if (targetElem.find('> tbody > tr').eq(row).find('> td').eq(col).length === 0) {
							// console.log('d-3');
							// console.log('tr[' + row + ']');
							// console.log(targetElem.find('tr').eq(row));
							targetElem.find('> tbody > tr').eq(row).append('<td></td>');
							// targetElem.find('> tbody > tr').eq(row).append('<td>&nbsp;</td>');
							// targetElem.find('tr').eq(row).append($('<td>&nbsp;</td>'));
							// addElementIdArr.push(
							// 	{
							// 		'td_id'		: elementId + '_' + row + '-' + col,
							// 		'order'		: col
							// 	}
							// );
							addElementIdArr.push(elementId + '_' + row + '-' + col);
						}
					}
				}
			} else if (targetProperty['col'] < targetElem.find('> tbody > tr:last-child > td').length) {
				// console.log('e');
				// console.log('tr削除開始');
				for (var row=0,rowLen=targetElem.find('> tbody > tr').length; row<rowLen; row++) {
					while (targetProperty['col'] < targetElem.find('> tbody > tr').eq(row).find('> td').length) {
					// while (targetProperty['col'] < targetElem.find('> tbody > tr:last-child > td').length) {
						// console.log('e-1');
						delElementIdArr.push(targetElem.find('> tbody > tr').eq(row).find('> td:last-child').attr('id'));
						// delElementIdArr.push(targetElem.find('> tbody > tr:last-child > td:last-child').attr('id'));
						// console.log('tr削除');
						targetElem.find('> tbody > tr').eq(row).find('> td').remove('td:last-child');
						// targetElem.find('> tbody > tr:last-child > td').remove('td:last-child');
					}
				}
			}
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('addElementIdArr');
			// console.log(addElementIdArr);
			// console.log('delElementIdArr');
			// console.log(delElementIdArr);
			// console.log('---------------------------');
			// addElementIdArrのlength回、DataManager.insert()をコール
			// delElementIdArrのlength回、DataManager.delete()をコール

			targetElem.find(' > tbody > tr').each(function(row) {
				// console.log('f');
				$(this).find('> td').each(function(col) {
					// console.log('f-1');
					// $(this).attr('id', elementId + '_' + row + '-' + col);
					$(this)
						.attr(
							{
								'id'				: elementId + '_' + row + '-' + col,
								'data-item-name'	: 'Td'
							}
						)
						.addClass('editable');
					// idArr.push(elementId + '_' + row + '-' + col);
					// addElementIdArr.push(elementId + '_' + row + '-' + col);
					if (0 < $(this).find('> *').length) {
						var txt = $(this).html();
						txt = txt.replace(/^(%u3000|%20|%09)+|&nbsp;/g,'');
						$(this).html(txt);
					}
				});
			})

			if (!$("#" + elementId).hasClass('not-editable')) {
				// console.log('g');
				targetElem.find(' > tbody > tr > td').addClass('droppable');
			}
			// if (thisObj._wasArrived === true) {
			// var element = $(elementId);
			// var parent = element.parent();
			// var parentId = parent.attr('id');
			// var order = 0;
			// parent.find('>*').each(function(i) {
			// 	if ($(this).get(0) === element.get(0)) {
			// 		order = i;
			// 		return false;
			// 	}
			// });
			/*
			var elementDataObj = thisObj._instances['DataManager'].getElementDataObj(elementId);
			thisObj._instances['DataManager'].editTableElement(elementId, elementDataObj['order'], targetProperty, addElementIdArr, delElementIdArr, thisObj._instances['DataManager'].getItemDataObj('Td')['components']);
			*/
			// }
			// thisObj._wasArrived = true;

			if (isSilent !== true) {
				// console.log('h');
				$(thisObj).trigger('onCompleteBuild', elementId);
			}
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			// console.log('--------------------------');
			// console.log('--------------------------');
			// console.log('PreviewOfTable :: refreshStyle :: elementId = ' + elementId + ', componentName = ' + componentName);
			// console.log(targetProperty);
			// console.log('--------------------------');
			// console.log('--------------------------');
			thisObj.build(elementId, targetProperty, true);

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
