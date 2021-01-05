<template>
  <div class="col-md-12 text-center box mx-auto px-5">
    <img
      :alt="user.login + ' pfp'"
      class="img-fluid rounded-circle"
      style="height:100px;"
      :src="user.avatar_url"
    />
    <h2 class="mt-2 mb-1">{{ user.name || user.login }}</h2>
    <span
      ><b>{{ user.followers }}</b> followers,
      <b>{{ user.following }} following</b></span
    >
    <p class="px-md-5 mx-md-5">{{ user.bio }}</p>
    <a class="icon" target="_blank" :href="user.html_url">
      <font-awesome-icon :icon="['fab', 'github']" />
    </a>
    <a class="icon" target="_blank" v-if="user.blog" :href="user.blog">
      <font-awesome-icon :icon="['fas', 'link']" />
    </a>
  </div>
</template>

<script>
export default {
  props: ["user"],
  mounted() {
    // console.log(this.user);
  }
};
</script>
