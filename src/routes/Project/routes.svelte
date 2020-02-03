<script>
import { onMount } from 'svelte'

import Route from '../../components/Route.svelte'

import ReadMore from './ReadMore.svelte'
import { getResources } from '../../data/tagable.js'

let projects = {}
onMount(async () => {
  projects = await getResources()
})
</script>

{#each Object.entries(projects) as [id, data]}
{#if data.links && data.links.readMore}
<Route prefix="Jonathan Marsh - Project - " title={data.title} path="/project/{id}" category="Projects" component={ReadMore} props={data.links}/>
{/if}
{/each}
