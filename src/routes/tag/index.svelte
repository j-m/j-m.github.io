<script>
  export let id
  export let tag

  import Project from '../_project.svelte'
  import Tag from '../_tag.svelte'

  import { Tagable } from 'tagable'
  import * as json from '../_tags.json'
  const data = new Tagable()
  data.import(json)
  const projects = data.getResourcesByTagID(id)
  
</script>

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
