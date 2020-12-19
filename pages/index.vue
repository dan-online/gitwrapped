<template>
  <div class="container pt-5">
    <div class="row mt-5">
      <div class="col-md-6">
        <h1>GitWrapped</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut rutrum
          vehicula accumsan. Maecenas ornare iaculis augue, a ullamcorper turpis
          rhoncus eget. Vivamus lobortis eu metus sed venenatis. Nulla nulla
          felis, auctor eget justo ut, sollicitudin luctus velit.
        </p>
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
</style>
