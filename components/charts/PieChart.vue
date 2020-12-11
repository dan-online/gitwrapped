<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: ["data", "options"],
  mounted() {
    window.Chart.defaults.global.defaultFontColor = "white";
    this.renderChart(this.data, this.options);
  }
};
</script>

<style></style>
