<template>
  <div class="slackWidget-offline">
    <form class="slackWidget-offline__form" v-on:submit.prevent="onSubmit" v-if="showForm">
      <p class="slackWidget-offline__title"> {{titleMessage}}</p>

      <textarea ref="messageField" class="slackWidget-offline__message"
        v-bind:class="{ 'slackWidget-offline_error': hasError }"
        v-model="message"
        v-bind:placeholder="placeholderMessage"
        v-bind:maxlength="maxCharacterCount"
        v-on:input="onInput"
      >
      </textarea>

      <div class="slackWidget-offline__form_wrapper">
        <input class="slackWidget-offline__email"
          v-bind:class="{ 'slackWidget-offline_error': hasError }"
          v-model="email"
          v-bind:placeholder="placeholderEmail"
        >
        <button class="slackWidget-offline__submit" type="submit"></button>
      </div>
    </form>
    <div v-else class="slackWidget-offline__resultMessage">
      <p>{{ resultMessage }}</p>
    </div>
  </div>
</template>

<script>

import {settingsManager} from "../helpers/settingsManager.js";
const autosize = require('autosize');

/** @module chatOffline  - contains functionality of chat window when all users is offline  */
export default {

  name: 'chatOffline',

  data () {
    return {
      placeholderMessage: settingsManager.getProperty("inputMessagePlaceholder"),
      placeholderEmail: settingsManager.getProperty("emailPlaceholder"),
      titleMessage: settingsManager.getProperty("emailFormTitle"),
      showForm: true,
      isSent: false,
      email: "",
      emailTo: settingsManager.getProperty("email"),

      maxCharacterCount: 500,
      message: "",
      uri: settingsManager.getProperty("requestHandlerPath"),
      hasError: false
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
      * Clear email(trimming spaces)
      * @method clearedEmail
      * @return {string} - cleared email
      */
      clearedEmail: function () {
        return this.email.trim();
      },

    /**
      * Return message that printed after message sending
      * @method resultMessage
      * @return {string} - result message
      */
      resultMessage: function () {
        if(this.isSent) {
          return settingsManager.getProperty("emailSend");
        }
        else {
          return settingsManager.getProperty("emailNotSend");
        }
      }
  },

  methods: {

  /**
    * Get Email value from cookies
    * @method getEmail
    * @return {string} - Email
    */
    getEmail: function() {
      return this.$cookie.get('slackWidgetEmail');
    },

  /**
    * Set Email value in cookies(expired time 99999)    *
    * @method setEmail
    */
    setEmail: function() {
      this.$cookie.set('slackWidgetEmail', this.clearedEmail, 99999);
      this.email = this.clearedEmail;
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
    * @method clearFields   *
    */
    clearFields: function() {
      this.message = "";
      this.email = "";
    },

  /**
    * Wrap axios ajax calls
    * @method sendAjaxMessage
    * @param {string} uri - request url
    * @param {string} data - sending data
    */
    sendAjaxMessage(uri, data) {
      var self = this;
      this.axios.post(uri, data).then(function (response) {
        self.isSent = true;
      })
      .catch(function (error) {
        self.isSent = false;
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
    onSubmit: function (event) {

      this.message = this.getMessage();

      if(this.message) {
        if(this.clearedEmail) {
          // send data
          let data = 'request=sendEmail&message=' + this.message +'&email=' + this.clearedEmail + '&emailto=' + this.emailTo;
          this.sendAjaxMessage(this.uri, data);

          //clear message cookies
          this.setMessage('');

          this.hasError = false;
          this.clearFields();
          this.showForm = false;
        }
        else {
          this.hasError = true;
        }

        this.hasError = false;
      }
      else {
        this.hasError = true;
      }
    }
  },

  mounted: function () {
    //set initial values
    this.email = this.getEmail();
    this.message = this.getMessage();

    //attach autosize to message field
    autosize(this.$refs.messageField);
  },

  updated:  function () {
    autosize.update(this.$refs.messageField);
  }
}
</script>

<style lang="scss" scoped>

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .slackWidget-offline__resultMessage {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 5px 10px;
    resize: none;
    overflow: hidden;
    align-items: center;
    height: 100%;
    width: 100%;
    justify-content: center;
    p {
      text-align: center;
    }
  }

  .slackWidget-offline {
    width: 100%;
    height: 54%;
    padding: 0 10px;
    background-color: white;
    background: url("../assets/chatbg.png") center center no-repeat;
    background-size: contain;
    overflow-x: hidden;
    overflow-y: auto;
    flex-grow: 1;
    position: relative;

    &__form {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      flex-wrap: nowrap;
      padding: 5px 10px;
      resize: none;
      overflow: hidden;
      align-items: center;
      height: 100%;
      justify-content: space-evenly;

      &_wrapper {
        width: 100%;
        display: flex;
      }
    }

    &__title {
      font-size: 14px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
      color: #555;
      width: 80%;
      outline: none;
      height: auto;
      padding: 5px 0px;
      overflow: visible;
      text-align:center;
    }

    &__message {
      font-size: 14px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
      color: #555;
      width: 100%;
      outline: none;
      height: auto;
      padding: 5px 10px;
      max-height: 200px;
      background: transparent;

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

    &__email {
      font-size: 14px;
      font-family: "Ubuntu", sans-serif;
      font-weight: 400;
      color: #555;
      outline: none;
      float: left;
      width: 100%;
      padding: 5px 10px;
      overflow: visible;
      outline:none;
      border: 1px solid rgb(169, 169, 169);
      background: transparent;
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
