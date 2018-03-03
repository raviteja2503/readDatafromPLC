var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const scheduler = require('node-schedule');

var mc = require('mcprotocol');
var conn = new mc;
var doneReading = false;
var doneWriting = false;

var variables = {
    CURRENTDATE: 'D0,6',
    Date1: 'D7,3',
    Date2: 'D10,3',
    Date3: 'D13,3',
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
    conn.addItems('CURRENTDATE');
    conn.addItems('Date1');
    conn.addItems('Date2');
    conn.addItems('Date3');
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
    console.log(new Date());
    console.log('********************');
    console.log('********************');
    console.log('********************');

    if (anythingBad) {
        console.log("SOMETHING WENT WRONG READING VALUES!!!!");
    }
    // console.log('Values Are', values);
    // console.log('Values of Test1 Are', values.TEST1);
    // console.log('Values of Test1 Are', values.TEST1);
    var currentDate = values.CURRENTDATE;
    var test1 = values.TEST2;
    var test2 = values.TEST3;
    var test3 = values.TEST4;
    var date1 = values.Date1;
    var date2 = values.Date2;
    var date3 = values.Date3;
    console.log('Current Date:' + ' ' + currentDate[1] + '/' + currentDate[2] + '/' + currentDate[0]);
    console.log('Date1:' + ' ' + date1[1] + '/' + date1[0] + '/' + date1[2]);
    console.log('Date2:' + ' ' + date2[1] + '/' + date2[0] + '/' + date2[2]);
    console.log('Date3:' + ' ' + date3[1] + '/' + date3[0] + '/' + date3[2]);

    var deviceNeedToUpdateOnDate = date1[1] + '/' + date1[0] + '/' + date1[2];
    var deviceNeedToUpdateOn = new Date(deviceNeedToUpdateOnDate);
    console.log("deviceNeedToUpdateOn  Is ::" + " " + deviceNeedToUpdateOn);
    var today = new Date();

    var data = {
        'device': 'module1',
        'today': today,
        'dnuo': deviceNeedToUpdateOn
    };
    daysBetween(data, function (response) {
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

    console.log('Counter1' + ' ' + test1);
    console.log('Counter2' + ' ' + test2);
    console.log('Counter3' + ' ' + test3);
    // doneReading = true;
    // if (doneWriting) {
    //     process.exit();
    // }
}

scheduler.scheduleJob('*/1 * * * *', function () {
    // conn.readAllItems(valuesReady);
    connected();
});


app.use(bodyParser.json());


daysBetween = function (data, callback) {
    console.log("Data ::" + " " + JSON.stringify(data, null, 2));
    console.log("Data Is :" + " " + "Device ::" + " " + data.device + " " + "Date1 ::" + " " + data.today + " " + "Date2 ::" + " " + data.dnuo);

    var one_day = 1000 * 60 * 60 * 24;
    var end_date, trigger = 0;

    // Convert both dates to milliseconds
    var date1_ms = (data.today).getTime();
    var date2_ms = (data.dnuo).getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    var days = Math.ceil(difference_ms / one_day);

    /*console.log("Difference Days :" + " " + days);*/

    if (days < 0) {
        /*console.log("Choose Correct Date");*/
        /* console.log("Trigger=" + trigger);*/
        callback({
            status: "ERROR",
            device: data.device,
            message: "Choose The Correct Date for the" + " " + data.device,
            trigger: trigger
        });
        return;
    } else if (days <= 5 && days >= 0) {
        trigger = 1;
        /*console.log("The Remaining Days to change the Device:" + " " + data.device + " " +"is:" + " " + days);*/
        /*console.log("Trigger=" + " " + trigger);*/
        if (days == 0) {
            /*console.log("This Is Last Date to change the device" + " " + data.device);*/
            end_date = 1;
            /*console.log("End Date" + " " + end_date);*/
            callback({
                status: "DANGER",
                device: data.device,
                message: "Today Is Last Date to change the device:" + " " + data.device,
                trigger: trigger,
                end_date: end_date
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
        /*console.log("The Remainig Days for" + " " + data.device + " Are:" + Math.ceil(difference_ms / one_day));*/
        callback({
            status: "ALERT",
            device: data.device,
            message: "The Remaining Days to change the Device:" + " " + data.device + " " + "Are:" + " " + days,
            trigger: trigger
        });
        return;
    }
}



app.listen('3000', function () {
    console.log('running on 3000...');
});