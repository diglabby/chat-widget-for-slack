<template>
  <transition name="slide-fade">
    <div class="slackWidget-loader">
    </div>
  </transition>
</template>

<script>
/** @module loader - loading effect */
export default {
  name: 'loader'
}
</script>

<style lang="scss" scoped>

  .slackWidget-loader{
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    background: url('../assets/load.gif') center 60% no-repeat;
    background-color: transparent;
    transition: all .5s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: scale(0.2);
    opacity: 0;
  }
</style>
