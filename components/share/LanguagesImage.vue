<template>
  <div>
    <button @click="download" :disabled="loading" v-if="!finished">
      <span v-if="!loading">Download Report</span>
      <span v-else>Loading..</span>
    </button>
    <canvas
      v-for="c in canvas"
      :key="c.id"
      height="810"
      width="810"
      :ref="c.id"
      style="display:none"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: ["user", "lines"],
  data() {
    return {
      finished: false,
      loading: false,
      canvas: [],
      bg: require("../../assets/images/languages-bg.png")
    };
  },
  methods: {
    downloadFile(name, id) {
      var link = document.createElement("a");
      link.download = name + ".png";
      link.href = this.$refs[id][0].toDataURL();
      link.click();
    },
    async downloadImage(src) {
      const img = new Image();
      img.src = src;
      img.setAttribute("crossorigin", "anonymous");
      return new Promise((res, rej) => {
        img.onload = () => {
          res(img);
        };
      });
    },
    download() {
      if (this.loading) return;
      this.loading = true;
      const id = Math.random().toString();
      const chart = document.querySelector("#languages canvas");
      this.canvas.push({ id });
      this.$nextTick(async () => {
        const canvas = this.$refs[id][0];
        const ctx = canvas.getContext("2d");
        const background = await this.downloadImage(this.bg);
        ctx.drawImage(background, 0, 0);
        ctx.font = "50px JetBrains Mono";
        ctx.fillStyle = "#5b2ce6";
        ctx.fillText(this.user.name || this.user.login, 293, 110);
        ctx.font = "13px JetBrains Mono";
        ctx.fillStyle = "white";
        ctx.fillText("Generated " + new Date().toLocaleDateString(), 19, 785);
        ctx.font = "20px JetBrains Mono";
        ctx.fillStyle = "#baa3ff";
        ctx.fillText("@" + this.user.login, 297, 140);
        ctx.font = "20px Ubuntu Mono";
        ctx.fillStyle = "white";
        this.wrap(this.user.bio, 45).forEach((line, ind) => {
          ctx.fillText(line || "", 297, 167 + 25 * ind);
        });
        ctx.font = "30px JetBrains Mono";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(
          "I wrote " + this.lines + " lines of code in 2020",
          canvas.width / 2,
          330
        );
        const chartImg = await this.downloadImage(chart.toDataURL());
        ctx.drawImage(chartImg, canvas.width / 2 - 371 / 2, 400, 371, 371);
        const pfp = await this.downloadImage(this.user.avatar_url);
        ctx.beginPath();
        ctx.arc(160, 165, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(pfp, 60, 65, 200, 200);
        this.finished = true;
        this.loading = false;
        this.downloadFile("2020-languages-" + new Date().toISOString(), id);
      });
    },
    wrap(text, lineLength) {
      if (!text) {
        return [];
      }
      const splut = text.split(" ");
      let finalText = [""];
      splut.forEach(t => {
        if (finalText[finalText.length - 1].length >= lineLength) {
          finalText.push("");
        }
        finalText[finalText.length - 1] += t + " ";
      });
      return finalText;
    }
  }
};
</script>

<style>
button[disabled] {
  filter: grayscale(0.5);
  cursor: disabled;
}
</style>
