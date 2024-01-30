const socket = io();

socket.on('products', (products) => {
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Thumbnail</th>
        </tr>
    `;
    products.forEach((product) => {
        productsContainer.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>$${product.price}</td>
                <td>${product.statu}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.thumbnail}</td>
            </tr>
        `;
    });
});

document.querySelector('#add-product').addEventListener('submit', (event) => {
    event.preventDefault();
    
    socket.emit('new-product', {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        statu: document.getElementById('statu').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value
    })
    event.target.reset();
});

document.querySelector('#remove-product').addEventListener('submit', (event) => {
    event.preventDefault();
    const idToRemove = document.getElementById('id').value
    socket.emit('remove-product', idToRemove);
    event.target.reset();
});

socket.on('response', (response) => {
    if(response.status === 'success') {
        document.querySelector('#response-container').innerHTML = `<p class="success">${response.message}</p>`;
    } else {
        document.querySelector('#response-container').innerHTML = `<p class="error">${response.message}</p>`;
    }
});