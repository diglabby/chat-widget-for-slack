var webdriverio = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'firefox' } };
var client = webdriverio.remote(options);


client
    .init()

    // задаем размеры окна 
    .windowHandleSize({width: 500, height: 600}) 
    .url('http://chat.geeklauka.by/')
    
    // .saveScreenshot(__dirname + '/screenshotes/interface/0stepGuiScreen.png')

    // для задержки пока окно вылетит само
    .pause(10000)
    
    
    // .saveScreenshot(__dirname + '/screenshotes/interface/1stepGuiScreen.png')

    .setValue('.slackWidget-offline__email', 'yelo_woman@mail.ru')

    // .saveScreenshot(__dirname + '/screenshotes/interface/2stepGuiScreen.png')

    .setValue('.slackWidget-offline__message', ' this is automatic test, dont panic developers controled him')
    
    
    // .saveScreenshot(__dirname + '/screenshotes/interface/3stepGuiScreen.png')

    .click('.slackWidget-offline__submit')
    

    
    // .saveScreenshot(__dirname + '/screenshotes/interface/4stepGuiScreen.png')
    
    .click('.slackChatWidget__close')
    // save the screenshot!!
    
    // .saveScreenshot(__dirname + '/screenshotes/interface/5stepGuiScreen.png')
    
    .end();