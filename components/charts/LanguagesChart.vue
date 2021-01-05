<template>
  <PieChart id="languages" :options="options" :data="data"></PieChart>
</template>

<script>
export default {
  data() {
    const all = this.languages.reduce((prev, curr) => (prev += curr.times), 0);
    return {
      options: {
        type: "pie"
      },
      data: {
        labels: this.languages.map(x => " " + x.name),
        datasets: [
          {
            label: "Language",
            data: this.languages.map(x => Math.round((x.times / all) * 100)),
            backgroundColor: [
              "rgb(206,151,251)",
              "rgb(246,165,235)",
              "rgb(250,169,157)",
              "rgb(253,223,126)",
              "rgb(103,235,250)"
            ]
          }
        ]
      }
    };
  },
  props: ["languages"]
};
</script>

<style></style>
