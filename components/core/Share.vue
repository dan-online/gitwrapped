<template>
  <div class="col-md-2 mb-4 mb-md-0 shareme">
    <div class="sticky-top">
      <div class="box">
        <h3>Share</h3>
        <hr />

        <a
          v-for="link in links"
          :key="link.name"
          :href="link.url()"
          @click.prevent="link.button"
          target="_blank"
          class="d-flex mt-2"
          :title="'Share on ' + link.name"
        >
          <font-awesome-icon
            class="shareIcon ml-0 ml-md-2 ml-lg-0"
            :icon="link.icon"
            aria-hidden="true"
          ></font-awesome-icon>
          <span class="ml-2 d-block d-md-none d-lg-block shareText">{{
            link.name
          }}</span>
          <span class="sr-only">Share on {{ link.name }}</span>
        </a>
        <!-- 
    <li>
      <a
        href="mailto:?subject=Test&body=Test:%20http%3A%2F%2Flocalhost"
        target="_blank"
        title="Send email"
        ><i class="fas fa-envelope-square fa-2x" aria-hidden="true"></i
        ><span class="sr-only">Send email</span></a
      >
    </li> -->
      </div>
    </div>
  </div>
</template>

<script>
const html2canvas = () => import("html2canvas");
export default {
  data() {
    const desc =
        "Check out GitWrapped by DanCodes, the best way to view your github statistics for the year in one wrapped up website!",
      url = window.location.origin;
    return {
      links: [
        {
          name: "Facebook",
          icon: ["fab", "facebook-square"],
          url: () =>
            "https://www.facebook.com/sharer/sharer.php?u=" +
            url +
            "&quote=" +
            desc
        },
        {
          name: "Twitter",
          icon: ["fab", "twitter-square"],
          url: () =>
            "https://twitter.com/intent/tweet?source=" +
            url +
            "&text=" +
            desc +
            " " +
            url
        },
        {
          name: "Pinterest",
          icon: ["fab", "pinterest-square"],
          url: () =>
            "http://pinterest.com/pin/create/button/?url=" +
            url +
            "&description=" +
            desc
        },
        {
          name: "Reddit",
          icon: ["fab", "reddit-square"],
          url: () =>
            "http://www.reddit.com/submit?url=" + url + "&title=" + desc
        },
        {
          name: "Linkedin",
          icon: ["fab", "linkedin"],
          url: () =>
            "https://www.linkedin.com/sharing/share-offsite/?url=" +
            url +
            "&title=" +
            desc +
            "&summary=Check it out at " +
            url +
            "&source=" +
            url
        },
        {
          name: "Email",
          icon: ["fa", "envelope-square"],
          url: () =>
            "mailto:?subject=Check out " + url + "&body=" + desc + " " + url
        },
        {
          name: "Report",
          icon: ["fa", "download"],
          url: () => "#download",
          button: () => {
            document.body.classList.add("toprint");
            var svgElements = document.body.querySelectorAll("svg");
            svgElements.forEach(function(item) {
              item.setAttribute("width", item.getBoundingClientRect().width);
              item.setAttribute("height", item.getBoundingClientRect().height);
              item.style.width = null;
              item.style.height = null;
            });
            html2canvas().then(h =>
              h
                .default(document.body, { allowTaint: true, useCORS: true })
                .then(function(canvas) {
                  document.body.classList.remove("toprint");
                  var link = document.createElement("a");
                  link.download = "full_report.png";
                  link.href = canvas.toDataURL();
                  link.click();
                  // document.body.appendChild(canvas);
                })
            );
          }
        }
      ]
    };
  }
};
</script>

<style>
.toprint .shareme {
  display: none !important;
}
.shareIcon {
  color: var(--accent-light);
  font-size: 33px;
}
.shareText {
  color: white;
  font-size: 20px;
}
</style>
