<script>
import { onMount } from 'svelte'

import Route from '../../components/Route.svelte'

import Tag from './Tag.svelte'
import { getTags } from '../../data/tagable.js'

let tags = []
onMount(async () => {
  tags = await getTags()
})

</script>

{#each tags as tag}
<Route title={tag.id} path="/tag/{tag.id}" component={Tag} props={tag.data}/>
{/each}
