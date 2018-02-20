## SELENIUM server

first instal java

sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update

sudo apt-get install openjdk-8-jdk
sudo apt-get install openjdk-8-source

apt-cache search jdk

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk
export PATH=$PATH:/usr/lib/jvm/java-8-openjdk/bin

javac -version

## Webdriver
### NOTES
i am install globally
sudo npm install webdriverio -g

if you configurate the shandarte config and touch jasmine framework,install him:
sudo npm install wdio-jasmine-framework -g



++default ( it is easy) - oficial recept - v.4.10.2++

mkdir webdriverio-test && cd webdriverio-test

curl -O http://selenium-release.storage.googleapis.com/3.5/selenium-server-standalone-3.5.3.jar


####  Linux 64 bit
curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-linux64.tar.gz | tar xz

####  OSX
curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-macos.tar.gz | tar xz


open selenium server in new tab your terminal:
java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.5.3.jar

npm install webdriverio 


touch test.js ;
echo "
var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
webdriverio
    .remote(options)
    .init()
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end()
    .catch(function(err) {
        console.log(err);
    }); " > test.js 


##WARNING
++first++ start the selenium.
++second++ run the tests.

run the comand: 
node test.js - and see the result "Title was: Google"
