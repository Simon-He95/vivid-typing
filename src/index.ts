import { defaultProps } from './type';
import { h, defineComponent, ref, watch } from "vue";
import type { Ref, } from "vue";

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
    }
  },
  setup(props, { slots }) {
    const types = ref("");
    initData(props, types)
    watch(props, (newVProps) => {
      initData(newVProps, types)
    })

    return () => h('div', {
      innerHTML: types.value
    }, '')
  }
})

function initData(props: any, types: Ref<string>) {
  let { delay, content } = props;
  const copyContent = content
  setTimeout(() => updateContext(props, types, copyContent), delay);
}



function updateContext(props: defaultProps, types: Ref, copyContent: string) {
  let currentIndex = -1
  let {
    interval,
    infinity,
    content,
    finish,
    spiltTag,
    spiltClass,
    spiltStyle,
    stable } = props

  return dfs();
  function dfs(): void {
    currentIndex++
    if (spiltTag)
      types.value += `<${spiltTag} class="${spiltClass || ""}" style="${spiltStyle ? typeof spiltStyle === "function" ? spiltStyle(currentIndex) : spiltStyle : ''
        }">${content[0]}</${spiltTag}>`;
    else types.value += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(dfs, interval);
    } else if (infinity) {
      currentIndex = 0
      if (!stable) {
        setTimeout(() => {
          types.value = "";
        }, 100)
      }

      setTimeout(() => {
        if (stable) types.value = "";
        content = copyContent;
        dfs();
      }, interval);
    } else {
      finish && finish();
    }
  }
}


