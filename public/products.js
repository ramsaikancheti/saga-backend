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

async function loadProductDetailsForEditInternal(productId) {
    try {
        const response = await fetch(`/api/products/details/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Error loading product details: ${response.statusText}`);
        }

        const productDetails = await response.json();

        const editNameElement = document.getElementById('editProductName');
        const editBrandNameElement = document.getElementById('editProductBrand');
        const editPriceElement = document.getElementById('editProductPrice');
        const editImageElement = document.getElementById('editProductImagePreview');

        if (editNameElement && editBrandNameElement && editPriceElement && editImageElement) {
            editNameElement.value = productDetails.name || '';
            editBrandNameElement.value = productDetails.brandname || '';
            editPriceElement.value = productDetails.price || '';

            editImageElement.src = productDetails.images[0];
            editImageElement.style.display = 'block';

             const closeEditButton = document.getElementById('cancelEditProduct');
            closeEditButton.addEventListener('click', () => closeEditModal('editProductModal'));
        } else {
            console.error('Error finding elements for edit:', productId);
        }
    } catch (error) {
        console.error('Error loading product details for edit:', error);
    }
}

 


function closeEditModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
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

        const updatedData = {
            name: editedName,
            brandname: editedBrandName,
            price: editedPrice,
        };

         updateProductDetailsViaNavbar(productId, updatedData);

        closeEditModal(`editProductModal_${productId}`);
    } else {
        console.error("Form validation failed. Please fill in all required fields.");
    }
}

function submitEditForm(productId) {
    const editedName = document.getElementById('editProductName').value;
    const editedBrandName = document.getElementById('editProductBrand').value;
    const editedPrice = document.getElementById('editProductPrice').value;

    const updatedData = {
        name: editedName,
        brandname: editedBrandName,
        price: editedPrice,
    };

    updateProductDetailsViaNavbar(productId, updatedData);
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

    const confirmDeleteHandler = () => {
        console.log('Confirm delete button clicked');
        confirmDelete(productId);

        confirmDeleteButton.removeEventListener('click', confirmDeleteHandler);
        cancelDeleteButton.removeEventListener('click', cancelDeleteHandler);

        closeDeleteConfirmationModal();
    };

    const cancelDeleteHandler = () => {
        closeDeleteConfirmationModal();
    };

    confirmDeleteButton.addEventListener('click', confirmDeleteHandler);
    cancelDeleteButton.addEventListener('click', cancelDeleteHandler);
}



async function confirmDelete(productId) {
    console.log('Confirm delete function called');

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error deleting product: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Product deleted successfully:', data.message);
            loadAllProducts();
        } else {
            console.error('Error deleting product:', data.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }

    closeDeleteConfirmationModal();
}

function closeDeleteConfirmationModal() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
        modal.remove();
    }
}



function handleEditButtonClick(productId) {
    console.log(`Edit button clicked for product ID: ${productId}`);
    displayEditProductModal(productId);
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

function displayEditProductModal(productId) {
    const editModal = document.getElementById('editProductModal');
    const confirmEditButton = document.getElementById('confirmEditProduct');
    const cancelEditButton = document.getElementById('cancelEditProduct');

     loadProductDetailsForEditInternal(productId);

    confirmEditButton.addEventListener('click', async () => {
        try {
             validateAndSubmit(productId, true);
             showSuccessMessageModal();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    cancelEditButton.onclick = function () {
        console.log('Edit operation canceled');
        editModal.style.display = 'none';
    };

     editModal.style.display = 'block';

     const fileInput = document.getElementById('editImage');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
}

 function handleImageUpload(event) {
    const previewImage = document.getElementById('editProductImagePreview');
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

 function showSuccessMessageModal() {
    const successMessageModal = document.getElementById('successMessageModal');
    successMessageModal.style.display = 'block';

    setTimeout(() => {
        successMessageModal.style.display = 'none';
    }, 1000);
}

 document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('close')) {
        const modalId = generateModalId(event.target);
        closeEditModal(modalId);
    }
});
