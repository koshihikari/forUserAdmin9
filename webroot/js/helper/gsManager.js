'use strict';

google.load("visualization", "1");
google.setOnLoadCallback(function() {
	// console.log('Google');
	var baseUrl = 'https://docs.google.com/spreadsheet/pub';
	// var key = '0AtvxJEe7IC7ndFNfbjhXZnIwQnVNOGFraFVGOEtUaHc';
	// var seetIds = [0];

	var getGSData = function(id, key, gid) {
		var dfd = jQuery.Deferred();
		dfd.pipe(
			function() {
				// console.log('1');
				return requestData(baseUrl, key, gid);
			}
		)
		.then(
			function(data) {
				// console.log('2');
				var retData = {
					key: key,
					gid: gid,
					data: data
					// data: fixed(data, seetId)
				}
				// console.log(retData);
				// console.log('終了');
				jQuery(window).trigger(('onCompleteRequestData_' + id), [retData]);
				// jQuery(window).trigger('onCompleteRequestData', [retData]);
			}
		);
		dfd.resolve();


		function requestData(baseUrl, key, gid) {
			// console.log('1 - a');
			var dfd = jQuery.Deferred();
			var retObj = {};
			var count = 0;
			function request(gid, ms) {
				var url = baseUrl + '?key=' + key + '&gid=' + gid + '&pub=1' + '&ms=' + ms;
				var query = new google.visualization.Query(url);
				query.send(handleResponse);
				function handleResponse(response)
				{
					retObj["gid" + gid] = response.getDataTable();
					dfd.resolve(retObj);
				}
			}
			request(gid, new Date().getUTCMilliseconds());
			return dfd.promise();
		}
	}
	window.getGSData = getGSData;
});
