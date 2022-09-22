import { reactive, effect } from './reactive.js'


test('STEP ONE: basic reactive', () => {
  // initial obj
  const obj = { 
    foo: 1,
    bar: 2
  }
  let sum = 0

  const proxiedObj = reactive(obj) 

  effect(() => {
    sum = proxiedObj.foo + proxiedObj.bar
  })

  expect(sum).toBe(3)
  proxiedObj.foo = 2
  expect(sum).toBe(4)
  proxiedObj.foo = 3
  expect(sum).toBe(5)
})

// Simplied version based on vue core source code 
// https://github.com/vuejs/core/blob/8772a01a9280b1591e781e20741d32e2f9a836c8/packages/reactivity/__tests__/effect.spec.ts
test('STEP TWO: scheduler', () => {
  let dummy
  let run
  const scheduler = jest.fn(effectFn => {
    run = effectFn
  })
  const obj = reactive({ foo: 1 })
  effect(
    () => {
      dummy = obj.foo
    },
    { scheduler }
  )
  expect(scheduler).not.toHaveBeenCalled()
  expect(dummy).toBe(1)
  // should be called on first trigger
  obj.foo++
  expect(scheduler).toHaveBeenCalledTimes(1)
  // should not run yet
  expect(dummy).toBe(1)
  // manually run
  run()
  // should have run
  expect(dummy).toBe(2)
})