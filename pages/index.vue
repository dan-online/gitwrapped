<template>
  <div class="container pt-5 all">
    <div class="row mt-5 mx-md-5 mx-1 h-v100">
      <div class="col-md-7 p-md-3 p-0 m-md-0">
        <a @click="checkLogin">
          <img
            alt="GitWrapped promotion"
            src="../assets/images/promo-compressed.png"
            class="img-fluid box-hero"
          />
        </a>
      </div>
      <div class="col-md-5 box mt-md-5 mt-0" id="hero">
        <h1>GitWrapped</h1>
        <p>
          Hey there and welcome to GitWrapped. This website allows you to view
          the statistics of your Github profile over the years, the amount of
          lines you wrote, how many pull requests you closed and more! Compare
          stats with your friends and show off on social media with our widgets!
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
        <button
          v-if="!user"
          @click="$auth.loginWith('github')"
          class="d-inline-block"
        >
          Login with Github
        </button>
        <nuxt-link class="button-me d-inline-block" to="/dashboard" v-else
          >Dashboard of {{ user.name || user.login }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.$store.state.auth.user
    };
  },
  head() {
    return {
      title: "GitWrapped - Home"
    };
  },
  methods: {
    checkLogin() {
      if (!this.user) {
        return this.$auth.loginWith("github");
      } else {
        this.$router.push("/dashboard");
      }
    }
  }
  // mounted() {
  //   // console.log(this.$auth);
  //   if (this.$store.state.auth.user) {
  //     return this.$router.push("/dashboard");
  //   }
  // }
};
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
.h-v100 {
  height: 80vh;
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
  height: fit-content;
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

.box-hero {
  width: 100%;
  position: relative;
  display: inline-block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  will-change: transform;
}

.box-hero::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  opacity: 0;
  -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.box-hero:hover {
  -webkit-transform: scale(1.05, 1.05);
  transform: scale(1.05, 1.05);
}

.box-hero:hover::after {
  opacity: 1;
}
</style>
