const { fail } = require('assert')
const line = require('@line/bot-sdk')
const { execute } = require('./lib/ScriptExecutor')
const config = {
  channelAccessToken:
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    fail('LINE_CHANNEL_ACCESS_TOKEN environment missing'),
  channelSecret:
    process.env.LINE_CHANNEL_SECRET ||
    fail('LINE_CHANNEL_SECRET environment missing'),
}

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

const client = new line.Client(config)

async function handleEvent(event) {
  if (event.type !== 'message') {
    return `Sorry, I don’t handle events of type ${event.type}`
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
    const stateRef = admin
      .database()
      .ref('state')
      .child(userId)
      .child('data')
    const programRef = admin
      .database()
      .ref('program')
      .child(userId)
      .child('source')
    const statePromise = stateRef.once('value')
    const programPromise = programRef.once('value')
    const state = (await statePromise).val() || undefined
    const program = (await programPromise).val() || undefined
    const result = await execute({
      event: JSON.stringify(event),
      state,
      program,
    })
    for (const message of result.logs) {
      responses.push({
        type: 'text',
        text: message,
      })
    }
    if (
      result.output &&
      !(result.logs.length > 0 && result.output === 'undefined')
    ) {
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
      await stateRef.set(result.nextState)
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
  await client.replyMessage(event.replyToken, /** @type {any[]} */ (responses))
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
