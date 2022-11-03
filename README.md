# hand write mini-vue-core

The best way to learn Vue is by understading its source code and code it yourself.

### Why this repo?
- `npm run test` runs real test cases copied from Vue 3 Core source code
- NO EDGE CASE but Focus is on understanding the concept
- `playground.html` implements a very simple demo. It is amazing to see it works the same as Vue 3


```html
<!DOCTYPE html>
<html>
  <body>
    <h2>My own vue core!</h2> 
    <div id="app"></div>
  </body>
  <script type="module">
    import { reactive, effect, ref } from './packages/reactivity/reactive.js'
    import { createRenderer } from './packages/runtime-core/renderer.js'
    const count = ref(1) 
    const render = createRenderer().render
    
    effect(() => {
      render({
        type: 'h1',
        children: `${count.value}`
      }, document.getElementById('app'))
    })

    setInterval(() => {
      count.value ++
    }, 1000);
  </script>
</html>
```
