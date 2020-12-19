<template>
  <div class="row box p-4 no-gutters">
    <div class="col-md-6">
      <div class="container">
        <div class="row pr-3">
          <div class="col-md-2 text-center">
            <b class="statIcon"
              ><font-awesome-icon :icon="['fas', 'users']"></font-awesome-icon
            ></b>
          </div>
          <div class="col-md-10 pt-2">
            <h4>{{ user.followers }} followers</h4>
          </div>
        </div>
        <div class="row pr-3 mt-2">
          <div class="col-md-2 text-center">
            <b class="statIcon"
              ><font-awesome-icon
                :icon="['fas', 'user-plus']"
              ></font-awesome-icon
            ></b>
          </div>
          <div class="col-md-10 pt-2">
            <h4>{{ user.following }} following</h4>
          </div>
        </div>
        <div class="row pr-3 mt-2">
          <div class="col-md-2 text-center">
            <b class="statIcon"
              ><font-awesome-icon
                :icon="['fas', 'door-open']"
              ></font-awesome-icon
            ></b>
          </div>
          <div class="col-md-10 pt-2">
            <h4>{{ user.public_repos }} public repos</h4>
          </div>
        </div>
        <div class="row pr-3 mt-2">
          <div class="col-md-2 text-center">
            <b class="statIcon"
              ><font-awesome-icon :icon="['fas', 'save']"></font-awesome-icon
            ></b>
          </div>
          <div class="col-md-10 pt-2">
            <h4>{{ formatBytes(user.disk_usage * 1000) }} of disk usage</h4>
          </div>
        </div>
        <div class="row pr-3 mt-2">
          <div class="col-md-2 text-center">
            <b class="statIcon"
              ><font-awesome-icon :icon="['fas', 'clock']"></font-awesome-icon
            ></b>
          </div>
          <div class="col-md-10 pt-2">
            <h4>
              {{
                formatDuration((new Date() - new Date(user.created_at)) / 1000)
              }}
              with Github
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 mt-4 mt-md-0">
      <h2>Info</h2>
      <hr />
      <p>
        People are liking what they are seeing from you, keep up the good work.
        Some notable followers who followed you were
        <b>{{
          followers
            .map(x => x.login)
            .slice(0, 3)
            .join(", ")
        }}</b>
        and of course, us!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user", "followers", "formatBytes", "formatDuration"]
};
</script>

<style></style>
