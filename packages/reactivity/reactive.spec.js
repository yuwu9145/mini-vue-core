import { reactive, effect, computed, ref } from './reactive.js'

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

// real test case from vue core source code 
// https://github.com/vuejs/core/blob/8772a01a9280b1591e781e20741d32e2f9a836c8/packages/reactivity/__tests__/effect.spec.ts
test('STEP TWO: scheduler', () => {
  let dummy
  let run
  const scheduler = jest.fn(() => {
    run = runner
  })
  const obj = reactive({ foo: 1 })
  const runner = effect(
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

// modified real test case from vue core source code 
// https://github.com/vuejs/core/blob/8772a01a9280b1591e781e20741d32e2f9a836c8/packages/reactivity/__tests__/effect.spec.ts
it('STEP THREE: lazy', () => {
  const obj = reactive({ foo: 1 })
  let dummy
  const runner = effect(() => (dummy = obj.foo), { lazy: true })
  expect(dummy).toBe(undefined)

  runner()
  expect(runner()).toBe(1)
  expect(dummy).toBe(1)
  obj.foo = 2
  expect(dummy).toBe(2)
})


// Computed
// real test case from vue core source code 
it('STEP FOUR: (computed) should return updated value', () => {
  const value = reactive({})
  const cValue = computed(() => value.foo)
  expect(cValue.value).toBe(undefined)
  value.foo = 1
  expect(cValue.value).toBe(1)
})

// real test case from vue core source code 
it('STEP FIVE: (computed) should compute lazily', () => {
  const value = reactive({})
  const getter = jest.fn(() => value.foo)
  const cValue = computed(getter)

  // lazy
  expect(getter).not.toHaveBeenCalled()

  expect(cValue.value).toBe(undefined)
  expect(getter).toHaveBeenCalledTimes(1)

  // should not compute again
  cValue.value
  expect(getter).toHaveBeenCalledTimes(1)

  // should not compute until needed
  value.foo = 1
  expect(getter).toHaveBeenCalledTimes(1)

  // now it should compute
  expect(cValue.value).toBe(1)
  expect(getter).toHaveBeenCalledTimes(2)

  // should not compute again
  cValue.value
  expect(getter).toHaveBeenCalledTimes(2)
})

// real test case from vue core source code 
xit('should trigger effect', () => {
  const value = reactive({})
  const cValue = computed(() => value.foo)
  let dummy
  effect(() => {
    dummy = cValue.value
  })
  expect(dummy).toBe(undefined)
  value.foo = 1
  expect(dummy).toBe(1)
})

// real test case from vue core source code 
describe('STEP SIX: reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    // a.value = 2
    // expect(calls).toBe(2)
  })

  xit('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  xit('should work without initial value', () => {
    const a = ref()
    let dummy
    effect(() => {
      dummy = a.value
    })
    expect(dummy).toBe(undefined)
    a.value = 2
    expect(dummy).toBe(2)
  })

  xit('should work like a normal property when nested in a reactive object', () => {
    const a = ref(1)
    const obj = reactive({
      a,
      b: {
        c: a
      }
    })

    let dummy1
    let dummy2

    effect(() => {
      dummy1 = obj.a
      dummy2 = obj.b.c
    })

    const assertDummiesEqualTo = (val) =>
      [dummy1, dummy2].forEach(dummy => expect(dummy).toBe(val))

    assertDummiesEqualTo(1)
    a.value++
    assertDummiesEqualTo(2)
    obj.a++
    assertDummiesEqualTo(3)
    obj.b.c++
    assertDummiesEqualTo(4)
  })
})