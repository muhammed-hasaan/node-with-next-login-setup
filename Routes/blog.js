const express = require('express')
const router = express.Router()
const BlogModal = require('../Schema/Blog')
const sendResponse = require('../helpers/sendResponse')

router.post('/', async (req, res) => {
    console.log('body console-->', req.body)
    try {
        const user = await BlogModal.create({ ...req.body })
        if (user) {
            sendResponse(res, 200, user, 'Blog Created Successfully', false)
        }
    }
    catch (err) {
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

router.get('/', async (req, res) => {
    try {
        const blogs = await BlogModal.find().populate('user').exec()
        if (blogs) {
            sendResponse(res, 200, blogs, 'User Fetched Successfully', false)
        }

    }
    catch (err) {
        console.log(err.message)
        sendResponse(res, 500, null, 'Internal Server Error', true)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await BlogModal.findOne({ _id: req.params.id })
        if (user) {
            const updated = await BlogModal.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
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
        const user = await BlogModal.findByIdAndDelete(req.params.id)
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