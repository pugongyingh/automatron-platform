const ivm = require('isolated-vm')
const isolate = new ivm.Isolate({ memoryLimit: 128 })

let context = isolate.createContextSync()
let script = isolate.compileScriptSync('let y = 1, f = x => x + y')
let result = script.runSync(context)

console.log(result)
