<script>
  let filter;

  let title = true;
  let description = true;
  let tag = true;

  let selected;
	let sortOptions = [
		{ id: 1, text: `Sort by...` },
		{ id: 2, text: `Title` },
		{ id: 3, text: `Date` }
  ];
  
  let ascending = true;
</script>

<div id="filter">
  <input placeholder="filter" id="search" bind:value={filter}>
  <input type="checkbox" id="title" bind:checked={title}/><label for="title">Title</label>
  <input type="checkbox" id="description" bind:checked={description}/><label for="description">Description</label>
  <input type="checkbox" id="tag" bind:checked={tag}/><label for="tag">Tag</label>
  <select bind:value={selected}>
    {#each sortOptions as sortOption}
    <option value={sortOption}>
      {sortOption.text}
    </option>
    {/each}
	</select>
  <input type="checkbox" id="ascending" bind:checked={ascending}/><label for="ascending"></label>
</div>
