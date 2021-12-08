const express = require('express')
const router = express.Router()
// import Category controllers
const { addCategory, getCategory, updateCategories, deleteCategories } = require('../controller/category')
// permission middleware
const { requireSignin, adminMiddleware } = require('../common-middleware')

// middleware to handle file upload
const path = require('path')
const multer = require('multer')
const shortid = require('shortid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), '../', 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
})
const upload = multer({ storage })

// request to create a new category
router.post('/category/create', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory)

// request to get categories data
router.get('/category/getcategory', getCategory)

// request to update categories
router.post('/category/update', upload.array('categoryImage'), updateCategories)

// request to delete categoreis
router.post('/category/delete', deleteCategories)

module.exports = router;