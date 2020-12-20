<template>
  <div class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6">
      <LineChart :data="chart.data" :options="chart.options"></LineChart>
    </div>
  </div>
</template>

<script>
export default {
  props: ["repos"],
  data() {
    console.log(this.repos.map(x => x.name));
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
      chart: {
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Chart.js Line Chart"
          },
          tooltips: {
            mode: "index",
            intersect: false
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
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Value"
                }
              }
            ]
          }
        },

        data: {
          labels: MONTHS,
          datasets: [
            {
              label: "My First dataset",
              backgroundColor: "red",
              borderColor: "red",
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
