export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  server: {
    port: process.env.NODE_ENV == "production" ? 4000 : 3000,
    host: "localhost"
  },
  head: {
    htmlAttrs: {
      lang: "en"
    },
    title: "GitWrapped",
    meta: [
      { name: "title", content: "GitWrapped - Home" },
      {
        name: "description",
        content:
          "Hey there and welcome to GitWrapped. This website allows you to view the statistics of your Github profile over the years, the amount of lines you wrote, how many pull requests you closed and more! Compare stats with your friends and show off on social media with our widgets!"
      },

      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gitwrapped.dev" },
      { property: "og:title", content: "GitWrapped - Home" },
      {
        property: "og:description",
        content:
          "Hey there and welcome to GitWrapped. This website allows you to view the statistics of your Github profile over the years, the amount of lines you wrote, how many pull requests you closed and more! Compare stats with your friends and show off on social media with our widgets!"
      },
      {
        property: "og:image",
        content: "https://gitwrapped.dev/logo-256.png"
      },

      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:url", content: "https://gitwrapped.dev" },
      { property: "twitter:title", content: "GitWrapped - Home" },
      {
        property: "twitter:description",
        content:
          "Hey there and welcome to GitWrapped. This website allows you to view the statistics of your Github profile over the years, the amount of lines you wrote, how many pull requests you closed and more! Compare stats with your friends and show off on social media with our widgets!"
      },
      {
        property: "twitter:image",
        content: "https://gitwrapped.dev/logo-256.png"
      },

      // { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
      // {
      //   hid: "description",
      //   name: "description",
      //   content:
      //     "Hey there and welcome to GitWrapped. This website allows you to view the statistics of your Github profile over the years, the amount of lines you wrote, how many pull requests you closed and more! Compare stats with your friends and show off on social media with our widgets!"
      // }
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/logo-64.png" },
      { rel: "shortcut icon", type: "image/png", href: "/logo-64.png" }
    ]
  },
  loading: {
    color: "var(--#3500d3)",
    height: "5px"
  },
  auth: {
    redirect: {
      callback: "/auth/welcome",
      home: "/dashboard"
      // logout: "/auth/logout"
      // login: "/"
    },
    // watchLoggedIn: false,
    rewriteRedirects: false,
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
    "@nuxtjs/google-fonts",
    "@nuxtjs/sentry"
  ],
  bootstrapVue: {
    bootstrapCSS: true,
    bootstrapVueCSS: false,
    icons: false
  },
  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },
  sentry: {
    dsn:
      "https://16bc32df16e24e0d807596bf25278cbf@o193439.ingest.sentry.io/5580600", // Enter your project's DSN here
    config: {
      lazy: true
    } // Additional config
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
