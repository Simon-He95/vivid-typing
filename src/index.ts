import { defaultProps } from './type';
import { h, defineComponent, ref, watch } from "vue";
import type { Ref, } from "vue";

let timers: any[] = []

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
      default: 5
    }
  },
  setup(props) {
    const types = ref("");
    const textIndent = ref<number>(0);
    const paddingTop = ref<number>(0);
    initData(props, types, textIndent, paddingTop)
    watch(props, (newProps: any) => {
      timers.forEach(timer => clearTimeout(timer))
      if (typeof newProps.content === 'string')
        deleteModel(types, newProps, textIndent, paddingTop)
      else
        initData(newProps, types, textIndent, paddingTop)
    })

    return () => h('div', {
      innerHTML: types.value,
      style: {
        'white-space': 'nowrap',
        'text-indent': textIndent.value + '%',
        'overflow': 'hidden',
        "will-change": "transform",
        'padding-top': paddingTop.value + '%'
      }
    }, '')
  }
})

function initData(props: any, types: Ref<string>, textIndent: Ref<number>, paddingTop: Ref<number>) {
  let { delay, content } = props;
  const copyContent = content
  timers.length = 0
  setTimeout(() => updateContext(props, types, copyContent, textIndent, paddingTop), delay);
}

function deleteModel(types: Ref<string>, newProps: defaultProps, textIndent: Ref<number>, paddingTop: Ref<number>) {
  const { content, interval } = newProps

  if (types.value.length > 0 && content.indexOf(types.value) !== 0) {
    types.value = types.value.substring(0, types.value.length - 1)
    setTimeout(() => {
      deleteModel(types, newProps, textIndent, paddingTop)
    }, interval)
  } else if (content.indexOf(types.value) === 0) {
    initData(newProps, types, textIndent, paddingTop)
  }
}



function updateContext(props: defaultProps, types: Ref, copyContent: string, textIndent: Ref<number>, paddingTop: Ref<number>) {
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
    speed } = props

  if (typeof content === 'string' && content.indexOf(types.value) === 0) {
    content = content.substring(types.value.length)
  }

  return dfs();
  function dfs(): void {
    currentIndex++
    if (spiltTag)
      types.value += `<${spiltTag} class="${spiltClass || ""}" style="${spiltStyle ? typeof spiltStyle === "function" ? spiltStyle(currentIndex) : spiltStyle : ''
        }">${content[0]}</${spiltTag}>`;
    else if (content.length) { types.value += content[0]; }
    if (content.length)
      content = content.slice(1);
    console.log(content)
    if (content.length !== 0) {
      let timer = setTimeout(dfs, interval);
      timers.push(timer)
    } else if (scrollX) {
      if (textIndent.value <= -200)
        textIndent.value = 100
      else
        textIndent.value = textIndent.value - speed

      let timer = setTimeout(() => {
        dfs();
      }, interval);
      timers.push(timer)
    } else if (scrollY) {
      if (paddingTop.value >= 10)
        paddingTop.value = 0
      else
        paddingTop.value = paddingTop.value + speed / 5
      console.log(paddingTop.value)
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
    }
  }
}


