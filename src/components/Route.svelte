<script>
  export let title;
  export let component;
  export let path;
  export let props = {};

  import { addRoute } from '../data/routes.js'

  addRoute(title, component, path.toLowerCase(), props)
</script>
