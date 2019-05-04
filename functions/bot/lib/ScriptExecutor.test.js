
const ScriptExecutor = require('./ScriptExecutor')

async function run(code) {
  const options = { code }
  const result = await ScriptExecutor.execute(options)
  return result
}

it('should run JS code', async () => {
  expect(await run('2 + 2')).toBe(4)
})

it('should work with promises', async () => {
  expect(await run('Promise.resolve(55)')).toBe(55)
})

it('should support fetch', async () => {
  expect(await run('fetch("http://example.com/").then(r => r.text())')).toMatch(/Example Domain/)
})

it('should protect against too much memory', async () => {
  await expect(run('Array(10000000)')).rejects.toMatchObject({
    name: 'ProcessTerminatedError'
  })
})

afterAll(() => {
  ScriptExecutor.destroy()
})