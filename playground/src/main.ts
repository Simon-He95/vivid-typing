import { createApp } from 'vue'
import { VividTyping } from '../../src'
import App from './App.vue'
// import { VividTyping } from 'vivid-typing'
import '../../src/index.css'

import '@unocss/reset/tailwind.css'
// import 'vivid-typing/style.css'
import 'uno.css'
// import { VividTyping } from 'vivid-typing'
const app = createApp(App)
app.component('VividTyping', VividTyping)
app.mount('#app')
