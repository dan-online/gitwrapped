<template>
  <RadarChart
    style="height:350px"
    :height="350"
    :options="options"
    :data="data"
  ></RadarChart>
</template>

<script>
export default {
  props: ["pulls", "issues", "commits", "additions", "deletions"],
  data() {
    return {
      options: {
        elements: { line: { tension: -0.1, borderWidth: 3 } },
        scale: { ticks: { showLabelBackdrop: false } }
      },
      data: {
        labels: ["Commits", "Issues", "Pulls" /*"Additions", "Deletions"*/],
        datasets: [
          {
            label: "Github",
            data: [
              this.commits,
              this.pulls.length,
              this.issues.length

              //   this.additions,
              //   this.deletions
            ],
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)"
          }
        ]
      }
    };
  }
};
</script>

<style></style>
