<template>
  <div class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6 ">
      <h2>Top Languages</h2>
      <hr />
      <p>
        You wrote
        <b>{{ nFormatter(lines) }}</b>
        lines of code. Your top language to write in was
        <b>{{ languages[0].name }}</b> with
        {{ nFormatter(languages[0].lines) }} lines! Let's not forget
        {{ languages[languages.length - 1].name }} though which your repos
        contained a commendable
        {{ nFormatter(languages[languages.length - 1].lines) }}
        lines in. <br /><br />That's around
        <b>{{ formatBytes(50 * lines) }}</b>
        of code<br />
        At 20wpm that's
        <b>{{ formatDuration((lines * 66) / 100, true) }}</b>
        of continous work<br />
        So about
        <b>{{ Math.round(lines / 365) }} lines a day</b>
        this year
      </p>
      <table class="table border-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Lines</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(lang, ind) in languages" :key="lang.name">
            <th scope="row">{{ ind + 1 }}</th>
            <td>{{ lang.name }}</td>
            <td>{{ nFormatter(lang.lines) }}</td>
          </tr>
        </tbody>
      </table>
      <LanguagesImage :lines="nFormatter(lines)" :user="user"></LanguagesImage>
    </div>
    <div class="col-md-6 p-3 pt-4">
      <LanguagesChart :languages="languages.slice(0, 5)"></LanguagesChart>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lines: this.repos.reduce(
        (prev, curr) => (prev += curr.contributions.a),
        0
      )
    };
  },
  props: [
    "repos",
    "languages",
    "nFormatter",
    "formatBytes",
    "formatDuration",
    "user"
  ]
};
</script>

<style></style>
