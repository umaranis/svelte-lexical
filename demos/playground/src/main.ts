//import './app.css' //default css from startup template
import './global.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
