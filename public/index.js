document.addEventListener('DOMContentLoaded', () => {
    attachSidebarListeners();

    function attachSidebarListeners() {
        document.body.addEventListener("click", function (event) {
            if (event.target.classList.contains("dropdown-btn")) {
                event.target.classList.toggle("active");
                const dropdownContent = event.target.nextElementSibling;
                dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";
            } else if (event.target.id === 'allProductsLink') {
                console.log("Loading all products...");
                loadAllProducts();
            } else if (event.target.id === 'addProductLink') {
                console.log("Loading add product form...");
                loadContent('/products-page', 'product.script.js');
            }else if (event.target.id === 'allOrdersLink') {
                console.log("Loading all orders...");
                loadAllOrders();
            }
        });
    }

    function loadAllOrders() {
        fetch('/orders/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading all orders: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Orders loaded successfully:", data);
            displayAllOrders(data.orders);
        })
        .catch(error => {
            console.error('Error loading all orders:', error);
        });
    }


function displayAllOrders(orders) {
    const ordersContainer = document.getElementById('mainContent');
    ordersContainer.innerHTML = '<h2>All Orders</h2>';

    if (orders.length === 0) {
        ordersContainer.innerHTML += '<p>No orders available.</p>';
        return;
    }

    orders.forEach(order => {
        const orderBox = createOrderBox(order);
        ordersContainer.appendChild(orderBox);
    });
}


function createOrderBox(order) {
    console.log('Order Data:', order);

    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';

    const orderInfo = document.createElement('div');
    orderInfo.className = 'order-info';
    console.log(order);
    orderInfo.innerHTML = `
        <p>Order ID: ${order._id || 'N/A'}</p>
        <p>Timestamp: ${(order.orderDetails && order.orderDetails.timestamp !== undefined) ? order.orderDetails.timestamp : 'N/A'}</p>
        <p>User: ${getUserInfo(order.user) || 'N/A'}</p>
        <p>Address: ${getAddressInfo(order.address) || 'N/A'}</p>
        <p>Products: ${getProductInfo(order.products) || 'N/A'}</p>
        <p>Payment: ${getPaymentInfo(order.payment !== undefined ? order.payment : []) || 'N/A'}</p>
    `;

    orderBox.appendChild(orderInfo);

    return orderBox;
}


function getProductInfo(products) {
    if (!products || !Array.isArray(products) || products.length === 0) {
        return 'N/A';
    }

    const productInfoArray = products.map(product => {
        return getProductDetails(product);
    });
    console.log(products);

    return productInfoArray.join('<br>');
}

function getProductDetails(product) {
    const productDetailsArray = [];

    for (const key in product) {
        if (product.hasOwnProperty(key)) {
            const value = product[key];

            if (Array.isArray(value)) {
                 const arrayValues = value.join(', ');
                productDetailsArray.push(`${key}: ${arrayValues}`);
            } else if (typeof value === 'object') {
                 const nestedDetails = getProductDetails(value);
                productDetailsArray.push(`${key}: ${nestedDetails}`);
            } else {
                const formattedValue = value !== undefined ? value : 'N/A';
                productDetailsArray.push(`${key}: ${formattedValue}`);
            }
        }
        console.log(productDetailsArray)
    }

    return productDetailsArray.join('<br>');
}

    function getUserInfo(user) {
        if (!user) {
            return 'N/A';
        }
    
        const userInfoArray = [];
        for (const key in user) {
            if (user.hasOwnProperty(key)) {
                userInfoArray.push(`${key}: ${user[key]}`);
            }
        }
    
        return userInfoArray.join(', ');
    }
    
    function getAddressInfo(address) {
        if (!address) {
            return 'N/A';
        }
        const addressInfoArray = [];
        for (const key in address) {
            if (address.hasOwnProperty(key)) {
                addressInfoArray.push(`${key}: ${address[key]}`);
            }
        }
        return addressInfoArray.join(', ');
    }
    
    function getPaymentInfo(payment) {
        if (Array.isArray(payment) && payment.length > 0) {
            const paymentInfoArray = [];
            for (const item of payment) {
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        paymentInfoArray.push(`${key}: ${item[key]}`);
                    }
                }
            }
            return paymentInfoArray.join(', ');
        } else {
            return 'N/A';
        }
    }
 
