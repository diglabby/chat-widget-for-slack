<template>
  <div class="slackWidget-input">
    <form class="slackWidget-input__form" v-on:submit.prevent="onSubmit">

      <input class="slackWidget-input__username"
        v-if="usernameInputingMode"
        v-bind:class="{ 'slackWidget-input_error': hasError }"
        v-model="username"
        v-bind:placeholder="placeholderUsername"
      >

      <textarea ref="messageField" class="slackWidget-input__message"
        v-else
        v-bind:class="{ 'slackWidget-input_error': hasError }"
        v-model="message"
        v-bind:placeholder="placeholderMessage"
        v-bind:maxlength="maxCharacterCount"
        v-on:input="onInput">
      </textarea>

      <button class="slackWidget-input__submit" type="submit"></button>
    </form>
  </div>
</template>

<script>

import {settingsManager} from "../helpers/settingsManager.js";
const autosize = require('autosize');

/** @module chatInput - contains functionality of chat input messages component  */
export default {

  name: 'chatInput',

  data () {
    return {
      placeholderMessage: settingsManager.getProperty("inputMessagePlaceholder"),
      placeholderUsername: settingsManager.getProperty("inputNamePlaceholder"),
      usernameInputingMode: false, //is user input message or name?
      maxCharacterCount: 500, //number of maximum charecters in message
      username: "",
      message: "",
      uri: settingsManager.getProperty("requestHandlerPath"),
      hasError: false,
      channel: settingsManager.getProperty("channel"),
    }
  },

  computed: {

  /**
    * Clear message(trimming spaces)
    * @method clearedMessage
    * @return {string} - cleared message
    */
    clearedMessage: function () {
      return this.message.trim();
    },

  /**
    * Clear username(trimming spaces)
    * @method clearedUsername
    * @return {string} - cleared username
    */
    clearedUsername: function () {
      return this.username.trim();
    }

  },

  methods: {

  /**
    * Get username value from cookies
    * @method getUsername
    * @return {string} - username
    */
    getUsername: function() {
      return this.$cookie.get('slackWidgetName');
    },

  /**
    * Set username value in cookies(expired time 99999)    *
    * @method setUsername
    */
    setUsername: function() {
      if(this.usernameInputingMode) {
        if(this.clearedUsername) {
          this.$cookie.set('slackWidgetName', this.clearedUsername, 99999);
          this.usernameInputingMode = false;
          this.hasError = false;
        }
        else {
          this.hasError = true;
        }
      }
    },

  /**
    * Get saved massage from cookies
    * @method getMessage
    * @return {string} - message
    */
    getMessage: function() {
      return this.$cookie.get('slackWidgetMessage');
    },

  /**
    * Save massage in cookies
    * @method setMessage
    * @param {string} message - input message
    */
    setMessage: function(message) {
      this.$cookie.set('slackWidgetMessage', message, 99999);
    },

  /**
    * Clear all input fields
    * @method clearFields
    */
    clearFields: function() {
      this.message = "";      
    },

  /**
    * Wrap axios ajax calls
    * @method sendAjaxMessage
    * @param {string} uri - request url
    * @param {string} data - sending data
    */
    sendAjaxMessage(uri, data) {
      this.axios.post(uri, data).then(function (response) {        
      })
      .catch(function (error) {
        console.log(error);
      });
    },

  /**
    * Handle input event from text field and stores message to cookies
    * @method onInput
    */
    onInput: function () {
      this.setMessage(this.clearedMessage);
    },

  /**
    * Handle form submit event and send data to server
    * @method onSubmit
    */
    onSubmit: function () {

      this.setUsername();
      this.message = this.getMessage();

      if(this.message) {

        if(this.clearedUsername) {
          // send data
          let data = 'request=sendMessage&text='  + this.message +'&username=' + this.clearedUsername + '&channel=' + this.channel;
          this.sendAjaxMessage(this.uri, data);

          //clear message cookies
          this.setMessage('');

          this.clearFields();

          //disable error message
          this.hasError = false;
        }
        else {
          this.usernameInputingMode = true;
        }
      }
      else {
        this.hasError = true;
      }
    }
  },

  mounted: function () {
    //set initial values
    this.username = this.getUsername();
    if(!this.username)
        this.username = "";
    
    this.message = this.getMessage();
    if(!this.message)
         this.message = "";

    //attach autosize to message field
    autosize(this.$refs.messageField);
  },

  updated:  function () {
    autosize(this.$refs.messageField);
    //autosize.update(this.$refs.messageField);
  }
}
</script>

<style lang="scss" scoped>
  .slackWidget-input {
    width: 100%;
    height: auto;
    border-top: 1px solid #7b7b7b;
    position: relative;

    &__form {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: nowrap;
      padding: 10px 10px;
      resize: none;
      overflow: hidden;
    }

    &__message, &__username {
      font-size: 14px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
      color: #555;
      width: 100%;
      border: 1px solid #999;
      border-radius: 2px;
      outline: none;
      height: auto;
      padding: 5px 10px;
      overflow-y: visible;

      &::placeholder {
        color: #555;
      }

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

    &_error {
      border: 2px solid red;
    }

    &__submit {
      font-size: 16px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 500;
      border: none;
      outline: none;
      background: url('../assets/send.png') top center no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      margin-left: 7px;
    }
  }
</style>
