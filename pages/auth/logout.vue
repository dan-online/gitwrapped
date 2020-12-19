<template>
  <h1>You have been logged out!</h1>
</template>

<script>
export default {
  middleware({store, redirect}) {
    return redirect("/"); 
  }
};
</script>

<style></style>
