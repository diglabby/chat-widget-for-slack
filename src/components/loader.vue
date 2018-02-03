<template>
  <div class="slackWidget-loader">
  </div>
</template>

<script>
/** @module loader - loading effect */
export default {
  name: 'loader'
}
</script>

<style lang="scss" scoped>
  .slackWidget-loader{
    width: 100%;
    height: 100%;
    background: url('../assets/load.gif') center center no-repeat;
  }

</style>
