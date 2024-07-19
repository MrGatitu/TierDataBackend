const crypto = require('crypto');

function generateMeterNumber(county, subCounty) {
  const countyPrefix = county.substring(0, 2).toUpperCase();
  const subCountyPrefix = subCounty.substring(0, 2).toUpperCase();

  const randomNumber = crypto.randomInt(100000, 1000000);

  
  const meterNumber = `${countyPrefix}${subCountyPrefix}${randomNumber}`;

  return meterNumber;
}


const county = 'Nairobi';
const subCounty = 'Westlands';
const meterNumber = generateMeterNumber(county, subCounty);
console.log(`Generated Meter Number: ${meterNumber}`);
