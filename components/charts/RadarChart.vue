<script>
import { Radar } from "vue-chartjs";

export default {
  extends: Radar,
  props: ["data", "options"],
  mounted() {
    window.Chart.defaults.global.defaultFontColor = "white";
    this.renderChart(this.data, this.options);
  }
};
</script>

<style></style>
