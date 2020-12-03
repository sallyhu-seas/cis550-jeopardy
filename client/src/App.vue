<template>
  <div id="app" v-loading="isLoading">
    <notifications></notifications>
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>
