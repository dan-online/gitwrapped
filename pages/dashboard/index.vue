<template>
  <div v-if="topRepo">
    Top repo this year: {{ topRepo.name }} with
    <!-- {{ topRepo.commits.length }} commits, commit: {{ topRepo.commits[0] }} -->
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
      repos: [],
      jan: new Date(new Date().getFullYear().toString()).toISOString(),
      topRepo: null
    };
  },
  methods: {
    fetchAllRepos(cb, index = 0, all = []) {
      this.$auth.ctx.$axios
        .get(
          "https://api.github.com/user/repos?per_page=100&page=" +
            index +
            "&since=" +
            this.jan
        )
        .then(repos => {
          all = [...all, ...repos.data];
          if (repos.data.length >= 100) {
            return this.fetchAllRepos(cb, index + 1, all);
          } else {
            return cb(all);
          }
        });
    },
    fetchAllLanguages(cb, index = 0, all = []) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.$auth.ctx.$axios.get(repo.languages_url).then(languages => {
        const all = Object.entries(languages.data).map(x => ({
          name: x[0],
          value: x[1]
        }));
        const lines = all.reduce((prev, curr) => (prev += curr.value), 0);
        const mapped = all.map(x => ({
          name: x.name,
          lines: x.value,
          perc: Math.round((x.value / lines) * 100)
        }));
        console.log(mapped);
      });
    },
    fetchAllCommits(cb, page = 0, index = 0, all = []) {
      const repo = this.repos[index];
      console.log(index, "/", this.repos.length);
      if (!repo) return cb();
      this.$auth.ctx.$axios
        .get(repo.url + "/stats/contributors")
        .then(info => {
          const contributions = info.data.find(
            x => x.author.id == this.user.id
          );
          contributions.weeks = contributions.weeks.filter(
            x => new Date(x.w * 1000).getFullYear() == new Date().getFullYear()
          );
          const adc = contributions.weeks.reduce(
            (prev, curr) => {
              prev.a += curr.a;
              prev.d += curr.d;
              prev.c += curr.c;
              return prev;
            },
            { a: 0, d: 0, c: 0 }
          );
          this.repos[index].contributions = {
            total: contributions.total,
            a: adc.a,
            d: adc.d,
            c: adc.c
          };
          this.fetchAllCommits(cb, 0, index + 1, []);
        })
        .catch(err => {
          this.repos[index].contributions = {};
          this.fetchAllCommits(cb, 0, index + 1, []);
        });
    }
  },
  mounted() {
    this.fetchAllRepos(repos => {
      this.repos = repos.slice(0, 10);
      this.fetchAllLanguages(() => {
        this.fetchAllCommits(() => {
          // console.log(this.repos[0].contribution);
          this.topRepo = this.repos.sort(
            (a, b) => b.contributions.c - a.contributions.c
          )[0];
          console.log(this.topRepo.contributions);
        });
      });
    });
  }
};
</script>

<style></style>
