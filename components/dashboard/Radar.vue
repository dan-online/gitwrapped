<template>
  <div ref="Radar" id="Radar" class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6">
      <h2>Radar</h2>
      <hr />
      <p>
        You created <b>{{ pulls.length }} pull requests</b> this year and
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
        <b
          >{{
            repos.reduce((prev, curr) => (prev += curr.contributions.a || 0), 0)
          }}
          lines</b
        ><br />But deleted
        <b
          >{{
            repos.reduce((prev, curr) => (prev += curr.contributions.d || 0), 0)
          }}
          lines</b
        ><br />
        All in
        <b
          >{{
            repos.reduce(
              (prev, curr) => (prev += curr.contributions.total || 0),
              0
            )
          }}
          commits</b
        >
      </p>
    </div>
    <div class="col-md-6">
      <PullsChart
        :pulls="pulls"
        :issues="issues"
        :commits="
          repos.reduce((prev, curr) => (prev += curr.contributions.c), 0)
        "
        :deletions="
          repos.reduce((prev, curr) => (prev += curr.contributions.d), 0)
        "
      ></PullsChart>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pulls", "issues", "repos"]
};
</script>

<style></style>
