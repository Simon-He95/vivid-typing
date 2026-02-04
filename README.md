# Vivid Typing

Vue 3 打字机 / 通知滚动（marquee）组件。

- Online Demo: https://vivid-typing.netlify.app/

## Install

```bash
npm i vivid-typing
# or
pnpm add vivid-typing
# or
yarn add vivid-typing
```

## Quick Start

```ts
import { createApp } from 'vue'
import { VividTyping } from 'vivid-typing'
import 'vivid-typing/dist/index.css'

import App from './App.vue'

const app = createApp(App)
app.component('VividTyping', VividTyping)
app.mount('#app')
```

## Usage

```vue
<template>
  <vivid-typing content="Hi" :interval="80" />
</template>
```

更多示例：`playground/src/App.vue`

## Props

| Prop | Type | Default | Desc |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | `''` | 渲染内容（字符串或数组） |
| `interval` | `number` | `100` | 每个字符的间隔（ms） |
| `delay` | `number` | `0` | 延迟多久开始（ms） |
| `infinity` | `boolean` | `false` | 是否无限循环 |
| `infinityDelay` | `number` | `500` | 每轮结束后的等待（ms） |
| `finish` | `() => void` | - | 播放完成回调（非 `infinity` 时） |
| `stable` | `boolean` | `false` | `infinity` 时每轮的清空/首帧策略（见示例） |
| `tail` | `boolean` | `true` | 是否展示结尾闪烁效果 |
| `spiltTag` | `string` | - | 将文本以 `spiltTag` 包裹拆分（历史拼写：spilt） |
| `spiltClass` | `string` | - | 拆分后 tag 的 class |
| `spiltStyle` | `string \| (index:number)=>string` | - | 拆分后 tag 的 style（支持按 index） |
| `scrollX` | `boolean` | `false` | 横向滚动（注意外层 `overflow:hidden`） |
| `scrollY` | `boolean` | `false` | 纵向滚动（注意外层 `overflow:hidden`） |
| `speed` | `number` | `2` | 滚动速度 |
| `reverse` | `boolean` | `false` | 反向滚动 |

## Feature
- 支持用 `\\n` 表示换行（例如 `content="a\\nb"`）
- 支持 `<%> ... </%>` 插入片段（例如插入 icon / HTML 片段）

```vue
<template>
  <vivid-typing
    :content="`Hi,<%><i class='emoji'></i></%>Simon\\nNice to meet you`"
    spilt-tag="span"
    spilt-class="animate-bounce"
    :interval="80"
  />
</template>
```

注意：组件内部使用 `innerHTML` 渲染，`content` 请不要来自不可信输入，否则可能产生 XSS 风险。

## FAQ

如果遇到 Vue 重复实例导致的报错（例如 “Missing ref owner context”），可以在 `vite.config.ts` 添加 dedupe：

```ts
export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
})
```
