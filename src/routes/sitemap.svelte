<script>
import tagable from "../data/tags"

var sitemap = {
  "Main": [
    {path: ".", title: "Home"},
    {path: "project", title: "Projects"},
    {path: "privacy", title: "Privacy"},
    {path: "sitemap", title: "Sitemap"}
  ]
}

function addRoute(category, path, title) {
  sitemap[category] ? sitemap[category].push({path, title}) : sitemap[category] = [{path, title}]
}

for (let [key, tag] of Object.entries(tagable.tags)) {
  addRoute("Tags", `tag/${key}`, tag.data.title)
}

for (let [key, project] of Object.entries(tagable.resources)) {
  if (project.links) {
    if (project.links.demo) {
      addRoute("Demo", project.links.demo, project.title)  
    }
    if (project.links.readMore) {
      addRoute("Read More", `project/${key}`, project.title)  
    }
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
.column ul li a {
  text-decoration: none!important;
}
.column ul li a:hover {
  background-color: #FFFF00;
}
</style>

<svelte:head>
	<title>Jonathan Marsh - Sitemap</title>
</svelte:head>

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
