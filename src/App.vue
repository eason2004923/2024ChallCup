<template>
  <div id="app">
    <router-view></router-view>
    <index></index>
  </div>
</template>

<script>
import index from './views/index.vue'
export default {}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
