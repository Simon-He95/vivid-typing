# Vivid Typing

[online](http://www.hejian.club:8080/vivid-typing/)


## start

```bash
 npm i vivid-typing # 安装依赖

# main.ts 引入
  import { createApp } from 'vue'
  import { VividTyping } from 'vivid-typing'

  const app = createApp(App)
  app.component('VividTyping', VividTyping)
  app.mount('#app')
```

## usage

```markdown
  <vivid-typing :interval="100" :delay="0" h-10 content="hi"></vivid-typing>
```

## api

```markdown
type defaultProps = {
  content: string | array // 渲染的内容
  interval: number  // 文字间隔
  delay: number    // 延迟多久开始
  infinity: boolean | undefined // 是否无限循环
  finish: Function | undefined  // 完成后的回调
  spiltTag: string | undefined  // 将文本以spiltTag标签分割
  spiltClass: string | undefined  // 分割的Tag加上spiltClass类
  spiltStyle: string | Function | undefined // 分割的Tag加上spiltStyle样式，支持函数可以正对每个分割的Tag独立的style 
}

```
