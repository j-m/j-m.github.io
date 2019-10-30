<script>
  export let id
  
  import { onMount } from 'svelte'
  import { getTags } from '../data/tagable.js'

  let title

  onMount(async function() {
    const tags = await getTags()
    title = tags[id].data.title
  })
</script>

<a title="View everything tagged '{title}''" href="tag/{id}">
  <div class='tag'>{title}</div>
</a>
