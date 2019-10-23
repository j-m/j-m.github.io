<script>
  export let defaultTitle;
  export let defaultComponent;
  export let defaultProps = [];

  import { get } from "svelte/store"

  import { routes } from '../data/routes.js'

  let component = defaultComponent
  let props = defaultProps
  routes.subscribe(value => {
		const route = value[document.location.pathname.toLowerCase()]
    document.title = (route) ? route.title : defaultTitle
    component =  (route) ? route.component : defaultComponent
    props = (route) ? route.props : defaultProps
	})
</script>

<svelte:component this={component} {...props}/>
