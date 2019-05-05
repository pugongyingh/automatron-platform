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
  const result = run('Array(10000000)')
  await expect(result).rejects.toMatchObject({
    name: 'ProcessTerminatedError',
  })
})

afterAll(() => {
  ScriptExecutor.destroy()
})
