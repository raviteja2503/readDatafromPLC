module.exports.utils = {
	CONSTANTS: require('./constants').CONSTANTS,
	filters: require('./filter').filters,
	cloneObject: function (object) {
		var cloneObject = {};
		Object.keys(object).forEach(function (key) {
			cloneObject[key] = object[key];
		});
		return cloneObject;
	},
	formatText: function (text) {
		var result = text;
		for (var i = 1; i < arguments.length; i += 1) {
			var re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
			result = result.replace(re, arguments[i]);
		}
		return result;
	},
	getSystemTime: function () {
		return new Date().getTime();
	},
	deriveIdFromSuccessMessage: function (message) {
		//parseInt(response.result[0].match(/\d+/),10);
		return message.substr(message.lastIndexOf(' ') + 1);
	},
	getRandomNumber: function () {
		//generates 8 digit random integer as string
		return Math.floor((Math.random() * 100000000) + 9999999).toString();
	},
	utcToDate: function (pUTCString) {
		return new Date(pUTCString)
	},
	formatDate: function (pDate, pFormat) {
		if (!pDate) {
			return;
		} else {
			var formattedValue = '';
			switch (pFormat) {
				case 'MMM-DD':
					formattedValue = calendarConstants.mon[pDate.getMonth()] + '-' +
						((pDate.getDate() < 10) ? '0' + pDate.getDate() : pDate.getDate());
					break;
				case 'YYYYMMDDHHMI':
					var date = new Date(pDate);
					var year = date.getFullYear();
					var month = ("0" + (date.getMonth() + 1)).slice(-2);
					var day = date.getDate();
					var hours = date.getHours();
					var minutes = date.getMinutes();
					formattedValue = year + month + day + hours + minutes;
					break;
				default:
					var month = pDate.getMonth() + 1;
					month = (month < 10) ? '0' + month : month;
					var date = pDate.getDate();
					date = (date < 10) ? '0' + date : date;
					var year = pDate.getFullYear();
					formattedValue = month + '/' + date + '/' + year;
			}
			return formattedValue;
		}
	},
	utcToIsoDate: function (utcDate) {
		if (utcDate) {
			return new Date(utcDate).toISOString();
		}
	},
	IsoToUtcDate: function (isoDate) {
		if (isoDate) {
			return new Date(isoDate).getTime();
		}
	},
	isNumber: function (n) {
		return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
	},
	formatResponse: function (responseArray, keys) {
		var finalResponse = [];
		responseArray.forEach(function (responseObj) {
			subArray = []
			Object.keys(keys).forEach(function (key) {
				subArray.push(responseObj[key]);
			});
			finalResponse.push(subArray);
		});
		return finalResponse;
	},
	convertArrayToObject: function (inputObj) {
		var finalResponse = [];
		Object.keys(inputObj).forEach(function (key) {
			var subArray = inputObj[key];
			Object.keys(subArray).forEach(function (subArraykey) {
				finalResponse.push(subArray[subArraykey]);
			});
		});
		return finalResponse;
	},
	getdaysdiff: function (date1, date2) {
		var one_day = 1000 * 60 * 60 * 24;
		var date1_ms = (date1).getTime();
		var date2_ms = (date2).getTime();
		var difference_ms = date2_ms - date1_ms;
		var diff = Math.ceil(difference_ms / one_day);
		return diff;
	},
	formatPlcDataForTBM: function (inputObj, currentDate) {
		console.log('inputObj', inputObj +' ' + 'Current Date' +' ' + currentDate[1] + '/' + currentDate[2] + '/' + currentDate[0]);
		var deviceNeedToUpdateOnDate, deviceNeedToUpdateOn, today;
		deviceNeedToUpdateOnDate= inputObj[0] + '/' + inputObj[1] + '/' + inputObj[2];
		deviceNeedToUpdateOn = new Date(deviceNeedToUpdateOnDate);
		today = currentDate[1] + '/' + currentDate[2] + '/' + currentDate[0];
		var data = {
            'device': String.fromCharCode(inputObj[4]) + String.fromCharCode(inputObj[5]),
			'today': new Date(today),
			'warningStarts': inputObj[3],
            'dnuo': deviceNeedToUpdateOn
		};
		return data;
	}
};
