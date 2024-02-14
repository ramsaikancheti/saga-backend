document.addEventListener('DOMContentLoaded', function () {
    loadAllOrders();
});

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

function displayAllOrders(orders) {
const ordersContainer = document.getElementById('mainContent');
ordersContainer.innerHTML = '<h2>All Orders</h2>';

if (orders.length === 0) {
ordersContainer.innerHTML += '<p>No orders available.</p>';
return;
}

orders.forEach(order => {
console.log('Order data:', order);
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

const userIcon = document.createElement('i');
userIcon.className = 'fa fa-user';
userIcon.style.color = '#57a0e5';
userIcon.style.backgroundColor = '#b7cde1d1';
userIcon.style.padding = '7px';
userIcon.style.borderRadius = '10px';
userIcon.style.marginLeft = '-36px';
userIcon.style.marginTop = '10px';

const addressIcon = document.createElement('i');
addressIcon.className = 'fas fa-location-dot';
addressIcon.style.color = '#57a0e5';
addressIcon.style.backgroundColor = '#b7cde1d1';
addressIcon.style.padding = '7px 8px';
addressIcon.style.borderRadius = '10px';
addressIcon.style.marginLeft = '-36px';
addressIcon.style.marginTop = '10px';

const paymentIcon = document.createElement('i');
paymentIcon.className = 'fas fa-credit-card';
paymentIcon.style.color = '#57a0e5';
paymentIcon.style.backgroundColor = '#b7cde1d1';
paymentIcon.style.padding = '7px';
paymentIcon.style.borderRadius = '10px';
paymentIcon.style.marginLeft = '-36px';
paymentIcon.style.marginTop = '10px';

orderInfo.innerHTML += `
<div class="flex">
<div class="user-info"><p>${userIcon.outerHTML} User: ${getUserInfo(order.user) || 'N/A'}</p></div>
<div class="address-info"><p>${addressIcon.outerHTML} Address: ${getAddressInfo(order.address) || 'N/A'}</p></div>
<p>${paymentIcon.outerHTML} Payment: ${getPaymentInfo(order.payments !== undefined ? order.payments : []) || 'N/A'}</p>
</div>
`;

orderBox.appendChild(orderInfo);

const orderTable = document.createElement('table');
orderTable.className = 'order-table';

orderTable.innerHTML = `
<thead>
<tr>
    <th>Image</th>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Price</th>
    <th>Total</th>
</tr>
</thead>
`;
const orderTableBody = document.createElement('tbody');

if (order.products && order.products.length > 0) {
order.products.forEach(product => {
    const productInfo = getProductDetailsForTable(product, order);
    orderTableBody.innerHTML += productInfo;
});
}

orderTable.appendChild(orderTableBody);
orderBox.appendChild(orderTable);

return orderBox;
}

function getProductDetailsForTable(product, order) {
const filteredProductDetailsArray = [];

const imageUrls = product.images !== undefined ? product.images : [];

if (imageUrls.length > 0) {
 const imageUrl = imageUrls[0];
console.log('Image URL:', imageUrl);
filteredProductDetailsArray.push(`<td><img src="${imageUrl}" style="width:60px"></td>`);
} else {
 filteredProductDetailsArray.push('<td>No Image</td>');
}

const validHeadings = ['name', 'quantity', 'price'];

validHeadings.forEach(heading => {
if (product.hasOwnProperty(heading)) {
    const value = product[heading];

    if (Array.isArray(value)) {
        const arrayValues = value.join(', ');
        filteredProductDetailsArray.push(`<td>${arrayValues}</td>`);
    } else {
        const formattedValue = value !== undefined ? value : 'N/A';
        filteredProductDetailsArray.push(`<td>${formattedValue}</td>`);
    }
} else {
    filteredProductDetailsArray.push('<td></td>');
}
});

const totalAmount = order.totalAmount !== undefined ? order.totalAmount : 'N/A';
filteredProductDetailsArray.push(`<td>${totalAmount}</td>`);

return `<tr>${filteredProductDetailsArray.join('')}</tr>`;
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
if (!payment) {
    return 'N/A';
}

const paymentInfoArray = [];
for (const key in payment) {
    if (payment.hasOwnProperty(key)) {
        paymentInfoArray.push(`${key}: ${payment[key]}`);
    }
}

return paymentInfoArray.join(', ');
}