const express = require('express')
const router = express.Router()
// import admin user authorization controller
const { signup, signin, signout } = require('../../controller/admin/auth')
// import user validator
const { validateSigninRequest, validateSignupRequest, isRequestValidated } = require('../../validator/auth')
// requireSignin checks if req.headers.authorization exists
const { requireSignin } = require('../../common-middleware')

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin)
router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/admin/signout', requireSignin, signout)

module.exports = router