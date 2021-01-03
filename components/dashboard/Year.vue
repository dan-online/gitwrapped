<template>
  <div class="row box p-4 mt-4 mx-0">
    <div class="col-md-6">
      <LineChart
        :key="log"
        :data="chart.data"
        :options="chart.options"
      ></LineChart>
      <button @click="toggleLog">{{ log ? "Linear" : "Logarithmic" }}</button>
    </div>
    <div class="col-md-6">
      <h2>Contributions</h2>
      <hr />
      <p>
        In {{ new Date().getFullYear() - 1 }} you contributed to many repos but
        your top repository was <b>{{ topRepo.name }}</b> with
        <b>{{ nFormatter(topRepo.contributions.a) }} additions</b> and
        <b>{{ topRepo.contributions.c }}</b> commits. <br /><br />Your top week
        to commit was of {{ new Date(topCWeek.w * 1000).toDateString() }} with
        {{ topCWeek.c }} commits but your top week for additions was of
        {{ new Date(topAWeek.w * 1000).toDateString() }} with
        {{ nFormatter(topAWeek.a) }} additions<br /><br />You shined in
        <b>{{ MONTHS[topMonth.ind] }}</b
        ><br />
        With <b>{{ nFormatter(topMonth.obj.a) }} additions</b><br />
        And <b>{{ nFormatter(topMonth.obj.d) }} deletions</b><br />
        All in <b>{{ nFormatter(topMonth.obj.c) }} commits</b>
      </p>
      <YearImage
        :repos="repos"
        :commits="nFormatter(contributions.c)"
        :user="user"
      ></YearImage>
    </div>
  </div>
</template>

<script>
export default {
  props: ["contributions", "nFormatter", "repos", "user"],
  methods: {
    toggleLog() {
      this.chart.options.scales.yAxes[0].type = this.log
        ? "linear"
        : "logarithmic";
      this.log = !this.log;
    }
  },
  data() {
    const dataMonths = new Array(12).fill("a").map(x => ({ a: 0, d: 0, c: 0 }));
    this.contributions.w.forEach(week => {
      const m = new Date(week.w * 1000).getMonth();
      dataMonths[m].c += week.c;
      dataMonths[m].a += week.a;
      dataMonths[m].d += week.d;
    });
    var MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return {
      log: false,
      item: null,
      topRepo: this.repos.reduce(
        (prev, curr) => {
          if (prev.contributions.c < curr.contributions.c) {
            prev = curr;
          }
          return prev;
        },
        { contributions: { c: 0 } }
      ),
      topCWeek: this.contributions.w.reduce((prev, curr) =>
        prev.c < curr.c ? curr : prev
      ),
      topAWeek: this.contributions.w.reduce((prev, curr) =>
        prev.a < curr.a ? curr : prev
      ),
      topMonth: dataMonths.reduce(
        (prev, curr, ind) => {
          const allP = prev.obj.a + prev.obj.c + prev.obj.d;
          const allC = curr.a + curr.c + curr.d;
          if (allC > allP) {
            prev = { obj: curr, ind };
          }
          return prev;
        },
        { obj: { a: 0, c: 0, d: 0 }, ind: 0 }
      ),
      MONTHS,
      chart: {
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Contributions over time"
          },
          tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (tooltipItem, data) => {
                return (
                  " " +
                  ["Commits", "Additions", "Deletions"][
                    tooltipItem.datasetIndex
                  ] +
                  ": " +
                  this.nFormatter(tooltipItem.value)
                );
              }
            }
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Month"
                }
              }
            ],
            yAxes: [
              {
                // type: "logarithmic",
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Value"
                }
              }
            ]
          }
        },
        // "rgb(206,151,251)",
        //               "rgb(246,165,235)",
        //               "rgb(250,169,157)",
        //               "rgb(253,223,126)",
        //               "rgb(103,235,250)"
        data: {
          labels: MONTHS,
          datasets: [
            {
              label: "Commits",
              backgroundColor: "rgb(206,151,251)",
              borderColor: "rgb(206,151,251)",
              data: dataMonths.map(x => x.c),
              fill: false
            },
            {
              label: "Additions",
              backgroundColor: "rgb(103,235,250)",
              borderColor: "rgb(103,235,250)",
              data: dataMonths.map(x => x.a),
              fill: false
            },
            {
              label: "Deletions",
              backgroundColor: "rgb(253,223,126)",
              borderColor: "rgb(253,223,126)",
              data: dataMonths.map(x => x.d),
              fill: false
            }
          ]
        }
      }
    };
  }
};
</script>

<style></style>
