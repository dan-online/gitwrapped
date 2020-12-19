<template>
  <div class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6 pr-3">
      <StarsCarousel :rows="[...stars, ...watches]"></StarsCarousel>
    </div>
    <div class="col-md-6 mt-3 mt-md-0">
      <h2>Stars/Watches</h2>
      <hr />
      <p>
        You starred <b>{{ stars.length }}</b> repositories, way to contribute to
        the community. Not only were you a star but you also kept an eye on
        <b>{{ watches.length }}</b> repositories!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["stars", "watches"]
};
</script>

<style></style>
