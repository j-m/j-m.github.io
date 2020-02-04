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

<Route prefix="Jonathan Marsh - " title="Home" path="/" category="Main" component="{Home}"/>
<Route prefix="Jonathan Marsh - " title="Privacy" path="/privacy" category="Main" component="{Privacy}"/>
<Route prefix="Jonathan Marsh - " title="Sitemap" path="/sitemap" category="Main" component="{Sitemap}"/>
<ProjectRoutes/>
<TagRoutes/>
