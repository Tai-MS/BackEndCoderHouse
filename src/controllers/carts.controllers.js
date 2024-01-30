import fs from 'fs'
import productManager from './products.controllers.js'


class CartManager{
    constructor(){
        this.carts = []
        this.path = './json/carts.json'
    }

    //Funcion que se asegura de que el JSON existe,
    //si no existe creara uno nuevo
    readJson(){
        if(fs.existsSync(this.path)){
            const data = fs.readFileSync(this.path, 'utf-8')
            const parsedData = JSON.parse(data)
            this.carts = parsedData
            return true
        }else{
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
            return true, 'Carts JSON succesfully created'
        }
    }

    async createNewCart() {
        try {
            //Lee el contenido del JSON
            const data = await fs.promises.readFile(this.path, 'utf-8');
            //Parsea el contenido y devuelve un array
            const currentCarts = JSON.parse(data);
    
            // Crea un nuevo carrito
            const newCart = {
                id: currentCarts.length + 1,
                products: []
            };
    
            //Agrega el nuevo carrito al array 
            currentCarts.push(newCart);
    
            //Escribe el array actualizado en el JSON
            await fs.promises.writeFile(this.path, JSON.stringify(currentCarts, null, 2));
    
            console.log(currentCarts);
            return `Added new cart, ID ${newCart.id}`;
        } catch (error) {
            this.readJson()
            return "Error creating new cart";
        }
    }  

    async getProductsFromCart(id){
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const parsedData = JSON.parse(data)

            const idCoincidence = parsedData.find((cart) => cart.id == id)

            if(!idCoincidence){
                return "Cart not found"
            }else {
                return { id, products: idCoincidence.products };
            }

        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            //Lee el archivo JSON y lo parsea
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const parsedData = JSON.parse(data);
    
            //Busca el indice de cid dentro de la informacion parseada, si es que existe dicho id
            const cartIndex = parsedData.findIndex(cart => cart.id === parseInt(cid));
    
            if (cartIndex !== -1) {
                //Ahora busca el posible indice del pid dentro de products 
                const productIndex = parsedData[cartIndex].products.findIndex(product => product.id === parseInt(pid));
    
                if (productIndex !== -1) {
                    //Si dicho id ya existe, aumentara la cantidad, de lo contrario 
                    //simplemente lo añadira
                    parsedData[cartIndex].products[productIndex].quantity++;
                } else {
                    parsedData[cartIndex].products.push({ id: parseInt(pid), quantity: 1 });
                }
    
                //Guarda los cambios en el archivo JSON
                await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2));
                return `Product with ID ${pid} added to cart with ID ${cid} \n 
                Now you have ${parsedData[cartIndex].products[productIndex].quantity} of this product on your cart`;
            } else {
                return "Cart not found";
            }
        } catch (error) {
            this.readJson()
        }
    }
}

const cartManager = new CartManager()

export default cartManager