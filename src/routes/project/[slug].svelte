<script context="module">
  import tagable from "../../data/tags"
  
  export async function preload({ params, query }) {
    const project = tagable.resources[params.slug]
  	if (project) {
      if (project.links.readMore.type === "html-url") {
        const page = await this.fetch(project.links.readMore.url)
        project.html = await page.text()
      }

  		return {
        project,
        tags: tagable.getTags(params.slug)
      }
    }
    this.error(404, "Not found")
  }
</script>

<script>
  export let project;
  export let tags;
  import Tag from "../../components/tag.svelte"
</script>

<svelte:head>
	<title>Jonathan Marsh - Project - {project.title}</title>
</svelte:head>

<h1>{project.title}</h1>
<h2>Tags</h2>

<div class="tags">
  {#each Object.entries(tags) as [id, tag]}
  <Tag {id} title={tag.data.title}/>
  {/each}
</div>

<h3>About</h3>
<div class='content'>
	{@html project.html}
</div>

