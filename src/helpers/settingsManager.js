/** @module settingsManager - manage user settings for chat */

export const settingsManager = (() => {

  var settings = {

    windowHeight: 400,
    windowWidth: 300,
    windowBottomMargin: 100,
    windowRightMargin: 100,
    widgetPath: "slackChatWidget/", //widget path
    title: "Chat title", //chat title
    subtitle: "Chat subtitle",     //chat subtitle
    channel: ".......",       //slack channel
    logo: "img/logo.png",

    inputMessagePlaceholder: "Your message",
    inputNamePlaceholder: "Your name",

    email: "test@test.com",
    emailFormTitle: "Email form title text",
    emailPlaceholder: "Your Еmail",
    emailMessagePlaceholder: "Your message",
    emailSend: "Thanks for your massage",
    emailNotSend: "Sorry, your email not sent, try later",

    requestHandlerPath: "slackChatWidget/app/php/requestHandler.php",

    openChatTimeout: 5000,
    welcomeMessageTimeout: 1000,
    historyMessagesCount: 3,

    welcomeMessage: "Hello!",
    welcomeMessageUser: "Admin"

  }

  return {

    /**
      * Get user settings for chat.
      * @param {string} property - chat setting property
      * @return {Object} - property value.
      */
      getProperty: (property) => {
        if(window.slackChatWidgetConfig) {
          if(window.slackChatWidgetConfig[property])
            return window.slackChatWidgetConfig[property];
        }
        return settings[property];
      }
  };
})();
