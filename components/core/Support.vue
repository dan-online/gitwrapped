<template>
  <div class="col-md-3 supportme" ref="Quick">
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
        <h3>Year</h3>
        <hr />
        <p>
          The currently chosen year is: <b>{{ year }}</b>
        </p>
        <input
          type="number"
          min="1970"
          :max="new Date().getFullYear()"
          step="1"
          v-model="newYear"
        />
        <button @click="openYear">Go</button>
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
  props: ["year"],
  data() {
    return {
      divs: [],
      newYear: parseInt(this.year)
    };
  },
  mounted() {
    this.$nextTick(() => {
      const divs = Array.from(document.querySelectorAll(".jumpTo"));
      this.divs = divs.map(x => ({ name: x.id }));
    });
  },

  methods: {
    openYear() {
      window.location.href = "/dashboard/" + this.newYear;
    },
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

<style>
.toprint .supportme {
  display: none !important;
}
input {
  border: 3px solid #3500d3;
  border: 3px solid var(--accent);
  background: none;
  color: white;
  font-size: 20px;
  padding: 10px;
  transition: 0.3s all;
}
</style>
