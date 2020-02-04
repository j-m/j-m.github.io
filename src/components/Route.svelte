<script>
  export let prefix = "";
  export let title;
  export let category = "";
  export let component = "";
  export let path;
  export let props = {};

  import { addRoute } from '../data/routes.js'

  addRoute(prefix, title, path.toLowerCase(), category, component, props)
</script>
