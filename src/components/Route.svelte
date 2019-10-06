<script>
  export let title;
  export let component;
  export let path;

  import { addRoute } from '../data/routes.js'

  addRoute(title, component, path)
</script>
