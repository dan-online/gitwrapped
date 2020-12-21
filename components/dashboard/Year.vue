<template>
  <div class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6">
      <LineChart :data="chart.data" :options="chart.options"></LineChart>
    </div>
  </div>
</template>

<script>
export default {
  props: ["contributions", "nFormatter"],
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
      item: null,
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
