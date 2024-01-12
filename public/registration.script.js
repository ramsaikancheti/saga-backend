 function validatePassword() {
    var password = document.getElementById("password").value;
    var passwordError = document.getElementById("passwordError");

     if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        passwordError.textContent = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long.";
        return false;
    } else {
        passwordError.textContent = "";
        return true;
    }
}
 