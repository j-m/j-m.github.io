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

<svelte:head>
	<title>Jonathan Marsh - Tag - {tag.data.title}</title>
</svelte:head>

<h1>{tag.data.title}</h1>

{#if tag.data.description}
{@html tag.data.description}
{/if}

{#if tag.parent}
<h3>Parent</h3>
<Tag id={tag.parent}/>
{/if}

{#if tag.children}
<h3>Children</h3>
  {#each tag.children as child}
  <Tag id={child}/>
  {/each}
{/if}

{#if tag.similar}
<h3>Similar</h3>
  {#each tag.similar as child}
  <Tag id={child}/>
  {/each}
{/if}

{#if tag.inverse}
<h3>Inverse</h3>
  {#each tag.inverse as child}
  <Tag id={child}/>
  {/each}
{/if}

<h2>Projects</h2>
<div id="projects">
  {#each Object.entries(projects) as [id, data]}
  <Project {id} {...data} />
  {:else}
  <p>No projects directly associate with this tag</p>
  {/each}
</div>

