<template>
  <div>
    <nav class="navbar">
      <nuxt-link to="/" class="navbar-brand title">GitWrapped</nuxt-link>
      <div class="my-auto d-flex">
        <div class="custom-control custom-switch pt-3 mr-3">
          <input
            ref="switch"
            :value="on"
            @input="input"
            type="checkbox"
            class="custom-control-input"
            id="customSwitch1"
          />
          <label class="custom-control-label" for="customSwitch1"></label>
        </div>
        <button @click="logInOut">
          <span v-if="user">Logout</span><span v-else>Login</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  data() {
    return {
      on: false,
      light: {
        bg: "#fff",
        accent: "#3500d3",
        text: "black",
        "accent-light": "#76cca8",
        "box-bg": "#110142"
      },
      dark: {
        bg: "#090915",
        accent: "#3500d3",
        text: "white",
        "accent-light": "#7075ff",
        "box-bg": "rgba(0,0,0,0.4)"
      }
    };
  },
  mounted() {
    this.on = Array.from(document.body.classList).find(x => x == "lights-on")
      ? true
      : false;
    if (localStorage.lights == "on") {
      this.$refs.switch.click();
    }
  },
  methods: {
    logInOut() {
      if (this.user) {
        this.$auth.logout();
        // return this.$router.push("/?loggedout");
      } else this.$auth.loginWith("github");
    },
    input(e) {
      this.on = !this.on;
      if (this.on) {
        document.body.classList.add("lights-on");
        localStorage.lights = "on";
      } else {
        document.body.classList.remove("lights-on");
        localStorage.lights = "off";
      }
      const vars = Object.entries(this[!this.on ? "dark" : "light"]).map(x => ({
        name: "--" + x[0],
        val: x[1]
      }));
      vars.forEach(v => {
        document.documentElement.style.setProperty(v.name, v.val);
      });
      console.log(vars);
    }
  }
};
</script>

<style>
.toprint .navbar {
  display: none;
}
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #3500d3 !important;
  background-color: #3500d3 !important;
}
.navbar-brand {
  color: var(--text) !important;
  font-size: 25px !important;
}
</style>
