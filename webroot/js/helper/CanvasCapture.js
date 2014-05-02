

jQuery.noConflict();
jQuery(document).ready(function($){
//$(function() {
	/*
	 * リンク先ページ選択Modal管理クラス
	 * eventName		onOpenDialog, onCloseDialog, onClickAddPartsBtn, onClickSaveEditPartsBtn, onClickDelPartsBtn
	 */
	MYNAMESPACE.namespace('modules.CanvasCapture');
	MYNAMESPACE.modules.CanvasCapture = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.CanvasCapture.prototype = {
		_isEnabled						: false
		,_targetId						: null
		,_elems							: {}
		,_option						: {}
		,_pageListData					: {}
		
		/*
		 * コンストラクタ
		 * @param	id 		Web上の画像挿入ModalのID
		 * @return	void
		 */
		,initialize: function(id, option) {
			var thisObj = this;
			
			this._targetId = id;
			this._option = option;
			_.bindAll(this, 'create');
			
			// var rootElement = this.createElement(id);
			// $("body").append(rootElement);
			// this._elems		= {
			// 	'all'			: rootElement,
			// 	'mainModal'		: $('#' + id)
			// }
		}
		
		/*
		 * 指定されたURLをキャプチャした画像を作成するメソッド
		 * @param	url		キャプチャするURL
		 * @return	このクラスが管理するエレメント
		 */
		,create: function(url) {
		//	$("#content").css({'display':'none'});
			var thisObj = this;
					var a = document.createElement("iframe");
					$(a)
						.attr('src', url)
						// .css(
						// 	{
						// 		visibility: "hidden",
						// 		display: 'none'
						// 	}
						// )
						.width(320)
						.height(568);
					$("#content").append(a);
					var b = a.contentWindow.document;
				//	b.open();
					$(a.contentWindow).load(
						function() {
							var g = $(a).contents().find("body");
							var h = {
								onrendered: function(j) {
									console.log('onreandered');
									$("#sideMenuForUserAdmin").css('display', 'none');
									$("#content").empty().append(j);
									$(j).css({'width':'10%'});
									/*
									try{
										var imgdata = j.toDataURL();
										imgdata = imgdata.replace('data:image/png;base64,', '');
										// var img = "<img src='" + data + "' style='border:1px solid #999; width:400px;'/>";
										var img = "<img src='" + imgdata + "'/>";
										$("#content").append(img);
										// console.log(j);
										// console.log(imgdata);
										// console.log(img);
										$(thisObj).trigger('onCreateComplete', imgdata);
									}catch(e){
										console.log('error');
										$(thisObj).trigger('onCreateError');
									}
									*/
									// $("#content").append(j);
									// $("#getscreenshot").prop("disabled", false);
									// $("base").attr("href", "")
								},
								allowTaint: true,
								taintTest: false
								// flashcanvas: "src/flashcanvas.min.js"



								/*
								,
								useOverflow : false,
								width : 200,
								height : 100
								*/



							};
							var i = html2canvas(g, h);
						}
					)
					/*
					b.write('a');
					b.close()
					*/
		}
	}
});
