import { reactive, effect } from './reactive.js'


test('basic reactive', () => {
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
});