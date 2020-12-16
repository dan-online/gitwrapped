<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
:root {
  --bg: #090915;
  --accent: #3500d3;
  --text: white;
  --accent-light: #7075ff;
}
button,
.button-me {
  border: 3px solid var(--accent);
  background: none;
  color: white;
  font-size: 20px;
  padding: 10px;
  transition: 0.3s all;
}
button:hover,
.button-me:hover {
  color: white;
  text-decoration: none !important;
  background: var(--accent);
}
h1,
h2,
h3,
h4,
h5,
.title {
  font-family: "JetBrains Mono", monospace;
}
html,
body {
  background: var(--bg);
  color: white;
  font-family: "Ubuntu Mono", monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
