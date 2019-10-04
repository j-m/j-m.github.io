import App from './routes/index.svelte';

var app = new App({
	target: document.body.querySelector('app'),
	hydrate: true
});

export default app;
