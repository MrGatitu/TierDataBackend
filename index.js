//const sendSMS = require('./sendSMS');
const smsServer = require('./smsServer');

// TODO: Call sendSMS function
const sendSMS = require('./sendSMS');

// Trigger to send SMS if low balances
const _smsTrigger = require('./BalanceController');

smsTrigger();

//sendSMS();

//sendSMS();

// TODO: Call start sms server

smsServer();