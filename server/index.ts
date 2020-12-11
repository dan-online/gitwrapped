// import passport from "passport";
// import { Strategy } from "passport-github2";
// import { Router } from "express";
// import bodyParser from "body-parser";
// import session from "express-session";

// const app = Router();
// const GITHUB_CLIENT_ID = process.env.CLIENT_ID || "";
// const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET || "";

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// app.use(
//   session({
//     secret: "BUBUebsuUHEUhusbUEushuSHuEYFIOALKOEpZKONEJvecxtZDYHUIJEKME",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   })
// );

// passport.use(
//   new Strategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/github/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       process.nextTick(function() {
//         return done(null, profile);
//       });
//     }
//   )
// );

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.session());

// app.get(
//   "/callback",
//   function(req, res, next) {
//     console.log(req.session, req.query.code);
//     next();
//     // res.redirect("/");
//   }
//   // passport.authenticate("github", {
//   //   failureRedirect: "/login",
//   //   successRedirect: "/testy"
//   // })
// );

// app.get("/", passport.authenticate("github", { scope: ["user:email"] }));

// export default app;
