require('dotenv').config()
const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')
const cors = require('cors')
// const methodOverride = require('method-override')
// const sequelize = require('./models/index')
const UserControllers = require('./controllers/UserController')
const ProductControllers = require('./controllers/ProductController')
const OrderControllers = require('./controllers/OrderController')
const CartControllers = require('./controllers/CartController')

app.use(express.urlencoded({
    extended: true
}))

app.use(cors({
    origin: '*'
}))

app.options('*', cors())

// user routes
app.post('/register', UserControllers.register)
app.post('/login', UserControllers.login)

// product routes
app.get('/product/:slug', ProductControllers.showProduct)
app.get('/products/all', ProductControllers.showAllProducts)

// superuser routes
app.post('/product/new', verifyJWT, ProductControllers.createProduct)
app.patch('/product/edit/:slug', verifyJWT, ProductControllers.editProduct)
app.get('/superuser', verifyJWT, UserControllers.checkSuperUser)
app.delete('/product/:slug', verifyJWT, ProductControllers.deleteProduct)

// cart routes
app.post('/product/:id', verifyJWT, CartControllers.addToCart)
app.post('/cart/:id', verifyJWT, CartControllers.removeFromCart)
app.get('/cart', verifyJWT, CartControllers.showCart)


// order routes

app.listen(process.env.PORT || port, () => {
    console.log(`Shopping App listening on port: ${port}`)
})


function verifyJWT(req, res, next) {
    // get the jwt token from the request header
    const authToken = req.headers.auth_token
    console.log(authToken)
    // console.log(req.headers) // added this line and it worked?
    // check if authToken header value is empty, return err if empty
    if (!authToken) {
        res.json({
            success: false,
            message: "Auth header value is missing"
        })
        return
    }

    // verify that JWT is valid and not expired
    try {
        // if verify success, proceed
        const userData = jwt.verify(authToken, process.env.JWT_SECRET, {
            algorithms: ['HS384']
        })
        // store jwt token into res.locals.jwtData
        res.locals.jwtData = userData;
        next()
    } catch (err) {
        // if fail, return error msg

        res.json({
            success: false,
            message: "Auth token is invalid"
        })
        return
    }
}