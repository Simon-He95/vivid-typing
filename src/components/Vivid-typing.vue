<script setup lang="ts">
import { Text } from "vue";
const {
  interval = 30,
  delay = 0,
  infinity,
  finish,
  spiltTag,
  spiltClass,
  spiltStyle,
} = defineProps<{
  interval?: number;
  infinity?: boolean;
  delay?: number;
  finish?: Function;
  spiltTag?: string;
  spiltClass?: string;
  spiltStyle?: string | Function;
}>();

const slots = useSlots();

function joinSlots(data) {
  if (!Array.isArray(data)) {
    return data;
  }
  return data
    .map((item) => {
      if (item.type === Text) return item.children;
      return `<${item.type} v-bind="${item.props}">${joinSlots(item.children)}</${
        item.type
      }>`;
    })
    .join("");
}
let content = joinSlots(slots.default());
console.log(content);
const types = $ref("");
function updateContext() {
  return dfs();
  function dfs() {
    if (content[0] === "\\" && content[1] === "n") {
      types += " \n ";
      content = content.slice(2);
      return dfs();
    }
    if (spiltTag)
      types += `<${spiltTag} class="${spiltClass || ""}" style="${
        typeof spiltStyle === "function" ? spiltStyle() : spiltStyle
      }">${content[0]}</${spiltTag}>`;
    else types += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(() => dfs(), interval);
    } else if (infinity) {
      setTimeout(() => {
        content = slots.default()[0].children;
        types = "";
        dfs();
      }, delay + interval);
    } else {
      finish && finish();
    }
  }
}
setTimeout(updateContext, delay);
</script>

<template>
  <div whitespace-pre-line transition="all" v-html="types"></div>
</template>
