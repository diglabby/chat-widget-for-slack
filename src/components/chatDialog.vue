<template>
  <div ref="dialog" id="slackWidget-dialog" class="slackWidget-dialog" v-on:wheel="getHistory">

    <transition name="slide-fade">
      <loader id="slackWidget-dialog__loader" v-if="showLoader"></loader>
    </transition>

    <div class="slackWidget-dialog__container" v-if="connectionStatus">
        <ul class="slackWidget-dialog__list">
            <li v-for="item in messages" v-bind:class="{ 'slackWidget-message_user': item.isUser }" class="slackWidget-message">
              <div class="slackWidget-message__avatar">
                <img :src="item.avatar">
              </div>
              <div class="slackWidget-message_head">
                <span class="slackWidget-message__username">
                  {{item.username}}
                </span>
                <span class="slackWidget-message__time">
                  {{item.time}}
                </span>
              </div>
              <span class="slackWidget-message__text">
                {{item.text}}
              </span>
            </li>
        </ul>
    </div>

  </div>
</template>

<script>
import {utils} from '../helpers/utils.js'
import defaultAvatar from '../assets/defaultAvatar.png'
import {settingsManager} from '../helpers/settingsManager.js'
import loader from './loader.vue'
import PerfectScrollbar from 'perfect-scrollbar'

/** @module chatDialog  - contains functionality of chat message field  */
export default {
  name: 'chatDialog',

  components: {
    loader
  },

  props: [
    'webSocketInstance', // current web socket instance
    'connectionStatus', // is connection to server established?
    'workspaceData' // parsed data about Slack workspace
  ],

  data () {
    return {
      ps: null,
      showLoader: false,
      getHistoryIsBusy: false, // indicates getHistory ajax call ending
      toTop: true, // autoscroll direction
      messages: [], // all messages array
      uri: settingsManager.getProperty('requestHandlerPath'),
      count: settingsManager.getProperty('historyMessagesCount'),
      welcomeMessageTimeout: settingsManager.getProperty('welcomeMessageTimeout'),
      channel: settingsManager.getProperty('channel')
    }
  },

  watch: {
    getHistoryIsBusy: function (value) {
      this.getHistoryIsBusy = value
      this.showLoader = value
    }
  },

  methods: {

  /**
    * Push welcome message to all messages array
    * @method sendWelcomeMessage
    */
    sendWelcomeMessage: function () {
      let message = {}

      message.time = utils.formatTime((this.workspaceData.cache_ts))
      message.unformattedTime = this.workspaceData.cache_ts
      message.text = settingsManager.getProperty('welcomeMessage')
      message.username = settingsManager.getProperty('welcomeMessageUser')
      message.avatar = defaultAvatar
      message.isUser = false

      this.messages.push(message)
    },

    /**
    * Get username value from cookies
    * @method getUsername
    * @return {string} - username
    */
    getUsername: function () {
      return this.$cookie.get('slackWidgetName')
    },

    /**
    * Get username by user Slack id
    * @method getUsernameById
    * @param {string} id - user id
    * @param {Object} workspaceData - parsed slack workspace data
    * @return {string} - slack username
    */
    getUsernameById: function (id, workspaceData) {
      for (var userid in workspaceData.users) {
        if (workspaceData.users[userid].id == id) {
          return workspaceData.users[userid].name
        }
      }
    },

    /**
    * Get last messages from slack channel and add them to messages
    * @method getHistory
    * @param {Object} event - event descriptor
    */
    getHistory: function (event) {
      if ((this.$el.scrollTop == 0) && (event.deltaY < 0) && (!this.getHistoryIsBusy)) {
        this.getHistoryIsBusy = true

        var time = ''

        if (this.messages[0]) {
          time = this.messages[0].unformattedTime
        } else {
          time = (Date.now() / 1000.0)
        }

        var data = 'request=getHistory&count=' + this.count + '&latest=' + time + '&channel=' + this.channel

        var self = this

        // send ajax request
        setTimeout(function () {
          self.axios.post(self.uri, data).then(
            response => {
              if (response.data.messages) {
                for (var i = 0; i < response.data.messages.length; i++) {
                // put new message at start of messages array
                  self.getMessage(response.data.messages[i], self.workspaceData, false)
                  self.getHistoryIsBusy = false
                }
              }
            }
          )
            .catch(function (error) {
              console.log(error)
            })
        }, 1000)
      }
    },

    /**
    * Get user avatar by id
    * @method getAvatarById
    * @param {string} id - user id
    * @param {Object} workspaceData - parsed slack workspace data
    * @return {string} - avatar image url
    */
    getAvatarById: function (id, workspaceData) {
      for (var userid in workspaceData.users) {
        if (workspaceData.users[userid].id == id) {
          return workspaceData.users[userid].profile.image_48
        }
      }
    },

    /**
    * Create new message and push it to array of messsages
    * @method getMessage
    * @param {Object} data - data for new message
    * @param {number} data.ts - time stamp
    * @param {string} data.username - username
    * @param {string} data.text - message
    * @param {string} data.user - user id
    * @param {Object} workspaceData - parsed slack workspace data
    * @param {bool} [toTop=true] - indicates where new messages are placed in array(top = true, bottom = false)
    */
    getMessage: function (data, workspaceData, toTop) {
      let message = {}

      if (data.type == 'message' && data.subtype !== 'message_deleted') {
        message.time = utils.formatTime(data.ts)
        message.unformattedTime = data.ts
        message.text = data.text

        let username = this.getUsername()
        if (data.username) {
          message.username = data.username
          message.avatar = defaultAvatar
          message.isUser = (message.username == username)
        } else {
          message.username = this.getUsernameById(data.user, workspaceData)
          message.avatar = this.getAvatarById(data.user, workspaceData)
          message.isUser = false
        }

        if (toTop) {
          this.messages.push(message)
          this.toTop = true
        } else {
          this.messages.unshift(message)
          this.toTop = false
        }
      }
    },

    /**
    * Scroll chat to last message
    * @method scrollTop
    */
    scrollTop: function () {
      var elem = this.$el
      if (this.toTop) {
        elem.scrollTop = elem.scrollHeight
      }
    }
  },

  updated: function () {
    this.ps.update()
    this.scrollTop()
  },

  mounted: function () {
    var self = this

    setTimeout(function () {
      self.sendWelcomeMessage()
    }, self.welcomeMessageTimeout)

    // put new messages, recieved over websocket, to array of messages
    this.webSocketInstance.onmessage = function (event) {
      var msgData = JSON.parse(event.data)
      self.getMessage(msgData, self.workspaceData, true)
    }

    this.ps = new PerfectScrollbar(this.$refs.dialog, {
      wheelSpeed: 2,
      suppressScrollX: true,
      minScrollbarLength: 20,
      maxScrollbarLength: (this.$refs.dialog.clientHeight / 2)
    })
    this.scrollTop()
  }
}
</script>

