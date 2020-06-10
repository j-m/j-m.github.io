<script context="module">
  import tagable from "../../data/tags"
  
	export function preload({ params, query }) {
    return { projects: tagable.resources }
	}
</script>

<script>
  export let projects
   
  import Project from "../../components/project.svelte"
  import Filter from "../../components/filter.svelte"
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

<!--Filter/-->

<div id="projects">
  {#await projects}
    <p>Loading projects...</p>
  {:then projects}
    {#each Object.entries(projects) as [id, data]}
      <Project {id} {...data} />
    {/each}
  {:catch error}
    <p>error</p>
  {/await}
</div>
