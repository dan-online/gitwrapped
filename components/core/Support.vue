<template>
  <div class="col-md-3" ref="Quick">
    <div class="sticky-top">
      <div class="box">
        <h3>Quick Jump</h3>
        <hr />
        <ul>
          <li v-for="ref in divs" :key="ref.name">
            <b>
              <a @click.prevent="goTo(ref.name)" :href="'#' + ref.name">
                {{ ref.name }}
              </a>
            </b>
          </li>
        </ul>
      </div>
      <div class="mt-4 box">
        <h3>Support</h3>
        <hr />
        <p>
          Thanks for using GitWrapped! This website was created by me, DanCodes
          during December of 2020, if you would like to support me, follow me on
          github or visit my website for more info!
        </p>
        <a href="https://github.com/dan-online">@dan-online</a> |
        <a href="https://dancodes.online">dancodes.online</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      divs: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      const divs = Array.from(document.querySelectorAll(".jumpTo"));
      this.divs = divs.map(x => ({ name: x.id }));
    });
  },

  methods: {
    goTo(name) {
      const scroll =
        document.getElementById(name).getBoundingClientRect().top +
        window.pageYOffset -
        20;
      window.scrollTo({
        top: scroll,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style></style>
