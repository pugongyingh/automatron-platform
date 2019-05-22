const ScriptExecutor = require('./ScriptExecutor')

async function run(input, opts = {}) {
  const options = {
    event: JSON.stringify({
      type: 'message',
      message: { type: 'text', text: input },
    }),
    ...opts,
  }
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
  expect(result.error).toMatch(/Error: Script execution timed out/)
})

it('should protect against async infinite loop', async () => {
  const result = await run('(async()=>42)().then(()=>{for(;;);})')
  expect(result.error).toMatch(/TimeoutError/)
})

it('should display cyclic data structures', async () => {
  const result = await run('x={};x.x=x;x')
  expect(result.output).toBe('{ x: [Circular] }')
})

it('should not return next state if it is same', async () => {
  const result = await run('99')
  expect(result.nextState).toBeUndefined()
})

it('should support stateful computation', async () => {
  let result
  result = await run('state.things = []')
  expect(result.output).toBe('[]')
  expect(result.nextState).toBeTruthy()
  result = await run('state.things.push(42)', { state: result.nextState })
  expect(result.nextState).toBeTruthy()
  result = await run('JSON.stringify(state)', { state: result.nextState })
  expect(result.output).toBe(`'{"things":[42]}'`)
})

it('supports serializing regexps', async () => {
  let result
  result = await run('state.pattern = /m.+w/')
  expect(result.nextState).toBeTruthy()
  result = await run('state.pattern.exec("test meow test")[0]', {
    state: result.nextState,
  })
  expect(result.output).toBe(`'meow'`)
})

it('supports serializing dates', async () => {
  let result
  result = await run('state.time = new Date()')
  expect(result.nextState).toBeTruthy()
  result = await run('state.time.getFullYear()', {
    state: result.nextState,
  })
  expect(result.output).toMatch(/^\d+$/)
})

it('supports serializing maps', async () => {
  let result
  result = await run(
    'state.things = new Map([["a", "b"], ["c", "d"], ["e", "f"]])',
  )
  expect(result.nextState).toBeTruthy()
  result = await run('state.things.get("c")', {
    state: result.nextState,
  })
  expect(result.output).toBe("'d'")
})

it('should support programs', async () => {
  const result = await run('a()', {
    program: 'function a() { return 42 }',
  })
  expect(result.error).toBeUndefined()
  expect(result.output).toBe('42')
})

it('should support custom bot function', async () => {
  const result = await run('nice', {
    program: 'function bot(event) { return "uwu " + event.message.text }',
  })
  expect(result.error).toBeUndefined()
  expect(result.output).toBe("'uwu nice'")
})

it('should display input position', async () => {
  const result = await run('event + wow')
  expect(result.error).toMatch(/input\.js:1:9/)
})

afterAll(() => {
  ScriptExecutor.destroy()
})
