const express = require('express')
const router = express.Router()
// requireSignin checks if req.headers.authorization exists
const { requireSignin, adminMiddleware, upload } = require('../../common-middleware') // upload middleware
const { createPage, getPage } = require('../../controller/admin/page')

router.post('/page/create', requireSignin, adminMiddleware, upload.fields([
    {name: 'banners'},
    {name: 'products'}
]), createPage )

router.get(`/page/:category/:type`, getPage);

module.exports = router;