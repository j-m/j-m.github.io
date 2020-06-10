<script>
  export let id
  export let caption
  export let date
  export let description
  export let logo
  export let preview
  export let title
  export let links = {}

  let age = new Date(new Date(date) - new Date("1997-10-24")).getFullYear() - 1970

  import Tag from './tag.svelte'
  import tagable from "../data/tags"
  const tags = tagable.getTags(id)
</script>

<style>
	
.project {
  position: relative;
  background: #fafcfc;
  border-radius: .2rem;
  box-shadow: 0 .5rem .5rem rgba(50,50,50,0.1);
  display: inline-grid;
  grid-template-areas: 
  "preview agedate agedate"
  "preview title title"
  "preview description description"
  "caption tags links";
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content min-content 1fr auto;
  height: 15rem;
  margin: 1rem;
  overflow: hidden;
  vertical-align: top;
  flex: 25rem 1;
  max-width: 30rem;
}

.project > .preview {
  grid-column: 1;
  grid-row: 1/6;
  min-height: 100%;
  width:100%;
  max-width: 11rem;
  object-fit: cover;
}

.project > .title {
  grid-area: title;
  max-height: 4rem;
}

.project > h2.title {
  margin: 0.5rem 0;
  text-align: center;
  white-space: nowrap;
}

.project > img.title {
  box-sizing: border-box;
  margin: auto;
  max-width: 100%;
  padding: 0.5rem;
}

.project .date {
  grid-area: agedate;
  margin: 0 0.2rem 0 0;
  font-size: small;
  text-align: right;
}

.project > .description {
  grid-area: description;
  white-space: pre-wrap;
  font-size: 0.8rem;
  margin: 0.5rem;
  overflow: auto;
  text-align: left;
}

.project > .links {
  grid-area: links;
  text-decoration: none;
  text-align: right;
  height: 2rem;
  margin-top: auto;
}

.link {
  box-sizing: border-box;
  display: inline-block;
  padding: 0.2rem;
  height: 2rem;
  font-size: small;
}

.link:hover {
  background: rgb(230, 230, 230);
}

.link > img {
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}

.project > .caption {
  grid-area: caption;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 0.25rem;
  margin: 0;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  color: white;
  font-weight: bold;
}

.project .loading {
  margin: 0;
}

.project > .tags {
  grid-area: tags;
  padding: 0.1rem;
  vertical-align: middle;
  margin-left: 0.2rem;
}

</style>

<div class="project">
  {#if preview}
  <img class="preview" alt="preview" src={preview}/>
  {/if}
  {#if logo}
  <img class="title" alt='logo' src={logo}/>
  {:else}
  <h2 class="title">{title}</h2>
  {/if}
  {#if age}
  <p class="date">Age: {age} | Date: <time datetime={date}>{date}</time></p>
  {/if}
  <p class="description">{@html description}</p>
  {#if caption}
  <p class="caption">{@html caption}</p>
  {/if}
  <div class="links">
    {#if links.readMore}
    <a href="project/{id}" title="Read more about {title}" class="link">
      <img alt="Read more icon" src="images/icons/read-more.svg"/>
    </a>
    {/if}
    {#if links.demo}
    <a href="{links.demo}" title="Demo {title}" class="link">
      <img alt="Demo icon" src="images/icons/demo.svg"/>
    </a>
    {/if}
    {#if links.github}
    <a href="{links.github}" title="View the source code for {title}" class="link">
      <img alt="GitHub Octocat" src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"/>
    </a>
    {/if}
  </div>
  <div class="tags">
    {#each Object.entries(tags) as [id, tag]}
    <Tag {id} />
    {:else}
    <p class="loading">Loading tags...</p>
    {/each}
  </div>
</div>
