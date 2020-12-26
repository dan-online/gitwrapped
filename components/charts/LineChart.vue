<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    window.reRenderLine = this.render;
    // window.Chart.defaults.global.defaultFontColor = "white";
    this.render();
  },
  methods: {
    render(cb) {
      this.renderChart(this.data, this.options, {
        callbacks: { afterBody: cb }
      });
    }
  }
};
</script>

<style></style>
