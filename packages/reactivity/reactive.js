const bucket = new WeakMap()

let activeEffect = undefined

export function effect(fn) {
  // implement effect
  activeEffect = fn 
  fn()
  activeEffect = undefined
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

  if (activeEffect) deps.add(activeEffect)
}

function trigger(target, key) {
  // implement trigger
  const depMap = bucket.get(target)
  if (!depMap) return
  const deps = depMap.get(key)
  if (!deps) return
  for(let fn of deps) {
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
