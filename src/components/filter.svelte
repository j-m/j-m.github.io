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

<style>
#filter {
  margin-bottom: 1rem;
  text-align: center;
}

#search{
  width: 60%;
  font-size: 2rem;
  margin: auto;
  display: block;
  border-radius: .2rem;
  border: 1px solid rgba(50,50,50, 0.3);
  padding: 0.25rem 1rem;
}

#search::placeholder {
  color: grey;
}

#ascending + label:before {
  content: "Z-A"
}
#ascending:checked + label:before {
  content: "A-Z"
}
</style>

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
