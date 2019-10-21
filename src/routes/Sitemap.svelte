<script>
import { onMount } from 'svelte'

import Route from '../components/Route.svelte'

import { getResources, getTags } from '../data/tagable.js'

let projects = {}
let tags = {}
onMount(async () => {
  projects = await getResources()
  tags = await getTags()
})
</script>

<style>
.row {
  display: flex;
}

.column {
  flex: 1;
}
</style>


<h1>Sitemap</h1>

<div class="row">
  <div class="column">
    <h2>Tags</h2>
    <ul>
      {#each Object.entries(tags) as [id, tag]}
      <li><a href="/tag/{id}">{tag.title}</a></li>
      {/each}
    </ul>
  </div>
  <div class="column">
    <h2>Projects</h2>
    <ul>
      {#each Object.entries(projects) as [id, data]}
      <li><a href="/project/{id}">{data.title}</a></li>
      {/each}
    </ul>
  </div>
</div>
