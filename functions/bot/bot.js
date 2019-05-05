const { VM } = require('vm2')
const line = require('@line/bot-sdk')
const { execute } = require('./lib/ScriptExecutor')
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const client = new line.Client(config)

async function handleEvent(event) {
  if (event.type !== 'message') {
    return `Sorry, I don’t handle events of type ${event.type}`
  }
  if (event.message.type !== 'text') {
    return `Sorry, I don’t handle messages of type ${event.message.type}`
  }
  const responses = []
  try {
    const result = await execute({ code: event.message.text })
    if (result.output) {
      responses.push({
        type: 'text',
        text: result.output,
      })
    }
  } catch (e) {
    responses.push({
      type: 'text',
      text: `Error: ${e}`,
    })
  }
  if (!responses.length) {
    responses.push({
      type: 'text',
      text: `(No output)`,
    })
  }
  await client.replyMessage(event.replyToken, responses)
  return 'OK'
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
