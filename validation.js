var utils = require('./assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;

function timeBasedValidation(data, callback) {
    var days = utils.getdaysdiff(data.today, data.dnuo);
    var trigger, end_day = 0;
    if (days < 0) {
        callback({
            status: "ERROR",
            device: data.device,
            message: "Choose The Correct Date for the" + " " + data.device,
            trigger: trigger
        });
        return;
    } else if (days <= 5 && days >= 0) {
        trigger = 1;
        if (days == 0) {
            end_day = 1;
            callback({
                status: "DANGER",
                device: data.device,
                message: "Today Is Last Date to change the device:" + " " + data.device,
                trigger: trigger,
                end_day: end_day
            });
            return;
        } else {
            callback({
                status: "WARNING",
                device: data.device,
                message: "The Remaining Days to change the Device:" + " " + data.device + " " + "is:" + " " + days,
                trigger: trigger
            });
            return;
        }
    } else {
        callback({
            status: "ALERT",
            device: data.device,
            message: "The Remaining Days to change the Device:" + " " + data.device + " " + "Are:" + " " + days,
            trigger: trigger
        });
        return;
    }
}

function countBasedValidation(inputData, callback) {
    console.log('inputData from countBasedValidation Is', inputData);
}

function valueBasedValidation(inputData, callback) {
    console.log('inputData from valueBasedValidation Is', inputData);
}


module.exports.timeBasedValidation = timeBasedValidation;
module.exports.countBasedValidation = countBasedValidation;
module.exports.valueBasedValidation = valueBasedValidation;