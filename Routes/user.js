const express = require('express')
const router = express.Router()
const UserModal = require('../Schema/User')
const sendResponse = require('../helpers/sendResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateJwt = require('../helpers/authenticateJwt')
require('dotenv').config()

router.post('/signup', async (req, res) => {
    console.log('body console-->', req.body)
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const obj = { ...req.body, password: hash }
        const user = await UserModal.create(obj)

        if (user) {
            sendResponse(res, 200, user, 'User Created Successfully', false)
        }
    }
    catch (err) {
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await UserModal.findOne({ email: req.body.email })
        if (user) {
            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
            if (isPasswordValid) {
                const token =  jwt.sign({ data: user }, process.env.JWT_SECRET)
                sendResponse(res, 200, { user, token }, 'User login Successfully', false)
            } else {
                sendResponse(res, 403, null, 'Password is not valid.', true)
            }
        } else {
            sendResponse(res, 403, null, 'User Doesnt Exist', true)
        }
    }
    catch (err) {
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

router.get('/', authenticateJwt, async (req, res) => {
    try {
        const users = await UserModal.find()
        if (users) {
            sendResponse(res, 200, users, 'User Fetched Successfully', false)
        }

    }
    catch (err) {
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await UserModal.findOne({ _id: req.params.id })
        if (user) {
            const updated = await UserModal.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            return sendResponse(res, 200, updated, 'User Updated Successfully', false)
        } else {
            return sendResponse(res, 403, null, 'User Not Found', true)
        }
    }
    catch (err) {
        console.log(err.message)
        sendResponse(res, 500, null, err.message, true)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await UserModal.findByIdAndDelete(req.params.id)
        console.log('user-->', user)
        if (user) {
            sendResponse(res, 200, user, 'User Deleted Successfully', false)
        } else {
            sendResponse(res, 403, null, 'User Not Found', true)
        }

    }
    catch (err) {
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

module.exports = router