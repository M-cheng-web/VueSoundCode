/* @flow */

import { namespaceMap } from 'web/util/index'

export function createElement (tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  // 如果为 select标签,那么会强制设置 multiple(多选)属性   ----- 为什么??
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}

/**
 * 与 createElement() 方法相似，只是它创建的 Element 节点除了具有指定的名称外，还具有指定的命名空间。只有使用命名空间的 XML 文档才会使用该方法
 */
export function createElementNS (namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

export function createTextNode (text: string): Text {
  return document.createTextNode(text)
}

export function createComment (text: string): Comment {
  return document.createComment(text)
}

export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild (node: Node, child: Node) {
  node.removeChild(child)
}

export function appendChild (node: Node, child: Node) {
  node.appendChild(child)
}

export function parentNode (node: Node): ?Node {
  return node.parentNode
}

export function nextSibling (node: Node): ?Node {
  return node.nextSibling
}

export function tagName (node: Element): string {
  return node.tagName
}

export function setTextContent (node: Node, text: string) {
  node.textContent = text
}

export function setStyleScope (node: Element, scopeId: string) {
  node.setAttribute(scopeId, '')
}
