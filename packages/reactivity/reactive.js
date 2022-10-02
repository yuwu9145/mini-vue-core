const bucket = new WeakMap()

let activeEffect = undefined

export function effect(fn, options = {}) {
  // implement effect
  const effectFn = () => {
    let result
    activeEffect = effectFn
    result = fn()
    activeEffect = undefined
    return result
  }
  effectFn.options = options

  if (!effectFn.options.lazy)
    effectFn()
  
  return effectFn
}

function track(target, key) {
  // implement track
  // set activeEffect against target[key]
  let depMap = bucket.get(target)
  if (!depMap) {
    depMap = new Map()
    bucket.set(target, depMap)
  }
  // deps for the key 
  let deps = depMap[key]
  if (!deps) {
    deps = new Set()
    depMap.set(key, deps)
  }

  deps.add(activeEffect)
}

function trigger(target, key) {
  // implement trigger
  const depMap = bucket.get(target)
  if (!depMap) return
  const deps = depMap.get(key)
  if (!deps) return
  for(let fn of deps) {
    if (fn.options.scheduler)
      fn.options.scheduler()
    else
      fn()
  }
}

export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (!activeEffect) return target[key]
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
      return true
    }
  })
}

export function computed(fn) {
  let dirty = true
  let value
  const effectFn = effect(fn, { 
    lazy: true,
    scheduler: () => {
      dirty = true
    }
  })
  let obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      return value
    }
  }
  return obj
}

export function ref(value) {
  const wrapper = reactive({value})
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true,
    writable: false
  })
  return wrapper
}

export function isRef(r) {
  return r && r.__v_isRef
}

export function toRef(target, key, defaultValue) {
  const val = target[key]
  if (isRef(val))
    return val

  const wrapper = {
    get value() {
      return target[key] ?? defaultValue
    },
    set value(newValue) {
      target[key] = newValue
    }
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true,
    writable: false
  })
  return wrapper 
}

export function toRefs(target) {
  const wrapper = Array.isArray(target) ? [] : {}
  const props = Object.keys(target)

  for (const p of props) {
    wrapper[p] = toRef(target, p)
  }

  return wrapper
}
