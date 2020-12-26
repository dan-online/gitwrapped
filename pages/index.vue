<template>
  <div class="container pt-5 all">
    <div class="row mt-5 mx-md-5 mx-1">
      <div class="col-md-8">
        <img src="../assets/images/promo-1.png" class="img-fluid" />
      </div>
      <div class="col-md-4 box mt-5 mt-md-0" id="hero">
        <h1>GitWrapped</h1>
        <p>
          Hey there and welcome to GitWrapped. This website allows you to view
          the statistics of your Github profile this year, the amount of lines
          you wrote, how many pull requests you closed and more! Compare stats
          with your friends and show off on social media with our widgets!
        </p>
        <!-- <pre>
         <code lang="js">
          <span class="var">const</span> GitWrapped <span class="eq">= new</span> <span class="func">Website</span>();
          <span class="var">const</span> githubProfile <span class="eq">=</span> GitWrapped.<span class="func">get</span>(user);
          githubProfile.<span class="func">getAllInfo</span>().<span class="func">then</span>(() <span class="eq">=></span> {
            createDashboard();
            // Check out your GitWrapped profile by logging in!
          })
         </code>
        </pre> -->
        <button v-if="!user" @click="$auth.loginWith('github')">
          Login with Github
        </button>
        <nuxt-link class="button-me" to="/dashboard" v-else
          >Dashboard of {{ user.name || user.login }}</nuxt-link
        >
      </div>
    </div>
    <!-- <div>
      <Logo />
      <h1 class="title">
        github-wrapped
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      user: this.$store.state.auth.user
    };
  }
  // mounted() {
  //   // console.log(this.$auth);
  //   if (this.$store.state.auth.user) {
  //     return this.$router.push("/dashboard");
  //   }
  // }
});
</script>

<style>
.all {
  max-width: 100%;
  width: 100%;
}
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
code {
  color: var(--accent-light) !important;
}
.var,
.eq {
  color: #f9b5f1;
}
.func {
  color: #e0da30;
}
#hero {
  background-color: var(--box-bg) !important;
}
pre {
  margin: 20px;
  padding: 20px;
  color: #aaa;
  background-color: #222;
  white-space: pre;
  text-shadow: 0 1px 0 #000;
  border-radius: 15px;
  border-bottom: 1px solid #555;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4) inset,
    0 0 20px rgba(0, 0, 0, 0.2) inset;
  font: 16px/24px "Courier New", Courier, "Lucida Sans Typewriter",
    "Lucida Typewriter", monospace;
}
</style>
