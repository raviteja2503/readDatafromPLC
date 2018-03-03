var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validation = require('./validation');
const scheduler = require('node-schedule');
var utils = require('./assets/utils').utils;

var mc = require('mcprotocol');
var conn = new mc();
var doneReading = false;
var doneWriting = false;

var variables = {
    CURRENTDATE: 'D5000,6',
    Date1: 'D5200,3',
    Date2: 'D5250,3',
    Date3: 'D5260,3',
    TEST2: 'D5200,3',
    TEST3: 'D5250,3',
    TEST4: 'D5260,3',
    MULTIADD : 'D3720, 2',
    SingleAdd: 'D3730, 3',
    Add : 'D3740, 10',
    Add2 : 'M2000, 4'
    
};

conn.initiateConnection({
    port: 5551,
    host: '192.168.3.39',
    ascii: false
}, connected);

function connected(err) {
    if (typeof (err) !== "undefined") {
        console.log('error Ocuured');
        console.log(err);
        process.exit();
    }
    conn.setTranslationCB(function (tag) {
        return variables[tag];
    });
    conn.addItems('CURRENTDATE');
    conn.addItems('Date1');
    conn.addItems('Date2');
    conn.addItems('Date3');
    conn.addItems('TEST2');
    conn.addItems('TEST3');
    conn.addItems('TEST4');
    conn.addItems('MULTIADD');
    conn.addItems('SingleAdd');
    conn.addItems('Add');
    conn.addItems('Add2');
    conn.writeItems(['MULTIADD', 'SingleAdd', 'Add', 'Add2'], [ [44, 55] , [11, 22, 33], [1,2,3,4,5,6,7,8,9,10], [true, true]], valuesWritten);
    // conn.writeItems('SingleAdd', [ 111, 222, 333], valuesWritten);
    conn.readAllItems(valuesReady);
}

function valuesReady(error, values) {
    if (error) {
        console.log("SOMETHING WENT WRONG READING VALUES!!!!");
    } else {
        console.log('Values Are', values);
        var currentDate = values.CURRENTDATE;
        // var test1 = values.TEST2, test2 = values.TEST3, test3 = values.TEST4, date1 = values.Date1, date2 = values.Date2, date3 = values.Date3;

        // Dates Given
        var dates = [
            values.Date1,
            values.Date2,
            values.Date3
        ]

        // Validate TBM
        for (i = 0; i < dates.length; i++) {
            console.log('*******************');
            console.log('*******************');
            console.log('date', dates[i]);
            var data = utils.formatPlcDataForTBM(dates[i], currentDate);
            validation.timeBasedValidation(data, function (response) {
                console.log("Response ::" + " " + JSON.stringify(response, null, 2));
                if (response.trigger && response.end_date) {
                    console.log('Today Is Last Day' + ' ' + 'Device ' + response.device + ' ' + 'Trigger Is ' + response.trigger + ' ' + 'End Is ' + response.end_date);
                } else if (response.trigger) {
                    console.log('Remaining Days' + ' ' + 'Device ' + response.device + ' ' + 'Trigger ' + response.trigger);
                } else if (response.status == 'ERROR') {
                    console.log('Please Choose Correct Date for' + 'Device ' + response.device);
                } else {
                    console.log('We Have More Days no trigger and no end' + +'Device ' + response.device);
                }
            });
            console.log('*******************');
            console.log('*******************');
        }
    }
}

function valuesWritten(anythingBad) {
    if (anythingBad) {
        console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
    } else {
        console.log("Done writing.");
    }    
    // doneWriting = true;
    // if (doneReading) { process.exit(); }
}

function aaaa(anythingBad) {
    if (anythingBad) {
        console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
    } else {
        console.log("Done writing.");
    }    
    // doneWriting = true;
    // if (doneReading) { process.exit(); }
}

scheduler.scheduleJob('*/1 * * * *', function () {
    connected();
});

app.listen('3000', function () {
    console.log('running on 3000...');
});