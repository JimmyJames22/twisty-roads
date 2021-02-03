
function checkPassword(input){
    if(input.value != document.getElementById('password').value){
        alert('Passwords must match')
    } else {
        return
    }
}

function checkEmail(input){
    if(input.value != document.getElementById('email').value){
        alert('Emails must match')
    } else {
        return
    }
}

