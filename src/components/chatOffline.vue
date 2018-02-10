<template>
  <div class="slackWidget-offline">
    <form class="slackWidget-offline__form" v-on:submit.prevent="onSubmit" v-if="showForm">
      <p class="slackWidget-offline__title"> {{titleMessage}}</p>
      <div class="group">
        <div ref="scroll" class="slackWidget-offline__scroll">
          <textarea ref="messageField" class="slackWidget-offline__message"
            v-bind:class="{ 'slackWidget-offline_error': hasError }"
            v-model="message"
            v-bind:maxlength="maxCharacterCount"
            v-on:input="onInput"
            v-on:focus="onFocus"
            v-on:focusout="onFocusOut"
            required
          >
          </textarea>
        </div>
        <span class="highlight" v-bind:class="{ 'highlight-focused': focused }"></span>
        <span class="bar" v-bind:class="{ 'bar-focused': focused }"></span>
        <label v-bind:class="{ 'label-focused': focused }">{{ placeholderMessage }}</label>
      </div>
      <div class="slackWidget-offline__form_wrapper">
        <div class="group">

          <input class="slackWidget-offline__email"
            v-bind:class="{ 'slackWidget-offline_error': hasError }"
            v-model="email"
            required
          >
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>{{ placeholderEmail }}</label>
        </div>

        <button class="slackWidget-offline__submit" type="submit"></button>
      </div>
    </form>
    <div v-else class="slackWidget-offline__resultMessage">
      <p>{{ resultMessage }}</p>
    </div>
    <loader class="slackChatWidget__loader"v-if="showLoader">
    </loader>

  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import {settingsManager} from '../helpers/settingsManager.js'
import loader from './loader.vue'
const autosize = require('autosize')

