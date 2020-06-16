<script>
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(139, 139, 139, 0.1);
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

  span:nth-of-type(1) div {
    float: left;
    margin-right: 1rem;
  }
  
  span:nth-of-type(2) div {
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
  
  a:not(#JonMarsh):hover {
    background-color: rgba(100, 100, 100, 0.10);
	}
  
	[aria-current] {
		border-bottom-color: black;
  }
  
  #JonMarsh{
    color: black!important;
    font-weight: bold;
    float: left;
    padding-left: 1rem;
  }
  
  #menutoggle {
    display: none;
  }
  
  #menutoggle ~ label {
    display: none;
  }
  
  #menutoggle:checked ~ span:nth-of-type(2){
    display: block;
    margin-right: 1rem;
  }
  
  #menutoggle ~ label img {
    height: 2rem;
    width: 2rem;
    padding: 0.5rem;
    float: right;
  }
  
  #menutoggle:checked ~ label img:nth-of-type(2){
    display: none;
  }
  
  #menutoggle:not(:checked) ~ label img:nth-of-type(1) {
    display: none;
  }
  
  @media only screen and (max-width: 40rem) {    
    #menutoggle ~ label {
      display: block;
      float: right;
    }
  
    span:nth-of-type(2) div {
      display: block;
      width: 100%;
    }
    
    span:nth-of-type(2) a:not(#JonMarsh):hover,
    span:nth-of-type(2) [aria-current] {
  		border-bottom-color: transparent!important;
      text-decoration: underline;
    }
    
    #menutoggle:checked ~ span:nth-of-type(2){
      display: none;
    }
  }
</style>

<nav>
  <input type="checkbox" id="menutoggle" name="menutoggle" checked/>
  <a href="." id="JonMarsh">JonMarsh</a>
  <label for="menutoggle">
    <img alt="open navigation menu (hamburger icon emoji)" src="images/openmoji/E250.svg"/>
    <img alt="close navigation menu (close icon emoji)" src="images/openmoji/E24E.svg"/>
  </label> 
  <span>
		<div><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Home</a></div>
		<div><a rel=prefetch aria-current="{segment === 'project' ? 'page' : undefined}" href="project/">Projects</a></div>
  </span>
  <span>
    <div><a aria-current="{segment === 'sitemap' ? 'page' : undefined}" href="sitemap/">Site Map</a></div>
    <div><a aria-current="{segment === 'policies' ? 'page' : undefined}" href="policies/">Policies</a></div>
  </span>
</nav>
