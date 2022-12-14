import { 
  reactive,
  effect as reactiveEffect,
  ref,
  isRef,
} from '../reactivity/reactive.js'

const resolvedPromise = /*#__PURE__*/ Promise.resolve()

function nextTick( fn ) {
  // a dummy promise to simulate nextTick's effect
  return resolvedPromise
  // const p = currentFlushPromise || resolvedPromise
  // return fn ? p.then(this ? fn.bind(this) : fn) : p
}

function watch(fn, cb) {
  doWatch(fn, cb, undefined)
}

function watchEffect(fn) {
  doWatch(fn, null, undefined)
}

function doWatch(source, cb, options) {
  let getter

  if (typeof source === 'function') {
    getter = source
  } else if(Array.isArray(source)) {
    // getter = () => source.map(s => traverse(s))
    getter = () => {
      return traverse(source)
    }
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue
  
  if (cb) {
    const effectFn = reactiveEffect(getter, {
      scheduler: () => {
        newValue = effectFn()
        cb(newValue, oldValue)
        oldValue = newValue
      },
      lazy: true
    })
    const oldValResult = effectFn()
    oldValue = oldValResult
  } else {
    reactiveEffect(getter)
  }
}

function traverse(value, seen) {
  if (typeof value !== 'object' || value === null || seen?.has(value)) {
    return value
  }

  if (!seen) seen = new Set()
  seen.add(value)

  if (isRef(value)) {
    return traverse(value.value, seen)
  } else {
    // for (const k in value) {
    //   traverse(value[k], seen)
    // }
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
    // for(let i = 0; i < value.length; i++) {
    //   traverse(value[i], seen)
    // }
  }

  return value
}

export {
  nextTick,
  reactive,
  watchEffect,
  watch,
  ref
}