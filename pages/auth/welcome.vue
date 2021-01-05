<template>
  <div class="container pb-5">
    <div class="row">
      <div class="col" v-if="!err">
        <span v-if="!user">Please wait while we setup a few things...</span>
        <span v-else
          >Hi there {{ user.name }}, please wait while we redirect you!</span
        >
      </div>
      <div class="col" v-else>Uh oh! We ran into an error: {{ err }}</div>
    </div>
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
      err: false
    };
  },
  // watch: {
  //   user() {
  //     // this.$router.push("/dashboard");
  //   }
  // },
  mounted() {
    this.err = this.$route.query.error_description;
    // if (this.user) {
    //   this.$router.push("/dashboard");
    // }
  }
};
</script>

<style></style>
