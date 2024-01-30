import express from 'express'
import cartManager from '../controllers/carts.controllers.js'

const router = express()

router.get('/:id', async (req, res) => {
    try {
        const result = await cartManager.getProductsFromCart(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await cartManager.createNewCart();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:cid/product/:pid', async(req, res) => {
    try {
        const result = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


export default router