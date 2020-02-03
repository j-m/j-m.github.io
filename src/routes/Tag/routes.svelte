<script>
import { onMount } from 'svelte'

import Route from '../../components/Route.svelte'

import Tag from './Tag.svelte'
import { getTags } from '../../data/tagable.js'

let tags = {}
onMount(async () => {
  tags = await getTags()
})

</script>

{#each Object.entries(tags) as [id, tag]}
<Route prefix="Jonathan Marsh - Tag - " title={tag.data.title} path="/tag/{id}" category="Tags" component={Tag} props={{id,tag}}/>
{/each}
