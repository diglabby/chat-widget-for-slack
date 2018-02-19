<template>
  <div>

      <transition name="slide-fade">
        <chatWindow id="slackWidget__window"
          v-if="showWindow"
          v-on:hide="hideWidget"
          v-bind:class="{ 'slackWidget__window_hide' : hideWindow }"
          v-bind:style="{ bottom: bottom + 'px', right: right + 'px' }"
        >
        </chatWindow>
      </transition>

      <transition name="slide-fade">
        <div id="slackWidget__button"
          v-if="showButton"
          v-on:click="showWidget"
          v-bind:style="{ bottom: bottom + 'px', right: right + 'px' }"
        >
        </div>
      </transition>

  </div>
</template>

<script>

import chatWindow from './components/chatWindow.vue'
import {settingsManager} from './helpers/settingsManager.js'

/** @module App  - main chat module  */
export default {

  name: 'App',

  components: {
    chatWindow
  },

  data () {
    return {
      showWindow: false,
      showButton: true,
      hideWindow: false,
      bottom: settingsManager.getProperty('windowBottomMargin'),
      right: settingsManager.getProperty('windowRightMargin')
    }
  },

  methods: {

  /**
    * Show chat window
    * @method showWidget
    */
    showWidget: function () {
      this.showWindow = true
      this.hideWindow = false
      this.showButton = false
    },

    /**
    * Hide chat window
    * @method hideWidget
    */
    hideWidget: function () {
      this.hideWindow = true
      this.showButton = true
    }
  },

  mounted: function () {
    var self = this

    // show widget with timeout

    setTimeout(function () {
      self.showWidget()
    }, settingsManager.getProperty('openChatTimeout'))
  }
}

</script>

<style lang="scss" scoped>

  @import "./scss/global.scss";

  .slackWidget__window_hide {
    transform: scale(0.2);
    opacity: 0;
  }

  #slackWidget__window {
    transition: transform 0.4s ease-in-out,
                opacity 0.4s ease-in-out;
    z-index: 9999999;
  }

  #slackWidget__button {
    position: fixed;
    box-sizing: border-box;

    width: 80px;
    height: 80px;

    bottom: 100px;
    right: 100px;

    padding: 5px;
    overflow: hidden;

    background: url('assets/button.png') 40% center no-repeat;
    background-size: 70% 70%;
    background-color: $thirdColor;
    cursor: pointer;

    border-radius: 50%;
    border: 4px solid $mainColor;

    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    transition: transform 0.5s ease;
    z-index: 9999999;
    &:hover {
      transform: scale(1.1);
      transition: transform 0.4s ease-in-out;
    }
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: scale(0.2);
    opacity: 0;
  }

</style>
