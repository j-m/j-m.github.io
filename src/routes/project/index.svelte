<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`project.json`).then(r => r.json()).then(projects => {
			return { projects };
		});
	}
</script>

<script>
  export let projects;
  import Project from "../_project.svelte"
  import Filter from "./_filter.svelte"
</script>

<style>
#projects {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>

<svelte:head>
	<title>Jonathan Marsh - Projects</title>
</svelte:head>

<Filter/>

<div id="projects">
  {#each Object.entries(projects) as [id, data]}
    <Project {id} {...data} />
  {:else}
    <p class="loading">Loading projects...</p>
  {/each}
</div>
