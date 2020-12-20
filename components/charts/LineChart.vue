<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    // window.Chart.defaults.global.defaultFontColor = "white";
    this.renderChart(this.data, this.options);
  }
};
</script>

<style></style>
