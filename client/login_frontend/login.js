function validate(evt){
    evt.preventDefault();
    let username =getElementById('login').value;
    let password =getElementById('password').value;
    if(username =="admin"&& password=="user"){
        alert("It's Up There")
        return false;
       
    }else {
        alert("Login Attempt failed ")
    }
}

let submitButton = document.getElementById('submit')
submitButton.addEventListener('click', validate())