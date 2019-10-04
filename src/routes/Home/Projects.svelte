<script>
  import { onMount } from 'svelte';
  import { load } from '../../data/tagable.js';

  import Project from './Project.svelte';

  let projects = [];
  onMount(async function(){
    projects = await load();
  });
</script>

<div id="projects">
{#if projects}
{#each projects as project}
  <Project {...project.data} />
{/each}
{:else}
<p class="loading">Loading projects...</p>
{/if}
</div>
