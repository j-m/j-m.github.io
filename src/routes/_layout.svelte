<script>
	import Nav from "../components/nav.svelte";

	export let segment;
</script>

<style>
	main {
		position: relative;
		padding: 5rem 2rem 2rem 2rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
  
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
