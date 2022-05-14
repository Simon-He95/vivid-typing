<script setup lang="ts">
const { interval = 30, delay = 0, infinity, finish } = defineProps<{
  interval?: number;
  infinity?: boolean;
  delay?: number;
  finish?: Function;
}>();

const slots = useSlots();
let content = slots.default()[0].children;
const types = $ref("");
function updateContext() {
  return dfs();
  function dfs() {
    if (content[0] === "\\" && content[1] === "n") {
      types += " \n ";
      content = content.slice(2);
      return dfs();
    }
    types += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(() => dfs(), interval);
    } else if (infinity) {
      setTimeout(() => {
        content = slots.default()[0].children;
        types = "";
        dfs();
        console.log("22");
      }, delay + interval);
    } else {
      finish && finish();
    }
  }
}
setTimeout(updateContext, delay);
</script>

<template>
  <div whitespace-pre-line>{{ types }}</div>
</template>

<style scoped></style>
