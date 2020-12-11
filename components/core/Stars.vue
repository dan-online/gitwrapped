<template>
  <div class="limit" v-if="stars.length >= 1">
    <transition name="fade">
      <div v-if="show">
        <div class="mb-2">
          <img
            class="img-fluid rounded-circle"
            style="width:25px"
            :src="item.owner.avatar_url"
          />
          <a target="_blank" :href="item.owner.html_url">
            @{{ item.owner.login }}
          </a>
        </div>
        <a :href="item.html_url" target="_blank" class="repoName">
          <h3>{{ item.full_name }}</h3>
        </a>
        <p>{{ item.description }}</p>
        <a :href="item.stargazers_url" target="_blank"
          ><font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon>
          {{ item.stargazers_count }}</a
        >
        |
        <a :href="item.html_url + '/watchers'" target="_blank"
          ><font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
          {{ item.watchers_count == 0 ? 1 : item.watchers_count }}</a
        >
        |
        <a :href="item.forks_url" target="_blank"
          ><font-awesome-icon
            :icon="['fas', 'code-branch']"
          ></font-awesome-icon>
          {{ item.forks_count }}</a
        >
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  props: ["rows"],
  methods: {
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  },
  data() {
    return {
      idx: 0,
      show: false,
      repos: [],
      item: {}
    };
  },
  created() {
    this.repos = this.shuffle(this.rows).filter(
      x => x.owner.id != this.user.id && x.description
    );
    this.item = this.repos[0];
    this.show = true;
    this.interval = setInterval(() => {
      this.show = false;
      setTimeout(() => {
        this.item = this.repos[++this.idx];
        if (!this.item) this.item = this.repos[0];
        console.log(this.item);
        this.show = true;
      }, 1000);
    }, 6000);
  },
  destroyed() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.repoName {
  word-wrap: break-word;
  color: white;
  text-decoration: underline;
}
.limit {
  min-height: 200px;
  max-height: 200px;
}
</style>
