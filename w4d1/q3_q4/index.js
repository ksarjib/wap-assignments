const express = require('express');
const session = require('express-session');
const url = require('url');
const path = require('path');

const app = express();

app.use(session({
    resave: false,
    secret: 'salt for cookies',
    saveUninitialized: false
}));

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use('/public', express.static(path.join(__dirname, 'public')));
let desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
let products = [{id: 1, name: 'Product1', price: 100, description: desc},
                {id: 2, name: 'Product2', price: 200, description: desc},
                {id: 3, name: 'Product3', price: 300, description: desc},
                {id: 4, name: 'Product4', price: 400, description: desc}];

app.use(function (req, res, next) {
    if (!req.session.cart) {
        req.session.cart = {};
    }
    next();
});

app.get('/products', (req, res) => {
    res.render('products', {products : products});
});

app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    let product = products.find(e => e.id === parseInt(id));
    res.render('product', {id : product.id, name : product.name, price : product.price, description : product.description});
});

app.post('/addToCart', (req, res, next) => {
    let id = req.body.id;
    let item = products.find(e => e.id === parseInt(id));
    let  cartItem = req.session.cart[item.id];
    if (cartItem) {
        console.log(cartItem);
        cartItem.quantity += 1;
        cartItem.price += item.price;
    } else {
        item.quantity = 1;
        req.session.cart[item.id] = item;
    }
    console.log(req.session.cart);
    res.redirect(url.format({
        pathname: "/cart"
    }));
});

app.get('/cart', (req, res) => {
    res.render('shoppingCart', {cartItems : req.session.cart});
});

app.listen(3000, () => {console.log('Listening on port 3000')});