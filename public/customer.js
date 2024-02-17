async function fetchAndDisplayUsersTable() {
    try {
        const response = await fetch('/orders/api/users/data'); 
        const responseData = await response.json();

        const usersData = responseData.usersData;

        const tableContainer = document.getElementById('usersTableContainer');

        if (!tableContainer) {
            console.error("Error: Element with ID 'usersTableContainer' not found.");
            return;
        }

        const table = document.createElement('table');
        table.classList.add('users-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headings = ['User ID', 'User Name', 'User Email', 'Total Orders', 'Action'];

        headings.forEach(headingText => {
            const th = document.createElement('th');
            th.textContent = headingText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        usersData.forEach(user => {
            const tr = document.createElement('tr');
            tr.dataset.userId = user.userId;
            tr.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.userName}</td>
                <td>${user.userEmail}</td> 
                <td>${user.totalOrders}</td>
                <td>
                    <i class="fas fa-edit" onclick="openEditUserModal(${user.userId}, '${user.userName}', '${user.userEmail}', '${user.userPassword}')"></i>                
                    <i class="fas fa-trash-alt" onclick="displayDeleteUserModal(${user.userId})"></i>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

    } catch (error) {
        console.error('Error loading users table:', error);
    }
}

function editUser(userId) {
    console.log('Edit user with ID:', userId);
}
fetchAndDisplayUsersTable(); 

function displayDeleteUserModal(userId) {
    const modal = document.getElementById('deleteUserModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');

    confirmButton.onclick = async function () {
        try {
            const apiUrl = `/api/users/${userId}`;
            const response = await fetch(apiUrl, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('User deleted with ID:', userId);
                fetchAndDisplayUsersTable();
            } else {
                console.error('Error deleting user. Status:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            modal.style.display = 'none';
        }
    };

    cancelButton.onclick = function () {
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
} 


function openEditUserModal(userId, userName, userEmail, userPassword) {
    const editModal = document.getElementById('editUserModal');
    const editUserNameInput = document.getElementById('editUserName');
    const editUserEmailInput = document.getElementById('editUserEmail');
    const editUserPasswordInput = document.getElementById('editUserPassword');
    const confirmEditButton = document.getElementById('confirmEdit');
    const cancelEditButton = document.getElementById('cancelEdit');

    console.log('Editing user with ID:', userId);
    console.log('Initial userName:', userName);
    console.log('Initial userEmail:', userEmail);

    editUserNameInput.value = userName;
    editUserEmailInput.value = userEmail;
     editUserPasswordInput.value = userPassword;

    confirmEditButton.addEventListener('click', async () => {
        try {
            const updatedUserData = {
                name: editUserNameInput.value,
                email: editUserEmailInput.value,
                 password: editUserPasswordInput.value || undefined,
            };

            console.log('Updated userData:', updatedUserData);

            const apiUrl = `/api/update/users/${userId}`;
            console.log('API URL:', apiUrl);
            console.log(updatedUserData);
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            console.log(response);

            if (response.ok) {
                console.log('User updated with ID:', userId);
                fetchAndDisplayUsersTable();
                showSuccessMessageModal();
            } else {
                console.error('Error updating user. Status:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }

            editModal.style.display = 'none';
        } catch (error) {
            console.error('Error updating user:', error);
        }
    });

    cancelEditButton.onclick = function () {
        console.log('Edit operation canceled');
        editModal.style.display = 'none';
    };

    editModal.style.display = 'block';
}

function showSuccessMessageModal() {
    const successMessageModal = document.getElementById('successMessageModal');
    successMessageModal.style.display = 'block';

     setTimeout(() => {
        successMessageModal.style.display = 'none';
    }, 1000);
}


 async function deleteUser(userId) {
    const apiUrl = `/api/users/${userId}`;
    const response = await fetch(apiUrl, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('User deleted with ID:', userId);
        fetchAndDisplayUsersTable();
    } else {
        console.error('Error deleting user. Status:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
    }
}

function deleteUser(userId) {
    displayDeleteUserModal(userId);
}

function displayDeleteUserModal(userId) {
    const modal = document.getElementById('deleteUserModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');

    confirmButton.onclick = function () {
        deleteUser(userId);
        modal.style.display = 'none';
    };

    cancelButton.onclick = function () {
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

async function deleteUser(userId) {
    try {
        const apiUrl = `/api/users/${userId}`;
        const response = await fetch(apiUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('User deleted with ID:', userId);
            fetchAndDisplayUsersTable();
        } else {
            console.error('Error deleting user. Status:', response.status);
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
} 

// Admin table

async function fetchAndDisplayAdminsTable() {
    try {
        const response = await fetch('/api/admins');
        const responseData = await response.json();

        const adminsData = responseData.admins; 

        const tableContainer = document.getElementById('admintablecontainer');

        if (!tableContainer) {
            console.error("Error: Element with ID 'admintablecontainer' not found.");
            return;
        }

        const table = document.createElement('table');
        table.classList.add('admin-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headings = ['Admin ID', 'Name', 'Email', 'Action']; 

        headings.forEach(headingText => {
            const th = document.createElement('th');
            th.textContent = headingText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        adminsData.forEach(admin => {
            const tr = document.createElement('tr');
            tr.dataset.adminId = admin.adminId; 
            tr.innerHTML = `
                <td>${admin.adminId}</td>
                <td>${admin.name}</td>
                <td>${admin.email}</td>
                <td>
                <i class="fas fa-edit" onclick="displayEditAdminModal(${admin.adminId}, '${admin.name}', '${admin.email}', '${admin.email}')"></i>
                    <i class="fas fa-trash-alt" onclick="deleteAdmin(${admin.adminId})"></i>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

    } catch (error) {
        console.error('Error loading admins table:', error);
    }
}

function editAdmin(adminId) {
    console.log('Edit admin with ID:', adminId);
}

fetchAndDisplayAdminsTable();


async function deleteAdmin(adminId) {
    try {
        const apiUrl = `/api/delete/admins/${adminId}`;
        const response = await fetch(apiUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Admin deleted with ID:', adminId);
            fetchAndDisplayAdminsTable();
        } else {
            console.error('Error deleting admin. Status:', response.status);
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
    }
}

async function deleteAdmin(adminId) {
    try {
        displayDeleteAdminModal(adminId);
    } catch (error) {
        console.error('Error initiating delete confirmation:', error);
    }
}


function displayDeleteAdminModal(adminId) {
    const modal = document.getElementById('deleteAdminModal');  
    const confirmButton = document.getElementById('confirmdelete');
    const cancelButton = document.getElementById('canceldelete');

    confirmButton.onclick = async function () {
        try {
            const apiUrl = `/api/delete/admins/${adminId}`;
            const response = await fetch(apiUrl, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Admin deleted with ID:', adminId);
                fetchAndDisplayAdminsTable();
            } else {
                console.error('Error deleting admin. Status:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }

            modal.style.display = 'none';
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    cancelButton.onclick = function () {
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}



function displayEditAdminModal(adminId, adminName, adminEmail, adminPassword) {
    const editModal = document.getElementById('editAdminModal');
    const editAdminNameInput = document.getElementById('editAdminName');
    const editAdminEmailInput = document.getElementById('editAdminEmail');
    const editAdminPasswordInput = document.getElementById('editAdminPassword');
    const confirmEditButton = document.getElementById('confirmedit');
    const cancelEditButton = document.getElementById('canceledit');

    console.log('Editing admin with ID:', adminId);
    console.log('Initial adminName:', adminName);
    console.log('Initial adminEmail:', adminEmail);

    editAdminNameInput.value = adminName;
    editAdminEmailInput.value = adminEmail;
     editAdminPasswordInput.value = adminPassword;

    confirmEditButton.addEventListener('click', async () => {
        try {
            const updatedAdminData = {
                name: editAdminNameInput.value,
                email: editAdminEmailInput.value,
                 password: editAdminPasswordInput.value || undefined,
            };

            console.log('Updated admin data:', updatedAdminData);

            const apiUrl = `/api/update/admins/${adminId}`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAdminData),
            });

            if (response.ok) {
                console.log('Admin updated with ID:', adminId);
                fetchAndDisplayAdminsTable();
                showSuccessMessageModal();
            } else {
                console.error('Error updating admin. Status:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }

            editModal.style.display = 'none';
        } catch (error) {
            console.error('Error updating admin:', error);
        }
    });

    cancelEditButton.onclick = function () {
        console.log('Edit operation canceled');
        editModal.style.display = 'none';
    };

    editModal.style.display = 'block';
}


 function showSuccessMessageModal() {
    const successMessageModal = document.getElementById('successMessageModal');
    successMessageModal.style.display = 'block';

    setTimeout(() => {
        successMessageModal.style.display = 'none';
    }, 1000);
}
