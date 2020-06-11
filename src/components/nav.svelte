<script>
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(139, 139, 139, 0.1);
    padding: 0 1rem;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    box-sizing: border-box;
	}
  @supports (backdrop-filter: blur(0.5rem)) {
    nav {
      backdrop-filter: blur(0.5rem);
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

	ul {
		margin: 0;
		padding: 0;
	}

	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
  }
  
  ul span:nth-of-type(1) li {
    float: left;
    margin-right: 1rem;
  }
  
  ul span:nth-of-type(2) li {
    float: right;
    margin-left: 1rem;
  }

	a {
		text-decoration: none;
		padding: 1em 0.5em;
    display: block;
    border-bottom: 3px solid transparent;
    color: rgb(29, 29, 29)!important;
  }
  
  a:not(#JonMarsh):hover, 
	[aria-current] {
		border-bottom-color: black;
	}

  #JonMarsh{
    color: black!important;
    font-weight: bold;
  }
  
</style>

<nav>
	<ul>
    <span>
      <li><a href="." id="JonMarsh">JonMarsh</a></li>
  		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Home</a></li>
  		<li><a rel=prefetch aria-current="{segment === 'project' ? 'page' : undefined}" href="project">Projects</a></li>
    </span>
    <span>
      <li><a aria-current="{segment === 'sitemap' ? 'page' : undefined}" href="sitemap">Site Map</a></li>
      <li><a aria-current="{segment === 'policies' ? 'page' : undefined}" href="policies">Policies</a></li>
    </span>
	</ul>
</nav>

