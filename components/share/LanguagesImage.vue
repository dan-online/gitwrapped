<template>
  <div>
    <button @click="download" :disabled="loading" class="no-print">
      <span v-if="!loading && !finished">Download Image</span>
      <span v-else-if="!finished">Loading..</span>
      <span v-else>Finished in {{ finished }}</span>
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
      const start = new Date();
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
          "I wrote " +
            this.lines +
            " lines of code in " +
            (new Date().getFullYear() - 1),
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
        this.finished = new Date() - start + "ms";
        this.loading = false;
        this.downloadFile("2020-languages-" + new Date().toISOString(), id);
        setTimeout(() => {
          this.finished = false;
        }, 3000);
      });
    },
    wrap(text, w) {
      if (!text) {
        return [];
      }
      text = text.replace(
        new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"),
        "$1\n"
      );
      console.log(text);
      let finalText = text.split("\n");
      console.log(finalText);
      // const splut = text.split(" ");
      // let finalText = [""];
      // splut.forEach(t => {
      //   if (finalText[finalText.length - 1].length >= lineLength) {
      //     finalText.push("");
      //   }
      //   finalText[finalText.length - 1] += t + " ";
      // });
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
