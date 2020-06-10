<svelte:head>
	<title>Jonathan Marsh - Home</title>
</svelte:head>

<style>
#about {
  white-space: nowrap;
  text-align: center;
}

#picture {
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  height: 15rem;
  width: 15rem;
}

#name {
  margin: 0.5rem 0 0 0;
  font-size: 2rem;
  font-weight: bold;
}

#social {
  height: 3rem;
}

#social a {
  text-decoration: none;
  height: 3rem;
  width: 3rem;
  padding: 1rem;
  display: inline-block;
  box-sizing: content-box;
}

#social a:hover {
  background: lightgrey;
}

#social a img {
  height: 3rem;
  box-sizing: border-box;
}

</style>

<div id="about">
  <img id="picture" alt="Pciture of Jonathan Marsh" src="images/me-square.png" />
  <p id="name">Jonathan Marsh</p>
  <div id="social">
    <a href="https://github.com/j-m"><img id="github" alt="GitHub logo" height="50" src="images/logos/github.png" /></a>
    <a href="https://stackoverflow.com/users/4907552"><img alt="StackOverflow logo" height="50" src="images/logos/stackoverflow.png" /></a>
    <a href="https://www.linkedin.com/in/jonrmarsh/"><img alt="LinkedIn logo" height="50" id="linkedin" src="/images/logos/linkedin.png" /></a>
  </div>

</div>
