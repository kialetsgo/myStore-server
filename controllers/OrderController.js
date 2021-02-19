'use strict'
const Order = require('../models/order')
const sequelize = require('../models/index')
const OrderModel = Order(sequelize.sequelize, sequelize.Sequelize.DataTypes)

const controllers = {}

module.exports = controllers