import { reactive, effect } from './reactive.js'


test('adds 1 + 2 to equal 3', () => {
  // initial obj
  const obj = { 
    foo: 1,
    bar: 2
  }
  let sum = 0

  // implement proxy
  const proxiedObj = reactive(obj) 

  effect(() => {
    sum = proxiedObj.foo + proxiedObj.bar
  })
  expect(sum).toBe(3)
  proxiedObj.foo = 2
  expect(sum).toBe(4)
});