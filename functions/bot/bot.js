const {VM} = require('vm2')

async function hello() {
  const vm = new VM({
    timeout: 100,
    sandbox: {}
  })
  let result = vm.run('1+1')
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
