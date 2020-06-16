<svelte:head>
	<title>Jonathan Marsh - Home</title>
</svelte:head>

<style>
#about {
  display : grid;
  height: 100%;
  grid-template-areas: 
  ". . . ."
  ". portrait info ."
  ". portrait name ."
  ". portrait social ."
  ". portrait quote ."
  ". . . .";
  grid-template-columns: 1fr 15rem auto 15rem 1fr;
  grid-template-rows: 1fr auto auto auto auto 1fr;
}

#name {
  grid-area: name;
  text-align: center;
  margin: 0;
  font-size: 5rem;
  font-weight: bold;
  position: relative;
}

#portrait {
  grid-area: portrait;
}

#portrait img {
  border-radius: 50%;
  margin: 0 auto;
  height: 15rem;
  width: 15rem;
}

#social {
  grid-area: social;
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
  grid-area: quote;
  font-family: "Playfair Display",serif;
  font-style: italic;
  font-weight: 400;
  text-align: center;
}

#info {
  grid-area: info;
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
  white-space: nowrap;
}

#info li {
  display: inline-block;
  margin-right: 2rem;
}

#info li img {
  vertical-align: middle;
  height: 2rem;
}
 
 
@media only screen and (max-width: 95rem) { 
  #about {
    grid-template-columns:1fr 15rem auto 1fr;
  }
}

@media only screen and (max-width: 70rem) { 
  #name {
    word-spacing: 100vw;
  }
  
  #about {
    grid-template-areas: 
    ". . ."
    "portrait name ."
    "info social ."
    "info quote ."
    ". . .";
    grid-template-columns: 15rem auto 1fr;
    grid-template-rows: 1fr 15rem auto auto 1fr;
  }
  
  #info {
    margin: 1rem auto 0 auto;
  }
  
  #info li {
    display: block;
    margin: 0 auto 0 0;
    text-align: left;
  }
}

@media only screen and (max-width: 50rem) { 
  #about {
    grid-template-areas: 
      ". . ."
      ". portrait ."
      ". name ."
      ". social ."
      ". . .";
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto auto auto 1fr;
  }
  
  #info {
    display: none;
  }
  
  #quote{
    display: none;
  }
}
 
</style>

<div id="about">
  <picture id="portrait">
    <source type="image/jp2" srcset="images/me.jp2"> 
    <source type="image/webp" srcset="images/me.webp"> 
    <img src="images/me.png" alt="Jonathan Marsh">
  </picture>
  <ul id="info">
    <li><img src="images/openmoji/E0A9.svg" alt="Emoji of a red location indicator" />Cambridgeshire, UK</li>
    <li><img src="images/openmoji/1F393.svg" alt="Emoji of a graduation cap" />Computer Science BSc</li>
    <li><img src="images/openmoji/1F50D.svg" alt="Emoji of a magnifying glass" />Software Developer role</li>
  </ul>
  <p id="name">Jonathan Marsh</p>
  <div id="social">
    <a href="https://github.com/j-m"><img id="github" alt="GitHub logo" height="50" src="images/logos/github.png" /></a>
    <a href="https://stackoverflow.com/users/4907552"><img alt="StackOverflow logo" height="50" src="images/logos/stackoverflow.png" /></a>
    <a href="https://www.linkedin.com/in/jonrmarsh/"><img alt="LinkedIn logo" height="50" id="linkedin" src="/images/logos/linkedin.png" /></a>
  </div>
  <p id="quote">Me? Mad? Absolutely! But all the best people are</p>
</div>
