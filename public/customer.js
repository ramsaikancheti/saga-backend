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
                <td><i class="fas fa-edit" onclick="editUser(${user.userId})"></i></td>
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