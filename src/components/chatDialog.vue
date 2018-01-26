<template>
  <div id="slackWidget-dialog" class="slackWidget-dialog" v-on:wheel="getHistory">
    <div class="slackWidget-dialog__container" v-if="connectionStatus">
        <ul class="slackWidget-dialog__list">
            <li v-for="item in messages" v-bind:class="{ 'slackWidget-message_user': item.isUser }" class="slackWidget-message">
              <img class="slackWidget-message__avatar" :src="item.avatar">
              <span class="slackWidget-message__username">
                {{item.username}}
              </span>
              <span class="slackWidget-message__time">
                {{item.time}}
              </span>
              <span class="slackWidget-message__text">
                {{item.text}}
              </span>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import {utils} from "../helpers/utils.js"
import defaultAvatar from "../assets/defaultAvatar.png"
import {settingsManager} from "../helpers/settingsManager.js"

/** @module chatDialog  - contains functionality of chat message field  */
export default {
  name: 'chatDialog',

  props: [
    'webSocketInstance', // current web socket instance
    'connectionStatus', // is connection to server established?
    'workspaceData' //parsed data about Slack workspace
  ],

  data () {
    return {
      getHistoryIsBusy: false, //indicates getHistory ajax call ending
      toTop: true, //autoscroll direction
      messages: [], //all messages array
      uri: settingsManager.getProperty("requestHandlerPath"),
      count: settingsManager.getProperty("historyMessagesCount"),
      welcomeMessageTimeout: settingsManager.getProperty("welcomeMessageTimeout"),
      channel: settingsManager.getProperty("channel")
    }
  },

  methods: {

  /**
    * Push welcome message to all messages array
    * @method sendWelcomeMessage
    */
    sendWelcomeMessage: function() {

      let message = {};

      message.time = utils.formatTime((this.workspaceData.cache_ts));
      message.unformattedTime = this.workspaceData.cache_ts;
      message.text = settingsManager.getProperty("welcomeMessage");
      message.username = settingsManager.getProperty("welcomeMessageUser");;
      message.avatar = defaultAvatar;
      message.isUser = false;

      this.messages.push(message);
    },

  /**
    * Get username value from cookies
    * @method getUsername
    * @return {string} - username
    */
    getUsername: function() {
      return this.$cookie.get('slackWidgetName');
    },

  /**
    * Get username by user Slack id
    * @method getUsernameById
    * @param {string} id - user id
    * @param {Object} workspaceData - parsed slack workspace data
    * @return {string} - slack username
    */
    getUsernameById: function(id, workspaceData) {
      for( var userid in workspaceData.users ){
        if( workspaceData.users[userid].id == id ){
          return workspaceData.users[userid].name ;
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
          this.getHistoryIsBusy = true;

          var time = "";

          if(this.messages[0]) {
            time = this.messages[0].unformattedTime;
          }
          else {
            time = (Date.now() / 1000.0);
          }

          var data = 'request=getHistory&count='  + this.count + "&latest=" + time + '&channel=' + this.channel;

          var self = this;

          //send ajax request
          setTimeout(function() {
            self.axios.post(self.uri, data).then(
              response => {
                if(response.data.messages)
                  for(var i = 0; i < response.data.messages.length; i++) {

                    //put new message at start of messages array
                    self.getMessage(response.data.messages[i], self.workspaceData, false);
                    self.getHistoryIsBusy = false;
                  }
              }
            )
            .catch(function (error) {
              console.log(error);
            });
          }, 1000);
      }
    },

  /**
    * Get user avatar by id
    * @method getAvatarById
    * @param {string} id - user id
    * @param {Object} workspaceData - parsed slack workspace data
    * @return {string} - avatar image url
    */
    getAvatarById: function(id, workspaceData) {
      for( var userid in workspaceData.users ){
        if( workspaceData.users[userid].id == id ){
          return workspaceData.users[userid].profile.image_48;
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
    getMessage: function(data, workspaceData, toTop) {

      let message = {};

      if(data.type == "message") {
        message.time = utils.formatTime(data.ts);
        message.unformattedTime = data.ts;
        message.text = data.text;

        let username = this.getUsername();
        if(data.username) {
          message.username = data.username;
          message.avatar = defaultAvatar;
          message.isUser = (message.username == username);
        }
        else {
          message.username = this.getUsernameById(data.user, workspaceData);
          message.avatar = this.getAvatarById(data.user, workspaceData);
          message.isUser = false;
        }

        if(toTop) {
          this.messages.push(message);
          this.toTop = true;
        }
        else {
          this.messages.unshift(message);
          this.toTop = false;
        }

      }
    },

  /**
    * Scroll chat to last message
    * @method scrollTop
    */
    scrollTop: function() {
      var elem = this.$el;
      if(this.toTop) {
        elem.scrollTop = elem.scrollHeight;
      }
    }
  },

  updated: function () {
    this.scrollTop();
  },

  mounted: function () {
    var self = this;

    setTimeout(function(){
        self.sendWelcomeMessage();
    }, self.welcomeMessageTimeout);

    //put new messages, recieved over websocket, to array of messages
    this.webSocketInstance.onmessage = function(event) {
      var msgData = JSON.parse(event.data);
      self.getMessage(msgData, self.workspaceData, true);
    }
  }
}
</script>

<style lang="scss" scoped>

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .slackWidget-dialog {
    width: 100%;
    height: 54%;
    padding: 0 10px;
    background-color: white;
    background: url("../assets/chatbg.png") center center no-repeat;
    background-size: contain;
    overflow-x: hidden;
    overflow-y: scroll;
    flex-grow: 1;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: green;
      border: 4px solid transparent;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(200, 200, 200, 0.9);
      height: 10px;
    }
  }

  .slackWidget-dialog__container {
    height: calc(100% + 1px);
  }

  .slackWidget-dialog__list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .slackWidget-message {
    display: flex;
    flex-direction: column;
    margin-left: 45px;
    border: 1px solid green;
    border-radius: 4px;
    padding: 5px;
    width: 70%;
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
    word-break: break-word;
    margin: 10px 0 10px 35px;
    align-self: flex-start;

    &__avatar {
      width: 30px;
      height: 30px;
      background-color: green;
      top: 0;
      left: -35px;
      border-radius: 4px;
      position: absolute;
    }

    &__username {
      font-size: 10px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 700;
    }

    &__time {
      font-size: 10px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
      padding: 5px 0;
    }

    &__text {
      font-size: 14px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
    }
  }

  .slackWidget-message.slackWidget-message_user {

    .slackWidget-message__avatar {
      right: -35px;
      left: auto;
    }

    margin-right: 30px;
    align-self: flex-end;
  }
</style>
