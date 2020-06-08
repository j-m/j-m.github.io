<script context="module">
export async function preload({ params, query }) {
	const res = await this.fetch(`project/${params.slug}.json`);
	const data = await res.json();

  if (data.project.links.readMore.type === "html-url") {
    data.project.html = await fetch(data.project.links.readMore.url).then(response => { 
      return response.text()
    })
  }

	if (res.status === 200) {
		return data;
	} else {
		this.error(res.status, data.message);
	}
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
  <Tag {id} />
  {:else}
  <p class="loading">Loading tags...</p>
  {/each}
</div>

<h3>About</h3>
<div class='content'>
	{@html project.html}
</div>

