<svelte:head>
	<title>Jonathan Marsh - Home</title>
</svelte:head>

<style>
#about {
  display : flex;
  height: 100%;
  align-items : center;
  justify-content: center;
  flex-direction: column;
}

#name {
  margin: 0;
  font-size: 5rem;
  font-weight: bold;
  text-align: center;
  position: relative;
}

#picture {
  position: relative;
  width:0;
  height:0;
  display: inline-block;
}

#picture img {
  position: absolute;
  left: -17rem;
  top: -8.5rem;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  height: 15rem;
  width: 15rem;
}

#social {
  white-space: nowrap;
  text-align: center;
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

#quote {
  font-family: "Playfair Display",serif;
  font-style: italic;
  font-weight: 400;
}

#info {
  list-style: none;
  margin: 0;
}

#info li {
  white-space: nowrap;
  display: inline-block;
  margin-right: 2rem;
}

#info li img {
  vertical-align: middle;
  height: 2rem;
}
 
</style>

<div id="about">
  <ul id="info">
    <li><img src="images/openmoji/E0A9.svg" alt="Emoji of a red location indicator" />Cambridgeshire, UK</li>
    <li><img src="images/openmoji/1F393.svg" alt="Emoji of a graduation cap" />Computer Science BSc</li>
    <li><img src="images/openmoji/1F50D.svg" alt="Emoji of a magnifying glass" />Software Developer role</li>
  </ul>
  <p id="name"><span id="picture"><img alt="Jonathan Marsh" src="images/me-square.png" /></span>Jonathan Marsh</p>
  <div id="social">
    <a href="https://github.com/j-m"><img id="github" alt="GitHub logo" height="50" src="images/logos/github.png" /></a>
    <a href="https://stackoverflow.com/users/4907552"><img alt="StackOverflow logo" height="50" src="images/logos/stackoverflow.png" /></a>
    <a href="https://www.linkedin.com/in/jonrmarsh/"><img alt="LinkedIn logo" height="50" id="linkedin" src="/images/logos/linkedin.png" /></a>
  </div>
  <p id="quote">Me? Mad? Absolutely! But all the best people are</p>
</div>
