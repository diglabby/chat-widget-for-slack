
var chatWidgetIsLoaded  = false;

function loadjscssfile(filename, filetype) {
  if (filetype == "js") { 
    
    var fileref = document.createElement('script')
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", filename)
    
  } else if (filetype == "css") { 
    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref != "undefined")
    document.body.appendChild(fileref)
}

function resizeSlackWidgetApp() {
    if(window.innerWidth >= 800 && !chatWidgetIsLoaded) {   
        var div = document.createElement('div');
        div.id = "slackChatWidget";  
        document.body.appendChild(div);   
        loadjscssfile("slackChatWidget/config.js","js");      
        loadjscssfile("slackChatWidget/app/css/styles.css","css");  
        loadjscssfile("slackChatWidget/app/js/app.js","js");     
        chatWidgetIsLoaded  = true;      
    } 
}

function loadSlackWidgetApp() {   
    if(window.innerWidth >= 800) {
        var div = document.createElement('div');
        div.id = "slackChatWidget";  
        document.body.appendChild(div);   
        loadjscssfile("slackChatWidget/config.js","js");      
        loadjscssfile("slackChatWidget/app/css/styles.css","css");  
        loadjscssfile("slackChatWidget/app/js/app.js","js");     
        chatWidgetIsLoaded  = true;        
    }    
}

window.addEventListener("load", loadSlackWidgetApp, false); 
window.addEventListener("resize", resizeSlackWidgetApp, false); 
