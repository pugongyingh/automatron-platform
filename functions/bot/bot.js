const {VM} = require('vm2')
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}

const client = new line.Client(config)

async function execute(code) {
  const vm = new VM({
    timeout: 100,
    sandbox: {}
  })
  let result = vm.run(code)
  return result
}

async function handleEvent(event) {
  if (event.type !== 'message') {
    return `Sorry, I don’t handle events of type ${event.type}`
  }
  if (event.message.type !== 'text') {
    return `Sorry, I don’t handle messages of type ${event.message.type}`
  }
  const result = await execute(event.message.text)
  const results = [
    require('util').inspect(result, { depth: 5 })
  ]
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: String(results)
  })
}

exports.handler = async function(event, context) {
  try {
    const eventBody = JSON.parse(event.body)
    const results = await Promise.all(
      eventBody.events.map(handleEvent)
    )
    return { statusCode: 200, body: results.join('\n') }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() }
  }
}
