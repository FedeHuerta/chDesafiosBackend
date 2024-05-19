const socket = io();

const productsList = document.getElementById('products-list');
const productForm = document.getElementById('product-form');

socket.on('updateProducts', (products) => {
    updateProductsList(products);
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