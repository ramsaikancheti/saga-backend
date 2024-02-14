document.addEventListener('DOMContentLoaded', function () {
    loadCategories();
});

async function fetchCategoryStatus(categoryId) {
try {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching category status: ${response.statusText}`);
    }

    const result = await response.json();
    return result.status; 

} catch (error) {
    console.error('Error fetching category status:', error);
    return null; 
}
}

async function togglePublishStatus(category, toggleInput) {
try {
    const newStatus = toggleInput.checked;
    console.log('Updating published status:', newStatus);

    const response = await fetch(`/api/status/category/${category.categoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
        throw new Error(`Error updating published status: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Category updated successfully:', result);

} catch (error) {
    console.error('Error updating published status:', error);
}
}

function createIcon(iconClass, clickHandler, tooltip) {
const icon = document.createElement('i');
icon.className = iconClass;
icon.style.marginRight = '10px';
icon.setAttribute('data-tooltip', tooltip || '');
if (clickHandler) {
    icon.addEventListener('click', clickHandler);
}
return icon;
}



function editCategory(categoryId) {
fetch(`/api/categories/${categoryId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error loading category details for editing: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const editForm = document.createElement('form');
        editForm.innerHTML = `
            <label for="editCategoryName_${categoryId}">Category Name:</label>
            <input type="text" id="editCategoryName_${categoryId}" value="${data.name}">
            <!-- Add more input fields as needed for other category properties -->
            <button type="button" onclick="saveUpdatedCategory('${categoryId}')">Save</button>
        `;

        const editModalContent = document.getElementById('editModalContent');
        editModalContent.innerHTML = '';
        editModalContent.appendChild(editForm);

        const editModal = document.getElementById('editModal');
        editModal.style.width = '250px';
        editModal.style.right = '0';
    })
    .catch(error => {
        console.error('Error loading category details for editing:', error);
    });
}


function closeEditModal() {
const editModal = document.getElementById('editModal');
editModal.style.right = '-250px';
}  

function fetchUpdatedData() {
return fetch('/getUpdatedData')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching updated data: ${response.statusText}`);
        }
        return response.json();
    });
}


window.saveUpdatedCategory = function (categoryId) {
console.log('Save button clicked');
const updatedCategoryName = document.getElementById(`editCategoryName_${categoryId}`).value;

fetch(`/updateCategory/${categoryId}`, {
method: 'PUT',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({
    name: updatedCategoryName,
}),
})
.then(response => {
if (!response.ok) {
    throw new Error(`Error updating category: ${response.statusText}`);
}
return response.json();
})
.then(data => {
console.log('Category updated successfully:', data);

 const categoryNameCell = document.getElementById(`categoryName_${categoryId}`);
if (categoryNameCell) {
    categoryNameCell.innerText = updatedCategoryName;
}

 const messageContainer = document.getElementById('messageContainer');
messageContainer.innerText = 'Category updated successfully';

showSuccessModal();

setTimeout(() => {
    closeEditModal();
    hideSuccessModal();
    messageContainer.innerText = '';
    // updateContent();
}, 1000);
})
.catch(error => {
console.error('Error updating category:', error);
});
};


function showSuccessModal() {
const successModal = document.getElementById('successModal');
successModal.style.display = 'block';

document.body.style.overflow = 'hidden';
}

function hideSuccessModal() {
const successModal = document.getElementById('successModal');
successModal.style.display = 'none';

document.body.style.overflow = 'auto';
}



function deleteType(typesId) {
const userConfirmed = confirm("Are you sure you want to delete this type?");

if (userConfirmed) {
    return fetch(`/api/delete/types/${typesId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error deleting type: ${response.statusText}`);
        }

        const typeRow = document.querySelector(`tr[data-types-id="${typesId}"]`);
        if (typeRow) {
            typeRow.remove(); 
        }

        return response.json();
    })
    .then(() => {
        console.log("Type deleted successfully");
    })
    .catch(error => {
        console.error('Error deleting type:', error);
    });
}
}





function deleteCategory(categoryId) {
const userConfirmed = confirm("Are you sure you want to delete this category?");

if (userConfirmed) {
    return fetch(`/api/delete/category/${categoryId}`, {
        method: 'DELETE',
    })
    .then(response => {
        console.log("Response:", response);
        if (!response.ok) {
            throw new Error(`Error deleting category: ${response.statusText}`);
        }

         const categoryRow = document.querySelector(`tr[data-category-id="${categoryId}"]`);
        if (categoryRow) {
            categoryRow.remove();
        }

        return response.json();
    })
    .then(() => {
        console.log("Category deleted successfully");
    })
    .catch(error => {
        console.error('Error deleting category:', error);
    });
}
}


function editType(typesId) {
fetch(`/api/types/${typesId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error loading type details for editing: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const editForm = document.createElement('form');
        editForm.innerHTML = `
            <label for="editTypeName_${typesId}">Type Name:</label>
            <input type="text" id="editTypeName_${typesId}" value="${data.name}">
            <!-- Add more input fields as needed for other type properties -->
            <button type="button" onclick="saveUpdatedType('${typesId}')">Save</button>
        `;

        const editModalContent = document.getElementById('editModalContent');
        editModalContent.innerHTML = '';
        editModalContent.appendChild(editForm);

        const editModal = document.getElementById('editModal');
        editModal.style.width = '250px';
        editModal.style.right = '0';
    })
    .catch(error => {
        console.error('Error loading type details for editing:', error);
    });
}


window.saveUpdatedType = function (typesId) {
console.log('Save button clicked');
const updatedTypeName = document.getElementById(`editTypeName_${typesId}`).value;

fetch(`/api/updatetypes/${typesId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: updatedTypeName,
    }),
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error updating type: ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    console.log('Type updated successfully:', data);
    closeEditModal();
})
.catch(error => {
    console.error('Error updating type:', error);
});
};

function displayAdditionalData(categoryId) {
fetch(`/api/categories/${categoryId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error loading category details: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const categoriesContainer = document.getElementById('mainContent');
        categoriesContainer.innerHTML = '';

        const categoryTable = document.createElement('table');
        categoryTable.className = 'category-table';

        const typesHeading = document.createElement('h2');
        typesHeading.textContent = 'sub-Category';
        categoriesContainer.appendChild(typesHeading);

        const tableHeaders = ['categoryId', 'image', 'name', 'published', 'actions'];
        const headerRow = document.createElement('tr');
        tableHeaders.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1);
            headerRow.appendChild(header);
        });
        categoryTable.appendChild(headerRow);

        const tableBody = document.createElement('tbody');
        const dataRow = createCategoryRow(data, tableHeaders);
        tableBody.appendChild(dataRow);

         const publishCell = document.createElement('td');
        const publishButton = document.createElement('button');
        publishButton.textContent = data.published ? 'Published' : 'Unpublished';
        publishButton.classList.add(data.published ? 'published' : 'unpublished');
        publishCell.appendChild(publishButton);

        const actionsCell = document.createElement('td');
        const searchIcon = createIcon('fas fa-search', () => displayTypesData(categoryId, data.types[0].typesId));
        const editIcon = createIcon('fas fa-edit');
        const deleteIcon = createIcon('fas fa-trash-alt');
        actionsCell.appendChild(searchIcon);
        actionsCell.appendChild(editIcon);
        actionsCell.appendChild(deleteIcon);

        dataRow.appendChild(publishCell);
        dataRow.appendChild(actionsCell);

        categoryTable.appendChild(tableBody);
        categoriesContainer.appendChild(categoryTable);

        displayTypesData(data.types);
    })

    .catch(error => {
        console.error('Error loading category details:', error);
    });
}

