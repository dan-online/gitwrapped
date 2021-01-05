<template>
  <div v-if="!ready" class="cookies text-center">
    This website uses cookies for anonymous analytics
    <button @click="accept">Accept</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false
    };
  },
  mounted() {
    this.ready = localStorage.acceptedCookies == "yes";
    if (this.ready) {
      this.loadJS();
    }
  },
  methods: {
    accept() {
      localStorage.acceptedCookies = "yes";
      this.loadJS();
      this.ready = true;
    },
    loadJS() {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-C1VRFVSQE4";
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-C1VRFVSQE4");
      };
      document.body.appendChild(script);
    }
  }
};
</script>

<style>
.cookies {
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  height: 70px;
  background: var(--bg);
  left: 0;
  bottom: 0;
  z-index: 99999999;
  position: fixed;
}
</style>
