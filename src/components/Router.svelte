<script>
  export let defaultTitle;
  export let defaultComponent;

  import { get } from "svelte/store"

  import { path } from '../data/path.js'
  import { routes } from '../data/routes.js'

  let component = defaultComponent;
  path.subscribe(path => {
    get(routes).filter(item => {
      if (item.path === path) {
        component = item.component;
      }
    })
	});
</script>

<svelte:component this='{component}'/>
