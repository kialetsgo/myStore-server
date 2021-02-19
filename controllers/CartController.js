'use strict'
const sequelize = require('../models/index')
const Cart = require('../models/cart')
const CartModel = Cart(sequelize.sequelize, sequelize.Sequelize.DataTypes)
const Product = require('../models/product')
const ProductModel = Product(sequelize.sequelize, sequelize.Sequelize.DataTypes)
const User = require('../models/user')
const UserModel = User(sequelize.sequelize, sequelize.Sequelize.DataTypes)

CartModel.belongsTo(UserModel)
UserModel.hasMany(CartModel)
CartModel.belongsTo(ProductModel)
ProductModel.hasMany(CartModel)

const controllers = {
    addToCart: (req, res) => {
        console.log(req.body)
        // if else to check if product is added by user
        CartModel.findOne({
            where:
            {
                product_id: req.body.product_id,
                user_id: req.body.user_id,
            }
        })
            .then(response => {
                if (response) {
                    console.log('response: ' + response.quantity)
                    // let qty = response.quantity
                    // console.log(typeof response.quantity)
                    // console.log(response.quantity)
                    // console.log(typeof req.body.quantity)
                    // console.log(req.body.quantity)
                    // let intQty = parseInt(req.body.quantity)
                    // console.log(intQty)
                    let newQty = response.quantity + parseInt(req.body.quantity)
                    CartModel.update(
                        {
                            quantity: newQty
                        },
                        {
                            where: {
                                product_id: req.body.product_id,
                                user_id: req.body.user_id,
                            }
                        })
                        .then(response => {
                            return res.status(200).json({
                                success: true,
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({
                                success: false,
                                message: 'add to cart failed'
                            })
                        })
                }
                else {
                    CartModel.create({
                        product_id: req.body.product_id,
                        user_id: req.body.user_id,
                        quantity: req.body.quantity
                    })
                        .then(response => {
                            return res.status(201).json({
                                success: true,
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({
                                success: false,
                                message: 'add to cart failed'
                            })
                        })
                }

            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'add to cart failed'
                })
            })
    },
    showCart: (req, res) => {
        console.log(res.locals.jwtData)
        CartModel.findAll({
            where: {
                user_id: res.locals.jwtData.userid,
            },
            include: [UserModel, ProductModel]
            // product_id: req.body.product_id
        })
            .then(response => {
                console.log(response)
                return res.status(200).json(response)
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'show cart failed'
                })
            })
    },
    removeFromCart: (req, res) => {
        console.log(req.body)
        console.log(res.locals.jwtData)
        CartModel.findOne({
            where: {
                user_id: res.locals.jwtData.userid,
                product_id: req.body.product_id
            },
            include: [UserModel, ProductModel]
        })
            .then(response => {
                if (response) {
                    console.log("CART ITEM FOUND")
                    CartModel.destroy({
                        where: {
                            user_id: res.locals.jwtData.userid,
                            product_id: req.body.product_id
                        },
                        include: [UserModel, ProductModel]
                    })
                        .then(response => {
                            console.log(response)
                            return res.status(200).json(response)
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({
                                success: false,
                                message: 'delete cart failed'
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'delete cart failed'
                })
            })
    },
    generateOrder: (req, res) => {
        CartModel.
    }
}

module.exports = controllers