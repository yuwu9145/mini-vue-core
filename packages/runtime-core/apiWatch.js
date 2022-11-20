import { 
  reactive,
  effect as reactiveEffect,
  computed,
  ref,
  toRef,
  toRefs,
  isRef
} from '../reactivity/reactive'

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
  let getter = source
  if (cb) {
    reactiveEffect(getter, {
      scheduler: cb
    })
  } else {
    reactiveEffect(getter)
  }
}

export {
  nextTick,
  reactive,
  watchEffect,
  watch
}