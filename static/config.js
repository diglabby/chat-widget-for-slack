var slackChatWidgetConfig = {
    
    windowHeight: 400,
    windowWidth: 300,
    windowBottomMargin: 100,
    windowRightMargin: 100,
   
    title: 'Чат-бот Фаланстер', //загаловак чата
    subtitle: 'Прывітанне',     //падзагаловак чата
    //channel: 'C7C7NS',       //канал у Slack, з якім працуе чат    
    channel: 'C7C7NSMAB',       //канал у Slack, з якім працуе чат    
    
    inputMessagePlaceholder: "Ваша паведамленне", //тэкст у полі запыту паведамлення
    inputNamePlaceholder: "Ваша імя", //тэкст у полі запыту імя
    
    //email: "falanster.by@gmail.com",
    email: "alexwish@tut.by",
    emailFormTitle: "Прывітанне, пакіньце свае пытанне праз форму ніжэй і мы адкажам на яго.",
    emailPlaceholder: "Ваш Еmail",
    emailMessagePlaceholder: "Ваша пытанне?", 
    emailSend: "Дзякуй, ваша паведамленне адпраўлена",
    emailNotSend: "Дзякуй, ваша паведамленне не адпраўлена з-за праблем з падключэннем, паспрабуйте яшчэ раз",  
    
    requestHandlerPath: 'https://chat.geeklauka.by/slackChatWidget/app/php/requestHandler.php', //URL да сэрвера, на якім знаходзіцца абработчык запросаў
    
    openChatTimeout: 5000,
    welcomeMessageTimeout: 1000, //час, праз які чат аўтаматычна адчыняецца
    historyMessagesCount: 3, //колькасць паведамленняў у гісторыі
    welcomeMessage: "Вітаем вас у чаце каманды Майстэрні! Камунікуйце!", //прывітальнае паведамленне
    welcomeMessageUser: "Falanster", //юзер, які дасылае прывітальнае паведамленне
    
};