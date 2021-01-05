<template>
  <footer>
    <div class="container max">
      <div class="row">
        <div class="col-md-8 mx-auto topFooter">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <img
                  alt="GitWrapped logo"
                  src="../../static/logo.png"
                  class="img-fluid footerLogo mb-3"
                />
              </div>
              <div class="col-md-8">
                <h3 class="title">GitWrapped</h3>
                <hr />
                <p>
                  Thanks for using GitWrapped! This website was made by
                  <a href="https://dancodes.online">DanCodes</a> in
                  <a href="https://nuxtjs.org">Nuxt.js</a> and hosted on
                  <a href="https://api.dancodes.online/api/v2/link/galaxygate"
                    >GalaxyGate</a
                  >. Feel free to use the contact links to get in touch or
                  contribute to the site through the github repository link.<br /><br />This
                  website uses
                  <a href="https://sentry.io/welcome/">Sentry</a> and Google
                  Analytics
                </p>
              </div>
              <div class="col-md-4">
                <h3 class="title">Contact</h3>
                <hr />
                <ul>
                  <li>
                    <a href="mailto:dan@dancodes.online">Email</a>
                  </li>
                  <li>
                    <a href="https://dancodes.online">DanCodes</a>
                  </li>
                  <li>
                    <a href="https://github.com/dan-online/gitwrapped"
                      >Github</a
                    >
                  </li>
                  <li>
                    <a href="https://api.dancodes.online/api/v2/link/discord"
                      >Discord</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 text-center">
          Copyright &copy; {{ new Date().getFullYear() }} GitWrapped<br />All
          Rights Reserved
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style>
footer {
  padding-bottom: 30px;
  background: var(--box-bg);
}
.topFooter {
  padding-top: 50px;
  padding-bottom: 80px;
}
footer .title {
  color: white;
  font-size: 40px;
}
.footerLogo {
  width: 100px;
}
footer ul li {
  font-size: 20px;
}
</style>
