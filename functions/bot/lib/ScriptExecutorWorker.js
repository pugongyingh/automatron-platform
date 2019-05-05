const { VM } = require('vm2')
const fetch = require('node-fetch')
const v8 = require('v8')
const util = require('util')

async function execute(code, executeOptions) {
  const vm = new VM({
    timeout: 480,
    sandbox: {
      fetch,
      say: executeOptions.say,
    },
  })
  let result = vm.run(code)
  return result
}

module.exports = async function(options, callback) {
  let result = { logs: [] }
  try {
    const returned = await execute(options.code, {
      say: (...args) => result.logs.push(util.format(...args)),
    })
    result.output = util.inspect(returned, { depth: 5 })
  } catch (error) {
    result.error = String((error && error.stack) || error)
  }
  callback(null, result)
}
