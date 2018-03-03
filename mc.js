var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const scheduler = require('node-schedule');

var mc = require('mcprotocol');
var conn = new mc;
var doneReading = false;
var doneWriting = false;

var variables = {
    TEST1: 'D0,15',
    TEST2: 'D20,3',
    TEST3: 'D30,3',
    TEST4: 'D40,3'    
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
    conn.addItems('TEST1');
    conn.addItems('TEST2');
    conn.addItems('TEST3');
    conn.addItems('TEST4');
    conn.readAllItems(valuesReady);
}

function valuesReady(anythingBad, values) {
    console.log('read Done');
    console.log('********************');
    console.log('********************');
    console.log('********************');
    var currentDt = new Date();
    console.log('currentDt', currentDt);    
    console.log(new Date());
    console.log('********************');
    console.log('********************');
    console.log('********************');

    if (anythingBad) {
        console.log("SOMETHING WENT WRONG READING VALUES!!!!");
    }
    console.log('Values Are', values);
    console.log('Values of Test1 Are', values.TEST1);
    console.log('Values of Test1 Are', values.TEST1);
    var currentDate = values.TEST1;
    var date1 = values.TEST2;
    var date2 = values.TEST3;
    var date3 = values.TEST4;
    console.log('Current Date' + ' ' + currentDate[2] + ' ' + 'Month' + ' ' + currentDate[1] + ' ' + 'Year' + ' ' + currentDate[0]);
    console.log('Date1' + ' ' + date1);    
    console.log('Date1' + ' ' + date2);    
    console.log('Date1' + ' ' + date3);    
    // doneReading = true;
    // if (doneWriting) {
    //     process.exit();
    // }
}

scheduler.scheduleJob('*/1 * * * *', function () {
    // conn.readAllItems(valuesReady);
    console.log('********************');
    console.log('********************');
    console.log('********************');
    var currentDt = new Date();
    console.log('currentDt', currentDt);    
    console.log('********************');
    console.log('********************');
    console.log('********************');
    connected();
});


app.use(bodyParser.json());


app.listen('3000', function () {
    console.log('running on 3000...');
});