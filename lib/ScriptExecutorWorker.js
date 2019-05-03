const {VM} = require('vm2')

async function execute(code) {
  const vm = new VM({
    timeout: 180,
    sandbox: {}
  })
  let result = vm.run(code)
  return result
}

module.exports = async function(options, callback) {
  let err
  let res
  try {
    res = await execute(options.code)
  } catch (error) {
    err = error
  }
  callback(err, res)
}