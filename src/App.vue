<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <vivid-typing :interval="80" :delay="0" :infinity="true" h-10>
      l will always loop
    </vivid-typing>
    <vivid-typing :interval="80" :delay="0" h-10> Hi </vivid-typing>
    <vivid-typing :interval="80" :delay="1500" h-10> What your name? </vivid-typing>
    <vivid-typing :interval="80" :delay="3000" h-10> How old are you? </vivid-typing>
    <vivid-typing :interval="80" :delay="4500" h-10 :finish="finish">
      Do you love it?
    </vivid-typing>
    <Footer />
  </main>
</template>

<script setup lang="ts">
function finish() {
  console.log("finish");
}
</script>

<style scoped></style>
