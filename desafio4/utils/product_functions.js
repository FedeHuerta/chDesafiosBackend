import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            return { products };
        } catch (error) {
            console.error("Error leyendo los productos desde el archivo:", error);
            return [];
        }
    }


    async updateProduct(id, updatedFields) {
        try {
            const productsList = await this.getProducts();
            const index = productsList.findIndex(product => product.id === id);
            if (index === -1) {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return;
            }

            productsList[index] = { ...productsList[index], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify(productsList), 'utf8');
            console.log(`Producto con ID '${id}' actualizado exitosamente.`);
        } catch (error) {
            console.error("Error actualizando el producto:", error);
        }
    }

    async deleteProduct(id) {
        try {
            const productsList = await this.getProducts();
            const index = productsList.findIndex(product => product.id === id);
            if (index === -1) {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return;
            }

            productsList.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(productsList), 'utf8');
            console.log(`Producto con ID '${id}' eliminado exitosamente.`);
        } catch (error) {
            console.error("Error eliminando el producto:", error);
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

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        try {
            const productsList = await this.getProducts();
            const product_id = productsList.length + 1;

            const product = {
                id: product_id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status : true,
                category,
            }

            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                console.log("Debes llenar todos los campos para agregar un producto.");
                return;
            }

            const codeOrTitleExists = productsList.some(product => product.code === code || product.title === title);
            if (codeOrTitleExists) {
                console.log("Error, el código de producto o el título ya existe.");
                return;
            }

            productsList.push(product);
            await fs.writeFile(this.path, JSON.stringify(productsList), 'utf8');
            console.log("Producto agregado exitosamente.");
        } catch (error) {
            console.error("Error agregando un producto a la lista:", error);
        }
    }
}
