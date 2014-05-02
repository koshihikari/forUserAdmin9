

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfLink');
	MYNAMESPACE.modules.PreviewOfLink = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfLink.prototype = {
		_isEventEnabled							: false
		,_instances								: {}
		,_createdElement						: {}

		/*
		 * コンストラクタ
		 * @param	void
		 * @return	void
		 */
		,initialize: function(DataManager) {
			var thisObj = this;
			_.bindAll(
				this
				,'refreshStyle'
			);
			this._instances = {
				'DataManager'		: DataManager
			}
		}

		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElem = $("#" + elementId);
			// console.log('elementId = ' + elementId);
			// console.log('targetElem');
			// console.log(targetElem);
			if (targetElem[0].nodeName !== 'TD') {
				targetElem = targetElem.find('.contentWrapper');
			}
			var aNode = targetElem.find('a');
			var hasLink = false;
			var url = '';
			var appendSource = '';

			// console.log('---------------------');
			// console.log('PreviewOfLink :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('aNode');
			// console.log(aNode);
			// console.log(aNode.length);
			// console.log('targetElem.find(a)');
			// console.log(targetElem.find('a'));
			// console.log('---------------------');

			var baseType  = '';
			switch (targetProperty['baseType']) {
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
			targetProperty['baseType'] = baseType;

			if (
				targetProperty['baseType'] === 'url' &&
				targetProperty['linkUrl'] !== ''
			) {
				hasLink = true;
				url = targetProperty['linkUrl'];
				if (targetProperty['linkType'] === 'mail') {
					url = 'mailto:' + targetProperty['linkUrl'];
				} else if (targetProperty['linkType'] === 'phoneNum') {
					url = 'tel:' + targetProperty['linkUrl'];
				}
				appendSource = '<a href="' + url + '" target="' + targetProperty['target'] + '" />';

			} else if (
				targetProperty['baseType'] === 'page' &&
				targetProperty['linkPageId'] !== ''
			) {
				hasLink = true;
				url = '%pageId:' + targetProperty['linkPageId'] + '%';
				appendSource = '<a href="' + url + '" target="' + targetProperty['target'] + '" />';

			} else if (
				targetProperty['baseType'] === 'mapAddress' &&
				targetProperty['mapUrl'] !== ''
			) {
				hasLink = true;
				url = 'http://maps.apple.com/?q=' + targetProperty['mapUrl'];
				appendSource = '<a href="' + url + '" class="openmap" />';
			}

			// if (elementId === 'id-1371923589822') {
			// 	console.log('PreviewOfLink :: refreshStyle :: elementId = ' + elementId + ', itemName = ' + itemName);
			// 	console.log('targetProperty');
			// 	console.log(targetProperty);
			// 	console.log('	hasLink = ' + hasLink);
			// 	console.log('	aNode.length = ' + aNode.length);
			// }
			if (hasLink === true) {
				if (aNode.length < 1) {
					if (targetElem.find('> *').length === 0) {
						// if (elementId === 'id-1371923589822') {
						// 	console.log('	01');
						// }
						var val = targetElem.html();
						targetElem.empty();
						$(appendSource).appendTo(targetElem).html(val);
					} else {
						// if (elementId === 'id-1371923589822') {
						// 	console.log('	02');
						// }
						targetElem.find('> *').wrap(appendSource);
					}
				} else {
						// if (elementId === 'id-1371923589822') {
						// 	console.log('	03');
						// }
					aNode.not('.custom-link').attr('href', url);
					// aNode.attr('href', url);
				}
			} else {
				if (aNode.length) {
					if (0 < aNode.find('> *').length) {
						// if (elementId === 'id-1371923589822') {
						// 	console.log('	04');
						// }
						aNode.not('.custom-link').find('> *').unwrap();
						// aNode.find('> *').unwrap();
					} else {
						// if (elementId === 'id-1371923589822') {
						// 	console.log('	05');
						// }
						aNode.not('.custom-link').remove();
						// aNode.remove();
					}
				}
			}



			/*
			if (targetProperty['linkUrl'] === '') {
			// if (
			// 	(targetProperty['isDirectInput'] === true && targetProperty['linkUrl'] === '') ||
			// 	(targetProperty['isDirectInput'] === false && targetProperty['linkPageId'] === '')
			// ) {
				if (aNode.length) {
					// console.log('unwrap :: length = ' + aNode.find('> *').length);
					if (0 < aNode.find('> *').length) {
						aNode.find('> *').unwrap();
					} else {
						aNode.remove();
					}
				}

			} else {
				var url = targetProperty['linkUrl'];
				if (targetProperty['linkType'] === 'mail') {
					url = 'mailto:' + targetProperty['linkUrl'];
				} else if (targetProperty['linkType'] === 'phoneNum') {
					url = 'tel:' + targetProperty['linkUrl'];
				}

				var appendSource = '<a href="' + url + '" target="' + targetProperty['target'] + '" />';
				if (aNode.length < 1) {
					if (targetElem.find('> *').length === 0) {
						var val = targetElem.html();
						targetElem.empty();
						$(appendSource).appendTo(targetElem).html(val);
					} else {
						targetElem.find('> *').wrap(appendSource);
					}
				} else {
					aNode.attr('href', url);
				}
			}
			*/

			targetElem.find('a').css('textDecoration', targetProperty['isEnabledUnderline'] === true ? 'underline' : 'none');

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
