import { defaultProps } from './type';
import { Text, h, defineComponent } from "vue";
import type { Ref, } from "vue";

export const VividTyping = defineComponent({
  props: {
    interval: {
      type: Number,
      default: 100
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
    }
  },
  setup(props, { slots }) {
    const { delay } = props;
    let content = joinSlots((slots as any).default());
    console.log(content);

    const types = ref("");
    setTimeout(() => updateContext(props, content, types, slots), delay);

    return () => h('div', {
      innerHTML: types.value
    })
  }
})


function joinSlots(data: Array<any> | string): string {
  if (!Array.isArray(data)) {
    return data;
  }
  return data
    .map((item) => {
      if (item.type === Text) return item.children;
      return `<${item.type} >${joinSlots(item.children)}</${item.type
        }>`;
    })
    .join("");
}


function updateContext(props: defaultProps, content: string, types: Ref, slots: any) {

  const {
    interval,
    delay,
    infinity,
    finish,
    spiltTag,
    spiltClass,
    spiltStyle, } = props

  return dfs();
  function dfs(): void {
    if (content[0] === "\\" && content[1] === "n") {
      types.value += " \n ";
      content = content.slice(2);
      return dfs();
    }

    if (spiltTag)
      types.value += `<${spiltTag} class="${spiltClass || ""}" style="${typeof spiltStyle === "function" ? spiltStyle() : spiltStyle
        }">${content[0]}</${spiltTag}>`;
    else types.value += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(dfs, interval);
    } else if (infinity) {
      setTimeout(() => {
        content = slots.default()[0].children;
        types.value = "";
        dfs();
      }, delay + interval);
    } else {
      finish && finish();
    }
  }
}


