import { ProductManager } from "../../../utils/product_functions";
const socket = io();

const productManager = new ProductManager('products.json');
const productList = productManager.getProducts();

socket.emit('products', productList);