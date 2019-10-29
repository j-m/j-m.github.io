<script>
  export let id
  export let caption
  export let date
  export let description
  export let github
  export let logo
  export let preview
  export let title
  export let links = []

  let age = new Date(new Date(date) - new Date("1997-10-24")).getFullYear() - 1970

  import { onMount } from 'svelte'
  import { getTagsByResourceID } from '../data/tagable.js'

  import Tag from './Tag.svelte'

  let tags = {}

  onMount(async function() {
    tags = await getTagsByResourceID(id)
  })
</script>

<div class="project">
  <img class="preview" alt="preview" src={preview}/>
  {#if logo}
  <img class="title" alt='logo' src={logo}/>
  {:else}
  <h2 class="title">{title}</h2>
  {/if}
  <p class="date">Age: {age} | Date: <time datetime={date}>{date}</time></p>
  <p class="description">{@html description}</p>
  {#if caption}
  <p class="caption">{@html caption}</p>
  {/if}
  <div class="links">
    {#each links as link}
    <a href={link.href} title={link.title} class="link">
      <img alt={link.image.alt} src={link.image.src}/>
    </a>
    {/each}
  </div>
  <div class="tags">
    {#each Object.entries(tags) as [id, tag]}
    <Tag {id} />
    {:else}
    <p class="loading">Loading tags...</p>
    {/each}
  </div>
</div>
