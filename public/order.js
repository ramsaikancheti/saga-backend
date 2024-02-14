async function fetchOrderDetails(orderId) {
    try {
        console.log('Fetching order details for orderId:', orderId);
        const orderResponse = await fetch(`/orders/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error('Failed to fetch order details');
        }

        return await orderResponse.json();
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const orderStatusDropdown = document.getElementById('orderActionDropdown');
    const orderStatusSpan = document.getElementById('orderStatus');

    orderStatusDropdown.addEventListener('change', async () => {
        const newStatus = orderStatusDropdown.value;
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        try {
            await updateOrderStatus(orderId, newStatus);
            console.log('Order status updated successfully');

             orderStatusSpan.textContent = getStatusName(newStatus);
        } catch (updateError) {
            console.error('Error updating order status:', updateError);
        }
    });
});

 function getStatusName(status) {
    switch (status) {
        case '1':
            return 'Processing';
        case '2':
            return 'Pending';
        case '3':
            return 'Delivered';
        case '4':
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
        } 
        catch (getOrderError) {
            console.error('Error getting updated order details:', getOrderError);
        }
    } catch (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const paymentStatusDropdown = document.getElementById('paymentStatusDropdown');
    const paymentStatusSpan = document.getElementById('payment-status');
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    try {
         const orderData = await fetchOrderDetails(orderId);
        displayOrderDetails(orderData);

         paymentStatusDropdown.value = orderData.order.payments.status.toString();

        paymentStatusDropdown.addEventListener('change', async () => {
            const newPaymentStatus = paymentStatusDropdown.value;

            try {
                 await updatePaymentStatus(orderId, newPaymentStatus);
                console.log('Payment status updated successfully');

                 const updatedOrderData = await fetchOrderDetails(orderId);

                 displayOrderDetails(updatedOrderData);

                 paymentStatusDropdown.value = updatedOrderData.order.payments.status.toString();
            } catch (updateError) {
                console.error('Error updating payment status:', updateError);
            }
        });
    } catch (error) {
        console.error('Error loading order details:', error);
    }
}); 


function updateTableRow(orderId, updatedOrderData) {
     console.log(`Updating table row for order ${orderId} with updated data:`, updatedOrderData);
}
 async function updatePaymentStatus(orderId, newPaymentStatus) {
    try {
        const updateResponse = await fetch(`/orders/api/PaymentStatus/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: parseInt(newPaymentStatus, 10) }),
        });

        if (!updateResponse.ok) {
            console.error('Failed to update payment status. Server response:', updateResponse);
            throw new Error('Failed to update payment status');
        }

         const getOrderResponse = await fetch(`/orders/${orderId}`);
        const updatedOrderData = await getOrderResponse.json();

         updateTableRow(orderId, updatedOrderData);

    } catch (updateError) {
        console.error('Error updating payment status:', updateError);
        throw updateError;
    }
} 


