//import './app.css' //default css from startup template
import './index.css';
import './settings/setupEnv';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
