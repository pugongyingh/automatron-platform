const { VM } = require('vm2')
const fetch = require('node-fetch')
const v8 = require('v8')
const util = require('util')

async function execute(code) {
  const vm = new VM({
    timeout: 480,
    sandbox: {
      fetch,
    },
  })
  let result = vm.run(code)
  return result
}

module.exports = async function(options, callback) {
  let result = {}
  try {
    const returned = await execute(options.code)
    result.output = util.inspect(returned, { depth: 5 })
  } catch (error) {
    result.error = error.stack
  }
  callback(null, result)
}
