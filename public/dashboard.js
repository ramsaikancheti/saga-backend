document.addEventListener('DOMContentLoaded', function () {
    loadOrdersTable();
    fetchAndDisplayTotalProductsPieChart();
    fetchAndDisplayFourDaysGraph();
    loadTodaysOrders();
    loadYesterdaysOrders();
    loadThisMonthsOrders();
    loadLastMonthsOrders();
    loadAllTimeSales();
});


// orders_data

async function loadTodaysOrders() {
    const apiUrl = '/orders/todaysorders';
    
    try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Error fetching today's orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Today's orders data:", data);
    displayOrdersData(data);
    } catch (error) {
    console.error("Error loading today's orders:", error);
    throw error;
    }
    }
    
    
    function loadYesterdaysOrders() {
    const apiUrl = '/orders/yesterdaysorders';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching yesterday's orders: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Yesterday's orders data:", data);
            displayYesterdaysOrdersData(data);
        })
        .catch(error => {
            console.error('Error fetching yesterday\'s orders:', error);
        });
    }
    
    async function loadThisMonthsOrders() {
    const apiUrl = '/orders/thismonthorders';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching this month's orders: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("This month's orders data:", data);
        displayThisMonthsOrdersData(data);
    } catch (error) {
        console.error('Error fetching this month\'s orders:', error);
    }
    }
    
    async function loadLastMonthsOrders() {
    const apiUrl = '/orders/lastmonthorders';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching last month's orders: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("last month's orders data:", data);
        displayLastMonthsOrdersData(data);
    } catch (error) {
        console.error('Error fetching last month\'s orders:', error);
    }
    }
    
    async function loadAllTimeSales() {
    const apiUrl = '/orders/alltimesales'; 
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching all time sales: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("last month's orders data:", data);
        displayAllTimeSalesData(data);
    } catch (error) {
        console.error('Error fetching alltime sale\'s:', error);
    }
    }
    
    
    function displayOrdersData(data) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';
    
     const ordersHeading = document.createElement('h1');
    ordersHeading.innerText = 'Dashboard Overview';
    ordersHeading.classList.add('orders-heading');
    mainContent.appendChild(ordersHeading);
    
    const ordersDataDiv = document.createElement('div');
    ordersDataDiv.classList.add('orders_data');
    
    mainContent.appendChild(ordersDataDiv);
    
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.classList.add('order-details-box');
    
    const totalOrdersHeading = document.createElement('h2');
    totalOrdersHeading.innerText = 'Today orders';
    const totalOrdersValue = document.createElement('p');
    totalOrdersValue.classList.add('total-orders-value');
    totalOrdersValue.innerText = data.totalOrders;
    
    const totalAmountHeading = document.createElement('h2');
    totalAmountHeading.innerText = '';
    const totalAmountValue = document.createElement('p');
    totalAmountValue.classList.add('total-amount-value');
    totalAmountValue.innerText = '$' + data.totalAmount;
    
    orderDetailsDiv.appendChild(totalOrdersHeading);
    orderDetailsDiv.appendChild(totalOrdersValue);
    orderDetailsDiv.appendChild(totalAmountHeading);
    orderDetailsDiv.appendChild(totalAmountValue);
    
    if (data.paymentTypeDetails) {
        const paymentDetailsHeading = document.createElement('h2');
        paymentDetailsHeading.innerText = '';
        orderDetailsDiv.appendChild(paymentDetailsHeading);
    
        for (const [paymentType, details] of Object.entries(data.paymentTypeDetails)) {
            const paymentTypeDiv = document.createElement('div');
            paymentTypeDiv.classList.add('payment-type-box');
    
            const paymentTypeHeading = document.createElement('h3');
            paymentTypeHeading.innerText = paymentType;
            const paymentTypeDetailsValue = document.createElement('p');
            paymentTypeDetailsValue.innerText = `Orders: ${details.count},  ${details.totalAmount}`;
    
            paymentTypeDiv.appendChild(paymentTypeHeading);
            paymentTypeDiv.appendChild(paymentTypeDetailsValue);
            orderDetailsDiv.appendChild(paymentTypeDiv);
        }
    }
    
    ordersDataDiv.appendChild(orderDetailsDiv);
    }
    
    
    function displayYesterdaysOrdersData(data) {
    const mainContent = document.getElementById('mainContent');
    
    const ordersDataDiv = document.querySelector('.orders_data');
    
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.classList.add('order-details-box2');
    
    const totalOrdersHeading = document.createElement('h2');
    totalOrdersHeading.innerText = 'Yesterday\'s Orders';
    const totalOrdersValue = document.createElement('p');
    totalOrdersValue.classList.add('total-orders-value');
    totalOrdersValue.innerText = data.totalOrders;
    
    const totalAmountHeading = document.createElement('h2');
    totalAmountHeading.innerText = '';
    const totalAmountValue = document.createElement('p');
    totalAmountValue.classList.add('total-amount-value');
    totalAmountValue.innerText = '$'+ data.totalAmount;
    
    orderDetailsDiv.appendChild(totalOrdersHeading);
    orderDetailsDiv.appendChild(totalOrdersValue);
    orderDetailsDiv.appendChild(totalAmountHeading);
    orderDetailsDiv.appendChild(totalAmountValue);
    
     if (data.paymentTypeDetails) {
        const paymentDetailsHeading = document.createElement('h2');
        paymentDetailsHeading.innerText = ' ';
        orderDetailsDiv.appendChild(paymentDetailsHeading);
    
        for (const [paymentType, details] of Object.entries(data.paymentTypeDetails)) {
            const paymentTypeDiv = document.createElement('div');
            paymentTypeDiv.classList.add('payment-type-box');
    
            const paymentTypeHeading = document.createElement('h3');
            paymentTypeHeading.innerText = paymentType;
            const paymentTypeDetailsValue = document.createElement('p');
            paymentTypeDetailsValue.innerText = `Orders: ${details.count},  $ ${details.totalAmount}`;
    
            paymentTypeDiv.appendChild(paymentTypeHeading);
            paymentTypeDiv.appendChild(paymentTypeDetailsValue);
            orderDetailsDiv.appendChild(paymentTypeDiv);
        }
    }
    
    ordersDataDiv.appendChild(orderDetailsDiv);
    
    }
    
    function displayThisMonthsOrdersData(data) {
    const mainContent = document.getElementById('mainContent');
    
    const ordersDataDiv = document.querySelector('.orders_data');
    
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.classList.add('order-details-box3');
    
    const totalOrdersHeading = document.createElement('h2');
    totalOrdersHeading.innerText = "This Month's Orders";
    const totalOrdersValue = document.createElement('p');
    totalOrdersValue.classList.add('total-orders-value');
    totalOrdersValue.innerText = data.totalOrders;
    
    const totalAmountHeading = document.createElement('h2');
    totalAmountHeading.innerText = '';
    const totalAmountValue = document.createElement('p');
    totalAmountValue.classList.add('total-amount-value');
    totalAmountValue.innerText = '$' + data.totalAmount;
    
    orderDetailsDiv.appendChild(totalOrdersHeading);
    orderDetailsDiv.appendChild(totalOrdersValue);
    orderDetailsDiv.appendChild(totalAmountHeading);
    orderDetailsDiv.appendChild(totalAmountValue);
    
    if (data.paymentTypeDetails) {
        const paymentDetailsHeading = document.createElement('h2');
        paymentDetailsHeading.innerText = ' ';
        orderDetailsDiv.appendChild(paymentDetailsHeading);
    
        for (const [paymentType, details] of Object.entries(data.paymentTypeDetails)) {
            const paymentTypeDiv = document.createElement('div');
            paymentTypeDiv.classList.add('payment-type-box');  
    
            const paymentTypeHeading = document.createElement('h3');
            paymentTypeHeading.innerText = paymentType;
            const paymentTypeDetailsValue = document.createElement('p');
            paymentTypeDetailsValue.innerText = `Orders: ${details.count},  ${details.totalAmount}`;
    
            paymentTypeDiv.appendChild(paymentTypeHeading);
            paymentTypeDiv.appendChild(paymentTypeDetailsValue);
            orderDetailsDiv.appendChild(paymentTypeDiv);
        }
    }
    
    ordersDataDiv.appendChild(orderDetailsDiv);
    
    }
    
    
    function displayLastMonthsOrdersData(data) {
    const mainContent = document.getElementById('mainContent');
    
    const ordersDataDiv = document.querySelector('.orders_data');
    
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.classList.add('order-details-box4');
    
    const totalOrdersHeading = document.createElement('h2');
    totalOrdersHeading.innerText = "Last Month's Orders";
    const totalOrdersValue = document.createElement('p');
    totalOrdersValue.classList.add('total-orders-value');
    totalOrdersValue.innerText = data.totalOrders;
    
    const totalAmountHeading = document.createElement('h2');
    totalAmountHeading.innerText = '';
    const totalAmountValue = document.createElement('p');
    totalAmountValue.classList.add('total-amount-value');
    totalAmountValue.innerText = '$' + data.totalAmount;
    
    orderDetailsDiv.appendChild(totalOrdersHeading);
    orderDetailsDiv.appendChild(totalOrdersValue);
    orderDetailsDiv.appendChild(totalAmountHeading);
    orderDetailsDiv.appendChild(totalAmountValue);
    
    if (data.paymentTypeDetails) {
        const paymentDetailsHeading = document.createElement('h2');
        paymentDetailsHeading.innerText = ' ';
        orderDetailsDiv.appendChild(paymentDetailsHeading);
    
        for (const [paymentType, details] of Object.entries(data.paymentTypeDetails)) {
            const paymentTypeDiv = document.createElement('div');
            paymentTypeDiv.classList.add('payment-type-box');  
    
            const paymentTypeHeading = document.createElement('h3');
            paymentTypeHeading.innerText = paymentType;
            const paymentTypeDetailsValue = document.createElement('p');
            paymentTypeDetailsValue.innerText = `Orders: ${details.count},  ${details.totalAmount}`;
    
            paymentTypeDiv.appendChild(paymentTypeHeading);
            paymentTypeDiv.appendChild(paymentTypeDetailsValue);
            orderDetailsDiv.appendChild(paymentTypeDiv);
        }
    }
    
    ordersDataDiv.appendChild(orderDetailsDiv);
    
    } 
    
    function displayAllTimeSalesData(data) {
    const mainContent = document.getElementById('mainContent');
    
    const ordersDataDiv = document.querySelector('.orders_data');
    
    const orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.classList.add('order-details-box5');
    
    const totalOrdersHeading = document.createElement('h2');
    totalOrdersHeading.innerText = "All-Time Sales";
    const totalOrdersValue = document.createElement('p'); 
    
    const totalAmountHeading = document.createElement('h2');
    totalAmountHeading.innerText = '';
    const totalAmountValue = document.createElement('p');
    totalAmountValue.classList.add('total-amount-value');
    totalAmountValue.innerText = '$' + data.totalAmount;
    
    orderDetailsDiv.appendChild(totalOrdersHeading);
    orderDetailsDiv.appendChild(totalOrdersValue);
    orderDetailsDiv.appendChild(totalAmountHeading);
    orderDetailsDiv.appendChild(totalAmountValue); 
     
    ordersDataDiv.appendChild(orderDetailsDiv);
    }

    // charts

    async function fetchAndDisplayFourDaysGraph() {
        try {
            const response = await fetch('/orders/api/four-days-orders');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            console.log("Received data from API:", data);
        
            const labels = data.orders.map(order => order.date);
            const orderCounts = data.orders.map(order => order.totalOrders);
        
            displayGraph(labels, orderCounts);
            document.getElementById('myChartContainer').style.display = 'block';
        } catch (error) {
            console.error('Error fetching four-days orders:', error);
        }
        }
        
        
        function displayGraph(labels, data) {
        console.log("Labels:", labels);
        console.log("Data:", data);
        
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orders',
                    data: data,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: 'rgba(75, 192, 192, 1)',
                    pointHoverRadius: 8,
                    spanGaps: true,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 1,
                        suggestedMax: Math.max(...data) + 1,  
                    }
                }
            }
        });
        }        

