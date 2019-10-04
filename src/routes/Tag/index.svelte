<script>
  import { Route } from '../../components/Route.svelte';
  import { Project } from './Project.svelte';

  let projects = [];
  onMount(async function(){
    projects = await load();
  });
</script>

{#each projects as project}
<Route title="{project.title}" path="/project/{project.title}" component="{Project}"/>
{/each}
