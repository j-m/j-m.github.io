<script>
  export let defaultTitle;
  export let defaultComponent;

  import { get } from "svelte/store"

  import { routes } from '../data/routes.js'

  const route = get(routes)[document.location.pathname]
  const component =  (route) ? route.component : defaultComponent
</script>

routes {get(routes)}
route {route}

<svelte:component this='{component}'/>
