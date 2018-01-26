<template>
  <div>
      <transition name="slide-fade">
        <chatWindow v-if="showWindow" v-on:hide="hideWidget" v-bind:class=" { 'slackWidgetStarter-hide': hideWindow}"></chatWindow>
      </transition>
      <transition name="slide-fade">
        <div id="slackWidgetStarter-button" v-if="showButton" v-on:click="showWidget">
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
      hideWindow: false
    }
  },

  methods: {

  /**
    * Show chat window
    * @method showWidget
    */
    showWidget: function () {
      this.showWindow = true;
      this.hideWindow = false;
      this.showButton = false;
    },

  /**
    * Hide chat window
    * @method hideWidget
    */
    hideWidget: function () {
      this.hideWindow = true;
      this.showButton = true;
    }
  },

  mounted: function() {
    var self = this;

    //show widget with timeout

    setTimeout(function() {
      self.showWidget();
    }, settingsManager.getProperty('openChatTimeout'));
  }
}
</script>

<style lang="scss" scoped>

  .slackWidgetStarter-hide {
    visibility: hidden !important;
  }

  #slackWidgetStarter-button {
    overflow: hidden;
    width: 100px;
    height: 100px;
    position: fixed;
    bottom: 100px;
    right: 100px;
    background: url('assets/button.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    transition: all 0.5s ease;
  }

  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: all 1.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
