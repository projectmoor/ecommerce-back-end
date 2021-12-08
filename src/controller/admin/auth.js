// import User model (database)
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const shortid = require('shortid')

exports.signup = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec( async (error, user) => {
        if(user) return res.status(400).json({
            message: 'User already registered'
        })

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const hash_password = await bcrypt.hash(password, 10)

        const _user = new User({
            firstName,
            lastName,
            username: shortid.generate(),
            email,
            hash_password,
            role: 'admin' // make it admin user
        })

        _user.save((error, data) => {
            if(error){
                return res.status(400).json({
                    message: 'Something went wrong'
                })
            }
            if(data){
                return res.status(201).json({
                    message: 'Admin created successfully!'
                })
            }
        })
    })
}

exports.signin = (req, res) => {
    // only email and password required to signin

    // user.email
    User.findOne({ email: req.body.email}).exec(async (error, user) => {

        if(error) return res.status(400).json( {error} )
        // check if it is admin user
        if(user && user.role === 'admin') {
            // user.password
            // authenticate method is created in 'models/user.js'
            const validation = await user.authenticate(req.body.password);
            if(validation){
                // signin successfully
                // token
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' }) // expire in 1h
                const { _id, firstName, lastName, email, role, fullName } = user
                // cookie
                res.cookie('token', token, { expiresIn: '1h'})
                // send token and some user info back to client
                res.status(200).json({
                    token,
                    user: {
                        _id, firstName, lastName, email, role, fullName
                    }
                })
            } else {
                // if authentication fails (wrong password)
                return res.status(400).json({
                    message: 'Invalid Password'
                })
            }

        } else {
            return res.status(400).json({
                message: 'Something went wrong'
            })
        }
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: 'Signout successfully...!'
    })
}
