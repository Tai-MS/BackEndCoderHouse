import fs from 'fs'

class ProductManager{
    constructor(){
        this.products = []
        this.path = './json/products.json'
        this.counter = 1
    }

    //Funcion que se asegura de que el JSON existe,
    //si no existe creara uno nuevo
    readJson(){
        if(fs.existsSync(this.path)){
            const data = fs.readFileSync(this.path, 'utf-8')
            const parsedData = JSON.parse(data)
            this.products = parsedData
            return true
        }else{
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
            return true, 'Products JSON succesfully created'
        }
    }

    addProduct(newProduct){
        //Si logra leer el JSON, guardara la informacion en las constantes ya parseada
        if(this.readJson() === true){
            
            const data = fs.readFileSync(this.path, 'utf-8')
            const parsedData = JSON.parse(data)

            //Busca el ID mas alto para que sea el valor a partir del cual se incrementa el 
            //numero de ID en un nuevo producto
            const maxId = Math.max(...parsedData.map(product => product.id));

            this.counter = maxId + 1;
            const {title, description, code, price, statu, stock, category, thumbnail} = newProduct
            //Indica los campos que son obligatorios
            if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
                return 'All fields must be completed';
            }
            
            //Si thumbnail no es ingresado, tomara el valor por defecto
            if (newProduct.thumbnail !== "") {
                newProduct.thumbnail = thumbnail;
            } else {
                newProduct.thumbnail = "No image";
            }
            
            //Si statu no es ingresado sera true por defecto
            if (newProduct.statu === "true" ) {
                newProduct.statu = true;
            }else{
                newProduct.statu = false;
            }
            //Verifica si el codigo con el que se ingresa el producto ya existe
            const repeatedCode = parsedData.findIndex(product => product.code === newProduct.code)
            //Si no existe el codigo, se agregara un nuevo objeto al array y al JSON
            if(repeatedCode === -1){
                // Añade el ID al objeto de newProduct
                newProduct = {
                    id: newProduct.id = this.counter, 
                    ...newProduct
                }
                this.products.push(newProduct);
                parsedData.push(newProduct);
                fs.writeFileSync(this.path, JSON.stringify(parsedData, null, 2));
                return 'The product was added to the JSON';
            }else{
                return 'The product code already exists'
            }

        }else{
            //Si el JSON no existia se llamara a la funcion readJson()
            //para crear el archivo vacio
            this.readJson()
            return 'The products JSON has been created'
        }   
    }

    getProducts(){
        this.readJson()
        return this.products
    }

    getProductsByID(id){
        //Se lee el json mediante la funcion y luego se busca un
        //id que coincida con el ingresado por la url
        this.readJson()
        const idCoincidence = this.products.find((u) => u.id == id)
        if(!idCoincidence){
            return 'The product doesn´t exist'
        }else{
            return idCoincidence
        }
    }

    async updateProduct(id, updatedFields) {
        //Comienza leyendo el json
        this.readJson();
    
        //Busca el id que coincida con el ingresado
        const idCoincidence = this.products.findIndex(event => event.id === parseInt(id, 10));
    
        if (idCoincidence === -1) {
            return "Not found";
        } else {
            //Verifica que si se modifica un codigo de producto,
            //no se utilice uno ya existente
            const existingProduct = this.products.find(product => product.code === updatedFields.code && product.id !== parseInt(id, 10));
    
            if (existingProduct) {
                return "Product code already exists";
            }
    
            //Indica el indice que tiene en el array el producto
            let selectedProduct = this.products[idCoincidence];
    
            // Actualiza solo las propiedades proporcionadas en updatedFields
            Object.assign(selectedProduct, updatedFields);
    
            const updateProductStr = JSON.stringify(this.products, null, 2);
    
            await fs.promises.writeFile(this.path, updateProductStr);
    
            return `The product with the ID ${id} has been modified`;
        }
    }

    async removeProduct(id){
        //Lee el JSON mediante la funcion
        this.readJson()

        //Se convierte el id pasado por la url a un number
        const idToRemove = parseInt(id)
        
        //Se busca si existe un producto con dicho ID
        const idCoincidence = this.products.findIndex(event => event.id === idToRemove);

        if(idCoincidence === -1){
            return 'Product not found'
        }else{
            //Filtra el array con los productos, eliminando aquel que sea igual al pasado como argumento
            const newArr = this.products.filter(product => product.id !== idToRemove)

            //Guarda la nueva informacion en el JSON y devuelve un respuesta
            await fs.promises.writeFile(this.path, JSON.stringify(newArr, null, 2))
            
            return  `Product with the ID ${id} has been removed`
        }
    }
    
}

const productManager = new ProductManager()

export default productManager