function loadCategories() {
fetch('/api/categories')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error loading categories: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Categories loaded successfully:", data);
        displayCategories(data);
    })
    .catch(error => {
        console.error('Error loading categories:', error);
    });
}

function displayCategories(categories) {
const categoriesContainer = document.getElementById('mainContent');
categoriesContainer.innerHTML = '<h2>Categories</h2>';

if (categories.length === 0) {
    categoriesContainer.innerHTML += '<p>No categories available.</p>';
    return;
}

categoriesContainer.classList.add('category-table-visible');

const categoryTable = document.createElement('table');
categoryTable.className = 'category-table';

const tableHeaders = ['categoryId', 'image', 'name', 'published', 'actions'];
const headerRow = document.createElement('tr');

tableHeaders.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1);
    headerRow.appendChild(header);
});

categoryTable.appendChild(headerRow);

const tableBody = document.createElement('tbody');

categories.forEach(category => {
    const dataRow = createCategoryRow(category, tableHeaders);
    tableBody.appendChild(dataRow);
});

categoryTable.appendChild(tableBody);

categoriesContainer.appendChild(categoryTable);
}

function createCategoryRow(category, headers) {
const dataRow = document.createElement('tr');
dataRow.dataset.categoryId = category.categoryId;

headers.forEach(header => {
    const cell = document.createElement('td');
    if (header === 'image') {
        const image = document.createElement('img');
        image.src = category[header] || 'N/A';
        image.style.width = '50px';
        image.style.height = '50px';
        image.style.borderRadius = '30px';
        cell.appendChild(image);
    } else if (header === 'published') {
        (async () => {
            const toggleSwitch = document.createElement('label');
            toggleSwitch.className = 'switch';

            const toggleInput = document.createElement('input');
            toggleInput.type = 'checkbox';

             const status = await fetchCategoryStatus(category.categoryId);
            toggleInput.checked = status === '1' || status === 1;

            toggleInput.addEventListener('change', () => togglePublishStatus(category, toggleInput));

            const slider = document.createElement('span');
            slider.className = 'slider round';

            toggleSwitch.appendChild(toggleInput);
            toggleSwitch.appendChild(slider);

            cell.appendChild(toggleSwitch);

            cell.appendChild(statusText);
        })();
    } else if (header === 'actions') {
        const searchIcon = createIcon('fas fa-search', () => displayAdditionalData(category.categoryId));
        const editIcon = createIcon('fas fa-edit');
        const deleteIcon = createIcon('fas fa-trash-alt');

        cell.appendChild(searchIcon);
        cell.appendChild(editIcon);
        cell.appendChild(deleteIcon);
    } 
    else {
    cell.textContent = category[header] || 'N/A';
}
dataRow.appendChild(cell);
});
return dataRow;
}


