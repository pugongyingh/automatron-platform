const { VM } = require('vm2')
const fetch = require('node-fetch')

async function execute(code) {
  const vm = new VM({
    timeout: 180,
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
    res = await execute(options.code)
  } catch (error) {
    err = error
  }
  callback(err, res)
}