<script type="text/javascript">
  import Route from '../components/Route.svelte'
  import Router from '../components/Router.svelte'
  import Home from './Home/index.svelte'
  import Project from './Project/index.svelte'
  import Privacy from './Privacy.svelte'
  import Sitemap from './Sitemap.svelte'
</script>

<Router defaultTitle="Jonathan Marsh - Home" defaultComponent="{Home}"/>
<Route title="Jonathan Marsh - Privacy" path="/privacy" component="{Privacy}"/>
<Route title="Jonathan Marsh - Sitemap" path="/sitemap" component="{Sitemap}"/>
