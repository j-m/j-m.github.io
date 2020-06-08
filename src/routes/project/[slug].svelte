<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch(`project/${params.slug}.json`)
		const data = await res.json()

		if (res.status === 200) {
			return { project: data }
		} else {
			this.error(res.status, data.message)
		}
	}
</script>

<script>
  export let project;
  
  const tags = getTagsByResourceID(project.id)

</script>

<svelte:head>
	<title>{project.title}</title>
</svelte:head>

<h1>{project.title}</h1>

<div class='content'>
	{@html project.html}
</div>