<style>
  .ps {
    overflow: hidden !important;
    overflow-anchor: none;
    -ms-overflow-style: none;
    touch-action: auto;
    -ms-touch-action: auto;
  }

  @supports (-ms-overflow-style: none) {
    .ps {
      overflow: auto !important;
    }
  }

  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .ps {
      overflow: auto !important;
    }
  }

  .ps__rail-y {
    display: block;
    width: 2px;
    right: 2px !important;
    background: rgba(100, 221, 23, 0.8);
    position: absolute;
  }

  .ps__thumb-y {
    background-color: #aaa;
    border-radius: 6px;
    transition: background-color .2s linear, width .2s ease-in-out;
    -webkit-transition: background-color .2s linear, width .2s ease-in-out;
    width: 8px;
    right: -3px;
    background: rgba(100, 221, 23, 0.8);
    border-radius: 1px;
    position: absolute;
    &:hover {
      opacity: 0.6;
    }
  }

  .slackWidget-dialog.ps .ps__rail-x,
  .slackWidget-dialog.ps .ps__rail-y {
    background: rgba(100, 221, 23, 0.8);
    display: block;
  }
</style>
<style lang="scss" scoped>

  @import "../scss/global.scss";

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .slackWidget-dialog {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 54%;

    background-color: white;
    background: url("../assets/chatbg.png") center center no-repeat;
    background-size: contain;
    overflow-x: hidden;
    overflow-y: scroll;
    flex-grow: 1;
  }

  .slackWidget-dialog.ps {
    overflow: hidden !important;
    overflow-anchor: none;
    -ms-overflow-style: none;
    touch-action: auto;
    -ms-touch-action: auto;
  }

  @supports (-ms-overflow-style: none) {
    .slackWidget-dialog.ps {
      overflow: auto !important;
    }
  }

  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .slackWidget-dialog.ps {
      overflow: auto !important;
    }
  }

  .slackWidget-dialog__container {
    height: calc(100% + 1px);
  }

  .slackWidget-dialog__list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding-top: 15px;
  }

  .slackWidget-message {
    position: relative;
    display: flex;
    flex-direction: column;
    align-self: flex-start;

    margin-left: 45px;

    border-radius: $angleRadius;
    padding: 7px;
    width: 70%;

    background-color: $mainColor;
    word-break: break-word;
    margin: 15px 0 10px 35px;

    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

    &_head {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      margin-bottom: 13px;
      margin-top: -3px;

      overflow:hidden;
      padding-left: 25px;
    }

    &__avatar {
      position: absolute;

      width: $elementsWidth;
      height: $elementsHeight;

      top: -15px;
      left: -20px;

      background-color: $mainColor;

      padding: $elementsPadding;

      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
      border-radius: 50%;

      img {
        border-radius: 50%;
        width: 100%;
        height: auto;
      }
    }

    &__username {
      font-size: $mainFontSize;
      font-family: $mainFont;

      font-weight: bold;
      color: $mainFontColor;
    }

    &__time {
      font-size: 11px;
      font-family: $secondaryFont;
      font-weight: bold;
      color: $mainFontColor;
    }

    &__text {
      font-size:$mainFontSize;
      font-family: $mainFont;
      font-weight: 400;
      color: $mainFontColor;
      word-wrap: break-word;
    }
  }

  .slackWidget-message.slackWidget-message_user {

    .slackWidget-message__avatar {
      right: -20px;
      left: auto;
    }

    .slackWidget-message_head {
      flex-direction: row-reverse;
      padding-right: 25px;
      padding-left: 0px;
    }

    .slackWidget-message__text {
      text-align: left;
    }

    margin-right: 35px;
    align-self: flex-end;
  }

  #slackWidget-dialog__loader {
    height: 20px;
    top: 2px;
    left: 0;
    z-index: 2;
    background-color: transparent;
    background-size: auto 100%;
  }
</style>
