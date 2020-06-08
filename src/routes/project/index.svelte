<script>
  import tagable from "../../data/tags" 
  export let projects = tagable.resources
   
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
  {#each Object.entries(projects) as [id, data]}
    <Project {id} {...data} />
  {/each}
</div>
