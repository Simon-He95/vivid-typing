import { defineComponent, h, ref, watch } from 'vue'
import { animationFrameWrapper } from 'simon-js-tool'
import type { DefineComponent, Ref } from 'vue'
import type { defaultProps } from './type'

try {
  (function insertStyle() {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.id = 'vivid-typing-style'
    style.innerHTML = `
      .vivid-typing_tagClass, .vivid-typing_class, .vivid-typing_tag{
        position:relative
      }
      .vivid-typing_tagClass.vivid-typing_move:last-child:after{
        content:"|";
        position:absolute;
        width:1px;
        top:50%;
        transform:translateY(-50%);
        right:-0.25rem;
        color:darkgray;
        animation:twinkle 0.5s infinite alternate;
      }
      
      .vivid-typing_tag:after{
        content:"|";
        position:absolute;
        width:1px;
        top:50%;
        transform:translateY(-50%);
        right:-0.25rem;
        color:darkgray;
        font-size:1rem;
        animation:twinkle 0.5s infinite alternate;
      }
      
      @keyframes twinkle{
        0%{
          opacity:0
        }
        100%{
          opacity:100%
        }
      }
      
      `
    document.head.appendChild(style)
  })()
}
catch (error) {

}

export const VividTyping = defineComponent({
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
    const vividTypingEl = ref<HTMLElement>()
    const types = ref('')
    const x = ref<number>(0)
    const y = ref<number>(0)
    const timers: any[] = []
    let preContent: string | unknown[] = ''
    const duration = ref<number>(props.interval)

    initData(props, types, x, y, timers, preContent as string, vividTypingEl, duration)
    preContent = props.content
    watch(props, (newProps: any) => {
      timers.forEach(timer => clearTimeout(timer))
      if (typeof newProps.content === 'string')
        deleteModel(types, newProps, x, y, timers, preContent, vividTypingEl, duration)
      else
        initData(newProps, types, x, y, timers, preContent, vividTypingEl, duration)
      preContent = props.content
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
  },
}) as DefineComponent<defaultProps>

function initData(props: any, types: Ref<string>, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
  const { delay, content } = props
  const copyContent = content
  timers.length = 0
  animationFrameWrapper(() => updateContext(props, types, copyContent, x, y, timers, preContent, vividTypingEl, duration), delay, true)
}

function deleteModel(types: Ref<string>, newProps: defaultProps, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
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
    animationFrameWrapper(() => deleteModel(types, newProps, x, y, timers, preContent, vividTypingEl, duration), interval, true)
  }
  else if (isArray(content) || isArray(preContent) || content.indexOf(preContent as string) === 0)
    initData(newProps, types, x, y, timers, preContent, vividTypingEl, duration)
}

function updateContext(props: defaultProps, types: Ref, copyContent: string, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string | unknown[], vividTypingEl: Ref<HTMLElement | undefined>, duration: Ref<number>) {
  let currentIndex = -1
  const {
    interval,
    infinity,
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
      types.value += spiltContent(content[0], spiltTag, spiltClass, spiltStyle, currentIndex, tail)
    else if (content.length)
      types.value += content[0]

    if (content.length)
      content = content.slice(1)
    if (content.length !== 0)
      animationFrameWrapper(dfs, interval, true)
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
          animationFrameWrapper(() => duration.value = props.interval, 100, true)
        }
        else x.value = x.value + speed
      }
      else {
        if (x.value < -ratio) {
          duration.value = 0
          x.value = ratio
          animationFrameWrapper(() => duration.value = props.interval, 100, true)
        }
        else x.value = x.value - speed
      }

      animationFrameWrapper(dfs, interval, true)
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
          animationFrameWrapper(() => duration.value = props.interval, 100, true)
        }
        else y.value = y.value - speed
      }
      else {
        if (y.value > ratio) {
          duration.value = 0
          y.value = -ratio
          animationFrameWrapper(() => duration.value = props.interval, 100, true)
        }
        else y.value = y.value + speed
      }
      animationFrameWrapper(dfs, interval, true)
    }
    else if (infinity) {
      currentIndex = 0
      if (!stable)
        animationFrameWrapper(() => types.value = '', 100, true)

      animationFrameWrapper(() => {
        if (stable)
          types.value = ''
        content = copyContent
        dfs()
      }, interval, true)
    }
    else {
      animationFrameWrapper(() => {
        const el = vividTypingEl.value?.childNodes[vividTypingEl.value?.childNodes.length - 1] as HTMLElement
        if (!el)
          return
        const attributes = el.getAttribute('class')?.replace(/vivid-typing_move|vivid-typing_tag$/g, '') as string
        el.removeAttribute('class')
        el.setAttribute('class', attributes)
      }, 0, true)

      animationFrameWrapper(() => finish?.(), interval, true)
    }
  }
}

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

function isStr(str: any): boolean {
  return typeof str === 'string'
}

function isArray(arr: any): boolean {
  return Array.isArray(arr)
}
