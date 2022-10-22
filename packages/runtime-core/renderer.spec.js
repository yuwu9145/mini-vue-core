import { createRenderer } from './renderer'
describe('renderer: element', () => {
  let root
  const render = createRenderer().render
  beforeEach(() => {
    root = document.createElement('div')
  })

  it('should create an element', () => {
    render({
      type: 'div'
    }, root)
    expect(root.innerHTML).toBe('<div></div>')
  })

  it('should create an element with props', () => {
    render({
      type: 'div',
      props: { id: 'foo', class: 'bar' }
    }, root)
    expect(root.innerHTML).toBe('<div id="foo" class="bar"></div>')
  })

  it('should create an element with direct text children', () => {
    render({
      type: 'div',
      children: ['foo', ' ', 'bar']
    }, root)
    expect(root.innerHTML).toBe('<div>foo bar</div>')
  })

  it('should create an element with direct text children and props', () => {
    render({
      type: 'div',
      props: { id: 'foo' },
      children: ['bar']
    }, root)
    expect(root.innerHTML).toBe('<div id="foo">bar</div>')
  })

  it('should update an element tag which is already mounted', () => {
    render({
      type: 'div',
      children: ['foo']
    }, root)
    expect(root.innerHTML).toBe('<div>foo</div>')

    render({
      type: 'span',
      children: ['foo']
    }, root)
    expect(root.innerHTML).toBe('<span>foo</span>')
  })

  // it('should update element props which is already mounted', () => {
  //   render(h('div', { id: 'bar' }, ['foo']), root)
  //   expect(inner(root)).toBe('<div id="bar">foo</div>')

  //   render(h('div', { id: 'baz', class: 'bar' }, ['foo']), root)
  //   expect(inner(root)).toBe('<div id="baz" class="bar">foo</div>')
  // })
})
