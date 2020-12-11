<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      :aria-valuenow="val"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="'width: ' + val + '%'"
    ></div>
  </div>
</template>

<script>
export default {
  props: ["val"]
};
</script>

<style></style>
