/**
 * ...
 * Utilクラス
 * @author DefaultUser
 */

	/*
	 * カラーUtilクラス
	 * eventName
	 * 		onErrorOverSupportFileNum, onErrorDifferentFileType, onErrorOverFileSize
	 * 		onDropFile
	 */
jQuery.noConflict();
jQuery(document).ready(function($){
	MYNAMESPACE.namespace('modules.helper.Util');
	MYNAMESPACE.modules.helper.Util = function() {
		this.initialize.apply(this, arguments);
	};
	MYNAMESPACE.modules.helper.Util.prototype = {
		// _isAnimation						: false
		_animationProp						: {}
		,_curtain							: null
		,_blurCurtain						: null

		// コンストラクタ
		,initialize: function() {
			var thisObj = this;
			_.bindAll(
				this
				,'setDumpMethod'
				,'setStatus'
				,'changeColorCode'
				,'showCurtain'
				,'hideCurtain'
				,'compareObjects'
			);
			this._animationProp = {
				'forStatus'	: {
					'isAnimation'	: false,
					'timerId'		: null
				}
			}
			this.setDumpMethod();
		}

		/*
		 * dumpメソッド定義メソッド(http://d.hatena.ne.jp/sanojimaru/20100219/1266585878参照)
		 * @param	void
		 * @return	void
		 */
		,setDumpMethod: function() {
			var thisObj = this;

			$.fn.dump = function(){
				var elements = this;
				var dumphtml = [];

				elements.each(function(){
					var element = $(this);
					if($.browser.msie) {
						for(var i = 0; i < element.length; i++) {
							dumphtml.push(element[i].outerHTML.replace(/^[\r\n\t]+/, ''));
							dumphtml.push("\n");
						}
					} else {
						for(var i = 0; i < element.length; i++) {
							dumphtml.push('<' + element[i].nodeName.toLowerCase());
							for(var j = 0; j < element[i].attributes.length; j++) {
								dumphtml.push(' ' + element[i].attributes[j].nodeName + '="'
									+ element[i].attributes[j].nodeValue + '"');
							}
							dumphtml.push('>' + element[i].innerHTML);
							dumphtml.push('<\/' + element[i].nodeName.toLowerCase() + '>');
							dumphtml.push("\n");
						}
					}
				});

				return dumphtml.join('');
			};
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
			// var elem = $('#statusDisplay');
			var elem = $('#navigationPanel .status');
			if (isShow === true) {
				thisObj._animationProp['forStatus']['isAnimation'] = true;
				if (thisObj._animationProp['forStatus']['timerId']) {
					clearTimeout(thisObj._animationProp['forStatus']['timerId']);
				}
				thisObj._animationProp['forStatus']['isAnimation'] = true;
				elem
					.stop(true)
					.text(message)
					.animate(
						{
							'opacity'		: 1
						},
						{
							duration		: 500,
							complete		: function(event) {
								thisObj._animationProp['forStatus']['isAnimation'] = false;
								// console.log('show終わり');
								// thisObj.setStatus(false);
								if (time) {
									thisObj.setStatus(false, '');
								}
							}
						}
					);

			// } else if (thisObj._animationProp['forStatus']['isAnimation'] === false) {
			} else {
				thisObj._isAnimation = true;
				time = isNaN(time) || time <= 0 ? 1000 : time;
				if (thisObj._animationProp['forStatus']['timerId']) {
					clearTimeout(thisObj._animationProp['forStatus']['timerId']);
				}
				thisObj._animationProp['forStatus']['timerId'] = setTimeout(
					function(event) {
						elem
							.stop(true)
							.animate(
								{
									'opacity'		: 0
								},
								{
									duration		: 500,
									complete		: function(event) {
										thisObj._animationProp['forStatus']['isAnimation'] = false;
										// console.log('hide終わり');
									}
								}
							);
					}, time
				);
			}
		}


		/*
		 * カラーコード変換メソッド(16進数->10進数、10進数->16進数)(http://jsdo.it/londoner25/wDPQ参照)
		 * @param	colorCode 		変換元のカラーコード
		 * @param	isHex	 		true===16進数
		 * @return	変換後のカラーコードオブジェクト
		 */
		,changeColorCode: function(colorCode, isHex) {
			var thisObj = this;

			// console.log('colorCode = ' + colorCode);
			// var val = colorCode !== undefined ? colorCode : "",
			var val = colorCode,
			num = val.length,
			str = [];
			var resultObj = {
				isSuccess	: false,
				errorMess	: '',
				masterData	: val,
				r			: undefined,
				g			: undefined,
				b			: undefined
			}

			var hexChange = function(value) {
				return String(('0' + parseInt(value ,10).toString(16)).slice(-2));
			};

			if (isHex === true) {
				// 「#」がある場合は削除して値をセットしなおし
				if (val.charAt(0).match(/#/)) {
					val = val.slice(1);
					num = val.length;
				}

				// 16進数であるか判定
				if (val.match(/[^A-Fa-f0-9]/)) {
				//	self.outputError('16進数を入力してください');
					resultObj['errorMess'] = '16進数を入力してください';
					return resultObj;
				}

				// 変換の処理
				if (num !== 3 && num !== 6) {
				//	self.outputError('16進数のカラーコードを入力してください');
					resultObj['errorMess'] = '16進数のカラーコードを入力してください';
					return resultObj;
				} else {
					var colorCode = (num === 3) ?
					'0x' + val.charAt(0)+val.charAt(0)+val.charAt(1)+val.charAt(1)+val.charAt(2)+val.charAt(2) :
					'0x' + val.charAt(0)+val.charAt(1)+val.charAt(2)+val.charAt(3)+val.charAt(4)+val.charAt(5);
					r = colorCode >> 16 & 0xFF;
					g = colorCode >> 8 & 0xFF;
					b = colorCode >> 0 & 0xFF;
				}

				resultObj['isSuccess'] = true;
				resultObj['r'] = r;
				resultObj['g'] = g;
				resultObj['b'] = b;

				return resultObj;

			} else {
				str = val.split(',');

				// RGBの形式かチェック
				if (str.length !== 3) {
				//	self.outputError('RGBコードを入力してください');
					resultObj['errorMess'] = 'RGBコードを入力してください';
					return resultObj;
				} else {
					// 入力された文字列が"(0,0,0)"などの場合の操作
					if (!str[0].slice(0,1).match(/^[0-9]/)) {
						str[0] = str[0].slice(1);
					}
					if (!str[2].slice(-1).match(/[0-9]$/)) {
						str[2] = str[2].replace(')', '');
					}
				}

				// RGBの各々の値として適切かチェック
				for (var i=-1,n=3;++i<n;) {
					if (Number(str[i]) > 255){
					//	self.outputError('255以下の数字を入力してください。');
						resultObj['errorMess'] = '255以下の数字を入力してください';
						return resultObj;
					}
				}

				resultObj['isSuccess'] = true;
				resultObj['r'] = hexChange(str[0]);
				resultObj['g'] = hexChange(str[1]);
				resultObj['b'] = hexChange(str[2]);

				return resultObj;
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
			console.log('Util.js :: showCurtain :: message = ' + message);
			duration = duration === null || duration === undefined ? 300 : duration;

			if (!thisObj._curtain) {
				thisObj._curtain = $('<div id="curtain"><p>' + message + '</p></div>').appendTo('body');
			} else {
				thisObj._curtain.find('>p').html(message);
			}
			thisObj._curtain
				.stop(true, false)
				.css(
					{
						'display'		: 'table'
						// 'opacity'		: 0
					}
				)
				.animate(
					{
						'opacity'	: 1
					},
					{
						duration: duration,
						easing: 'linear',
						complete: function() {
						}
					}
				)
		}

		/*
		 * ページの最前面に表示したメッセージ表示用Divを非表示にするメソッド
		 * @param	duration			Divを非表示にするまでの時間
		 * @return	void
		 */
		,hideCurtain: function(duration) {
			var thisObj = this;
			duration = duration === null || duration === undefined ? 300 : duration;

			if (thisObj._curtain) {
				thisObj._curtain
					.stop(true, false)
					.animate(
						{
							'opacity'	: 0
						},
						{
							duration: 300,
							easing: 'linear',
							complete: function() {
								thisObj._curtain.css({'display': 'none'});
							}
						}
					)
			}
		}

		/*
		 * ページの最前面に表示したメッセージ表示用Divを非表示にするメソッド
		 * @param	duration			Divを非表示にするまでの時間
		 * @return	void
		 */
		// ,hideCurtain: function(duration) {
		,compareObjects: function(obj1, obj2, callback) {
			var thisObj = this;
			var paramName;

			var compare = function(objA, objB, param) {
				var paramObjA = objA[param], paramObjB = (typeof objB[param] === 'undefined') ? false : objB[param];

				switch (typeof objA[param]) {
					case "object" : return (thisObj.compareObjects(paramObjA, paramObjB));
					case "function" : return (paramObjA.toString() === paramObjB.toString());
					default: return (paramObjA === paramObjB);
				}
			}

			for (paramName in obj1) {
				if (typeof obj2[paramName] === 'undefined' || !compare(obj1, obj2, paramName)) {
					callback(false);
					return;
				}
			}

			for (paramName in obj2) {
				if (typeof obj1[paramName] === 'undefined' || !compare(obj1, obj2, paramName)) {
					callback(false);
					return;
				}
			}

			callback(true);
			return;
		}
	}
});
