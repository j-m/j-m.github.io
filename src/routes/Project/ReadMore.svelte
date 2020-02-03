<script>
  export let readMore;
  export let github = "";
  
  async function getBody() {
    if (readMore.type === "html-url") {
      return await fetch(readMore.url).then(response => { 
        return response.text()
      })
    }
  }
  
</script>

{#await getBody()}
	<p>Loading file...</p>
{:then body}
	{@html body}
{:catch error}
  <p>Could not load file</p>
	<p style="color: red">{error.message}</p>
{/await}
