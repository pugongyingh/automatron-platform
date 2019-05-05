const { fail } = require('assert')
const axios = require('axios')
const admin = require('firebase-admin')
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT ||
      fail('FIREBASE_SERVICE_ACCOUNT environment missing'),
    'base64',
  ).toString(),
)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://automatron-platform.firebaseio.com',
})

exports.handler = async function(event, context) {
  try {
    if (event.queryStringParameters.error) {
      return {
        statusCode: 400,
        body: 'Authorization request is unsuccessful :(',
      }
    }
    const code = String(event.queryStringParameters.code)
    const state = String(event.queryStringParameters.state)
    const accessToken = (await axios.default.post(
      'https://api.line.me/oauth2/v2.1/token',
      require('querystring').stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://automatron.netlify.com/.netlify/functions/login',
        client_id: process.env.LINE_LOGIN_CLIENT_ID,
        client_secret: process.env.LINE_LOGIN_CLIENT_SECRET,
      }),
    )).data.access_token
    const profile = (await axios.default.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })).data
    const token = await admin.auth().createCustomToken(profile.userId, {
      pictureUrl: profile.pictureUrl,
      displayName: profile.displayName,
    })
    console.log('Hello!', profile, state)
    return {
      statusCode: 302,
      body: 'Login successful!',
      headers: {
        location: `https://automatron.netlify.com/editor#login_token=${token}`,
      },
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: 'Failed to authorize user: ' + String(err) }
  }
}
