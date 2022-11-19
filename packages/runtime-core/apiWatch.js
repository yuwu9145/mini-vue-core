import { 
  reactive,
  effect as reactiveEffect,
  computed,
  ref,
  toRef,
  toRefs,
  isRef
} from '../reactivity/reactive'

function nextTick( fn ) {
  // a dummy promise to simulate nextTick's effect
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve('foo') }, 100);
  })
  // const p = currentFlushPromise || resolvedPromise
  // return fn ? p.then(this ? fn.bind(this) : fn) : p
}

function watchEffect(fn) {
  doWatch(fn, null, undefined)
}

function doWatch(source, cb, options) {
  reactiveEffect(source)
}

export {
  nextTick,
  reactive,
  watchEffect
}