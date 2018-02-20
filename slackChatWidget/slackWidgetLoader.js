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

window.onload = function() {    
    var div = document.createElement('div');
    div.id = "slackChatWidget";  
    document.body.appendChild(div);   
    loadjscssfile("slackChatWidget/config.js","js");      
    loadjscssfile("slackChatWidget/app/css/styles.css","css");  
    loadjscssfile("slackChatWidget/app/js/app.js","js");          
}
