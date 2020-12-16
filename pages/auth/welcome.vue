<template>
  <div>
    <span v-if="!user">Please wait while we setup a few things...</span>
    <span v-else
      >Hi there {{ user.name }}, please wait while we redirect you!</span
    >
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    user() {
      this.$router.push("/dashboard");
    }
  }
};
</script>

<style></style>
