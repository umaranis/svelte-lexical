//import './app.css' //default css from startup template
import './index.css';
import './settings/setupEnv';
import App from './App.svelte';
import {mount} from 'svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
