<template>
  <div class="slackWidget-input">
    <form class="slackWidget-input__form" v-on:submit.prevent="onSubmit">
      <div class="group">

          <input ref="usernameField" class="slackWidget-input__username"
            v-if="usernameInputingMode"
            v-bind:class="{ 'slackWidget-input_error': hasError }"
            v-model="username"
            type='text'
            v-on:focus="onFocus"
            v-on:focusout="onFocusOut"
            required
          >
          <div v-else ref="scroll" class="slackWidget-input__scroll">
            <textarea ref="messageField" class="slackWidget-input__message"
              v-bind:class="{ 'slackWidget-input_error': hasError }"
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
          <span class="bar"  v-bind:class="{ 'bar-focused': focused }"></span>
          <label v-bind:class="{ 'label-focused': focused }">{{ placeholder }}</label>
      </div>
      <button class="slackWidget-input__submit" type="submit"></button>
    </form>
  </div>
</template>

<script>

import {settingsManager} from '../helpers/settingsManager.js'
import PerfectScrollbar from 'perfect-scrollbar'
const autosize = require('autosize')

/** @module chatInput - contains functionality of chat input messages component  */
export default {

  name: 'chatInput',

  data () {
    return {
      placeholderMessage: settingsManager.getProperty('inputMessagePlaceholder'),
      placeholderUsername: settingsManager.getProperty('inputNamePlaceholder'),
      usernameInputingMode: false, // is user input message or name?
      maxCharacterCount: 500, // number of maximum charecters in message
      username: '',
      message: '',
      ps: null,
      uri: settingsManager.getProperty('requestHandlerPath'),
      hasError: false,
      channel: settingsManager.getProperty('channel'),
      focused: false
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

    placeholder: function () {
      return (this.usernameInputingMode ? this.placeholderUsername : this.placeholderMessage)
    },
    /**
    * Clear username(trimming spaces)
    * @method clearedUsername
    * @return {string} - cleared username
    */
    clearedUsername: function () {
      return this.username.trim()
    }

  },

  methods: {

  /**
    * Get username value from cookies
    * @method getUsername
    * @return {string} - username
    */
    getUsername: function () {
      return this.$cookie.get('slackWidgetName')
    },

    /**
    * Set username value in cookies(expired time 99999)    *
    * @method setUsername
    */
    setUsername: function () {
      if (this.usernameInputingMode) {
        if (this.clearedUsername) {
          this.$cookie.set('slackWidgetName', this.clearedUsername, 99999)
          this.usernameInputingMode = false
          this.hasError = false
        } else {
          this.hasError = true
        }
      }
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
    * @method clearFields
    */
    clearFields: function () {
      this.message = ''
    },

    /**
    * Wrap axios ajax calls
    * @method sendAjaxMessage
    * @param {string} uri - request url
    * @param {string} data - sending data
    */
    sendAjaxMessage (uri, data) {
      this.axios.post(uri, data).then(function (response) {
      })
        .catch(function (error) {
          console.log(error)
        })
    },

    /**
    * Handle input event from text field and stores message to cookies
    * @method onInput
    */
    onInput: function () {
      this.setMessage(this.clearedMessage)
      autosize.update(this.$refs.messageField)
      this.ps.update()
    },

    /**
    * Applay styles to input on focus
    * @method onFocus
    */
    onFocus: function () {
      this.focused = true
    },

    /**
    * Disable input styles if field is empty
    * @method onFocusOut
    */
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
    onSubmit: function () {
      this.setUsername()
      this.message = this.getMessage()

      if (this.message) {
        if (this.clearedUsername) {
          // send data
          let data = 'request=sendMessage&text=' + this.message + '&username=' + this.clearedUsername + '&channel=' + this.channel
          this.sendAjaxMessage(this.uri, data)

          // clear message cookies
          this.setMessage('')

          this.clearFields()

          // disable error message
          this.hasError = false
        } else {
          this.usernameInputingMode = true
          this.onFocusOut()
        }
      } else {
        this.hasError = true
      }
    }
  },

  mounted: function () {
    // set initial values
    this.username = this.getUsername()
    if (!this.username) { this.username = '' }

    this.message = this.getMessage()
    if (!this.message) {
      this.message = ''
    } else {
      this.onFocus()
    }

    // attach autosize to message field
    autosize(this.$refs.messageField)
    // attach scroll to message field
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
    height: 100%;
    padding-top: 25px;
  }

  .label-focused {
    top:5px;
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
    left: 15px;
    top: 40px;
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

  .bar 	{
    position:relative;
    display:block;
    width:100%;
  }

  .bar:before,
  .bar:after 	{
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

  .bar-focused:before, .bar-focused:after {
    width:50%;
  }

  .slackWidget-input {
    position: relative;

    width: 100%;
    height: auto;
    padding-top: 5px;

    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.5);
    z-index: 3;
    &__scroll {
      position: relative;
      width: 100%;
      max-height: 150px;
      height: auto;
      overflow:auto;

      ~label {
        top: 35px;
      }

      ~label.label-focused {
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

    &__form {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: nowrap;
      padding: 0px 10px 10px 10px;
      resize: none;
      overflow: hidden;
      position: relative;
    }

    &__message, &__username {
      position: relative;
      font-size: $mainFontSize;
      font-family: $mainFont;
      font-weight: 400;
      color: $secondaryColor;
      width: 100%;
      border:none;
      border-bottom:1px solid #757575;
      border-radius: $angleRadius;
      outline: none;
      height: 100%;
      padding: 15px 10px 5px 10px;
      overflow: hidden !important;

      resize: none;
      display: block !important;
      box-sizing: border-box;

      &::placeholder {
        color: #555;
      }
    }
    &__username {
      padding-bottom: 15px;

    }
    &__message {
      padding-top: 0px;

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
      margin-top: 20px;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.7);
        transition: box-shadow 0.3s;
      }
    }
  }
</style>
