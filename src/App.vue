<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <vivid-typing
      :interval="100"
      :delay="0"
      :infinity="true"
      h-10
      spilt-tag="span"
      spilt-class="vivid-span"
      :spilt-style="styleFn"
    >
      l will always loop
    </vivid-typing>
    <vivid-typing :interval="100" :delay="0" h-10> Hi </vivid-typing>
    <vivid-typing :interval="100" :delay="1500" h-10> What your name? </vivid-typing>
    <vivid-typing :interval="100" :delay="3000" h-10> How old are you? </vivid-typing>
    <vivid-typing :interval="100" :delay="4500" h-10 :finish="finish">
      Do you love it?
    </vivid-typing>
    <vivid-typing :interval="100" :delay="6000" h-10 :finish="finish">
      Let's give it a try
    </vivid-typing>
    <Footer />
  </main>
</template>

<script setup lang="ts">
import { VividTyping } from "./index";
function finish() {
  console.log("finish");
}

function styleFn() {
  return `color:rgb(${Math.random() * 255},${Math.random() * 255}, ${
    Math.random() * 255
  })`;
}
</script>

<style scoped></style>
