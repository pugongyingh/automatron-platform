const { VM } = require('vm2')
const fetch = require('node-fetch')
const v8 = require('v8')

async function execute(code) {
  const vm = new VM({
    timeout: 480,
    sandbox: {
      fetch
    }
  })
  let result = vm.run(code)
  return result
}

module.exports = async function (options, callback) {
  let err
  let res
  try {
    res = v8.serialize(await execute(options.code)).toString('base64')
  } catch (error) {
    err = error
  }
  callback(err, res)
}
