<template>
  <div>
    <nav class="navbar">
      <a class="navbar-brand" href="#">GitWrapped</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="my-auto custom-control custom-switch">
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
    </nav>
  </div>
</template>

<script>
export default {
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
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #3500d3 !important;
  background-color: #3500d3 !important;
}
</style>
