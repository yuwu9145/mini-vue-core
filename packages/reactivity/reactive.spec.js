import { 
  reactive,
  effect,
  computed,
  ref,
  toRef,
  isRef
} from './reactive.js'

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

  it('should work without initial value', () => {
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


  test('toRef', () => {
    const a = reactive({
      x: 1
    })
    const x = toRef(a, 'x')
    expect(isRef(x)).toBe(true)
    expect(x.value).toBe(1)

    // source -> proxy
    a.x = 2
    expect(x.value).toBe(2)

    // proxy -> source
    x.value = 3
    expect(a.x).toBe(3)

    // reactivity
    let dummyX
    effect(() => {
      dummyX = x.value
    })
    expect(dummyX).toBe(x.value)

    // mutating source should trigger effect using the proxy refs
    a.x = 4
    expect(dummyX).toBe(4)

    // should keep ref
    const r = { x: ref(1) }
    expect(toRef(r, 'x')).toBe(r.x)
  })

  test('toRef default value', () => {
    const a = { x: undefined }
    const x = toRef(a, 'x', 1)
    expect(x.value).toBe(1)

    a.x = 2
    expect(x.value).toBe(2)

    a.x = undefined
    expect(x.value).toBe(1)
  })

  xtest('toRefs', () => {
    const a = reactive({
      x: 1,
      y: 2
    })

    const { x, y } = toRefs(a)

    expect(isRef(x)).toBe(true)
    expect(isRef(y)).toBe(true)
    expect(x.value).toBe(1)
    expect(y.value).toBe(2)

    // source -> proxy
    a.x = 2
    a.y = 3
    expect(x.value).toBe(2)
    expect(y.value).toBe(3)

    // proxy -> source
    x.value = 3
    y.value = 4
    expect(a.x).toBe(3)
    expect(a.y).toBe(4)

    // reactivity
    let dummyX, dummyY
    effect(() => {
      dummyX = x.value
      dummyY = y.value
    })
    expect(dummyX).toBe(x.value)
    expect(dummyY).toBe(y.value)

    // mutating source should trigger effect using the proxy refs
    a.x = 4
    a.y = 5
    expect(dummyX).toBe(4)
    expect(dummyY).toBe(5)
  })

  xtest('toRefs reactive array', () => {
    const arr = reactive(['a', 'b', 'c'])
    const refs = toRefs(arr)

    expect(Array.isArray(refs)).toBe(true)

    refs[0].value = '1'
    expect(arr[0]).toBe('1')

    arr[1] = '2'
    expect(refs[1].value).toBe('2')
  })
})