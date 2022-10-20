const onRE = /^on[^a-z]/
export const isOn = (key) => onRE.test(key)

export function serialize(
  node,
  indent = 0,
  depth = 0
) {
  if (node.type === 'element') {
    return serializeElement(node, indent, depth)
  } else {
    return serializeText(node, indent, depth)
  }
}

export function serializeInner(
  node,
  indent = 0,
  depth = 0
) {
  const newLine = indent ? `\n` : ``
  return node.children.length
    ? newLine +
        node.children.map(c => serialize(c, indent, depth + 1)).join(newLine) +
        newLine
    : ``
}

function serializeElement(
  node,
  indent,
  depth
) {
  const props = Object.keys(node.props)
    .map(key => {
      const value = node.props[key]
      return isOn(key) || value == null
        ? ``
        : value === ``
        ? key
        : `${key}=${JSON.stringify(value)}`
    })
    .filter(Boolean)
    .join(' ')
  const padding = indent ? ` `.repeat(indent).repeat(depth) : ``
  return (
    `${padding}<${node.tag}${props ? ` ${props}` : ``}>` +
    `${serializeInner(node, indent, depth)}` +
    `${padding}</${node.tag}>`
  )
}

function serializeText(
  node,
  indent,
  depth
) {
  const padding = indent ? ` `.repeat(indent).repeat(depth) : ``
  return (
    padding +
    (node.type === 'comment' ? `<!--${node.text}-->` : node.text)
  )
}
