<script>
  export let id
  export let badge
  export let title
</script>

<a title="View everything tagged '{title}''" href="tag/{id}">
  {@html badge}
</a>
