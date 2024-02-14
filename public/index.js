document.addEventListener('DOMContentLoaded', () => {
    attachSidebarListeners();

    function attachSidebarListeners() {
        document.body.addEventListener("click", function (event) {
            if (event.target.classList.contains("dropdown-btn")) {
                const dropdownContent = event.target.nextElementSibling;
                dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";
            }
            if (event.target.id === "dashboard") {
                window.location.href = "/dashboard";
            }
            if (event.target.id === "allOrdersLink") {
                window.location.href = "/orders";
            }
            if (event.target.id === "addProductLink") {
                window.location.href = "/productform";
            }
            if (event.target.id === "allProductsLink") {
                window.location.href = "/product";
            }
            if (event.target.id === "categoriesLink") {
                window.location.href = "/category";
            }
            if (event.target.id === "customers") {
                window.location.href = "/customers";
            }
            if (event.target.id === "shoppix") {
                window.location.href = "/shoppix";
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('userName');
    const userImage = localStorage.getItem('userImage');

    if (userName && userImage) {
       const welcomeMessage = document.getElementById('welcomeMessage');
       const userImageElement = document.getElementById('');

       if (welcomeMessage) {
           welcomeMessage.textContent = ` ${userName}`;
       }

       if (userImageElement) {
           userImageElement.src = userImage;
           userImageElement.alt = `${userName}'s Image`;
       }
    }
});