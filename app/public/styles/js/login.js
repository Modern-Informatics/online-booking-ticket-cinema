function matchpass(){  
    var username = document.f1.username.value;  
    var password=document.f1.password.value;  
      
    if(username=="admin" && password == "admin"){  
    return true;  
    }  
    else{  
    alert("Username or password is incorrect !");  
    return false;  
    }  
    }  
      
      