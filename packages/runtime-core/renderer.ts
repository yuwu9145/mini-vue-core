export function createRenderer() {

  function mountElement(vnode, container) {
    const el = document.createElement(vnode.type)

    if (vnode.children && vnode.children.length) {
      for (const child of vnode.children) {
        el.textContent = `${el.textContent }${child}`
      }
    } 
    
    if (vnode.props) {
      for (const key of Object.keys(vnode.props) ) {
        el.setAttribute(key, vnode.props[key])
      }
    }
    
    container.appendChild(el)
  }

  function patch(n1 = null, n2, container) {
    mountElement(n2, container) 
  }

  function render(vnode, container) {
    patch(null, vnode, container) 
  }

  return {
    render
  }
}