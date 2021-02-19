'use strict'
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const sequelize = require('../models/index')
const UserModel = User(sequelize.sequelize, sequelize.Sequelize.DataTypes)

const controllers = {
    register: (req, res) => {
        console.log(req.body)

        UserModel.create({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
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
                    message: 'registration failed'
                })
            })
    },
    login: (req, res) => {
        console.log(req.body)
        UserModel.findOne(
            {
                where: {
                    email: req.body.email,
                    password: req.body.password
                }
            })
            .then(response => {
                if (!response) {
                    res.statusCode = 401
                    res.json({
                        "success": false,
                        "message": "Either username or password is wrong"
                    })
                    return
                }

                console.log(response)
                // login successful, generate JWT
                const token = jwt.sign({
                    username: response.username,
                    email: response.email,
                    userid: response.id
                }, process.env.JWT_SECRET, {
                    algorithm: "HS384",
                    expiresIn: "1h"
                })

                // decode JWT to get raw values
                const rawJWT = jwt.decode(token)

                // return token as json response
                res.json({
                    success: true,
                    token: token,
                    expiresAt: rawJWT.exp
                })

            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: 'login failed'
                })
            })
    },
    checkSuperUser: (req, res) => {
        console.log(res.locals.jwtData)
        UserModel.findOne({
            where: {
                id: res.locals.jwtData.userid,
            },
        })
            .then(response => {
                return res.status(200).json({
                    user: response
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    success: false,
                })
            })
    }
}

module.exports = controllers