<script>
import { Tagable } from 'tagable'
import * as json from './_tags.json'
const data = new Tagable()
data.import(json)

var sitemap = {
  "Main": [
    {path: "/", title: "Home"},
    {path: "/privacy", title: "Privacy"},
    {path: "/sitemap", title: "Sitemap"}
  ]
}

function addRoute(category, path, title) {
  sitemap[category] ? sitemap[category].push({path, title}) : sitemap[category] = [{path, title}]
}
addRoute(category, path, title)

for (let [key, tag] of Object.entries(data.tags)) {
  addRoute("Tags", `/tag/${key}`, tag.title)
}

for (let [key, project] of Object.entries(data.resources)) {
  if (projects.links.demo) {
    addRoute("Demo", projects.links.demo, project.title)  
  }
  if (projects.links.readMore) {
    addRoute("Read More", `/projects/${key}`, project.title)  
  }
}

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
  {#each Object.entries(sitemap) as [category, links]}
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
