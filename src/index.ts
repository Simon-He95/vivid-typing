import { defaultProps } from './type';
import { h, defineComponent, ref, watch } from "vue";
import type { Ref, } from "vue";
const style = document.createElement('style')
style.type = 'text/css'
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
  right:-0.5rem;
  animation:twinkle 0.5s infinite alternate;
}

.vivid-typing_tag:after{
  content:"|";
  position:absolute;
  width:1px;
  top:50%;
  transform:translateY(-50%);
  right:-0.5rem;
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

export const VividTyping = defineComponent({
  props: {
    interval: {
      type: Number,
      default: 100
    },
    content: {
      type: [String, Array],
      default: ''
    },
    infinity: {
      type: Boolean,
    },
    delay: {
      type: Number,
      default: 0
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
      default: false
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Number,
      default: 2
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const vividTypingEl = ref<HTMLElement>()
    const types = ref("");
    const x = ref<number>(0);
    const y = ref<number>(0);
    let timers: any[] = []
    let preContent: string | unknown[] = ''
    initData(props, types, x, y, timers, preContent as string, vividTypingEl)
    preContent = props.content as string
    watch(props, (newProps: any) => {
      timers.forEach(timer => clearTimeout(timer))
      if (typeof newProps.content === 'string')
        deleteModel(types, newProps, x, y, timers, preContent as string, vividTypingEl)
      else
        initData(newProps, types, x, y, timers, preContent as string, vividTypingEl)
      preContent = props.content
    })

    return () => h('div', {
      innerHTML: props.spiltTag || Array.isArray(props.content)
        ? types.value
        : '<span class="vivid-typing_tag">' + types.value + '</span>',
      class: "vivid-typing_class",
      ref: vividTypingEl,
      style: {
        'white-space': 'nowrap',
        'transform': `translate3d(${x.value}%,${y.value}%,0)`,
        'overflow': 'hidden',
      }
    }, '')
  }
})

function initData(props: any, types: Ref<string>, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string, vividTypingEl: Ref<HTMLElement | undefined>) {
  let { delay, content } = props;
  const copyContent = content
  timers.length = 0
  setTimeout(() => updateContext(props, types, copyContent, x, y, timers, preContent, vividTypingEl), delay);
}

function deleteModel(types: Ref<string>, newProps: defaultProps, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string, vividTypingEl: Ref<HTMLElement | undefined>) {
  let { content, interval, spiltTag, } = newProps
  if (types.value.length > 0 && content.indexOf(preContent) !== 0) {
    preContent = preContent.substring(0, preContent.length - 1)
    if (spiltTag) {
      types.value = findSplitLast(types.value, spiltTag)
    } else
      types.value = types.value.substring(0, types.value.length - 1)
    setTimeout(() => {
      deleteModel(types, newProps, x, y, timers, preContent, vividTypingEl)
    }, interval)
  } else if (content.indexOf(preContent) === 0) {
    initData(newProps, types, x, y, timers, preContent, vividTypingEl)
  }
}



function updateContext(props: defaultProps, types: Ref, copyContent: string, x: Ref<number>, y: Ref<number>, timers: any[], preContent: string, vividTypingEl: Ref<HTMLElement | undefined>) {
  let currentIndex = -1
  let {
    interval,
    infinity,
    content,
    finish,
    spiltTag,
    spiltClass,
    spiltStyle,
    stable,
    scrollX,
    scrollY,
    speed,
    reverse } = props
  if (!Array.isArray(content))
    content = content.toString()

  if (typeof content === 'string' && content.indexOf(preContent) === 0) {
    content = content.substring(preContent.length)
  }
  return dfs();
  function dfs(): void {
    currentIndex++
    if (spiltTag)
      types.value += spiltContent(content[0], spiltTag, spiltClass, spiltStyle, currentIndex);
    else if (content.length) types.value += content[0]

    if (content.length)
      content = content.slice(1);
    if (content.length !== 0) {
      let timer = setTimeout(dfs, interval);
      timers.push(timer)
    } else if (scrollX) {
      const el = vividTypingEl.value?.childNodes[0] as HTMLElement
      const attributes = el.getAttribute('class')?.replace('vivid-typing_tag', '') as string
      el.removeAttribute('class')
      el.setAttribute('class', attributes)
      const ratio = 51 + Math.floor((el.offsetWidth / vividTypingEl.value?.offsetWidth!) * 50)
      if (reverse) {
        if (x.value > ratio)
          x.value = -ratio
        else
          x.value = x.value + speed
      } else {
        if (x.value < -ratio)
          x.value = ratio
        else
          x.value = x.value - speed
      }

      let timer = setTimeout(() => {
        dfs();
      }, interval);
      timers.push(timer)
    } else if (scrollY) {
      const el = vividTypingEl.value?.childNodes[0] as HTMLElement
      const attributes = el.getAttribute('class')?.replace('vivid-typing_tag', '') as string
      el.removeAttribute('class')
      el.setAttribute('class', attributes)
      const ratio = 51 + Math.floor((el.offsetHeight / vividTypingEl.value?.offsetHeight!) * 50)
      if (reverse) {
        if (y.value < -ratio)
          y.value = ratio
        else
          y.value = y.value - speed
      } else {
        if (y.value > ratio)
          y.value = -ratio
        else
          y.value = y.value + speed
      }

      let timer = setTimeout(() => {
        dfs();
      }, interval);
      timers.push(timer)
    } else if (infinity) {
      currentIndex = 0
      if (!stable) {
        setTimeout(() => {
          types.value = "";
        }, 100)
      }

      let timer = setTimeout(() => {
        if (stable) types.value = "";
        content = copyContent;
        dfs();
      }, interval);
      timers.push(timer)
    } else {
      finish && finish();
      types.value = types.value.replace(/vivid-typing_move|vivid-typing_tag/g, '')
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

function spiltContent(content: string, spiltTag: string, spiltClass: string | undefined, spiltStyle: string | Function | undefined, currentIndex: number) {
  return `<${spiltTag}  class="vivid-typing_tagClass vivid-typing_move ${spiltClass || ""}" style="${spiltStyle ? typeof spiltStyle === "function" ? spiltStyle(currentIndex) : spiltStyle : ''
    }">${content}</${spiltTag}>`;
}
