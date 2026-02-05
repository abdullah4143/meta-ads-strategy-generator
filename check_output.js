const https = require('https');

const options = {
  hostname: 'api.manus.ai',
  path: '/v1/tasks/5jodb5MMd5yBT3bMEeuPdW',
  method: 'GET',
  headers: {
    'API_KEY': 'sk-opLHJL5Fru4yx6zl1fz5JctxnPFeMlI9TCftkU_3h7m-UjtE2TrFy9DWWtqxSF9Lw_gCZHrDjqIeJG622UHc4Jq9CBtj'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Task Status:', json.status);
      console.log('Messages count:', json.output?.length);
      json.output?.forEach((m, i) => {
        console.log(`Msg ${i} [${m.role}] [${m.status}]: ${m.content?.[0]?.text?.substring(0, 50)}...`);
      });
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => { console.error(e); });
req.end();
