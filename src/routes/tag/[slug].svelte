<script context="module">
  import tagable from "../../data/tags"

  export async function preload({ params, query }) {
    const tag = tagable.tags[params.slug]
  	if (tag) {
  		return {
        tag,
        projects: tagable.getResources(params.slug)
      }
    }
    this.error(404, "Not found")
  }
</script>

<script>
  export let projects;
  export let tag;
  
  import Project from '../../components/project.svelte'
  import Tag from '../../components/tag.svelte'
</script>

<style>
#projects {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>

<svelte:head>
	<title>Jonathan Marsh - Tag - {tag.data.title}</title>
</svelte:head>

<h1>{tag.data.title}</h1>

{#if tag.data.description}
{@html tag.data.description}
{/if}

{#if tag.parent}
<h3>Parent</h3>
<Tag id={tag.parent} title={tagable.tags[tag.parent].data.title}/>
{/if}

{#if tag.children}
<h3>Children</h3>
  {#each tag.children as id}
  <Tag {id} title={tagable.tags[id].data.title}/>
  {/each}
{/if}

{#if tag.similar}
<h3>Similar</h3>
  {#each tag.similar as id}
  <Tag {id} title={tagable.tags[id].data.title}/>
  {/each}
{/if}

{#if tag.inverse}
<h3>Inverse</h3>
  {#each tag.inverse as id}
  <Tag {id} title={tagable.tags[id].data.title}/>
  {/each}
{/if}

<h2>Projects</h2>
<div id="projects">
  {#each Object.entries(projects) as [id, data]}
  <Project {id} {...data} tags={tagable.getTags(id)} age={new Date(new Date(data.date) - new Date("1997-10-24")).getFullYear() - 1970}/>
  {:else}
  <p>No projects directly associate with this tag</p>
  {/each}
</div>

