<?php
    header('Access-Control-Allow-Origin: *');  
    
    $token = trim(file_get_contents('../../token.key'));
    
    function clean_string($string) {
          $bad = array("content-type","bcc:","to:","cc:","href");
          return str_replace($bad,"",$string);    
    } 
    
    function died($error) {      
        echo "Send error";               
        die();
    }
    
    function sendEmail($email_to, $email_subject, $message, $email) {   
    
        
        $email_message = "Message: \n <br>";        
        $email_message .= "Chat: ".clean_string($email_subject)."\n <br><br>";         
        $email_message .= "Contact information: ".clean_string($email)."\n  <br><br>";
        $email_message .= "Text: ".clean_string($message)."\n  <br><br>"; 
 

        $headers = "MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf-8\r\n"."From: <slack chat>\r\n";
        @mail($email_to, $email_subject, $email_message, $headers);  
    }
    
    $result = "";
    
    if($_POST['request'] == 'sendEmail') {   
        $result = sendEmail($_POST['emailto'], "New message", $_POST['message'], $_POST['email']);  
    }            
    else {        
        switch ($_POST['request']) {
        
            case 'createSocket':     
                    $ch = curl_init("https://slack.com/api/rtm.start");    
                    $data = http_build_query([
                        'token' => $token    
                    ]);           
                break;
            case 'sendMessage':
                    $ch = curl_init("https://slack.com/api/chat.postMessage");
                    $data = http_build_query([
                        'token' => $token,
                        'channel' => $_POST['channel'],                         
                        'text' => $_POST['text'],
                        'username' => $_POST['username']
                    ]);    
                break;     
            case 'getUsers':
                    $ch = curl_init("https://slack.com/api/users.list");
                    $data = http_build_query([
                        'token' => $token,   
                        'presence' => true
                    ]); 
                break;     
            case 'getHistory':
                    $ch = curl_init("https://slack.com/api/channels.history");
                    $data = http_build_query([
                        'token' => $token,                
                        'channel' => $_POST['channel'],                        
                        'count' => $_POST['count'],
                        'latest' => $_POST['latest']
                    ]); 
                break; 
            
            case 'getChannelInfo':
                    $ch = curl_init("https://slack.com/api/channels.info");
                    $data = http_build_query([
                        'token' => $token,                
                        'channel' => $_POST['channel']            
                    ]); 
                break; 
        }  
        
        
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $result = curl_exec($ch);
        
        curl_close($ch);   
    }    
    
    echo $result; 
?>