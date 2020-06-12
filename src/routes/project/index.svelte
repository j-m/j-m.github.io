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
  padding-bottom: 2rem;
}
</style>

<svelte:head>
	<title>Jonathan Marsh - Projects</title>
</svelte:head>

<!--Filter/-->

<div id="projects">
  {#each Object.entries(projects) as [id, data]}
    <Project {id} {...data} tags={tagable.getTags(id)} age={new Date(new Date(data.date) - new Date("1997-10-24")).getFullYear() - 1970}/>
  {/each}
</div>
