<script>
import { onMount } from 'svelte'

import Route from '../../components/Route.svelte'

import Project from './Project.svelte'
import { getResources } from '../../data/tagable.js'

let resources = []
onMount(async () => {
  resources = await getResources()
})
</script>

{#each resources as project}
<Route title={project.data.title} path="/project/{project.data.title}" component={Project} props={project.data}/>
{/each}
