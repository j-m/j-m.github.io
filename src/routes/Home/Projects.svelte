<script>
  import { onMount } from 'svelte'

  import { getResources } from "../../data/tagable.js"

  import Project from "../../components/Project.svelte"

  let projects = []
  onMount(async () => {
    projects = await getResources()
  })
</script>

<div id="projects">
  {#each Object.entries(projects) as [id, data]}
    <Project {id} {...data} />
  {:else}
    <p class="loading">Loading projects...</p>
  {/each}
</div>
