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
  props: ["user", "contributions", "bestDay"],
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
    writeText(ctx, text, font, color, x, y) {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    },
    download() {
      if (this.loading) return;
      const start = new Date();
      this.loading = true;
      const id = Math.random().toString();
      const chart = document.querySelector("#Events canvas");
      this.canvas.push({ id });
      this.$nextTick(async () => {
        const canvas = this.$refs[id][0];
        const ctx = canvas.getContext("2d");
        const background = await this.downloadImage(this.bg);
        ctx.drawImage(background, 0, 0);
        this.writeText(
          ctx,
          this.user.name || this.user.login,
          "50px JetBrains Mono",
          "#5b2ce6",
          293,
          110
        );
        this.writeText(
          ctx,
          "Generated " + new Date().toLocaleDateString(),
          "13px JetBrains Mono",
          "white",
          19,
          785
        );
        this.writeText(
          ctx,
          "@" + this.user.login,
          "20px JetBrains Mono",
          "#baa3ff",
          297,
          140
        );
        this.wrap(this.user.bio, 45).forEach((line, ind) => {
          this.writeText(
            ctx,
            line,
            "20px Ubuntu Mono",
            "white",
            297,
            167 + 25 * ind
          );
        });
        // this.repos
        //   .filter(x => !x.private)
        //   .sort((a, b) => b.contributions.c - a.contributions.c)
        //   .slice(0, 7)
        //   .map(x => {
        //     let l = 21;
        //     if (x.name.length > l) {
        //       x.name = x.name.slice(0, l - 3) + "...";
        //     }
        //     return x.name;
        //   })
        //   .forEach((line, ind) => {
        //     this.writeText(
        //       ctx,
        //       line,
        //       "30px Ubuntu Mono",
        //       "white",
        //       40,
        //       450 + 40 * ind
        //     );
        //   });
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        this.writeText(
          ctx,
          "I made " +
            this.contributions +
            " contributions in " +
            (new Date().getFullYear() - 1),
          "30px JetBrains Mono",
          "white",
          canvas.width / 2,
          315
        );
        this.writeText(
          ctx,
          "My best day was on " + this.bestDay.date,
          "30px JetBrains Mono",
          "white",
          canvas.width / 2,
          655
        );
        this.writeText(
          ctx,
          "with " + this.bestDay.count + " contributions",
          "30px JetBrains Mono",
          "white",
          canvas.width / 2,
          700
        );
        const chartImg = await this.downloadImage(chart.toDataURL());
        ctx.drawImage(
          chartImg,
          canvas.width - chart.width - 70,
          375,
          chart.width,
          chart.height
        );
        const pfp = await this.downloadImage(this.user.avatar_url);
        ctx.beginPath();
        ctx.arc(160, 165, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(pfp, 60, 65, 200, 200);
        this.finished = new Date() - start + "ms";
        this.loading = false;
        this.downloadFile("2020-events-" + new Date().toISOString(), id);
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
