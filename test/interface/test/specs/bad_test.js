var webdriverio = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'firefox' } };
var client = webdriverio.remote(options);
function badGen() {
    let resultTwo    = '',
        resultThree  = '',
        result       = '',
        words        = '0123456789qwertyuiopasdfUIOPASDFGHJKLZXCVBNM`!?{}=*!;><^',
        max_position = words.length - 1    	;
    
        for( i = 0; i < 6; ++i ) {
            position = Math.floor ( Math.random() * max_position );
            result = result + words.substring(position, position + 1 )  ;
        }
    
        for( i = 0; i < 4; ++i ) {
            position = Math.floor ( Math.random() * max_position );
            resultTwo = resultTwo + words.substring(position, position + 1 )  ;
        }


    // console.log(result);
    return result + '@' + resultTwo + '.com'
};


var badExampleEmail = badGen();




client
    .init()

    // задаем размеры окна 
    .windowHandleSize({width: 500, height: 600}) 
    .url('http://chat.geeklauka.by/')
    
    // .saveScreenshot(__dirname + '/screenshotes/bad_test/0bad_testScreen.png')

    .pause(10000)
    
    
    // .saveScreenshot(__dirname + '/screenshotes/bad_test/1bad_testScreen.png')

    .setValue('.slackWidget-offline__email', badExampleEmail)

    // .saveScreenshot(__dirname + '/screenshotes/bad_test/2bad_testScreen.png')

    .setValue('.slackWidget-offline__message', ' this is automatic test, dont panic developers controled him')
    
    
    // .saveScreenshot(__dirname + '/screenshotes/bad_test/3bad_testScreen.png')

    .click('.slackWidget-offline__submit')
    

    
    // .saveScreenshot(__dirname + '/screenshotes/bad_test/4bad_testScreen.png')
    
    .click('.slackChatWidget__close')

    
    // .saveScreenshot(__dirname + '/screenshotes/bad_test/5bad_testScreen.png')
    
    .end();
