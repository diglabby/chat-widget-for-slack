var slackChatWidgetConfig = {

    windowHeight: 400,
    windowWidth: 300,
    windowBottomMargin: 100,
    windowRightMargin: 100,
    
    title: 'Chat title', //chat title
    subtitle: 'Chat subtitle',     //chat subtitle
    channel: '',       //slack channel   

    inputMessagePlaceholder: "Your message",
    inputNamePlaceholder: "Your name",

    email: "falasnter.by@gmail.com",
    emailFormTitle: "Email form title text",
    emailPlaceholder: "Your Еmail",
    emailMessagePlaceholder: "Your message",
    emailSend: "Thanks for your massage",
    emailNotSend: "Sorry, your email not sent, try later",

    requestHandlerPath: 'slackChatWidget/app/php/requestHandler.php',

    openChatTimeout: 5000,
    welcomeMessageTimeout: 1000,
    historyMessagesCount: 3,

    welcomeMessage: "Hello!",
    welcomeMessageUser: "Admin"
}
