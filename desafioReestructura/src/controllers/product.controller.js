const { ProductManager } = require('../dao/classes/product.dao.js');
const Product = require('../dao/models/product.model.js');

const productManager = new ProductManager();

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, availability } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

        const queryOptions = {};
        if (availability === 'true') {
            queryOptions.status = true;
        }
        if (query) {
            queryOptions.category = query;
        }

        const products = await Product.paginate(queryOptions, options);

        if (!products || !products.docs || products.docs.length === 0) {
            throw new Error('Productos no encontrados o payload no definido');
        }

        const totalPages = products.totalPages;
        const hasPrevPage = products.hasPrevPage;
        const hasNextPage = products.hasNextPage;
        const prevPage = products.prevPage;
        const nextPage = products.nextPage;

        return {
            docs: products.docs,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        };
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        throw new Error('Error al cargar los productos');
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        console.log(`Buscando producto con ID: ${productId}`);
        const product = await productManager.getProductById(productId);
        if (product) {
            const plainProduct = product.toObject();
            res.render('productDetail', { product: plainProduct, user: req.session.user });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al obtener el producto");
    }
};

const addProduct = async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        await productManager.addProduct(req.body);
        res.status(201).json({ message: `Producto "${title}" agregado correctamente.` });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.status(200).json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente.` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
