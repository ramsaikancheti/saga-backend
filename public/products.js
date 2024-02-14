document.addEventListener('DOMContentLoaded', function () {
    loadAllProducts();
});

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
< id="${editModalId}" class="modal">
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
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', confirmationModalContent);

const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');

confirmDeleteButton.addEventListener('click', () => {
if (window.confirm("Are you sure you want to delete this product?")) {
    console.log('Confirm delete button clicked');
    confirmDelete(productId);
}
});

cancelDeleteButton.addEventListener('click', closeDeleteConfirmationModal);
}



function confirmDelete(productId) {
console.log('Confirm delete function called');
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