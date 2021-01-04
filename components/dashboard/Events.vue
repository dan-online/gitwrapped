<template>
  <div class="row box no-gutters mt-4">
    <div class="col-md-4">
      <h2>Events</h2>
      <hr />
      <p>
        Contributions are a vital part of Github which is why you made
        <b>{{ nFormatter(events.totalContributions) }} contributions</b> this
        year! You contributed your most on <b>{{ bestDay.date }}</b> with
        <b>{{ bestDay.count }} contributions</b>, well done.
      </p>
    </div>
    <div class="col-md-8 text-center">
      <ContributionsChart :user="user" :data="data"></ContributionsChart>
      <EventsShare
        :year="year"
        :user="user"
        :bestDay="bestDay"
        :contributions="nFormatter(events.totalContributions)"
      ></EventsShare>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user", "events", "nFormatter", "year"],
  data() {
    let lastDay = this.events.weeks[this.events.weeks.length - 1]
      .contributionDays[
      this.events.weeks[this.events.weeks.length - 1].contributionDays.length -
        1
    ];
    let firstDay = this.events.weeks[0].contributionDays[0];
    let days = [];
    let intensity = {
      "#ebedf0": 0,
      "#9be9a8": 1,
      "#40c463": 2,
      "#30a14e": 3,
      "#216e39": 4
    };
    this.events.weeks.forEach(w => {
      days = [
        ...days,
        ...w.contributionDays
          .filter(x => new Date(x.date) > new Date(firstDay.date))
          .map(d => ({
            date: d.date,
            count: d.contributionCount,
            color: d.color,
            intensity: intensity[d.color]
          }))
      ];
    });
    let data = {
      years: [
        {
          year: new Date(lastDay.date.toString()).getFullYear(),
          total: this.events.totalContributions,
          range: {
            start: firstDay.date,
            end: lastDay.date
          }
        }
      ],
      contributions: days
    };
    let bestDay = days.sort((a, b) => b.count - a.count)[0];
    // let calendar = [
    //   { name: "January", days: [] },
    //   { name: "February", days: [] },
    //   { name: "March", days: [] },
    //   { name: "April", days: [] },
    //   { name: "May", days: [] },
    //   { name: "June", days: [] },
    //   { name: "July", days: [] },
    //   { name: "August", days: [] },
    //   { name: "September", days: [] },
    //   { name: "October", days: [] },
    //   { name: "November", days: [] },
    //   { name: "December", days: [] }
    // ];
    // this.events.weeks.forEach(w => {
    //   w.contributionDays.forEach(d => {
    //     const m = new Date(d.date).getMonth();
    //     calendar[m].days.push(d);
    //   });
    // });
    // {"years":[{"year":"2020","total":2003,"range":{"start":"2020-01-01","end":"2020-12-31"}}"contributions":[{"date":"2020-12-31","count":0,"color":"#ebedf0","intensity":0},
    return {
      data,
      bestDay
    };
  }
};
</script>

<style>
.square {
  height: 10px;
  width: 10px;
}
.fit {
  max-width: 100%;
}
</style>
