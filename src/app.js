import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import realTimeProducts from './routes/realTimeProducts.router.js'

const app = express()
const PORT = 8080

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

import { fileURLToPath } from 'url'
import {dirname} from 'path'
import productManager from './controllers/products.controllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '/public')))

//Routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

//Handlebars config
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set('view engine', 'handlebars')

const httpServer = app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`);
})

//socket.io connection
const socketServer = new Server(httpServer)

app.use('/', viewsRouter)
app.use('/realTimeProducts', realTimeProducts)

socketServer.on('connection',  (socket) => {
    console.log('New client connected!');
    try {
        const products =  productManager.getProducts();
        socketServer.emit('products', products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    
    socket.on('new-product',  (newProduct) => {
        try {
            const newProductObject = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                statu: newProduct.statu,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            }
             
            const response = productManager.addProduct(newProductObject);
            const products =  productManager.getProducts();

            socketServer.emit('products', products);
            socketServer.emit('response', { status: 'success' , message: response});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    });
        

    socket.on('remove-product',  async(id) => {
        try {
            const response = await productManager.removeProduct(id);
            const products =  productManager.getProducts();

            socketServer.emit('products', products);
            socketServer.emit('response', { status: 'success', message: response });
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })})