'use strict'
const _ = require('lodash')
const Product = require('../models/product')
const sequelize = require('../models/index')
const ProductModel = Product(sequelize.sequelize, sequelize.Sequelize.DataTypes)

const controllers = {
    createProduct: (req, res) => {
        let slug = _.kebabCase(req.body.product_name)
        console.log(req.body)
        ProductModel.create({
            product_name: req.body.product_name,
            slug: slug,
            description: req.body.description,
            price: req.body.price,
            brand: req.body.brand,
            color: req.body.color,
            image: req.body.image
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
                    message: 'create product failed'
                })
            })
    },
    showAllProducts: (req, res) => {
        ProductModel.findAll()
            .then(response => {
                return res.status(200).json({
                    success: true,
                    products: response
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'find products failed'
                })
            })
    },
    editProduct: (req, res) => {
        console.log("PARAMS", req.params.slug)
        console.log(req.body)
        ProductModel.findOne({
            where: {
                slug: req.params.slug
            }
        })
            .then(response => {
                ProductModel.update(
                    {
                        product_name: req.body.product_name,
                        description: req.body.description,
                        price: req.body.price,
                        brand: req.body.brand,
                        color: req.body.color,
                        image: req.body.image,
                        slug: req.params.slug
                    },
                    {
                        where: {
                            slug: req.params.slug
                        }
                    }
                )
                    .then(response => {
                        return res.status(200).json({
                            success: true,
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(400).json({
                            success: false,
                            message: 'update product failed'
                        })
                    })
            })
            .catch(err => {
                console.log(err)
                return res.status(404).json({
                    success: false,
                    message: 'product not found'
                })
            })
    },
    showProduct: (req, res) => {
        console.log(req.params.slug)
        ProductModel.findOne({
            where: {
                slug: req.params.slug
            }
        })
            .then(response => {
                return res.status(200).json({
                    product: response
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'product not found'
                })
            })
    },
    deleteProduct: (req, res) => {
        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                if (result) {
                    ProductModel.destroy({
                        where: {
                            slug: req.params.slug
                        }
                    })
                        .then(response => {
                            return res.status(200).json({
                                products: response
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({
                                success: false,
                                message: 'delete failed'
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'delete failed'
                })
            })
    }
}

module.exports = controllers