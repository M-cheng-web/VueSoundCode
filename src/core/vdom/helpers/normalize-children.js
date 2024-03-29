/* @flow */

import VNode, { createTextVNode } from 'core/vdom/vnode'
import { isFalse, isTrue, isDef, isUndef, isPrimitive } from 'shared/util'

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.

// 当子组件包含组件时——因为是功能性组件
// 可能返回一个Array而不是单个根。在这种情况下，只是简单的
// 需要标准化-如果任何子数组是一个数组，我们扁平化整个
// 使用Array.prototype.concat它保证只有1层深
// 因为功能组件已经规范化了他们自己的子组件
export function simpleNormalizeChildren (children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.

// 当子类包含总是生成嵌套数组的构造时，
// 例如:<template>， <slot>， v-for，或者当子节点由用户提供时
// 使用手动编写的渲染函数/ JSX。在这种情况下是完全的标准化
// 需要满足所有可能的child值类型。
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node): boolean {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    if (Array.isArray(c)) {
      if (c.length > 0) {
        // 如果是一个数组类型，则递归调用 normalizeArrayChildren
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)

        // 如果数组的第一个和最后一个都是vnode text节点,会把它们合并成一个text节点
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      // 如果c是基础变量,number/string/symbol等等
      if (isTextNode(last)) {
        // 并且数组最后一个是 vnode text节点,那么合并成一个text节点
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        res.push(createTextVNode(c))
      }
    } else {
      // c既不是数组,也不是基础变量,那肯定是VNode类型
      if (isTextNode(c) && isTextNode(last)) {
        // 如果c和last都是VNode text节点,那么合并(c本来就是要push的,合并的原理一样)
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // 如果 children 是一个列表并且列表还存在嵌套的情况，则根据 nestedIndex 去更新它的 key
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
