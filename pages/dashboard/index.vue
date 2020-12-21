<template>
  <div class="container max">
    <transition name="fade" mode="out-in">
      <div class="row pt-5" v-if="!finished">
        <div class="col-md-8 mx-auto text-text text-center">
          <h1 class="mb-3">Please wait while we crunch the data!</h1>
          <Progress class="mb-3" :val="progress.value"></Progress>
          <span>{{ progress.name }} - {{ Math.round(progress.value) }}%</span>
        </div>
      </div>
    </transition>
    <transition name="fade-home">
      <div class="row pt-5 pb-5" v-if="finished">
        <Support class="d-md-none"></Support>
        <Share class="mt-4 mt-md-0"></Share>
        <div class="col-md-7 mx-auto">
          <div class="container">
            <div class="row">
              <UserInfo class="jumpTo" id="Home" :user="user"></UserInfo>
              <div class="col-md-12 mx-auto px-0 mt-4">
                <div class="container px-0 no-gutters">
                  <Info
                    class="jumpTo"
                    id="Info"
                    :user="user"
                    :followers="followers"
                    :formatBytes="formatBytes"
                    :formatDuration="formatDuration"
                  >
                  </Info>
                  <Languages
                    class="jumpTo"
                    id="Languages"
                    :contributions="contributions"
                    :languages="languages"
                    :nFormatter="nFormatter"
                    :formatBytes="formatBytes"
                    :formatDuration="formatDuration"
                    :user="user"
                  ></Languages>
                  <Stars
                    id="Stars"
                    :stars="stars"
                    :watches="watches"
                    class="jumpTo"
                  ></Stars>
                  <Radar
                    id="Radar"
                    class="jumpTo"
                    :pulls="pulls"
                    :contributions="contributions"
                    :issues="issues"
                  ></Radar>
                  <Year
                    :nFormatter="nFormatter"
                    :contributions="contributions"
                    id="Year"
                    class="jumpTo"
                  ></Year>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Support class="d-none d-md-block"></Support>
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
      following: [],
      followers: [],
      contributions: { w: [], a: 0, d: 0, c: 0 },
      jan: new Date(new Date().getFullYear().toString()).toISOString(),
      // topRepo: null,
      finished: false,
      progress: { value: 0, name: "Loading" },
      cache: {}
    };
  },
  methods: {
    saveCache(name, data) {
      localStorage["git_cache_" + name + "_data"] = JSON.stringify(data); // this autosaves
      localStorage["git_cache_" + name] = new Date().toISOString();
    },
    getCache(name) {
      let got = localStorage["git_cache_" + name + "_data"];
      return {
        data: got
          ? JSON.parse(localStorage["git_cache_" + name + "_data"])
          : null,
        date: got ? new Date(localStorage["git_cache_" + name]) : null
      };
    },
    fetchAllPages(
      name,
      url,
      cb,
      strip = d => d,
      returnDone = false,
      all = [],
      index = 0
    ) {
      let cached = this.getCache(name);
      if (cached.data) {
        if (new Date() - cached.date < 3600000) {
          return cb(cached.data);
        }
      }
      this.$auth.ctx.$axios.get(url(index)).then(({ data }) => {
        if (!returnDone) {
          all = [...all, ...data];
        }
        if (!returnDone && data.length >= 100) {
          return this.fetchAllPages(name, url, cb, all, index + 1);
        } else {
          let returnType = returnDone ? data : all;
          returnType = strip(returnType);
          this.saveCache(name, returnType);
          return cb(returnType);
        }
      });
    },
    fetchAllRepos(cb, index = 0) {
      this.fetchAllPages(
        "repos",
        index =>
          `https://api.github.com/user/repos?per_page=100&page=${index}&since=${this.jan}`,
        repos => {
          this.repos = repos;
          cb();
        },
        repos => {
          console.log(repos);
          return repos.map(repo => ({
            url: repo.url,
            name: repo.name,
            languages_url: repo.languages_url,
            id: repo.id,
            pulls_url: repo.pulls_url,
            issues_url: repo.issues_url
          }));
        }
      );
    },
    fetchAllFollowers(cb, index = 0) {
      this.fetchAllPages(
        "followers",
        index =>
          `https://api.github.com/user/followers?per_page=100&page=${index}`,
        followers => {
          this.followers = followers;
          cb();
        }
      );
    },
    fetchAllFollowing(cb, index = 0) {
      this.fetchAllPages(
        "following",
        index =>
          `https://api.github.com/user/following?per_page=100&page=${index}`,
        following => {
          this.following = following;
          cb();
        }
      );
    },
    fetchAllLanguages(cb, index = 0) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;
      this.fetchAllPages(
        "languages-" + repo.id,
        ind => repo.languages_url,
        languages => {
          const all = Object.entries(languages).map(x => ({
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
        },
        s => s,
        true
      );
    },
    fetchAllCommits(cb, page = 0, index = 0, all = []) {
      const repo = this.repos[index];
      if (!repo) return cb();
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;

      // this.fetc
      // this.$auth.ctx.$axios
      //   .get(`${repo.url}/stats/contributors`)
      //   .then(info => {
      this.fetchAllPages(
        "commits-" + repo.id,
        ind => `${repo.url}/stats/contributors`,
        info => {
          if (info && info.find) {
            const contributions = info.find(x => x.author.id == this.user.id);
            if (contributions) {
              contributions.weeks = contributions.weeks.filter(
                x =>
                  new Date(x.w * 1000).getFullYear() == new Date().getFullYear()
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
              this.contributions.a += adc.a;
              this.contributions.d += adc.d;
              this.contributions.c += adc.c;
              contributions.weeks.forEach(w => {
                let idx = this.contributions.w.find(x => x.w == w);
                if (idx >= 0) {
                  this.contributions.w[idx].a += w.a;
                  this.contributions.w[idx].d += w.d;
                  this.contributions.w[idx].c += w.c;
                } else {
                  this.contributions.w.push(w);
                }
              });
              // console.log(contributions.weeks);
              // this.repos[index].contributions = {
              //   total: contributions.total,
              //   a: adc.a,
              //   d: adc.d,
              //   c: adc.c
              //   // weeks: contributions.weeks
              // };
            }
          }
          if (!this.repos[index].contributions) {
            this.repos[index].contributions = { total: 0, a: 0, d: 0, c: 0 };
          }
          this.fetchAllCommits(cb, 0, index + 1, []);
        },
        s => s,
        true
      );
    },
    fetchAllStars(cb, index = 0) {
      this.fetchAllPages(
        "stars",
        index =>
          `https://api.github.com/user/starred?per_page=100&page=${index}`,
        stars => {
          this.stars = stars;
          cb();
        }
      );
    },
    fetchAllWatches(cb, index = 0) {
      this.fetchAllPages(
        "watches",
        index =>
          `https://api.github.com/user/subscriptions?per_page=100&page=${index}`,
        watches => {
          this.watches = watches;
          cb();
        }
      );
    },
    fetchAllPulls(cb, index = 0) {
      const repo = this.repos[index];
      if (!repo) {
        // this.repos = this.repos.filter(
        //   x => new Date(x.created_at).getFullYear() == new Date().getFullYear()
        // );
        return cb();
      }
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;

      this.fetchAllPages(
        "pulls-" + repo.id,
        ind =>
          `${repo.pulls_url
            .split("{/number}")
            .join("")}?per_page=100&page=${ind}&owner=${
            this.user.login
          }&state=all`,
        pulls => {
          this.pulls = [...this.pulls, ...pulls];
          this.fetchAllPulls(cb, index + 1);
        },
        pulls => {
          return pulls.map(pull => ({
            closed_at: pull.closed_at
          }));
          return pulls;
        }
      );
    },
    fetchAllIssues(cb, index = 0) {
      const repo = this.repos[index];
      if (!repo) {
        this.issues = this.issues.filter(
          x => new Date(x.created_at).getFullYear() == new Date().getFullYear()
        );
        return cb();
      }
      this.progress.value =
        this.progress.start + (index / this.repos.length) * 10;
      this.fetchAllPages(
        "issues-" + repo.id,
        ind =>
          `${repo.issues_url
            .split("{/number}")
            .join("")}?per_page=100&page=${ind}&owner=${
            this.user.login
          }&state=all`,
        issues => {
          this.issues = [...this.issues, ...issues];
          this.fetchAllIssues(cb, index + 1);
        }
      );
      // this.$auth.ctx.$axios
      //   .get(
      //     `${repo.issues_url
      //       .split("{/number}")
      //       .join("")}?per_page=100&page=${page}&owner=${
      //       this.user.login
      //     }&state=all`
      //   )
      //   .then(issues => {
      //     this.issues = [...this.issues, ...issues.data];
      //     if (issues.data.length >= 100) {
      //       this.fetchAllIssues(cb, index, page + 1);
      //     } else {
      //       this.fetchAllIssues(cb, index + 1);
      //     }
      //   });
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
    formatDuration(secs, extra) {
      if (secs < 60) {
        return secs + " seconds";
      }
      let mins = Math.round(secs / 60);
      if (mins < 60) {
        return (
          mins + " minutes" + (extra ? " and " + (secs % 60) + " seconds " : "")
        );
      }
      let hrs = Math.round(mins / 60);
      if (hrs < 24) {
        return (
          hrs + " hours" + (extra ? " and " + (mins % 60) + " minutes " : "")
        );
      }
      let days = Math.round(hrs / 24);
      if (days < 365) {
        return days + " days" + (extra ? " and " + (hrs % 24) + " hours " : "");
      }
      return (
        Math.round(days / 365) +
        " years" +
        (extra ? " and " + (days % 365) + " days " : "")
      );
    }
  },
  middleware: "auth",
  mounted() {
    // if (!this.user) return this.$router.push("/");
    this.progress = { value: 0, name: "Repos" };
    this.fetchAllRepos(() => {
      this.progress = { start: 10, value: 10, name: "Languages" };
      // this.repos = this.repos.slice(0, 10);
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
          this.progress = { start: 40, value: 40, name: "Stars" };
          this.fetchAllStars(() => {
            this.progress = { start: 50, value: 50, name: "Watches" };
            this.fetchAllWatches(() => {
              this.progress = { start: 60, value: 60, name: "Pulls" };
              this.fetchAllPulls(() => {
                this.progress = { start: 70, value: 70, name: "Issues" };
                this.fetchAllIssues(() => {
                  this.progress = { start: 80, value: 80, name: "Followers" };
                  this.fetchAllFollowers(() => {
                    this.progress = { start: 90, value: 90, name: "Following" };
                    this.fetchAllFollowing(() => {
                      this.progress = { value: 100, name: "Render" };
                      this.$nextTick(() => {
                        this.finished = true;
                        // this.$nextTick(() => {
                        //   this.divs = Object.entries(this.$refs).map(x => ({
                        //     name: x[0],
                        //     value: x[1]
                        //   }));
                        // });
                      });
                    });
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
.max {
  width: 100%;
  max-width: 100% !important;
}
hr {
  border-color: white;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.statIcon {
  font-size: 30px;
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
.text-text * {
  color: var(--text);
}
b {
  color: var(--accent-light);
}
.icon {
  font-size: 20px;
}
.sticky-top {
  top: 20px !important;
}

.toprint .box {
  box-shadow: none !important;
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
