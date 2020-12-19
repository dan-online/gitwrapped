<template>
  <div class="container pt-5">
    <div class="row mt-5">
      <div class="col-md-7 box" id ="hero">
        <h1>GitWrapped</h1>
        <pre>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut rutrum
vehicula accumsan. Maecenas ornare iaculis augue, a ullamcorper turpis
rhoncus eget. Vivamus lobortis eu metus sed venenatis. Nulla nulla
felis, auctor eget justo ut, sollicitudin luctus velit.
        </pre>
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
  },
  mounted() {
    // console.log(this.$auth);
  }, 
  middleware({store, redirect}) {
    if(store.state.auth.user) {
      return redirect('/dashboard'); 
    }
  }
});
</script>

<style>
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

#hero {
  background-color:var(--box-bg) !important;
}
pre { 
	margin: 20px; padding: 20px; 
	color: #aaa; background-color: #222;
	white-space: pre; text-shadow: 0 1px 0 #000;
	border-radius: 15px; border-bottom: 1px solid #555;
	box-shadow: 0 1px 5px rgba(0,0,0,0.4) inset, 0 0 20px rgba(0,0,0,0.2) inset;
	font: 16px/24px 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace;
	}

</style>
