class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const products = [...this.products];
        const buscarProducto = products.find(product => product.id === id);
        if (buscarProducto) {
            console.log(`Producto encontrado: ${buscarProducto.title}`);
            return buscarProducto;
        } else {
            console.log(`El producto con ID '${id}' no ha sido encontrado.`);
            return null;
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const product_id = this.products.length + 1;
        const product = {
            id: product_id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Debes llenar todos los campos para agregar un producto.");
            return;
        }

        const codeOrTitleExists = this.products.some(product => product.code === code || product.title === title);
        if (codeOrTitleExists) {
            console.log("Error, el código de producto o el título ya existe.");
            return;
        }

        this.products.push(product);
    }
}

const manager = new ProductManager();
manager.addProduct('Producto Prueba', 'Este es un producto de prueba.', 200, 'Sin Imagen', 'abc123', 25);
manager.addProduct('Producto Prueba', 'Este es un producto de prueba.', 200, 'Sin Imagen', 'abc123', 25);
manager.addProduct('Producto 2', 'Este es el producto 2.', 500, 'Sin Imagen', 'abc124', 35);
llamada = manager.getProducts();
console.log(llamada);
llamadaPorId = manager.getProductById(2);
console.log(llamadaPorId);
