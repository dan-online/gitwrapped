export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "github-wrapped",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  auth: {
    redirect: {
      callback: "/auth/welcome",
      logout: "/auth/logout"
    },
    strategies: {
      github: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        // scheme: "oauth2",
        // endpoints: {
        //   authorization: "https://github.com/login/oauth/authorize",
        //   token: undefined,
        //   userInfo: "https://api.github.com/user"
        // },
        // token: {
        //   property: "access_token",
        //   type: "Bearer",
        //   maxAge: 1800
        // },
        // refreshToken: {
        //   property: "refresh_token",
        //   maxAge: 60 * 60 * 24 * 30
        // },
        // responseType: "token",
        // grantType: "authorization_code",
        // accessType: undefined,
        // redirectUri: "http://localhost:3000/welcome"
        // logoutRedirectUri: undefined,
        scope: ["user", "repo"]
        // state: "UNIQUE_AND_NON_GUESSABLE"
        // codeChallengeMethod: "",
        // responseMode: "",
        // acrValues: ""
        // autoLogout: false
      }
    }
  },
  // serverMiddleware: [
  //   // Will register redirect-ssl npm package
  //   // "redirect-ssl",

  //   // Will register file from project api directory to handle /api/* requires
  //   { path: "/github", handler: "~/server/index.ts" }
  // ],
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    "@nuxtjs/fontawesome",
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build"
  ],
  // fontawesome: {
  //   icons: ["fabGithub"]
  // },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // "nuxt-fontawesome",
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/google-fonts"
  ],
  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },
  googleFonts: {
    families: {
      "JetBrains+Mono": true,
      "Ubuntu+Mono": true
      // Lato: [100, 300],
      // Raleway: {
      //   wght: [100, 400],
      //   ital: [100]
      // }
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
};
