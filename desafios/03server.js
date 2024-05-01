const fs = require('fs').promises;
const express = require('express');

const app = express();
const PORT = 8080;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error("El archivo no existe, creando uno vacío...");
                await fs.writeFile(this.path, '[]', 'utf8');
                this.products = [];
            } else {
                console.error("Error cargando los productos desde el archivo:", error);
                this.products = [];
            }
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            console.error("Error leyendo los productos desde el archivo:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            const product = products.find(product => product.id === id);
            if (product) {
                console.log(`Producto encontrado: ${product.title}`);
                return product;
            } else {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return null;
            }
        } catch (error) {
            console.error("Error leyendo los productos desde el archivo:", error);
            return null;
        }
    }

}

app.get('/products', async (req, res) => {
    try {
        const productManager = new ProductManager('testing.json');
        await productManager.loadProducts();
        const limit = parseInt(req.query.limit) || productManager.products.length;
        const products = productManager.products.slice(0, limit);
        res.json(products);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productManager = new ProductManager('testing.json');
        await productManager.loadProducts();
        const product = await productManager.getProductById(parseInt(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).json({ error: 'Error al cargar el producto' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

