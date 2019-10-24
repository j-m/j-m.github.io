<script type="text/javascript">
  import { onMount } from 'svelte'

  import Route from '../components/Route.svelte'
  import Router from '../components/Router.svelte'

  import Home from './Home/index.svelte'
  import ProjectRoutes from './Project/routes.svelte'
  import TagRoutes from './Tag/routes.svelte'
  import Privacy from './Privacy.svelte'
  import Sitemap from './Sitemap.svelte'

</script>

<Router defaultTitle="Jonathan Marsh - Home" defaultComponent="{Home}"/>

<Route title="Jonathan Marsh - Privacy" path="/privacy" category="root" component="{Privacy}"/>
<Route title="Jonathan Marsh - Sitemap" path="/sitemap" category="root" component="{Sitemap}"/>
<ProjectRoutes/>
<TagRoutes/>
