
export function render(vnode, container) {
  const el = document.createElement(vnode.type)
  container.appendChild(el)
}