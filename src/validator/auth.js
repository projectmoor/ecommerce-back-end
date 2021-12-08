// import validator
const { check, validationResult } = require('express-validator')

// siginup validation: firstName, lastName, email, password
exports.validateSignupRequest = [
    check('firstName')
    .notEmpty()
    .withMessage('firstName is required'),
    check('lastName')
    .notEmpty()
    .withMessage('lastName is required'),
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 character long')
]

// sigin validation: email, password
exports.validateSigninRequest = [
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 character long')
]

// handle validation result
exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.array().length > 0){
        return res.status(400).json({ errors: errors.array()[0].msg }) // only send back the first error
    }
    next()
}