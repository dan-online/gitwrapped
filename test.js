const GitWrapped = new Website();
const githubProfile = GitWrapped.get(user);
githubProfile.getAllInfo().then(() => {
  createDashboard();
  // Check out your GitWrapped profile by logging in!
});
