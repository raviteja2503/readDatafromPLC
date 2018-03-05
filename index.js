var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validation = require('./validation');
const scheduler = require('node-schedule');
var utils = require('./assets/utils').utils;
var moment = require('moment');


var mc = require('mcprotocol');
var conn = new mc();
var doneReading = false;
var doneWriting = false;

var variables = {
    CURRENTDATE: 'D5000,6',
    AADETAILS: 'D5200,6',
    ABDETAILS: 'D5400,6',
    ACDETAILS: 'D5420,6',
    ADDETAILS: 'D5430,6',
    AEDETAILS: 'D5440,6',
    AAREMAININGDAYS: 'D3720, 1',
    AAALARM: 'M2000, 2',
    ABREMAININGDAYS: 'D3721, 1',
    ABALARM: 'M2002, 2',
    ACREMAININGDAYS: 'D3722, 1',
    ACALARM: 'M2004, 2',
    ADREMAININGDAYS: 'D3723, 1',
    ADALARM: 'M2006, 2',
    AEREMAININGDAYS: 'D3724, 1',
    AEALARM: 'M2008, 2'

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
    conn.addItems('AADETAILS', 'AAREMAININGDAYS', 'AAALARM');
    conn.addItems('ABDETAILS', 'ABREMAININGDAYS', 'ABALARM');
    conn.addItems('ACDETAILS', 'ACREMAININGDAYS', 'ACALARM');
    conn.addItems('ADDETAILS', 'ADREMAININGDAYS', 'ADALARM');
    conn.addItems('AEDETAILS', 'AEREMAININGDAYS', 'AEALARM');
    // conn.writeItems(['WAADETAILS'], [[3, 9, 2018, 3]], valuesWritten);
    // writeData();
    // conn.writeItems(['AAREMAININGDAYS', 'AAALARM'], [[0], [false, false]], valuesWritten);
    // conn.writeItems(['ABREMAININGDAYS', 'ABALARM'], [[0], [false, false]], valuesWritten);
    conn.readAllItems(valuesReady);
}

function valuesReady(error, values) {
    if (error) {
        console.log("SOMETHING WENT WRONG READING VALUES!!!!");
    } else {
        console.log('Values Are', values);
        var currentDate = values.CURRENTDATE;

        // Assign Date to array
        var dates = [
            values.AADETAILS,
            values.ABDETAILS,
            values.ACDETAILS,
            values.ADDETAILS,
            values.AEDETAILS
        ]

        // Validate TBM
        for (i = 0; i < dates.length; i++) {
            console.log('*******************');
            console.log('*******************');
            console.log('*******************');
            console.log('*******************');
            (function (i) {
                setTimeout(function () {
                    console.log('date' + i + ' ' + ' ' + dates[i]);
                    var data = utils.formatPlcDataForTBM(dates[i], currentDate);
                    console.log('data', JSON.stringify(data, null, 2));
                    validation.timeBasedValidation(data, function (response) {
                        console.log('response.device', response.device);
                        console.log("Response ::" + " " + JSON.stringify(response, null, 2));
                        var remaingDays = response.device + 'REMAININGDAYS';
                        var alarm = response.device + 'ALARM';
                        console.log('*******************');
                        console.log('*******************');
                        console.log(remaingDays + ' ' + alarm);
                        console.log('*******************');
                        console.log('*******************');
                        console.log('At:', moment().format('MMMM Do YYYY, h:mm:ss a'));
                        if (response.status == 'DANGER') {
                            console.log('Danger');
                            console.log('Today Is Last Day' + ' ' + 'Device ' + response.device + ' ' + 'Trigger Is ' + response.trigger + ' ' + 'End Is ' + response.end_date);
                            conn.writeItems([remaingDays, alarm], [[response.days], [true, true]]);
                        } else if (response.status == 'WARNING') {
                            console.log('WARNING');
                            console.log('Remaining Days' + ' ' + 'Device ' + response.device + ' ' + 'Trigger ' + response.trigger);
                            conn.writeItems([remaingDays, alarm], [[response.days], [true, false]]);
                        } else if (response.status == 'ERROR') {
                            console.log('ERROR');
                            console.log('Please Choose Correct Date for' + 'Device ' + response.device);
                        } else if (response.status == 'INFO') {
                            console.log('INFO');
                            console.log('We Have More Days no trigger and no end' + ' ' + 'Device ' + response.device);
                            conn.writeItems([remaingDays, alarm], [[response.days], [false, false]]);
                        }
                    });
                }, 25 * i);
            })(i);
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

scheduler.scheduleJob('*/1 * * * *', function () {
    connected();
});

app.listen('3000', function () {
    console.log('running on 3000...');
});