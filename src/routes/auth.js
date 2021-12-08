const express = require('express')
const router = express.Router()
// import user singup controller
const { signup, signin, signout } = require('../controller/auth')
// import requireSignin(token) middleware
const { requireSignin } = require('../common-middleware/index')
// import validator
const { validateSigninRequest, validateSignupRequest, isRequestValidated } = require('../validator/auth')

router.post('/signin', validateSigninRequest, isRequestValidated, signin)
router.post('/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/signout', requireSignin, signout)

// requireSignin will be executed, and if it trigger next(), (req, res) => {} will be run
router.post('/profile', requireSignin, (req, res) => {
    res.status(200).json({user: req.user})
})

module.exports = router