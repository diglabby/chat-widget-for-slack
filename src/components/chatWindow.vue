<template>
  <div class="slackChatWidget-container" v-bind:style="{ height: style.height + 'px', width: style.width + 'px' }">

    <div class="slackChatWidget__close" v-on:click="closeChat"></div>

    <div class="chatWindow">
      <chatHeader>
      </chatHeader>

      <chatDialog :webSocketInstance='webSocketInstance' :connectionStatus='connectionStatus' :workspaceData='workspaceData' v-if="showDialog">
      </chatDialog>
      <chatInput v-if="showInput">
      </chatInput>
      <chatOffline v-if="showOffline">
      </chatOffline>
      <loader class="slackChatWidget__loader" v-if="showLoader">
      </loader>

    </div>

  </div>
</template>

<script>

import chatHeader from './chatHeader.vue'
import chatDialog from './chatDialog.vue'
import chatInput from './chatInput.vue'
import chatOffline from './chatOffline.vue'
import loader from './loader.vue'
import {settingsManager} from '../helpers/settingsManager.js'

/** @module chatWindow  - contains functionality of main chat window  */
export default {

  name: 'chatWindow',

  components: {
    chatHeader,
    chatDialog,
    chatInput,
    chatOffline,
    loader
  },

  data () {
    return {
      channel: settingsManager.getProperty('channel'),
      uri: settingsManager.getProperty('requestHandlerPath'),
      showDialog: false,
      showInput: false,
      showOffline: false,
      showLoader: true,
      connectionStatus: 'false',
      webSocketInstance: '',
      workspaceData: '', // parsed data about workspace
      style: {
        height: settingsManager.getProperty('windowHeight'),
        width: settingsManager.getProperty('windowWidth'),
        bottom: settingsManager.getProperty('windowBottomMargin'),
        right: settingsManager.getProperty('windowRightMargin')
      }
    }
  },

  methods: {

  /**
    * Creates new socket instance, establish Connection with Slack
    * @method createSocket
    */
    createSocket: function () {
      var req = this.axios.post(this.uri, 'request=createSocket')
        .then(
          response => {
            if (response.data.url) {
              this.webSocketInstance = new WebSocket(response.data.url)
              this.workspaceData = response.data
            } else {
              this.setToOfflineMode()
            }
          },
          error => {
            this.setToOfflineMode()
            console.log(error)
          }
        )

      // check if some users in channel online
      req.then(this.isSomeOnline)
    },

    /**
    * Render only online mode components(chatHeader, chatDialog, chatInput)
    * @method setToOnlineMode
    */
    setToOnlineMode: function () {
      this.connectionStatus = true
      this.showDialog = this.connectionStatus
      this.showInput = this.connectionStatus
      this.showOffline = !this.connectionStatus
    },

    /**
    * Render only offine mode components(chatHeader, chatOffline)
    * @method setToOnlineMode
    */
    setToOfflineMode: function () {
      this.connectionStatus = false
      this.showDialog = this.connectionStatus
      this.showInput = this.connectionStatus
      this.showOffline = !this.connectionStatus
    },

    /**
    * Get users statuses from Slack and check active status
    * @method isSomeOnline
    */
    isSomeOnline: function () {
      var self = this

      this.axios.post(this.uri, 'request=getUsers')
        .then(
          function (response) {
            var users = response.data.members

            let channelList = self.workspaceData.channels
            var resultChannel = ''

            if (channelList) {
              resultChannel = channelList.filter(function (obj) {
                return obj.id == self.channel
              })
              if (resultChannel.length !== 0) {
                var members = resultChannel[0].members

                function isOnline (userId) {
                  var onlineUser = users.filter(function (obj) {
                    return ((obj.id == userId) &&
                    (obj.presence == 'active') && (obj.is_bot !== true))
                  })

                  return onlineUser.length
                }

                if (members.some(isOnline)) {
                  self.setToOnlineMode()
                } else {
                  self.setToOfflineMode()
                }
              } else {
                self.setToOfflineMode()
              }
            } else {
              self.setToOfflineMode()
            }
            self.showLoader = false
          },
          error => {
            self.setToOfflineMode()
            console.log(error)
            self.showLoader = false
          }
        )
    },

    /**
    * Pass close chat event to parent container
    * @method closeChat
    */
    closeChat: function () {
      this.$emit('hide')
    }
  },

  mounted: function () {
    this.createSocket()
    var self = this
    // set window draggable and resizable
    $('.slackChatWidget-container').resizable({
      handles: 'n, e, s, w, ne, nw',
      ghost: true,
      maxHeight: '100vh',
      maxWidth: '100vw',
      minHeight: '300px',
      minWidth: '200px'
    })

    $('.slackChatWidget-container').draggable({
      handle: '.slackWidget-header'
    })
  }

}
</script>

<style lang="scss" scoped>
  @import "../scss/global.scss";
  @import '../assets/css/normalize.css';

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .slackChatWidget {

    &-container {
      position: fixed;

      height: 510px;
      width: 370px;

      bottom: 100px;
      right: 100px;

      border-radius: $angleRadius;
      background-color: $thirdColor;

      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;

      overflow: hidden;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    &__close {
      position: absolute;

      width: 25px;
      height: 25px;

      right: 0px;
      top: 0px;

      z-index: 999;
      padding: 5px;

      background: url("../assets/close_chat.png") center center no-repeat;
      background-size: 60%;

      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: rotate(90deg);
        transition: transform 0.2s;
      }
    }
  }

  .chatWindow {

      position: relative;

      width: 100%;
      height: 100%;

      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      overflow: hidden;

  }

  .ui-resizable {
    &-n {
      width: 30px;
      left: -20px;
    }
    &-w {
      width: 30px;
      left: -20px;
    }
    &-e {
      width: 30px;
      left: -20px;
    }
    &-s {
      width: 30px;
      left: -20px;
    }
  }

</style>
