const fs = require('fs').promises;

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


    async updateProduct(id, updatedFields) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index === -1) {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return;
            }

            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProducts();
            console.log(`Producto con ID '${id}' actualizado exitosamente.`);
        } catch (error) {
            console.error("Error actualizando el producto:", error);
        }
    }

    async deleteProduct(id) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index === -1) {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return;
            }

            this.products.splice(index, 1);
            await this.saveProducts();
            console.log(`Producto con ID '${id}' eliminado exitosamente.`);
        } catch (error) {
            console.error("Error eliminando el producto:", error);
        }
    }



    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, data, 'utf8');
        } catch (error) {
            console.error("Error guardando los productos en el archivo:", error);
        }
    }

    //No tiene mucho sentido leer el archivo otra vez ya que para eso está la función loadProducts, pero igualmente lo hago para practicar lectura de archivos y también porque lo pide la consigna.
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

    //No tiene mucho sentido leer el archivo otra vez ya que para eso está la función loadProducts, pero igualmente lo hago para practicar lectura de archivos y también porque lo pide la consigna.
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

    async addProduct(title, description, price, thumbnail, code, stock) {
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
        await this.saveProducts();
        console.log("Producto agregado exitosamente.");
    }
}


// Proceso de testing

(async () => {

    // 1
    const productManager = new ProductManager('testing.json');
    await productManager.loadProducts();

    /*
    // 2
    console.log(await productManager.getProducts()); // []

    // 3
    await productManager.addProduct('producto prueba 1', 'Este es un producto prueba 1', 100, 'Sin imagen', 'abc111', 21);
    await productManager.addProduct('producto prueba 2', 'Este es un producto prueba 2', 200, 'Sin imagen', 'abc222', 22);
    await productManager.addProduct('producto prueba 3', 'Este es un producto prueba 3', 300, 'Sin imagen', 'abc333', 23);
    await productManager.addProduct('producto prueba 4', 'Este es un producto prueba 4', 400, 'Sin imagen', 'abc444', 24);

    //4
    console.log(await productManager.getProducts());  

    //5
    await productManager.getProductById(5);

    //6
    await productManager.updateProduct(2, { description: 'Descripción actualizada del producto 2' });

    //7
    await productManager.deleteProduct(4);

    */

})();
