const ScriptExecutor = require('./ScriptExecutor')

async function run(code) {
  const options = { code }
  const result = await ScriptExecutor.execute(options)
  return result
}

it('should run JS code', async () => {
  const result = await run('2 + 2')
  expect(result.output).toBe('4')
})

it('should work with promises', async () => {
  const result = await run('Promise.resolve(55)')
  expect(result.output).toBe('55')
})

it('should support fetch', async () => {
  const result = await run('fetch("http://example.com/").then(r => r.text())')
  expect(result.output).toMatch(/Example Domain/)
})

it('should protect against too much memory', async () => {
  const result = await run('Array(10000000)')
  expect(result.error).toMatch(/ProcessTerminatedError/)
})

it('should protect against infinite loop', async () => {
  const result = await run('for(;;);')
  await expect(result.error).toMatch(/Error: Script execution timed out/)
})

it('should protect against async infinite loop', async () => {
  const result = await run('(async()=>42)().then(()=>{for(;;);})')
  await expect(result.error).toMatch(/TimeoutError/)
})

it('should display cyclic data structures', async () => {
  const result = await run('x={};x.x=x;x')
  await expect(result.output).toBe('{ x: [Circular] }')
})

afterAll(() => {
  ScriptExecutor.destroy()
})
