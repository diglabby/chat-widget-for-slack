<template>
  <div class="slackWidget-header">
    <div class="slackWidget-header__title"> {{ title }} </div>
    <div class="slackWidget-header__logo">
      <img class="slackWidget-logo" src="../assets/logo.png">
    </div>
    <div class="slackWidget-header__subtitle"> {{ subtitle }} </div>
  </div>
</template>

<script>

import {settingsManager} from "../helpers/settingsManager.js"

/** @module chatHeader - chat header component */
export default {

  name: 'chatHeader',

  data () {
    return {
      title: settingsManager.getProperty("title"),
      subtitle: settingsManager.getProperty("subtitle"),
      logo: this.loadLogo(settingsManager.getProperty("logo"))
    }
  },

  methods: {

  /**
    * Check if logo image exists
    * @method loadLogo
    * @param {string} src - logo path
    * @return {string} image path, or 0 if path doesn't exist
    */
    loadLogo: function(src) {
      var image = new Image(src);

      image.onload = function() {
        return src;
      }

      image.onerror = function() {
        return 0;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .slackWidget-header-container{
    width: 100%;
    height: 25%;
    border-bottom: 1px solid #a6cc0c;
    position: relative;
    padding: 15px 0;
  }

  .slackWidget-logo {
    width: 100%;
    height: auto;
  }

  .slackWidget-header {

    display: flex;
    min-height: 130px;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    border-bottom: 1px solid #7b7b7b;

    &__logo {
      width: 50px;
      height: 50px;
      padding: 5px;
    }

    &__title {
      font-size: 16px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 500;
    }

    &__subtitle {
      font-size: 16px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 500;
    }
  }
</style>
