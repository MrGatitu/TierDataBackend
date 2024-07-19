const sendSMS = require('./sendSMS');

const balance = 200;

function smsTrigger(){
    if(balance<= 300){
        sendSMS();
        console.log("Success");
    }
}

smsTrigger();