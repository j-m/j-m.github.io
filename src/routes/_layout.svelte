<script>
	import Nav from "../components/nav.svelte";

	export let segment;
</script>

<style>
  main {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
