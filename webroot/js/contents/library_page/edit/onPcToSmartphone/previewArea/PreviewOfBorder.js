

jQuery.noConflict();
jQuery(document).ready(function($){
	/*
	 * データ管理クラス
	 * eventName		onRequestComplete		データのリクエスト完了
	 */
	MYNAMESPACE.namespace('modules.PreviewOfBorder');
	MYNAMESPACE.modules.PreviewOfBorder = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.PreviewOfBorder.prototype = {
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
		,build: function(elementId, targetProperty) {
			var thisObj = this;
			$(thisObj).trigger('onCompleteBuild', elementId);
		}
		
		/*
		 * プレビューエリアのスキン変更メソッド
		 * @param	deviceName		変更するスキン名
		 * @return	void
		 */
		,refreshStyle: function(elementId, itemName, targetProperty) {
			var thisObj = this;
			var targetElem = $("#" + elementId);

			// console.log('---------------------');
			// console.log('PreviewOfBorder :: refreshStyle');
			// console.log('	elementId = ' + elementId + ', itemName = ' + itemName);
			// console.log('targetProperty');
			// console.log(targetProperty);
			// console.log('targetElem');
			// console.log(targetElem);
			// console.log('nodeName = ' + targetElem[0].nodeName);
			// console.log('td = ' + (targetElem[0].nodeName === 'TD'));
			// console.log('---------------------');

			if (targetElem[0].nodeName === 'TD') {
				/*
				if (targetElem.attr('data-item-name') === 'AboutTd') {
					var searchKeyName = targetElem.hasClass('key') ? 'key' : 'val';
					targetElem = targetElem.parent().parent().find('td.tdForAbout.' + searchKeyName);
					// console.log('---------------------');
					// console.log('targetElem');
					// console.log(targetElem);
					// console.log('---------------------');
				}
				*/
				/*
				console.log('.tdForAbout = ' + (targetElem.hasClass('tdForAbout')));
				if (targetElem.hasClass('tdForAbout')) {
					var splitIdArr = elementId.split('_');
					var col = splitIdArr[1].split('-')[1] - 0;
					var className = col === 0 ? 'key' : 'val';
					targetElem = $('#' + splitIdArr[0] + ' td.' + className);
					// console.log('#' + splitIdArr[0] + ' td.' + className);
				}
				*/

				if (targetElem.hasClass('tdForAbout')) {
					var splitIdArr = elementId.split('_');
					if (elementId.indexOf('_category') !== -1) {
						targetElem = $('#' + splitIdArr[0] + ' td.category');
						
					} else {
						var col = splitIdArr[1].split('-')[1] - 0;
						var className = col === 0 ? 'key' : 'val';
						targetElem = $('#' + splitIdArr[0] + ' td.' + className);
					}
				}
					// console.log('---------------------');
					// console.log('targetElem');
					// console.log(targetElem);
					// console.log('---------------------');
				targetElem
					.css(
						{
							'borderTopLeftRadius'				: targetProperty['borderTopLeftRadius'] + 'px',
							'borderTopRightRadius'				: targetProperty['borderTopRightRadius'] + 'px',
							'borderBottomRightRadius'			: targetProperty['borderBottomRightRadius'] + 'px',
							'borderBottomLeftRadius'			: targetProperty['borderBottomLeftRadius'] + 'px',
							'borderStyle'						: targetProperty['borderStyle'],
							'borderColor'						: targetProperty['borderColor'],
							// 'borderWidth'					: targetProperty['borderWidth'] + 'px',
							'borderTopWidth'					: targetProperty['borderTopWidth'] + 'px',
							'borderRightWidth'					: targetProperty['borderRightWidth'] + 'px',
							'borderBottomWidth'					: targetProperty['borderBottomWidth'] + 'px',
							'borderLeftWidth'					: targetProperty['borderLeftWidth'] + 'px',
							'borderTopLeftRadius'				: targetProperty['borderTopLeftRadius'] + 'px',
							'borderTopRightRadius'				: targetProperty['borderTopRightRadius'] + 'px',
							'borderBottomRightRadius'			: targetProperty['borderBottomRightRadius'] + 'px',
							'borderBottomLeftRadius'			: targetProperty['borderBottomLeftRadius'] + 'px'
						}
					)
			} else if (targetElem.attr('data-item-name') === 'Table') {
				targetElem
					.find('td')
						.css(
							{
							'borderStyle'						: targetProperty['borderStyle'],
							'borderColor'						: targetProperty['borderColor'],
							// 'borderWidth'					: targetProperty['borderWidth'] + 'px',
							'borderTopWidth'					: targetProperty['borderTopWidth'] + 'px',
							'borderRightWidth'					: targetProperty['borderRightWidth'] + 'px',
							'borderBottomWidth'					: targetProperty['borderBottomWidth'] + 'px',
							'borderLeftWidth'					: targetProperty['borderLeftWidth'] + 'px',
							'borderTopLeftRadius'				: targetProperty['borderTopLeftRadius'] + 'px',
							'borderTopRightRadius'				: targetProperty['borderTopRightRadius'] + 'px',
							'borderBottomRightRadius'			: targetProperty['borderBottomRightRadius'] + 'px',
							'borderBottomLeftRadius'			: targetProperty['borderBottomLeftRadius'] + 'px'
							}
						)
			} else if (targetElem.attr('data-item-name') === 'Image') {
				targetElem
					.find('img')
						.css(
							{
							'borderStyle'						: targetProperty['borderStyle'],
							'borderColor'						: targetProperty['borderColor'],
							// 'borderWidth'					: targetProperty['borderWidth'] + 'px',
							'borderTopWidth'					: targetProperty['borderTopWidth'] + 'px',
							'borderRightWidth'					: targetProperty['borderRightWidth'] + 'px',
							'borderBottomWidth'					: targetProperty['borderBottomWidth'] + 'px',
							'borderLeftWidth'					: targetProperty['borderLeftWidth'] + 'px',
							'borderTopLeftRadius'				: targetProperty['borderTopLeftRadius'] + 'px',
							'borderTopRightRadius'				: targetProperty['borderTopRightRadius'] + 'px',
							'borderBottomRightRadius'			: targetProperty['borderBottomRightRadius'] + 'px',
							'borderBottomLeftRadius'			: targetProperty['borderBottomLeftRadius'] + 'px'
							}
						)
			} else {
				targetElem
					.css(
						{
							'borderTopLeftRadius'			: targetProperty['borderTopLeftRadius'] + 'px',
							'borderTopRightRadius'			: targetProperty['borderTopRightRadius'] + 'px',
							'borderBottomRightRadius'		: targetProperty['borderBottomRightRadius'] + 'px',
							'borderBottomLeftRadius'		: targetProperty['borderBottomLeftRadius'] + 'px'
						}
					)
					.find(" > div.contentWrapper")
						.css(
							{
								'borderStyle'						: targetProperty['borderStyle'],
								'borderColor'						: targetProperty['borderColor'],
								// 'borderWidth'					: targetProperty['borderWidth'] + 'px',
								'borderTopWidth'					: targetProperty['borderTopWidth'] + 'px',
								'borderRightWidth'					: targetProperty['borderRightWidth'] + 'px',
								'borderBottomWidth'					: targetProperty['borderBottomWidth'] + 'px',
								'borderLeftWidth'					: targetProperty['borderLeftWidth'] + 'px',
								'borderTopLeftRadius'				: targetProperty['borderTopLeftRadius'] + 'px',
								'borderTopRightRadius'				: targetProperty['borderTopRightRadius'] + 'px',
								'borderBottomRightRadius'			: targetProperty['borderBottomRightRadius'] + 'px',
								'borderBottomLeftRadius'			: targetProperty['borderBottomLeftRadius'] + 'px'
							}
						);
			}

			$(thisObj).trigger('onCompleteRefreshStyle', [elementId, itemName]);
		}
	}
});