function displayOrderDetails(orderData) {
    const productRowsContainer = document.getElementById('productRows');
    const discountSpan = document.getElementById('discount');
    const totalSpan = document.getElementById('total');

    productRowsContainer.innerHTML = '';

    const orderStatusDropdown = document.getElementById('orderActionDropdown');
    orderStatusDropdown.value = orderData.order.status.toString();

     orderData.order.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.quantity}</td>
            <td>$${orderData.order.discount}</td>
            <td>$${orderData.order.totalAmount}</td>
        `;
        productRowsContainer.appendChild(row);
    }); 
    const paymentStatusSpan = document.getElementById('paymentStatus');
    const orderStatusSpan = document.getElementById('orderStatus');
    
    paymentStatusSpan.textContent = orderData.order.payments.status === 1 ? 'Paid' : 'Pending';
    
     switch (orderData.order.status) {
      case 1:
        orderStatusSpan.textContent = 'Processing';
        break;
      case 2:
        orderStatusSpan.textContent = 'Pending';
        break;
      case 3:
        orderStatusSpan.textContent = 'Delivered';
        break;
      case 4:
        orderStatusSpan.textContent = 'Cancelled';
        break;
      default:
        orderStatusSpan.textContent = 'Unknown Status';
        break;
    }
    

    const paymentId = document.getElementById('paymentId');
    const payment = document.getElementById('transaction');

    paymentId.textContent = orderData.order.payments.paymentId;
    payment.textContent = orderData.order.payments.name; 

    const name = document.getElementById('name');
    const email = document.getElementById('email');
     const location = document.getElementById('addressdata');
    const pincode = document.getElementById('pin');
    
    name.textContent = orderData.order.user.name;
    email.textContent = orderData.order.user.email;
     location.innerHTML = `
        House No: ${orderData.order.address.hNo}<br>
        Area: ${orderData.order.address.area}<br>
        City: ${orderData.order.address.city}<br>
        State: ${orderData.order.address.state}
    `;
    pincode.textContent = orderData.order.address.pincode;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    try {
        console.log('Attempting to load order details for orderId:', orderId);

        if (orderId) {
            const orderData = await fetchOrderDetails(orderId);
            console.log('Order details fetched successfully:', orderData);

            displayOrderDetails(orderData);
        } else {
            console.error('Error: Order ID not found in the URL.');
        }
    } catch (error) {
        console.error('Error loading order details:', error);
    }
});  


document.addEventListener('DOMContentLoaded', () => {
    const printInvoiceButton = document.getElementById('print-invoice');
    printInvoiceButton.addEventListener('click', () => {
        downloadInvoice();
    });
});

async function downloadInvoice() {
    const orderDetailsContainer = document.getElementById('orderDetailsContainer');

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const orderData = await fetchOrderDetails(orderId);

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = `
            <div class="invoice">
                <div class="shooppix">
                    <h1><i class="fa-brands fa-shopify" style="color: rgb(88, 251, 197);"></i>Shoppix</h1>
                </div>
    
                <div class="invoiceheading">
                    <h1>Invoice</h1>
                </div>
            </div>
    
            <div class="invoice">
                <div class="orderid">
                    <h3>Order Id  #${orderId}</h3> 
                </div>
                <div class="invoiceid">
                    <h4>Date: ${getCurrentDate()}</h4>
                </div> 
            </div>
            <hr>
         
            <div class="email">
                <div class="two">
                    <h3>Name</h3>
                    <p>${orderData.order.user.name}</p>
                </div>
    
                <div class="two">
                    <h3>Email </h3>
                    <p>${orderData.order.user.email}</p>
                </div>
            </div>
    
            <div class="con">   
                <h3>Address</h3>
                <p>${getAddressString(orderData.order.address)}</p>
    
                <h3>Payment Info</h3>
                <p>Method: ${orderData.order.payments.name}</p>
                <p>Status: ${getPaymentStatus(orderData.order.payments.status)}</p>
            </div>
    
            <div class="table2"> 
                <table>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Product Quantity</th>
                        <th>Discount</th>
                        <th>Total</th>
                    </tr>
            
                    ${orderData.order.products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>$${product.price}</td>
                            <td>${product.quantity}</td>
                            <td>$${orderData.order.discount}</td>
                            <td>$${orderData.order.totalAmount}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;

        const cloneContainer = tempContainer.cloneNode(true);

        await html2pdf(cloneContainer, { margin: 10, filename: 'invoice.pdf' });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}
function getAddressString(address) {
    return `${address.hNo}, ${address.area}, ${address.city}, ${address.state} - ${address.pincode}`;
}

 function getPaymentStatus(status) {
    return status === 1 ? 'Paid' : 'Pending'; 
}
function getCurrentDate() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
}
 







// async function downloadInvoice() {
//     const orderDetailsContainer = document.getElementById('orderDetailsContainer');

//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const orderId = urlParams.get('orderId');
//         const orderData = await fetchOrderDetails(orderId);

//         orderDetailsContainer.innerHTML = `
//         <div class="invoice">
//             <div class="shooppix">
//                 <h1><i class="fa-brands fa-shopify" style="color: rgb(88, 251, 197);"></i>Shoppix</h1>
//             </div>

//             <div class="invoiceheading">
//                 <h1>Invoice</h1>
//             </div>
//         </div>     

//         <div class="invoice">
//             <div class="orderid">
//                 <h3>Order Id  #${orderId}</h3> 
//             </div>
//             <div class="invoiceid">
//                 <h4>Date: ${getCurrentDate()}</h4>
//             </div> 
//         </div>
//             <hr>
         
//         <div class="email">
//             <div class="two">
//                 <h3>Name</h3>
//                 <p>${orderData.order.user.name}</p>
//             </div>

//             <div class="two">
//             <h3>Email </h3>
//                 <p>${orderData.order.user.email}</p>
//             </div>
//         </div>

//         <div class="con">   
//             <h3>Address</h3>
//             <p>${getAddressString(orderData.order.address)}</p>

//             <h3>Payment Info</h3>
//             <p>Method: ${orderData.order.payments.name}</p>
//             <p>Status: ${getPaymentStatus(orderData.order.payments.status)}</p>
//         </div>
//         <div class="table2"> 
//            <table>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Product Price</th>
//                     <th>Product Quantity</th>
//                     <th>Discount</th>
//                     <th>Total</th>
//                 </tr>
        
//                 ${orderData.order.products.map(product => `
//                     <tr>
//                         <td>${product.name}</td>
//                         <td>$${product.price}</td>
//                         <td>${product.quantity}</td>
//                         <td>$${orderData.order.discount}</td>
//                         <td>$${orderData.order.totalAmount}</td>
//                     </tr>
//                 `).join('')}
//            </table>
   
//         </div>
//         `;

//         orderDetailsContainer.style.color = 'black';

//         await html2pdf(orderDetailsContainer, { margin: 10, filename: 'invoice.pdf' });
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//     } finally {
//         orderDetailsContainer.style.color = '';
//     }
// }