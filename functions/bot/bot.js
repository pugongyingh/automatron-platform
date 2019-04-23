const ivm = require('isolated-vm')
const isolate = new ivm.Isolate({ memoryLimit: 128 })

async function hello() {
  let context = isolate.createContextSync()
  let script = isolate.compileScriptSync('"Hello, " + "world"')
  let result = script.runSync(context)
  return result
}

exports.handler = async function(event, context) {
  try {
    const body = await hello()
    return { statusCode: 200, body }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() }
  }
}
