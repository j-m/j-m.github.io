<script>
import { onMount } from 'svelte'

import Route from '../../components/Route.svelte'

import Project from './Project.svelte'
import { getResources } from '../../data/tagable.js'

let projects = {}
onMount(async () => {
  projects = await getResources()
})
</script>

{#each Object.entries(projects) as [id, data]}
<Route title="Jonathan Marsh - Project - {data.title}" path="/project/{id}" category="Projects" component={Project} props={data}/>
{/each}