//products

    function loadAllProducts() {
        fetch('/api/products/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading all products: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Products loaded successfully:", data);
                displayAllProducts(data.products);
            })
            .catch(error => {
                console.error('Error loading all products:', error);
            });
    }

    function displayAllProducts(products) {
        const productsContainer = document.getElementById('mainContent');
        productsContainer.innerHTML = '<h2>All Products</h2>';

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'product-cards-container';

        for (const product of products) {
            const cardElement = createProductCard(product);
            cardsContainer.appendChild(cardElement);
        }

        productsContainer.appendChild(cardsContainer);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const image = document.createElement('img');
        image.src = product.images[0];
        image.alt = product.name;

        const title = document.createElement('h3');
        title.textContent = product.name;

        const description = document.createElement('p');
        description.textContent = product.description;

        const brandName = document.createElement('p');
        brandName.textContent = `Brand: ${product.brandname}`;

        const price = document.createElement('p');
        price.textContent = `Price: ${product.price}`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'product-card-buttons';

        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editButton.dataset.productId = product.productId;

        buttonsContainer.appendChild(editButton);

        buttonsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit')) {
                const productId = event.target.dataset.productId;
                handleEditButtonClick(productId);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        deleteButton.addEventListener('click', () => handleDeleteButtonClick(product.productId));

        buttonsContainer.appendChild(deleteButton);

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);

        card.appendChild(image);
        card.appendChild(brandName);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(buttonsContainer);

        return card;
    }

    function handleEditButtonClick(productId) {
    console.log(`Edit button clicked for product ID: ${productId}`);

    const editModalId = `editProductModal_${productId}`;
    const editModalContent = `
        <div id="${editModalId}" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeEditModal('${editModalId}')">&times;</span>
                <h2>Edit Product</h2>
                <form id="editProductForm_${productId}">
                    <label for="editName_${productId}">Name:</label>
                    <input type="text" id="editName_${productId}" name="editName" required><br>

                    <label for="editBrandName_${productId}">Brand Name:</label>
                    <input type="text" id="editBrandName_${productId}" name="editBrandName"><br>

                    <label for="editPrice_${productId}">Price:</label>
                    <input type="number" id="editPrice_${productId}" name="editPrice" required><br>

                    <button type="button" onclick="validateAndSubmit(${productId}, true)">Update</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', editModalContent);

    loadProductDetailsForEditInternal(productId);

    const updateButton = document.querySelector(`#${editModalId} form button`);
    updateButton.addEventListener('click', () => submitEditForm(productId));

    const closeEditButton = document.querySelector(`#${editModalId} .close`);
    closeEditButton.addEventListener('click', () => closeEditModal(editModalId));
}

    async function loadProductDetailsForEditInternal(productId) {
        try {
        const response = await fetch(`/api/products/details/${productId}`);
        if (!response.ok) {
            throw new Error(`Error loading product details: ${response.statusText}`);
        }
        const productDetails = await response.json();

        const editNameElement = document.getElementById(`editName_${productId}`);
        const editBrandNameElement = document.getElementById(`editBrandName_${productId}`);
        const editPriceElement = document.getElementById(`editPrice_${productId}`);

        if (editNameElement && editBrandNameElement && editPriceElement) {
            editNameElement.value = productDetails.name || '';
            editBrandNameElement.value = productDetails.brandname || '';
            editPriceElement.value = productDetails.price || '';
        } else {
            console.error('Error finding elements for edit:', productId);
        }

        const closeEditButton = document.querySelector(`#editProductModal_${productId} .close`);
        closeEditButton.addEventListener('click', () => closeEditModal(`editProductModal_${productId}`));
        } catch (error) {
        console.error('Error loading product details for edit:', error);
        }
    }

    function closeEditModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
        modal.remove();
        }
    }

function validateAndSubmit(productId, isEdit) {
    console.log("Validating and submitting...");

    const formId = isEdit ? `editProductForm_${productId}` : "productForm";
    const form = document.getElementById(formId);

    if (form.checkValidity()) {
        const formData = new FormData(form);

        const editedName = formData.get('editName');
        const editedBrandName = formData.get('editBrandName');
        const editedPrice = formData.get('editPrice');

        updateProductDetailsViaNavbar(productId, {
            name: editedName,
            brandname: editedBrandName,
            price: editedPrice,
        });

        closeEditModal(`editProductModal_${productId}`);
    } else {
        console.error("Form validation failed. Please fill in all required fields.");
    }
}


function submitEditForm(productId) {
    const editedName = document.getElementById(`editName_${productId}`).value;
    const editedBrandName = document.getElementById(`editBrandName_${productId}`).value;
    const editedPrice = document.getElementById(`editPrice_${productId}`).value;

    const updatedData = {
        name: editedName,
        brandname: editedBrandName,
        price: editedPrice,
    };

    updateProductDetailsViaNavbar(productId, updatedData);
}


   function updateProductDetailsViaNavbar(productId, updatedData) {
    fetch(`/api/products/edit/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error updating product details: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
             console.log('Product details updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating product details:', error);
        });
}


    function handleDeleteButtonClick(productId) {
        console.log(`Delete button clicked for product ID: ${productId}`);

        const confirmationModalContent = `
            <div id="deleteConfirmationModal" class="modal">
                <div class="modal-content">
                    <h2>Delete Product</h2>
                    <p>Are you sure you want to delete this product?</p>
                    <div class="buttons">
                    <button id="confirmDeleteButton">Yes</button>
                    <button id="cancelDeleteButton">No</button>
                    <div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', confirmationModalContent);

        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const cancelDeleteButton = document.getElementById('cancelDeleteButton');

        confirmDeleteButton.addEventListener('click', () => confirmDelete(productId));
        cancelDeleteButton.addEventListener('click', closeDeleteConfirmationModal);
    }

    function confirmDelete(productId) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Product deleted successfully:', data.message);
                    loadAllProducts();
                } else {
                    console.error('Error deleting product:', data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });

        closeDeleteConfirmationModal();
    }

    function closeDeleteConfirmationModal() {
        const modal = document.getElementById('deleteConfirmationModal');
        if (modal) {
            modal.remove();
        }
    }

    function loadContent(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading ${page}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById('mainContent').innerHTML = html;
                initializeDropdowns();
                console.log("Content loaded successfully");

                attachCloseModalListener();
            })
            .catch(error => {
                console.error(`Error loading content for ${page}:`, error);
            });
    }

    function attachCloseModalListener() {
        document.body.addEventListener('click', function (event) {
            if (event.target.classList.contains('close')) {
                const modalId = generateModalId(event.target);
                closeEditModal(modalId);
            }
        });
    }

    function generateModalId(closeButton) {
        const modal = closeButton.closest('.modal');
        return modal ? modal.id : null;
    }

});
