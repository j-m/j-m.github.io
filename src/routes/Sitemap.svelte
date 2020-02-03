<script>
import { sitemap } from '../data/routes.js'
let map = {}
sitemap.subscribe(value => map = value)
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
  {#each Object.entries(map) as [category, links]}
  <div class="column">
    <h2>{category}</h2>
    <ul>
      {#each links as link}
      <li><a href="{link.path}">{link.title}</a></li>
      {/each}
    </ul>
  </div>
  {/each}
</div>
