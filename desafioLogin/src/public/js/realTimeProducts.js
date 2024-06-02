const socket = io();

const productsList = document.getElementById('products-list');
const productForm = document.getElementById('product-form');
const pagination = document.getElementById('pagination');

socket.on('updateProducts', (products) => {
    updateProductsList(products.docs);
    updatePagination(products);
});

function updateProductsList(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.setAttribute('data-id', product._id);
        li.appendChild(deleteBtn);
        productsList.appendChild(li);
    });
}

function updatePagination(data) {
    pagination.innerHTML = '';
    if (data.hasPrevPage) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.dataset.page = data.prevPage;
        prevButton.addEventListener('click', () => loadProducts(data.prevPage));
        pagination.appendChild(prevButton);
    }
    if (data.hasNextPage) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.dataset.page = data.nextPage;
        nextButton.addEventListener('click', () => loadProducts(data.nextPage));
        pagination.appendChild(nextButton);
    }
}

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const title = formData.get('title');
    const description = formData.get('description');
    const price = formData.get('price');
    const thumbnail = formData.get('thumbnail');
    const code = formData.get('code');
    const stock = formData.get('stock');
    const status = formData.get('status');
    const category = formData.get('category');

    socket.emit('addProduct', { title, description, price, thumbnail, code, stock, status, category });
    productForm.reset();
});

productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id').toString();
        socket.emit('deleteProduct', id);
    }
});

async function loadProducts(page = 1) {
    const response = await fetch(`/api/products?page=${page}`);
    const data = await response.json();
    updateProductsList(data.docs);
    updatePagination(data);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
