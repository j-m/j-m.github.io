<script>
  export let status;
  export let error;
</script>

<style>
  main {
    height: 100%;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
  }
  main,
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  section span {
    font-size: 24px;
    font-weight: 500;
    display: block;
    border-bottom: 1px solid #eaeaea;
    text-align: center;
    padding-bottom: 20px;
    width: 100px;
  }
  section p {
    font-size: 14px;
    font-weight: 400;
  }
  section span + p {
    margin: 20px 0 0 0;
  }
</style>

<svelte:head>
  <title>Jonathan Marsh - {status}</title>
</svelte:head>

<main>
  <section>
    <span>{status}</span>
    <p>{error.message}</p>
  </section>
  {#if error.stack}
    <pre>{error.stack}</pre>
  {/if}
</main>
