// variables 
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


// alert(document.getElementsByTagName("option")[e].value);
// var sizes = [e.selectedIndex].value;
// var text = e.options[e,selectedIndex].text;
// console.log("sizes", sizes);
// console.log("text", text);
// Cart 
let cart = [];
// Buttons 
let buttonsDOM = [];

// Getting Products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json')
            let data = await result.json();
            // console.log(data)
            let products = data.items
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                const sizes = item.fields.sizes;
                return { title, price, id, image, sizes }
            })
            
            return products;
        }
        catch (error) {
            console.log(error);
        }
    }
}

// Display products 
class UI {

    displayProducts(products) {
        
        // let size = document.getElementById('sizes').value;
        // console.log(size)
        
        let result= '';
        // let sizeResult = document.getElementById('sizes-${product.id}').value = 0;
        
        // console.log("size:", size);
        products.forEach(product => {
            result += `
            <article class="product">
                <div class="img-container">
                    <img class="product-img" src=${product.image}>
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>            
                </div>
                <label for="sizes">Select Size:</label>
                <select name="sizes-${product.id}" id="sizes-${product.id}">`;
            
            product.sizes.forEach(size => {
                result += `<option value="${size.value}">${size.name}</option>`;
            });

            result += `</select>
                <h3>${product.title}</h3>
                <h4>£${product.price}</h4>
            </article>
            `;
        });
        productsDOM.innerHTML = result;
        // products.forEach(product => {
        //     let sizesValue = document.getElementById(`sizes-${product.id}`);
        //     console.log("sizesValue:", sizesValue)
        //     const selectBox = sizesValue.options[sizesValue.selectedIndex].value;
        //     // console.log(`sizes-${product.id}`.value)
        //     const selectedSize  = selectBox.options[selectBox.selectedIndex];
        //     // size = selectedSize.getAttribute('size');
        //     console.log(selectedSize); // Non of this selectBox working because script running before DOM contents has loaded, so cannot get the values
        // });
    }
   
    
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                button.innerText = "In Cart";
                button.disabled = false;
            }
                button.addEventListener('click', event => {
                    event.target.disabled = true;

                    // Get the selected size from the page html using the id value
                    const size = document.getElementById(`sizes-${id}`).value;
                    console.log('size: ', size);

                    // GET product from products
                    let cartItem = { id, amount: 1, size };
                    
                    Storage.addItemToCart(cartItem);
                    
                    // SET cart values
                    this.setCartCosts(cart);

                    // DISPLAY cart item
                    console.log('cartItem: ', cartItem);


                    // DRAW the cart
                    this.drawCart();

                    // SHOW the cart 
                    this.showCart();
                    event.target.innerText = "In Cart";
                });
        });
    }
    setCartCosts(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    // addCartItemBeta(item) {
    //     const div = document.createElement("div");
    //     div.classList.add('cart-item'); 
    //     div.innerHTML = `
    //     <img src=${item.image} alt="product">
    //         <div>
    //             <h4>${item.title}</h4>
    //             <h5>£${item.price}</h5>
    //             <h5>size: ${item.size}</h5>
    //             <span class="remove-item" data-id=${item.id}>Remove</span> 
    //         </div>
    //         <div>
    //             <i class="fas fa-chevron-up" data-id=${item.id}></i>
    //             <p class="item-amount">${item.amount}</p>
    //             <i class="fas fa-chevron-down" data-id=${item.id}></i>
    //         </div>`;
    //     cartContent.appendChild(div);
    // } 

    drawCart(product) {
        // const cartElement = document.getElementById('cart-content');
        const div = document.createElement("div");
        // let innerHtml = '';
        div.classList.add('cart-item');
        const cart = Storage.getCartContents();
        if (cart && cart.length > 0) {
            cart.forEach(item => {
                const matchingProduct = Storage.getProduct(item.id);
                const product = { ...matchingProduct, ...item };
                div.innerHTML += `<img src=${product.image} alt="product">
                <div>
                    <h4>${product.title}</h4>
                    <h5>£${product.price}</h5>
                    <h5>size: ${product.size}</h5>
                    <span class="remove-item" data-id=${product.id}>Remove</span> 
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${product.id}></i>
                    <p class="item-amount">${product.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${product.id}></i>
                </div>`;
                cartContent.appendChild(div)} );
        }
        // cartContent.innerHTML = innerHtml;
    }


    addCartItem(cartItemAsObject) {
        // const cart = [{ title: 'my-shirt', price: 45, size: 'small', id: 12 }];
        const cart = Storage.getCartContents();
        localStorage.setItem('cart', JSON.stringify(cart));
    }


    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");

    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartCosts(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart)
        cartOverlay.addEventListener('click', this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));

    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }
    cartLogic() {
        // CLEAR cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        })
        // cart Functionality 
        cartContent.addEventListener('click', event => {
            if(event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartCosts(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartCosts(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartCosts(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disable = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i> Add To Cart`
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// Local Storage 
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    } 
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []; 
    }

    static getCartContents() {
        const cartString = localStorage.getItem('cart');
        if (cartString) return JSON.parse(cartString);
        return [];
    }

    static addItemToCart(item) {
        // we might want to add logic here to see if the item is already in the cart, 
        // if it is, we should just update the quantity rather than add a new item
        const cart = this.getCartContents();
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // setup APP
    ui.setupAPP();

    // get all products
    products
        .getProducts()
        .then(products => {
            ui.displayProducts(products)
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
    
});