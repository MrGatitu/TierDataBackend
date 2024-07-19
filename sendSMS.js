const AfricasTalking = require('africastalking');

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: 'atsk_f42c6d6173d84a088cb26d248dd6c8be78b0e02888c76e9e61c5b4d00fde0351fd7144fe', 
  username: 'sandbox'
});

module.exports = async function sendSMS() {
  try {
    const result = await africastalking.SMS.send({
      to: '+254114883285', 
      message: 'Hello, Your are running low on credit. Please Recharge!!',
      from: '78980'
    });
    console.log(result);
  } catch (ex) {
    console.error(ex);
  }
};
