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
  display: inline-block;
  box-sizing: content-box;
}

#social a:hover {
  border-bottom: 3px solid black;
}

#social a img {
  height: 3rem;
  box-sizing: border-box;
}

#github {
  padding: 10%;
}

#linkedin {
  padding: 14%;
}

#hackerrank {
  padding: 10%;
}

#copy {
  font-size: small;
}
</style>

<div id="about">
  <img id="picture" alt="Pciture of Jonathan Marsh" src="images/me-square.png" />
  <p id="name">Jonathan Marsh</p>
  <div id="social">
    <a href="https://github.com/j-m"><img id="github" alt="GitHub logo" height="50" src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" /></a>
    <a href="https://stackoverflow.com/users/4907552"><img alt="StackOverflow logo" height="50" src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.svg" /></a>
    <a href="https://www.linkedin.com/in/jonrmarsh/"><img alt="LinkedIn logo" height="50" id="linkedin" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" /></a>
    <a href="https://www.hackerrank.com/jaunt"><img alt="HackerRank logo" height="50" id="hackerrank" src="https://assets.brandfolder.com/y9ol94wb/original/HackerRank_logo.svg" /></a>
  </div>
  <p id="copy">&copy; Copyright 2019, Jonathan Marsh<br/> All rights reserved</p>
</div>
