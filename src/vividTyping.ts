import type { DefineComponent, Ref } from 'vue'
import type { defaultProps } from './type'
import { isArray, isStr, useRaf } from 'lazy-js-utils'
import { defineComponent, h, onBeforeUnmount, ref, watch } from 'vue'

export const VividTyping = defineComponent({
  name: 'VividTyping',
  props: {
    interval: {
      type: Number,
      default: 100,
    },
    content: {
      type: [String, Array],
      default: '',
    },
    infinity: {
      type: Boolean,
    },
    delay: {
      type: Number,
      default: 0,
    },
    infinityDelay: {
      type: Number,
      default: 500,
    },
    finish: {
      type: Function,
    },
    spiltTag: {
      type: String,
    },
    spiltClass: {
      type: String,
    },
    spiltStyle: {
      type: [String, Function],
    },
    stable: {
      type: Boolean,
      default: false,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    scrollY: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 2,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    tail: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const disposes: (() => void)[] = []
    const vividTypingEl = ref<HTMLElement>()
    const types = ref('')
    const x = ref<number>(0)
    const y = ref<number>(0)
    let preContent: string | unknown[] = ''
    const duration = ref<number>(props.interval)

    initData(props, types, x, y, preContent as string, vividTypingEl, duration)
    preContent = props.content
    watch(props, (newProps: any) => {
      if (typeof newProps.content === 'string')
        deleteModel(types, newProps, x, y, preContent, vividTypingEl, duration)
      else
        initData(newProps, types, x, y, preContent, vividTypingEl, duration)
      preContent = props.content
    })
    onBeforeUnmount(() => {
      disposes.forEach(dispose => dispose())
      disposes.length = 0
    })

    return () => h('div', {
      innerHTML: props.spiltTag || isArray(props.content)
        ? types.value
        : `<span class="vivid-typing_tag">${types.value}</span>`,
      class: 'vivid-typing_class',
      ref: vividTypingEl,
      style: {
        'transform': `translate3d(${x.value}%,${y.value}%,0)`,
        'transition': `transform ${duration.value}ms linear`,
        'word-break': 'break-word',
      },
    })

    function initData(props: any, types: Ref<string>, x: Ref<number>, y: Ref<number>, preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
      const { delay, content } = props
      const copyContent = content
      disposes.push(useRaf(() => updateContext(props, types, copyContent, x, y, preContent, vividTypingEl, duration), {
        delta: delay,
        autoStop: true,
      }))
    }

    function deleteModel(types: Ref<string>, newProps: defaultProps, x: Ref<number>, y: Ref<number>, preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
      const { content, interval, spiltTag } = newProps
      if (isStr(content) && isStr(preContent) && types.value.length > 0 && content.indexOf(preContent as string) !== 0) {
        const len = preContent.length - 1

        if (preContent[len] === '>' && preContent[len - 1] === '%' && preContent[len - 2] === '/') {
          const _index = preContent.indexOf('<%>')
          if (_index >= 0)
            types.value = types.value.substring(0, _index + 1)
          else
            throw new Error('<%>标签不匹配')
        }
        if (preContent[len] === 'n' && preContent[len - 1] === '\\') {
          types.value = types.value.slice(0, -4)
          preContent = (preContent as string).slice(0, -2)
        }
        else {
          preContent = (preContent as string).substring(0, preContent.length - 1)
          if (spiltTag)
            types.value = findSplitLast(types.value, spiltTag)
          else
            types.value = types.value.substring(0, types.value.length - 1)
        }
        disposes.push(useRaf(() => deleteModel(types, newProps, x, y, preContent, vividTypingEl, duration), {
          delta: interval,
          autoStop: true,
        }))
      }
      else if (isArray(content) || isArray(preContent) || content.indexOf(preContent as string) === 0) {
        initData(newProps, types, x, y, preContent, vividTypingEl, duration)
      }
    }

    function updateContext(props: defaultProps, types: Ref, copyContent: string, x: Ref<number>, y: Ref<number>, preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
      let currentIndex = -1
      const {
        interval,
        infinity,
        infinityDelay,
        finish,
        spiltTag,
        spiltClass,
        spiltStyle,
        stable,
        scrollX,
        scrollY,
        speed,
        reverse,
        tail,
      } = props
      let { content } = props
      if (!isArray(content))
        content = content.toString()

      if (isStr(content) && isStr(preContent) && content.indexOf(preContent as string) === 0)
        content = (content as string).substring(preContent.length)

      return dfs()
      function dfs() {
        currentIndex++
        if (content[0] === '\\' && content[1] === 'n') {
          types.value += '<br>'
          content = content.slice(2)
        }
        if (content[0] === '<' && content[1] === '%' && content[2] === '>') {
          const _index = content.indexOf('</%>')
          if (_index > 0) {
            types.value += content.slice(3, _index)
            content = content.slice(_index + 4)
          }
          else {
            throw new Error('<%>标签不匹配')
          }
        }
        if (spiltTag && content.length)
          types.value += spiltContent(content[0], spiltTag, spiltClass, spiltStyle, currentIndex, tail!)
        else if (content.length)
          types.value += content[0]

        if (content.length)
          content = content.slice(1)
        if (content.length !== 0) {
          disposes.push(useRaf(dfs, {
            delta: interval,
            autoStop: true,
          }))
        }
        else if (scrollX) {
          const el = vividTypingEl.value?.childNodes[0] as HTMLElement
          if (!el)
            return false
          const attributes = el.getAttribute('class')?.replace('vivid-typing_tag', '') as string
          el.removeAttribute('class')
          el.setAttribute('class', attributes)
          const ratio = vividTypingEl.value?.offsetWidth
            ? 51 + Math.floor((el.offsetWidth / vividTypingEl.value?.offsetWidth) * 50)
            : 70
          if (reverse) {
            if (x.value > ratio) {
              duration.value = 0
              x.value = -ratio
              disposes.push(useRaf(() => duration.value = props.interval!, {
                delta: 100,
                autoStop: true,
              }))
            }
            else { x.value = x.value + speed! }
          }
          else {
            if (x.value < -ratio) {
              duration.value = 0
              x.value = ratio
              disposes.push(useRaf(() => duration.value = props.interval!, {
                delta: 100,
                autoStop: true,
              }))
            }
            else { x.value = x.value - speed! }
          }
          disposes.push(useRaf(dfs, {
            delta: interval,
            autoStop: true,
          }))
        }
        else if (scrollY) {
          const el = vividTypingEl.value?.childNodes[0] as HTMLElement
          if (!el)
            return
          const attributes = el.getAttribute('class')?.replace('vivid-typing_tag', '') as string
          el.removeAttribute('class')
          el.setAttribute('class', attributes)
          const ratio = vividTypingEl.value?.offsetHeight
            ? (51 + Math.floor((el.offsetHeight / vividTypingEl.value?.offsetHeight) * 50))
            : 96

          if (reverse) {
            if (y.value < -ratio) {
              duration.value = 0
              y.value = ratio
              disposes.push(useRaf(() => duration.value = props.interval!, {
                delta: 100,
                autoStop: true,
              }))
            }
            else { y.value = y.value - speed! }
          }
          else {
            if (y.value > ratio) {
              duration.value = 0
              y.value = -ratio
              disposes.push(useRaf(() => duration.value = props.interval!, {
                delta: 100,
                autoStop: true,
              }))
            }
            else { y.value = y.value + speed! }
          }
          disposes.push(useRaf(dfs, {
            delta: interval,
            autoStop: true,
          }))
        }
        else if (infinity) {
          currentIndex = 0
          if (!stable) {
            disposes.push(useRaf(() => types.value = '', {
              delta: infinityDelay,
              autoStop: true,
            }))
          }

          disposes.push(useRaf(() => {
            if (stable)
              types.value = ''
            content = copyContent
            dfs()
          }, {
            delta: infinityDelay,
            autoStop: true,
          }))
        }
        else {
          disposes.push(useRaf(() => {
            const el = vividTypingEl.value?.childNodes[vividTypingEl.value?.childNodes.length - 1] as HTMLElement
            if (!el)
              return
            const attributes = el.getAttribute('class')?.replace(/vivid-typing_move|vivid-typing_tag$/g, '') as string
            el.removeAttribute('class')
            el.setAttribute('class', attributes)
          }, {
            delta: 0,
            autoStop: true,
          }))

          disposes.push(useRaf(() => finish?.(), {
            delta: infinityDelay,
            autoStop: true,
          }))
        }
      }
    }
  },
}) as DefineComponent<defaultProps & Record<string, any>>

function findSplitLast(content: string, spiltTag: string) {
  const len = spiltTag.length + 3
  content = content.substring(0, content.length - len)
  const index = content.lastIndexOf(spiltTag)
  content = content.substring(0, index - 1)
  return content
}

function spiltContent(content: string, spiltTag: string, spiltClass: string | undefined, spiltStyle: string | Function | undefined, currentIndex: number, tail: boolean) {
  return `<${spiltTag}  class="vivid-typing_tagClass${tail ? ' vivid-typing_move' : ''} ${spiltClass || ''}" style="${spiltStyle ? typeof spiltStyle === 'function' ? spiltStyle(currentIndex) : spiltStyle : ''
  }">${content}</${spiltTag}>`
}
