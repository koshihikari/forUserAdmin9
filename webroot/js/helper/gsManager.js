'use strict';

google.load("visualization", "1");
google.setOnLoadCallback(function() {
	var gsData = {};
	var baseUrl = 'https://docs.google.com/spreadsheet/pub';

	var getGsData = function(spredsheetId) {
		var retObj = {};
		if (gsData[spredsheetId]) {
			retObj = jQuery.extend(true, {}, gsData[spredsheetId]);
		} else {
			retObj = jQuery.extend(true, {}, gsData);
		}
		return retObj;
	}
	var setGsData = function(spredsheetId, data, key) {
		if (key) {
			if (!gsData[spredsheetId]) {
				gsData[spredsheetId] = {};
			}
			gsData[spredsheetId][key] = data;
		} else {
			gsData[spredsheetId] = data;
		}
	}
	var getSpreadsheetId = function(key, gid) {
		return 'https://docs.google.com/spreadsheet/ccc?key=' + key + '&usp=drive_web#gid=' + gid;
	}
	var requestGsData = function(id, key, gid) {
		var spredsheetId = getSpreadsheetId(key, gid);
		if (gsData[spredsheetId] && gsData[spredsheetId]['baseData']) {	// GoogleSpreadsheetのデータを取得済みなら、キャッシュから返す
			console.log('キャッシュから返す');
			var baseData = getGsData(spredsheetId);
			jQuery(window).trigger(('onCompleteRequestData_' + id), [baseData['baseData']]);
		} else {// GoogleSpreadsheetのデータが未取得なら、アクセスして取得
			console.log('アクセスして取得');
			var dfd = jQuery.Deferred();
			dfd.pipe(
				function() {
					var url = baseUrl + '?key=' + key + '&gid=' + gid + '&pub=1' + '&ms=' + new Date().getUTCMilliseconds();
					return requestData(url, gid);
				}
			)
			.then(
				function(data) {
					var retData = {
						key: key,
						gid: gid,
						data: data
					}
					setGsData(spredsheetId, retData, 'baseData');
					jQuery(window).trigger(('onCompleteRequestData_' + id), [retData]);
				}
			);
			dfd.resolve();
		}


		function requestData(url, gid) {
			var dfd = jQuery.Deferred();
			var retObj = {};
			var count = 0;
			function request(gid) {
				var query = new google.visualization.Query(url);
				query.send(handleResponse);
				function handleResponse(response)
				{
					retObj["gid" + gid] = response.getDataTable();
					dfd.resolve(retObj);
				}
			}
			request(gid);
			return dfd.promise();
		}
	}
	window.GsManager = {
		getGsData	: getGsData,
		setGsData	: setGsData,
		getSpreadsheetId	: getSpreadsheetId,
		requestGsData	: requestGsData
	};
});
