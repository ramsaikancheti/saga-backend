document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
});

function handleImageUpload() {
    const input = document.getElementById("images");
    const selectedImagesContainer = document.getElementById("selectedImagesContainer");
    selectedImagesContainer.innerHTML = "";
    for (const file of input.files) {
        const imageElement = document.createElement("img");
        imageElement.src = URL.createObjectURL(file);
        imageElement.alt = file.name;
        imageElement.style.maxWidth = "50px";
        imageElement.style.height = "50px";
        imageElement.style.marginRight = "5px";
        imageElement.style.marginBottom = "5px";
        selectedImagesContainer.appendChild(imageElement);
    }
}

function updateTypeDropdown() {
    const selectedCategoryDropdown = document.getElementById("category");
    const selectedCategory = JSON.parse(selectedCategoryDropdown.options[selectedCategoryDropdown.selectedIndex].getAttribute('data-category'));
    const typeDropdown = document.getElementById("type");
    typeDropdown.innerHTML = "<option value='' disabled selected>Select Type</option>";
    if (selectedCategory && selectedCategory.types) {
        selectedCategory.types.forEach(type => {
            const option = document.createElement("option");
            option.value = type.name;
            option.text = type.name;
            typeDropdown.add(option);
        });
    }
    updateSizeDropdown();
}

let selectedSizes = [];
function updateSizeDropdown() {
    const selectedCategoryDropdown = document.getElementById("category");
    const selectedTypeDropdown = document.getElementById("type");
    const sizeDropdown = document.getElementById("size");

    const selectedCategory = JSON.parse(selectedCategoryDropdown.options[selectedCategoryDropdown.selectedIndex].getAttribute('data-category'));
    const selectedType = selectedTypeDropdown.value;

    const selectedTypeObj = selectedCategory.types.find(type => type.name === selectedType);

    if (selectedTypeObj && selectedTypeObj.sizes) {
        sizeDropdown.innerHTML = ""; 

        selectedTypeObj.sizes.forEach(size => {
            const option = document.createElement("option");
            option.value = size.name;
            option.text = size.name;
            sizeDropdown.add(option);
        });
 
    } else {
        console.warn("No size data found for the selected type.");
    }
} 

function fetchCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const categoryDropdown = document.getElementById("category");
            categoryDropdown.innerHTML = "<option value='' disabled selected>Select Category</option>";

            data.forEach(category => {
                const option = document.createElement("option");
                option.value = category.name;
                option.text = category.name;
                option.setAttribute('data-category', JSON.stringify(category));
                categoryDropdown.add(option);
            });

            updateTypeDropdown();
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

document.getElementById("type").addEventListener("change", updateSizeDropdown);

function populateDropdown(dropdown, values, multiple = false) {
    if (!Array.isArray(values)) {
        values = [values];
    }

    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        if (multiple) {
            if (selectedSizes.includes(value)) {
                option.selected = true;
            }
            option.addEventListener('click', () => {
                updateSelectedSizes(dropdown);
            });
        }
        dropdown.add(option);
    });

    if (multiple) {
        $(dropdown).selectpicker('refresh');
        updateSelectedSizes(dropdown);
    }
}

function updateSelectedSizes(dropdown) {
    selectedSizes = Array.from(dropdown.selectedOptions, option => option.value);
}

function validateAndSubmit() {
    console.log("Submit button clicked");
    
    const form = document.getElementById("productForm");
    const formData = new FormData(form);

    const brandname = document.getElementById("brandname").value;
    if (brandname.trim() !== "") {
        formData.append("brandname", brandname);
    }

    console.log("Submitting form data:", formData);

     fetch('/api/addproduct', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
     })
    .catch(error => {
        console.error('Error submitting form data:', error.message);
    });
}



