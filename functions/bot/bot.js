const line = require('@line/bot-sdk')
const { execute } = require('./lib/ScriptExecutor')
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const admin = require('firebase-admin')
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64'),
)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://automatron-platform.firebaseio.com',
})

const client = new line.Client(config)

async function handleEvent(event) {
  if (event.type !== 'message') {
    return `Sorry, I don’t handle events of type ${event.type}`
  }
  if (event.message.type !== 'text') {
    return `Sorry, I don’t handle messages of type ${event.message.type}`
  }
  if (event.source.type !== 'user') {
    return `Sorry, I only handle direct messages for now`
  }
  const userId = event.source.userId
  if (!userId) {
    return `No user ID found`
  }
  const responses = []
  try {
    const dataRef = admin
      .database()
      .ref('state')
      .child(userId)
      .child('data')
    const state = (await dataRef.once('value')).val() || undefined
    const result = await execute({ code: event.message.text, state })
    for (const message of result.logs) {
      responses.push({
        type: 'text',
        text: message,
      })
    }
    if (result.output) {
      responses.push({
        type: 'text',
        text: `↪️ ${result.output}`,
      })
    }
    if (result.error) {
      responses.push({
        type: 'text',
        text: `⚠️ ${result.error}`,
      })
    }
    if (result.nextState) {
      await dataRef.set(result.nextState)
    }
  } catch (e) {
    responses.push({
      type: 'text',
      text: `⚠️ ${e}`,
    })
  }
  if (!responses.length) {
    responses.push({
      type: 'text',
      text: `(No output)`,
    })
  }
  await client.replyMessage(event.replyToken, responses)
  return 'All good'
}

exports.handler = async function(event, context) {
  try {
    const eventBody = JSON.parse(event.body)
    const results = await Promise.all(
      eventBody.events.map(async event => {
        try {
          return await handleEvent(event)
        } catch (err) {
          console.error('Failed to handle event...', err)
        }
      }),
    )
    console.log('OK, responses:', results)
    return { statusCode: 200, body: results.join('\n') }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() }
  }
}