// table

function getStatusName(statusValue) {
    switch (parseInt(statusValue, 10)) {
        case 1:
            return 'Processing';
        case 2:
            return 'Pending';
        case 3:
            return 'Delivered';
        case 4:
            return 'Cancelled';
        default:
            return 'Unknown Status';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const updateResponse = await fetch(`/orders/updateorder/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update order status');
        }

        try {
            const getOrderResponse = await fetch(`/orders/${orderId}`);
            if (!getOrderResponse.ok) {
                throw new Error('Failed to get updated order details');
            }

            const updatedOrderData = await getOrderResponse.json();
            updateTableRow(orderId, updatedOrderData);
        } catch (getOrderError) {
            console.error('Error getting updated order details:', getOrderError);
        }
    } catch (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
    }
}

function updateTableRow(orderId, updatedOrderData) {
    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
    if (row) {
        const statusCell = row.querySelector('td:nth-child(6)');
        if (statusCell) {
            statusCell.textContent = getStatusName(updatedOrderData.status);
        }
    }
}

function handleOrderClick(orderId) {
    try {
         window.location.href = `/order?orderId=${orderId}`;
    } catch (error) {
        console.error('Error handling order click:', error);
    }
}

async function loadOrdersTable() {
    try {
        const response = await fetch('/orders/all');
        const responseData = await response.json();

        const ordersData = Array.isArray(responseData) ? responseData : responseData.orders;

        const tableContainer = document.getElementById('ordersTableContainer');

        if (!tableContainer) {
            console.error("Error: Element with ID 'ordersTableContainer' not found.");
            return;
        }

        const table = document.createElement('table');
        table.classList.add('orders-table');

        const caption = document.createElement('caption');
        caption.textContent = 'Recent Orders';
        table.appendChild(caption);

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headings = ['ORDER ID', 'DATE', 'NAME', 'PAYMENT', 'TOTAL AMOUNT', 'STATUS', 'ACTION'];

        headings.forEach(headingText => {
            const th = document.createElement('th');
            th.textContent = headingText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        ordersData.forEach(order => {
            const tr = document.createElement('tr');
            tr.dataset.orderId = order.orderId;
            tr.innerHTML = `
            <td class="order-id" onclick="handleOrderClick('${order.orderId}')">${order.orderId}</td>
                <td>${new Date(order.created_at).toLocaleDateString('en', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                <td>${order.user ? order.user.name : ''}</td>
                <td>${order.payments ? order.payments.name : ''}</td>
                <td>${order.totalAmount}</td>
                <td>${getStatusName(order.status)}</td>
                <td>
                    <select class="action-dropdown" data-order-id="${order.orderId}" data-original-status="${order.status}">
                        <option value="1" ${order.status === 1 ? 'selected' : ''}>Processing</option>
                        <option value="2" ${order.status === 2 ? 'selected' : ''}>Pending</option>
                        <option value="3" ${order.status === 3 ? 'selected' : ''}>Delivered</option>
                        <option value="4" ${order.status === 4 ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

        document.querySelectorAll('.action-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', async (event) => {
                const orderId = event.target.dataset.orderId;
                const newStatus = event.target.value;

                try {
                    await updateOrderStatus(orderId, newStatus);
                    console.log('Order status updated successfully');

                    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
                    const statusCell = row.querySelector('td:nth-child(6)');
                    if (statusCell) {
                        statusCell.textContent = getStatusName(newStatus);
                    }
                } catch (updateError) {
                    console.error('Error updating order status:', updateError);

                    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
                    const statusCell = row.querySelector('td:nth-child(6)');
                    if (statusCell) {
                        const originalStatus = event.target.getAttribute('data-original-status');
                        statusCell.textContent = getStatusName(originalStatus);
                        event.target.value = originalStatus;
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading orders table:', error);
    }
}

loadOrdersTable();

async function fetchAndDisplayTotalProductsPieChart() {
try {
const response = await fetch('/orders/api/totalproducts');
if (!response.ok) {
    throw new Error('Failed to fetch data');
}

const data = await response.json();
console.log("Received data from API (Total Products):", data);

const productNames = data.totalProducts.map(product => product.productName);
const totalOrders = data.totalProducts.map(product => product.totalOrders);

displayPieChart(productNames, totalOrders);
} catch (error) {
console.error('Error fetching total products:', error);
}
}

function displayPieChart(labels, data) {
console.log("Labels:", labels);
console.log("Data:", data);

const ctx = document.getElementById('pieChart').getContext('2d');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                'rgb(255 0 54 / 70%)',
                ' rgb(255 188 0 / 70%)',
                'rgb(0 152 255)',
                'rgb(11 211 211)',
             ],
        }]
    },
    options: {
        responsive: true,
    }
});
}