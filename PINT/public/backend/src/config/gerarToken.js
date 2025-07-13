const { JWT } = require('google-auth-library');
const key = require('./serviceAccountKey.json');

async function getAccessToken() {
  const client = new JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging'],
    null
  );
  const tokens = await client.authorize();
  console.log(tokens.access_token);
}

getAccessToken();