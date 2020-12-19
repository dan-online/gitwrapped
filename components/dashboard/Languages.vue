<template>
  <div class="row box p-4 mt-4 no-gutters">
    <div class="col-md-6 ">
      <h2>Top Languages</h2>
      <hr />
      <p>
        You wrote a total of
        <b>{{
          nFormatter(languages.reduce((prev, curr) => (prev += curr.lines), 0))
        }}</b>
        lines of code. Your top language to write in was
        <b>{{ languages[0].name }}</b> with
        {{ nFormatter(languages[0].lines) }} lines! Let's not forget
        {{ languages[languages.length - 1].name }} though which you wrote a
        commendable
        {{ nFormatter(languages[languages.length - 1].lines) }}
        lines in. <br /><br />That's around
        <b>{{
          formatBytes(
            50 * languages.reduce((prev, curr) => (prev += curr.lines), 0)
          )
        }}</b>
        of code<br />
        At 20wpm that's
        <b>{{
          formatDuration(
            (languages.reduce((prev, curr) => (prev += curr.lines), 0) * 66) /
              100,
            true
          )
        }}</b>
        of continous work<br />
        So about
        <b
          >{{
            Math.round(
              languages.reduce((prev, curr) => (prev += curr.lines), 0) / 365
            )
          }}
          lines a day</b
        >
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
      <LanguagesImage
        :lines="
          nFormatter(languages.reduce((prev, curr) => (prev += curr.lines), 0))
        "
        :user="user"
      ></LanguagesImage>
    </div>
    <div class="col-md-6">
      <LanguagesChart :languages="languages.slice(0, 5)"></LanguagesChart>
    </div>
  </div>
</template>

<script>
export default {
  props: ["languages", "nFormatter", "formatBytes", "formatDuration", "user"]
};
</script>

<style></style>
