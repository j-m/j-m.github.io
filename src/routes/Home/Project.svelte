<script>
  export let age;
  export let caption;
  export let date;
  export let description;
  export let github;
  export let logo;
  export let preview;
  export let title;

  import { onMount } from 'svelte';
  import { getTags } from '../../data/tagable.js';

  import Tag from './Tag.svelte';

  let tags;

  onMount(async function() {
    tags = await getTags(title);
  });
</script>


<div class="project">
  <p class="date">Age: {age} | Date: <time datetime="2018/02/24">{date}</time></p>
  {#if logo}
  <img class="title" alt='logo' src='{logo}'/>
  {:else}
  <h2 class="title">{title}</h2>
  {/if}
  <img class="preview" alt="preview" src='{preview}'>
  <p class="description">{description}</p>
  <a href="project/{title}" class="readmore">Read more</a>
  {#if github}
  <a class="url" href="{github}"><img alt="GitHub Octocat" src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"/></a>
  {/if}
  <p class="caption">{@html caption}</p>
  <div class="tags">
  {#if tags}
  {#each tags as tag}
    <Tag {...tag} />
  {/each}
  {:else}
  <p class="loading">Loading tags</p>
  {/if}
  </div>
</div>
