async function submitForm() {
    const form = document.getElementById('loginForm');
    const identifier = form.querySelector('[name="identifier"]').value;
    const password = form.querySelector('[name="password"]').value;
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result);

            if (result.role === 'admin') {
                window.location.href = '/shoppix-dashboard';
            } else {
                window.location.href = '/shoppix';
            }
        } 
        else {
            console.error(result);
        }
    } 
    catch (error) {
        console.error('Error during login:', error.message);
    }
} 
        function updateSidenav(name, imageUrl) {
            console.log('Updating sidenav with name and image:', name, imageUrl);

            localStorage.setItem('userName', name);
            localStorage.setItem('userImage', imageUrl);

            window.location.href = '/index';
        }
document.addEventListener('DOMContentLoaded', resetLoginForm);