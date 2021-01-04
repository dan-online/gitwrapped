<template>
  <div ref="Radar" id="Radar" class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6">
      <h2>Radar</h2>
      <hr />
      <p>
        You created <b>{{ pulls.length }} pull requests</b> in {{ year }} and
        <b>{{ issues.length }} issues</b>, you are a real team player! Not only
        did you create these, you also
        <b
          >closed
          {{
            Math.round(
              ((pulls.filter(x => x.closed_at).length +
                issues.filter(x => x.closed_at).length) /
                (pulls.length + issues.length)) *
                100
            )
          }}%</b
        >
        of them.<br /><br />
        You added
        <b>{{ nFormatter(contributions.a) }} lines</b><br />But deleted
        <b>{{ nFormatter(contributions.d) }} lines</b><br />
        All in
        <b>{{ nFormatter(contributions.c) }} commits</b><br />
        That's
        <b>{{ nFormatter(contributions.a / contributions.c) }} lines</b> per
        commit<br /><br />
      </p>
      <!-- <div v-if="aClosedPull">
        <p>
          Here's a pull request you closed this year on
          {{ aClosedPull.name }}
        </p>
      </div> -->
    </div>
    <div class="col-md-6">
      <PullsChart
        :commits="contributions.c"
        :pulls="pulls"
        :issues="issues"
      ></PullsChart>
    </div>
  </div>
</template>

<script>
export default {
  // data() {
  //   console.log(this.pulls.find(x => x.closedUse));
  //   return {
  //     aClosedPull: this.pulls.find(x => x.closedUse)
  //   };
  // },
  props: ["pulls", "issues", "repos", "contributions", "nFormatter", "year"]
};
</script>

<style></style>
