<template>
  <div class="container">
    <transition name="fade" mode="out-in">
      <div class="row pt-5" v-if="!finished">
        <div class="col-md-8 mx-auto text-center">
          <h1 class="mb-3">Please wait while we crunch the data!</h1>
          <Progress class="mb-3" :val="progress.value"></Progress>
          <span>{{ progress.name }} - {{ progress.value }}%</span>
        </div>
      </div>
    </transition>
    <transition name="fade-home">
      <div class="row pt-5 pb-5" v-if="finished">
        <div class="col-md-10 text-center box mx-auto px-5">
          <img
            class="img-fluid rounded-circle"
            style="height:100px;"
            :src="user.avatar_url"
          />
          <h2 class="mt-2 mb-1">{{ user.name }}</h2>
          <p class="px-md-5 mx-md-5">{{ user.bio }}</p>
          <a class="icon" target="_blank" :href="user.html_url">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <a class="icon" target="_blank" v-if="user.blog" :href="user.blog">
            <font-awesome-icon :icon="['fas', 'link']" />
          </a>
        </div>
        <div class="col-md-10 mx-auto px-0 mt-4">
          <div class="container px-0 no-gutters">
            <div class="row box p-4 no-gutters">
              <div class="col-md-6 ">
                <h2>Top Languages</h2>
                <hr />
                <p>
                  You wrote a total of
                  <b>{{
                    nFormatter(
                      languages.reduce((prev, curr) => (prev += curr.lines), 0)
                    )
                  }}</b>
                  lines of code. Your top language to write in was
                  <b>{{ languages[0].name }}</b> with
                  {{ nFormatter(languages[0].lines) }} lines! Let's not forget
                  {{ languages[languages.length - 1].name }} though which you
                  wrote a commendable
                  {{ nFormatter(languages[languages.length - 1].lines) }} lines
                  in. <br /><br />That's around
                  <b>{{
                    formatBytes(
                      50 *
                        languages.reduce(
                          (prev, curr) => (prev += curr.lines),
                          0
                        )
                    )
                  }}</b>
                  of code<br />
                  At 20wpm that's
                  <b>{{
                    formatDuration(
                      (languages.reduce(
                        (prev, curr) => (prev += curr.lines),
                        0
                      ) *
                        66) /
                        100
                    )
                  }}</b>
                  of continous work<br />
                  So about
                  <b
                    >{{
                      Math.round(
                        languages.reduce(
                          (prev, curr) => (prev += curr.lines),
                          0
                        ) / 365
                      )
                    }}
                    lines a day</b
                  >
                  this year
                </p>
                <table class="table border-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Lines</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(lang, ind) in languages" :key="lang.name">
                      <th scope="row">{{ ind + 1 }}</th>
                      <td>{{ lang.name }}</td>
                      <td>{{ nFormatter(lang.lines) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <LanguagesChart
                  :languages="languages.slice(0, 5)"
                ></LanguagesChart>
              </div>
            </div>
            <div class="row box p-4 mt-4 no-gutters">
              <div class="col-md-6 pr-3">
                <Stars :rows="[...stars, ...watches]"></Stars>
              </div>
              <div class="col-md-6">
                <h2>Stars/Watches</h2>
                <hr />
                <p>
                  You starred <b>{{ stars.length }}</b> repositories, way to
                  contribute to the community. Not only were you a star but you
                  also kept on eye on <b>{{ watches.length }}</b> repositories!
                </p>
              </div>
            </div>
            <div class="row box p-4 mt-4 no-gutters">
              <div class="col-md-6">
                <h2>Radar</h2>
                <hr />
                <p>
                  You created <b>{{ pulls.length }} pull requests</b> this year
                  and <b>{{ issues.length }} issues</b>, you are a real team
                  player! Not only did you create these, you also
                  <b
                    >closed
                    {{
                      Math.round(
                        ((pulls.filter(x => x.closed_at).length +
                          issues.filter(x => x.closed_at).length) /
                          (pulls.length + issues.length)) *
                          100
                      )
                    }}%</b
                  >
                  of them.<br /><br />
                  You added
                  <b
                    >{{
                      repos.reduce(
                        (prev, curr) => (prev += curr.contributions.a),
                        0
                      )
                    }}
                    lines</b
                  ><br />But deleted
                  <b
                    >{{
                      repos.reduce(
                        (prev, curr) => (prev += curr.contributions.d),
                        0
                      )
                    }}
                    lines</b
                  ><br />
                  All in
                  <b
                    >{{
                      repos.reduce(
                        (prev, curr) => (prev += curr.contributions.c),
                        0
                      )
                    }}
                    commits</b
                  >
                </p>
              </div>
              <div class="col-md-6">
                <PullsChart
                  :pulls="pulls"
                  :issues="issues"
                  :commits="
                    repos.reduce(
                      (prev, curr) => (prev += curr.contributions.c),
                      0
                    )
                  "
                  :deletions="
                    repos.reduce(
                      (prev, curr) => (prev += curr.contributions.d),
                      0
                    )
                  "
                ></PullsChart>
              </div>
            </div>
          </div>
        </div>
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
  data() {
    return {
      repos: [],
      issues: [],
      stars: [],
      watches: [],
      languages: [],
      pulls: [],
      issues: [],
      jan: new Date(new Date().getFullYear().toString()).toISOString(),
      topRepo: null,
      finished: false,
      progress: { value: 0, name: "Loading" }
    };
  },
  methods: {
    fetchAllRepos(cb, index = 0) {
      this.$auth.ctx.$axios
        .get(
          `https://api.github.com/user/repos?per_page=100&page=${index}&since=${this.jan}`
        )
        .then(repos => {
          this.repos = [...this.repos, ...repos.data];
          if (repos.data.length >= 100) {
            return this.fetchAllRepos(cb, index + 1);
          } else {
            return cb();
          }
        });
    },
    fetchAllLanguages(cb, index = 0) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 20;
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
        this.repos[index].languages = mapped;
        this.fetchAllLanguages(cb, index + 1);
      });
    },
    fetchAllCommits(cb, page = 0, index = 0, all = []) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 20;
      this.$auth.ctx.$axios
        .get(`${repo.url}/stats/contributors`)
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
            total: contributions.total || 0,
            a: adc.a || 0,
            d: adc.d || 0,
            c: adc.c || 0
          };
          this.fetchAllCommits(cb, 0, index + 1, []);
        })
        .catch(err => {
          this.repos[index].contributions = {};
          this.fetchAllCommits(cb, 0, index + 1, []);
        });
    },
    fetchAllStars(cb, index = 0) {
      this.$auth.ctx.$axios
        .get(`https://api.github.com/user/starred?per_page=100&page=${index}`)
        .then(stars => {
          this.stars = [...this.stars, ...stars.data];
          if (stars.data.length >= 100) {
            this.fetchAllStars(cb, index + 1);
          } else {
            cb();
          }
        });
    },
    fetchAllWatches(cb, index = 0) {
      this.$auth.ctx.$axios
        .get(
          `https://api.github.com/user/subscriptions?per_page=100&page=${index}`
        )
        .then(watches => {
          this.watches = [...this.watches, ...watches.data];
          if (watches.data.length >= 100) {
            this.fetchAllWatches(cb, index + 1);
          } else {
            cb();
          }
        });
    },
    fetchAllPulls(cb, index = 0, page = 0) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;
      this.$auth.ctx.$axios
        .get(
          `${repo.pulls_url
            .split("{/number}")
            .join("")}?per_page=100&page=${page}&owner=${
            this.user.login
          }&state=all`
        )
        .then(pulls => {
          this.pulls = [...this.pulls, ...pulls.data];
          if (pulls.data.length >= 100) {
            this.fetchAllPulls(cb, index, page + 1);
          } else {
            this.fetchAllPulls(cb, index + 1);
          }
        });
    },
    fetchAllIssues(cb, index = 0, page = 0) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;
      this.$auth.ctx.$axios
        .get(
          `${repo.issues_url
            .split("{/number}")
            .join("")}?per_page=100&page=${page}&owner=${
            this.user.login
          }&state=all`
        )
        .then(issues => {
          this.issues = [...this.issues, ...issues.data];
          if (issues.data.length >= 100) {
            this.fetchAllIssues(cb, index, page + 1);
          } else {
            this.fetchAllIssues(cb, index + 1);
          }
        });
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    nFormatter(num) {
      var si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
    },
    formatDuration(secs) {
      if (secs < 60) {
        return secs + " seconds";
      }
      let mins = Math.round(secs / 60);
      if (mins < 60) {
        return mins + " minutes";
      }
      let hrs = Math.round(mins / 60);
      if (hrs < 24) {
        return hrs + " hours";
      }
      return Math.round(hrs / 24) + " days";
    }
  },
  mounted() {
    console.log(this.user);
    this.progress = { value: 0, name: "Repos" };
    this.fetchAllRepos(() => {
      this.progress = { start: 10, value: 10, name: "Languages" };
      this.repos = this.repos.slice(0, 10);
      this.fetchAllLanguages(() => {
        this.languages = this.repos.reduce((prev, curr) => {
          curr.languages.forEach(l => {
            const idx = prev.findIndex(x => x.name == l.name);
            if (idx >= 0) prev[idx].lines += l.lines;
            else prev.push({ name: l.name, lines: l.lines });
          });
          return prev;
        }, []);
        this.languages.sort((a, b) => b.lines - a.lines);
        this.progress = { start: 30, value: 30, name: "Commits" };
        this.fetchAllCommits(() => {
          this.progress = { start: 50, value: 50, name: "Stars" };
          // console.log(this.repos[0].contribution);
          this.topRepo = this.repos.sort(
            (a, b) => b.contributions.c - a.contributions.c
          )[0];
          console.log(this.topRepo.contributions);
          this.fetchAllStars(() => {
            this.progress = { start: 70, value: 70, name: "Watches" };
            this.fetchAllWatches(() => {
              this.progress = { start: 80, value: 80, name: "Pulls" };
              this.fetchAllPulls(() => {
                this.progress = { start: 90, value: 90, name: "Issues" };
                this.fetchAllIssues(() => {
                  console.log(this.issues[0]);
                  this.progress = { value: 100, name: "Render" };
                  this.$nextTick(() => {
                    this.finished = true;
                  });
                });
              });
            });
          });
        });
      });
    });
  }
};
</script>

<style>
hr {
  border-color: white;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.icon {
  font-size: 25px;
  color: white;
}
.icon:hover {
  color: var(--accent);
}
[role="progressbar"] {
  background-color: var(--accent);
}
table.table {
  color: white !important;
}
thead th {
  border-top: none !important;
}
b {
  color: #7075ff;
}
.box {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 25px;
  border-radius: 0.25rem;
  -webkit-box-shadow: 0px 10px 80px -33px rgba(53, 0, 211, 0.55);
  -moz-box-shadow: 0px 10px 80px -33px rgba(53, 0, 211, 0.55);
  box-shadow: 0px 10px 80px -33px rgba(53, 0, 211, 0.55);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-home-enter-active,
.fade-home-leave-active {
  transition: all 0.5s;
  transition-delay: 1s;
}
.fade-home-enter,
.fade-home-leave-to {
  opacity: 0;
}
</style>