function displayTypesData(types) {
const typesContainer = document.getElementById('mainContent');
typesContainer.classList.remove('category-table-visible');

const typesTable = document.createElement('table');
typesTable.className = 'types-table';

const tableHeaders = ['typesId', 'image', 'name', 'published', 'actions'];
const headerRow = document.createElement('tr');

tableHeaders.forEach(headerText => {
const header = document.createElement('th');
header.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1);
headerRow.appendChild(header);
});

typesTable.appendChild(headerRow);

const tableBody = document.createElement('tbody');
types.forEach(type => {
const dataRow = createTypeRow(type, tableHeaders);
tableBody.appendChild(dataRow);
});

typesTable.appendChild(tableBody);

typesContainer.appendChild(typesTable);
} 

function createTypeRow(type, headers) {
const dataRow = document.createElement('tr');

headers.forEach(header => {
    if (header === 'image') {
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = type[header] || 'N/A';
        image.style.width = '50px';
        image.style.height = '50px';
        image.style.borderRadius = '30px';
        imageCell.appendChild(image);
        dataRow.appendChild(imageCell);
    } else if (header === 'status') {
        const statusCell = document.createElement('td');
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'switch';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = type[header];

        toggleInput.addEventListener('change', () => toggleTypeStatus(type, toggleInput));

        const slider = document.createElement('span');
        slider.className = 'slider round';

        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(slider);

        statusCell.appendChild(toggleSwitch);
        dataRow.appendChild(statusCell);
    } else if (header === 'actions') {
        const actionsCell = document.createElement('td');
        const penIcon = createIcon('fas fa-pen', () => editType(type.typesId), 'Edit Type');
        const deleteIcon = createIcon('fas fa-trash-alt', () => deleteType(type.typesId), 'Delete Type');

        actionsCell.appendChild(penIcon);
        actionsCell.appendChild(deleteIcon);
        dataRow.appendChild(actionsCell);
    } else {
        const cell = document.createElement('td');
        cell.textContent = type[header] || 'N/A';
        dataRow.appendChild(cell);
    }
});

return dataRow;
}




function displayTypesData(types) {
const typesContainer = document.getElementById('mainContent');
typesContainer.classList.remove('category-table-visible');

const typesTable = document.createElement('table');
typesTable.className = 'types-table';

const tableHeaders = ['typesId', 'image', 'name', 'status', 'actions'];   
const headerRow = document.createElement('tr');

tableHeaders.forEach(headerText => {
const header = document.createElement('th');
header.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1);
headerRow.appendChild(header);
});

typesTable.appendChild(headerRow);

const tableBody = document.createElement('tbody');
types.forEach(type => {
const dataRow = createTypeRow(type, tableHeaders);
tableBody.appendChild(dataRow);
});

typesTable.appendChild(tableBody);

typesContainer.appendChild(typesTable);
}



function createSizeRow(size, headers) {
const dataRow = document.createElement('tr');

headers.forEach(header => {
const cell = document.createElement('td');
cell.textContent = size[header] || 'N/A';
dataRow.appendChild(cell);
});

return dataRow;
}

async function toggleTypeStatus(type, toggleInput) {
try {
const newStatus = toggleInput.checked ? '1' : '0';
console.log('Updating type status:', newStatus);

const response = await fetch(`/api/status/types/${type.typesId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
});

if (!response.ok) {
    throw new Error(`Error updating type status: ${response.statusText}`);
}

const result = await response.json();
console.log('Type status updated successfully:', result);

} catch (error) {
console.error('Error updating type status:', error);
}
}