/** @module chatOffline  - contains functionality of chat window when all users is offline  */
export default {

  name: 'chatOffline',
  components: {
    loader
  },

  data () {
    return {
      placeholderMessage: settingsManager.getProperty('inputMessagePlaceholder'),
      placeholderEmail: settingsManager.getProperty('emailPlaceholder'),
      titleMessage: settingsManager.getProperty('emailFormTitle'),
      showForm: true,
      showLoader: false,
      isSent: null,
      email: '',
      focused: false,
      emailTo: settingsManager.getProperty('email'),
      ps: null,
      maxCharacterCount: 500,
      message: '',
      uri: settingsManager.getProperty('requestHandlerPath'),
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
      return this.message.trim()
    },

    /**
      * Clear email(trimming spaces)
      * @method clearedEmail
      * @return {string} - cleared email
      */
    clearedEmail: function () {
      return this.email.trim()
    },

    /**
      * Return message that printed after message sending
      * @method resultMessage
      * @return {string} - result message
      */
    resultMessage: function () {
      if (this.isSent == null) {
        return ''
      } else {
        if (this.isSent) {
          return settingsManager.getProperty('emailSend')
        }
        return settingsManager.getProperty('emailNotSend')
      }
    }
  },

  methods: {

  /**
    * Get Email value from cookies
    * @method getEmail
    * @return {string} - Email
    */
    getEmail: function () {
      return this.$cookie.get('slackWidgetEmail')
    },

    /**
    * Set Email value in cookies(expired time 99999)    *
    * @method setEmail
    */
    setEmail: function () {
      this.$cookie.set('slackWidgetEmail', this.clearedEmail, 99999)
      this.email = this.clearedEmail
    },

    /**
    * Get saved massage from cookies
    * @method getMessage
    * @return {string} - message
    */
    getMessage: function () {
      return this.$cookie.get('slackWidgetMessage')
    },

    /**
    * Save massage in cookies
    * @method setMessage
    * @param {string} message - input message
    */
    setMessage: function (message) {
      this.$cookie.set('slackWidgetMessage', message, 99999)
    },

    /**
    * Clear all input fields
    * @method clearFields   *
    */
    clearFields: function () {
      this.message = ''
      this.email = ''
    },

    /**
    * Wrap axios ajax calls
    * @method sendAjaxMessage
    * @param {string} uri - request url
    * @param {string} data - sending data
    */
    sendAjaxMessage (uri, data) {
      var self = this
      this.showLoader = true
      setTimeout(function () {
        self.axios.post(uri, data).then(function (response) {
          self.isSent = true
          self.showLoader = false
        })
          .catch(function (error) {
            self.isSent = false
            self.showLoader = false
          })
      }, 1000)
    },

    /**
    * Handle input event from text field and stores message to cookies
    * @method onInput
    */
    onInput: function () {
      this.setMessage(this.clearedMessage)
      this.ps.update()
    },

    onFocus: function () {
      this.focused = true
    },

    onFocusOut: function (event) {
      try {
        if (!event.target.value) { this.focused = false }
      } catch (e) {
        this.focused = false
      }
    },

    /**
    * Handle form submit event and send data to server
    * @method onSubmit
    */
    onSubmit: function (event) {
      this.message = this.getMessage()

      if (this.message) {
        if (this.clearedEmail) {
          // send data
          let data = 'request=sendEmail&message=' + this.message + '&email=' + this.clearedEmail + '&emailto=' + this.emailTo
          this.sendAjaxMessage(this.uri, data)

          // clear message cookies
          this.setMessage('')

          this.hasError = false
          this.clearFields()
          this.showForm = false
        } else {
          this.hasError = true
        }

        this.hasError = false
      } else {
        this.hasError = true
      }
    }
  },

  mounted: function () {
    // set initial values
    this.email = this.getEmail()
    this.message = this.getMessage()
    if (!this.message) {
      this.message = ''
    } else {
      this.onFocus()
    }
    // attach autosize to message field
    autosize(this.$refs.messageField)
    this.ps = new PerfectScrollbar(this.$refs.scroll, {
      wheelSpeed: 2,
      suppressScrollX: true
    })
  },

  updated: function () {
    autosize.update(this.$refs.messageField)
    this.ps.update()
  }
}
</script>
<style>
  .ps .ps__rail-x,
  .ps .ps__rail-y {
    background: rgba(100, 221, 23, 0.8);
    display: none;
  }

  .ps--active-x > .ps__rail-x,
  .ps--active-y > .ps__rail-y {
    display: block;
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
</style>
<style lang="scss" scoped>

  @import "../scss/global.scss";

  .group {
    width: 100%;
    position: relative;
    height: auto;
  }

  input:focus ~ label, input:valid ~ label 		{
    top:-5px;
    font-size:14px;
    color: #AAA;
    font-family: $secondaryFont;
  }

  .group label.label-focused {
    top: -20px;
    font-size:14px;
    color: #AAA;
    font-family: $secondaryFont;
  }

  label {
    color: #AAA;
    font-size:18px;
    font-weight:normal;
    font-family: $secondaryFont;
    position:absolute;
    pointer-events:none;
    left: 10px;
    top: 10px;
    transition:0.2s ease all;
    -moz-transition:0.2s ease all;
    -webkit-transition:0.2s ease all;
  }

  .highlight {
    position:absolute;
    height:60%;
    width:50%;
    top:25%;
    left:10px;
    pointer-events:none;
    opacity:0.5;
  }

  input:focus ~ .highlight,
  .highlight-focused {
    -webkit-animation:inputHighlighter 0.3s ease;
    -moz-animation:inputHighlighter 0.3s ease;
    animation:inputHighlighter 0.3s ease;
  }

  @-webkit-keyframes inputHighlighter {
    from { background: $mainColor; }
    to 	{ width:0; background:transparent; }
  }
  @-moz-keyframes inputHighlighter {
    from { background:$mainColor; }
    to 	{ width:0; background:transparent; }
  }
  @keyframes inputHighlighter {
    from { background:$mainColor; }
    to 	{ width:0; background:transparent; }
  }

  .bar 	{ position:relative; display:block; width:100%;}
  .bar:before, .bar:after 	{
    content:'';
    height:3px;
    width:0;
    bottom: 0px;
    position:absolute;
    background:$mainColor;
    transition:0.2s ease all;
    -moz-transition:0.2s ease all;
    -webkit-transition:0.2s ease all;
    z-index: 999;
  }

  .bar:before {
    left:50%;
  }

  .bar:after {
    right:50%;
  }

  input:focus ~ .bar:before, input:focus ~ .bar:after {
    width:50%;
  }

  .bar-focused:before, .bar-focused:after {
    width:50%;
  }

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
      font-size: 14px;
      font-family: $mainFont;
      font-weight: bold;
      color: #555;
      width: 80%;
    }
  }

  .slackWidget-offline {
    width: 100%;
    height: 54%;
    padding: 0 10px;
    background-color: white;

    background-size: contain;
  //  overflow: hidden;
    flex-grow: 1;
    position: relative;

    &__scroll {
      position: relative;
      width: 100%;
      max-height: 150px;
      height: auto;
      overflow:auto;

      ~label {
        top: 5px;
      }
    }

    &__scroll.ps {
      overflow: hidden !important;
      overflow-anchor: none;
      -ms-overflow-style: none;
      touch-action: auto;
      -ms-touch-action: auto;
    }

    @supports (-ms-overflow-style: none) {
      &__scroll.ps {
        overflow: auto !important;
      }
    }

    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      &__scroll.ps {
        overflow: auto !important;
      }
    }

    .slackChatWidget__loader {
      background: url('../assets/load.gif') center center no-repeat;
    }

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
      font-size: $mainFontSize;
      font-family: $mainFont;
      color: $mainFontColor;
      width: 80%;
      outline: none;
      height: auto;
      padding: 5px 0px;
      overflow: visible;
      text-align:center;
    }

    &__message {
      display: block;
      font-size: $mainFontSize;
      font-family: $mainFont;
      font-weight: 400;
      color: $secondaryColor;
      width: 100%;

      border: none;
      border-bottom: 1px solid #777;
      border-radius: $angleRadius;
      outline: none;
      height: 100%;
      overflow: hidden !important;
      padding: 0px 10px 0px 10px;
      max-height: 200px;
      resize: none;
      box-sizing: border-box;

      &::placeholder {
        color: #555;
      }
    }

    &__email {
      font-size: $mainFontSize;
      font-family: $mainFont;
      font-weight: 400;
      color: $secondaryColor;
      width: 100%;
      height: 90%;
      border: none;
      border-bottom: 1px solid #777;
      border-radius: $angleRadius;
      outline: none;

      width: 100%;
      padding: 5px 10px;
      overflow: visible;
      background: transparent;
    }

    &_error {
      border-bottom: 2px solid red;
    }

    &__submit {

      border: none;
      outline: none;

      background: url('../assets/send.png') center center no-repeat;
      background-color: $mainColor;

      background-size: 60% 60%;;
      border-radius: 50%;

      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

      min-width: $elementsWidth;
      height: $elementsHeight;

      cursor: pointer;
      margin-left: 7px;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
        transition: box-shadow 0.3s;
      }
    }
  }

</style>
