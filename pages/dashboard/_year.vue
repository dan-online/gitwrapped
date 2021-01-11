<template>
  <div class="container max">
    <transition name="fade" mode="out-in">
      <div class="row py-5 mb-5" v-if="!finished">
        <div class="col-md-8 mx-auto text-text text-center">
          <h1 class="mb-3">Please wait while we crunch the data!</h1>
          <Progress class="mb-3" :val="progress.value"></Progress>
          <span>{{ progress.name }} - {{ Math.round(progress.value) }}%</span
          ><br />
          <button class="mt-2" @click="notifyMe">
            <span v-if="!notify">Notify me when ready</span
            ><span v-else>Don't notify me</span>
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade-home">
      <div class="row pt-5 pb-5" v-if="finished">
        <Support :year="year" class="d-md-none"></Support>
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
                    v-if="languages.length > 0"
                    class="jumpTo"
                    id="Languages"
                    :contributions="contributions"
                    :languages="languages"
                    :nFormatter="nFormatter"
                    :formatBytes="formatBytes"
                    :formatDuration="formatDuration"
                    :user="user"
                    :year="year"
                  ></Languages>
                  <Stars
                    id="Stars"
                    :stars="stars"
                    :v-if="stars.length + watches.length > 0"
                    :watches="watches"
                    class="jumpTo"
                  ></Stars>
                  <Radar
                    id="Radar"
                    class="jumpTo"
                    :pulls="pulls"
                    :year="year"
                    :contributions="contributions"
                    :issues="issues"
                    :nFormatter="nFormatter"
                    v-if="contributions.w.length > 0"
                  ></Radar>
                  <Year
                    v-if="contributions.w.length > 0"
                    :year="year"
                    :nFormatter="nFormatter"
                    :contributions="contributions"
                    :repos="repos"
                    :user="user"
                    id="Year"
                    class="jumpTo"
                  ></Year>
                  <Events
                    :year="year"
                    :user="user"
                    :events="events"
                    :nFormatter="nFormatter"
                    id="Events"
                    class="jumpto"
                  ></Events>
                  <!-- <Rank id="Rank" class="jumpTo"></Rank> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <Support :year="year" class="d-none d-md-block"></Support>
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
  head() {
    return {
      title: "GitWrapped - Dashboard"
    };
  },
  data() {
    const year = this.$route.params.year;
    let jan;
    let dec;
    if (year) {
      jan = new Date(year);
      dec = new Date(year);
      jan.setMonth(0);
      dec.setMonth(11);
      jan.setDate(1);
      dec.setDate(31);
    }
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
      events: {},
      contributions: { w: [], a: 0, d: 0, c: 0 },
      jan,
      dec,
      // topRepo: null,
      finished: false,
      progress: { value: 0, name: "Loading" },
      cache: {},
      notify: false,
      year
    };
  },
  methods: {
    saveCache(name, data) {
      try {
        localStorage["git_cache_" + name + "_data"] = JSON.stringify(data); // this autosaves
        localStorage["git_cache_" + name] = new Date().toISOString();
      } catch (err) {}
    },
    clearCache() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("git_cache")) {
          delete localStorage[key];
        }
      });
    },
    getCache(name) {
      let got;
      let date;
      try {
        got = localStorage["git_cache_" + name + "_data"];
        date = localStorage["git_cache_" + name];
      } catch {}
      return {
        data: got ? JSON.parse(got) : null,
        date: got ? new Date(date) : null
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
      if (cached.data && name != "repos") {
        if (new Date() - cached.date < 3600000) {
          return cb(cached.data);
        }
      }
      this.$auth.ctx.$axios
        .get(url(index))
        .then(({ data }) => {
          if (!returnDone) {
            all = [...all, ...data];
          }
          if (!returnDone && data.length >= 100) {
            return this.fetchAllPages(
              name,
              url,
              cb,
              strip,
              returnDone,
              all,
              index + 1
            );
          } else {
            let returnType = returnDone ? data : all;
            returnType = strip(returnType);
            if (returnType) this.saveCache(name, returnType);
            return cb(returnType);
          }
        })
        .catch(err => {
          console.error(err);
          this.$sentry.captureException(err);
          cb([]);
        });
    },
    fetchAllRepos(cb) {
      const since = this.jan;
      const before = this.dec;
      this.fetchAllPages(
        "repos",
        index =>
          `https://api.github.com/user/repos?per_page=100&page=${index}&since=${since.toISOString()}&before=${before.toISOString()}`,
        repos => {
          // console.log(repos);
          this.repos = repos;
          cb();
        },
        repos => {
          return repos.map(repo => ({
            url: repo.url,
            name: repo.name,
            languages_url: repo.languages_url,
            id: repo.id,
            pulls_url: repo.pulls_url,
            issues_url: repo.issues_url,
            owner: repo.owner,
            private: repo.private
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
      let repos = this.repos;
      const repo = repos[index];
      if (!repo) {
        // console.log(
        //   this.repos
        //     .map(x => x.name + ":" + x.languages.map(x => x.name))
        //     .join("\n")
        // );
        return cb();
      }
      // this.progress.value = this.progress.start + (index / repos.length) * 10;
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
          this.repos[index].languages = mapped || [];
          this.languages = this.repos.reduce((prev, curr) => {
            if (curr.languages) {
              curr.languages.forEach(l => {
                const idx = prev.findIndex(x => x.name == l.name);
                if (idx >= 0) {
                  prev[idx].lines += l.lines;
                  prev[idx].times++;
                } else prev.push({ name: l.name, times: 1, lines: l.lines });
              });
            }
            return prev;
          }, []);
          this.fetchAllLanguages(cb, index + 1);
        },
        s => s,
        true
      );
    },
    fetchAllCommits(cb, page = 0, index = 0, all = []) {
      const repo = this.repos[index];
      if (!repo) {
        return cb();
      }
      // this.progress.value =
      //   this.progress.start + (index / this.repos.length) * 10;

      this.fetchAllPages(
        "commits-" + repo.id,
        ind => `${repo.url}/stats/contributors`,
        info => {
          // console.log("INFO", info);
          if (info && info.weeks) {
            const adc = info.weeks.reduce(
              (prev, curr) => {
                prev.a += curr.a;
                prev.d += curr.d;
                prev.c += curr.c;
                return prev;
              },
              { a: 0, d: 0, c: 0 }
            );
            // console.log("ADC", adc);
            this.contributions.a += adc.a;
            this.contributions.d += adc.d;
            this.contributions.c += adc.c;
            info.weeks.forEach(w => {
              let idx = this.contributions.w.findIndex(x => x.w == w.w);
              if (idx >= 0) {
                this.contributions.w[idx].a += w.a;
                this.contributions.w[idx].d += w.d;
                this.contributions.w[idx].c += w.c;
              } else {
                this.contributions.w.push(w);
              }
            });
            this.repos[index].contributions = {
              total: info.total,
              a: adc.a,
              d: adc.d,
              c: adc.c
            };
            // console.log("REPO", this.repos[index].contributions);
          } else {
            this.repos[index].contributions = { total: 0, a: 0, d: 0, c: 0 };
          }
          this.fetchAllCommits(cb, 0, index + 1, []);
        },
        s => {
          if (s && s.find) {
            s = s.find(x => x.author.id == this.user.id);
            if (s && s.weeks) {
              s.weeks = s.weeks.filter(
                x => new Date(x.w * 1000).getFullYear().toString() == this.year
              );
            }
          }
          // console.log("S", s);
          if (s) {
            return s;
          } else {
            return {};
          }
        },
        true
      );
    },
    fetchAllEvents(cb) {
      // this.fetchAllPages(
      //   "events",
      //   index =>
      //     `https://api.github.com/users/${this.user.login}/events?per_page=100&page=${index}`,
      //   events => {
      //     this.events = events;
      //     delete localStorage.git_cache_events_data;
      //     cb();
      //   },
      //   events => {
      //     const eventNames = [];
      //     const final = {
      //       total: events.length,
      //       contributions: events
      //         .filter(x => x.type == "PushEvent")
      //         .reduce((prev, curr) => (prev += curr.payload.commits.length), 0)
      //     };
      //     events.forEach(e => {
      //       if (!eventNames.find(x => x == e.type)) {
      //         eventNames.push(e.type);
      //       }
      //     });
      //     console.log(events);
      //     console.log(eventNames);
      //     console.log(final);
      //     return final;
      //   }
      // );
      const start = this.jan;
      const end = this.dec;
      let gotCache = this.getCache("events");
      if (gotCache.data && new Date() - gotCache.date < 3600000) {
        this.events = gotCache.data;
        return cb();
      }
      this.$auth.ctx.$axios
        .post("https://api.github.com/graphql", {
          query: `query {
            user(login: "${this.user.login}") {
              name
              contributionsCollection(from: "${start.toISOString()}", to: "${end.toISOString()}") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`
        })
        .then(({ data }) => {
          this.events =
            data.data.user.contributionsCollection.contributionCalendar;
          this.saveCache("events", this.events);
          cb();
        });
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
        //   x => new Date(x.created_at).getFullYear() - 1 == (new Date().getFullYear() - 1)
        // );
        let idx = this.pulls.findIndex(x => x.closed_at);
        if (idx >= 0) this.pulls[idx].closedUse = true;
        return cb();
      }
      // this.progress.value =
      //   this.progress.start + (index / this.repos.length) * 10;

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
          // let idx = pulls.findIndex(x => x.closed_at);
          // if (!this.pulls.find(x => x.closedUse) && idx >= 0) {
          //   pulls[idx].closedUse = true;
          //   this.pulls.push(pulls[idx]);
          //   console.log(pulls[idx]);
          //   return [
          //     ...pulls
          //       .filter(x => x.id != pulls[idx].id)
          //       .map(x => ({ closed_at: x.closed_at }))
          //   ];
          // }
          pulls = pulls.filter(
            x =>
              new Date(x.created_at).getFullYear() == this.year &&
              x.user.id == this.user.id
          );
          return pulls.map(x => ({
            title: x.title,
            closed_at: x.closed_at
          }));
        }
      );
    },
    fetchAllIssues(cb, index = 0) {
      const repo = this.repos[index];
      if (!repo) {
        this.issues = this.issues.filter(
          x => new Date(x.created_at).getFullYear() == this.year
        );
        return cb();
      }
      // this.progress.value =
      //   this.progress.start + (index / this.repos.length) * 10;
      this.fetchAllPages(
        "issues-" + repo.id,
        ind =>
          `${repo.issues_url
            .split("{/number}")
            .join("")}?per_page=100&page=${ind}&owner=${
            this.user.login
          }&state=all`,
        issues => {
          // console.log(issues);

          this.issues = [...this.issues, ...issues];
          this.fetchAllIssues(cb, index + 1);
        },
        issues => {
          issues = issues.filter(
            x =>
              new Date(x.created_at).getFullYear() == this.year &&
              x.user.id == this.user.id
          );
          return issues;
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
      secs = Math.round(secs);
      if (secs < 60) {
        return secs + " seconds";
      }
      let mins = Math.round(secs / 60);
      if (mins < 60) {
        return (
          mins +
          " minutes" +
          (extra ? " and " + Math.round(secs % 60) + " seconds " : "")
        );
      }
      let hrs = Math.round(mins / 60);
      if (hrs < 24) {
        return (
          hrs +
          " hours" +
          (extra ? " and " + Math.round(mins % 60) + " minutes " : "")
        );
      }
      let days = Math.round(hrs / 24);
      if (days < 365) {
        return (
          days +
          " days" +
          (extra ? " and " + Math.round(hrs % 24) + " hours " : "")
        );
      }
      return (
        Math.round(days / 365) +
        " years" +
        (extra ? " and " + Math.round(days % 365) + " days " : "")
      );
    },
    notifyMe() {
      if (!("Notification" in window)) {
        return alert("This browser does not support desktop notification");
      }
      if (!this.notify) {
        Notification.requestPermission().then(permission => {
          this.notify = true;
        });
      } else {
        this.notify = false;
      }
    }
  },

  mounted() {
    if (!this.user) return this.$router.push("/");
    if (!this.year) {
      return this.$router.push(
        "/dashboard/" + (new Date().getFullYear() - 1).toString()
      );
    }
    if (!localStorage.lastYear || localStorage.lastYear != this.year) {
      this.clearCache();
      localStorage.lastYear = this.year;
    }
    //im so sorry - dancodes and lightenedlimited
    this.progress = { value: 0, name: "Repos" };
    this.fetchAllRepos(() => {
      this.progress = { start: 10, value: 10, name: "Stats" };
      let funcs = [
        "fetchAllLanguages",
        "fetchAllCommits",
        "fetchAllStars",
        "fetchAllWatches",
        "fetchAllPulls",
        "fetchAllIssues",
        "fetchAllFollowers",
        "fetchAllFollowing",
        "fetchAllFollowers",
        "fetchAllEvents"
      ];
      funcs = funcs.map(
        fn =>
          new Promise((res, rej) => {
            this[fn](() => {
              res();
              this.progress.name = fn.split("fetchAll")[1];
              this.progress.value += 90 / funcs.length;
            });
          })
      );
      Promise.all(funcs).then(() => {
        this.languages.sort((a, b) => b.times - a.times);
        this.progress = { value: 100, name: "Render" };
        this.$nextTick(() => {
          this.finished = true;
          if (this.notify) {
            const notif = new Notification(
              `GitWrapped: Your review of ${this.year} is ready!`
            );
            notif.onclick = () => {
              window.focus();
            };
          }
        });
      });
      // this.repos = this.repos.slice(0, 10);
      // this.fetchAllLanguages(() => {
      //   this.languages.sort((a, b) => b.times - a.times);
      //   this.progress = { start: 30, value: 30, name: "Commits" };
      //   this.fetchAllCommits(() => {
      //     this.progress = { start: 40, value: 40, name: "Stars" };
      //     this.fetchAllStars(() => {
      //       this.progress = { start: 50, value: 50, name: "Watches" };
      //       this.fetchAllWatches(() => {
      //         this.progress = { start: 60, value: 60, name: "Pulls" };
      //         this.fetchAllPulls(() => {
      //           this.progress = { start: 70, value: 70, name: "Issues" };
      //           this.fetchAllIssues(() => {
      //             this.progress = { start: 80, value: 80, name: "Followers" };
      //             this.fetchAllFollowers(() => {
      //               this.progress = { start: 90, value: 90, name: "Following" };
      //               this.fetchAllFollowing(() => {
      //                 this.progress = { value: 95, name: "Events" };
      //                 this.fetchAllEvents(() => {
      //                   this.progress = { value: 100, name: "Render" };
      //                   this.$nextTick(() => {
      //                     this.finished = true;
      //                     if (this.notify) {
      //                       const notif = new Notification(
      //                         `GitWrapped: Your review of ${this.year} is ready!`
      //                       );
      //                       notif.onclick = () => {
      //                         window.focus();
      //                       };
      //                     }
      //                     // console.log(
      //                     //   Object.entries(lengths).map(
      //                     //     ([key, val]) => `${key}: ${this.nFormatter(val)}`
      //                     //   )
      //                     // );
      //                     // console.log(
      //                     //   (Object.entries(lengths).reduce(
      //                     //     (prev, [key, val]) => (prev += val),
      //                     //     0
      //                     //   ) /
      //                     //     5238346) *
      //                     //     100
      //                     // );
      //                     // this.$nextTick(() => {
      //                     //   this.divs = Object.entries(this.$refs).map(x => ({
      //                     //     name: x[0],
      //                     //     value: x[1]
      //                     //   }));
      //                     // });
      //                   });
      //                 });
      //               });
      //             });
      //           });
      //         });
      //       });
      //     });
      //   });
      // });
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
.toprint .no-print {
  display: none;
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
