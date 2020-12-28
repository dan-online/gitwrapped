<template>
  <div>
    <canvas width="310" id="contribs" ref="canvas"></canvas>
  </div>
</template>

<script>
const c = () => import("github-contributions-canvas");
export default {
  props: ["data", "user"],
  mounted() {
    console.log(this.$refs.canvas);
    c().then(d =>
      d.drawContributions(this.$refs.canvas, {
        data: this.data,
        username: this.user.login,
        themeName: "standard",
        footerText: "Powered by GitWrapped - github-contributions.now.sh",
        customTheme: {
          text: "white",
          meta: getComputedStyle(document.documentElement).getPropertyValue(
            "--accent-light"
          ),
          background: "transparent"
          //   grade0:
        },
        fontFace: "JetBrains Mono"
      })
    );
  }
};
</script>
<style>
#contribs {
  max-width: 100%;
}
</style>

<style></style>
