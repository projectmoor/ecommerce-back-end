// import User model (database)
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const bcrypt = require('bcrypt')

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

exports.signup = (req, res, next) => {

    User.findOne({email: req.body.email}) // check database 
    .exec(async (error, user) => {
        if(user) return res.status(400).json({ // if email already registered
            message: 'User already registered'
        })

        // get user data from req.body
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        // encrypt password
        const hash_password = await bcrypt.hash(password, 10)

        // create user
        const _user = new User({
            firstName,
            lastName,
            username: shortid.generate(),
            email,
            hash_password
        })

        // add user to database
        _user.save((error, user) => {
            if(error){ // if
                return res.status(400).json({
                    message: 'Something went wrong'
                })
            }
            if(user){
                const token = generateJwtToken(user._id, user.role);
                const { _id, firstName, lastName, email, role, fullName } = user;
                return res.status(201).json({
                    token,
                    user: { _id, firstName, lastName, email, role, fullName },
                });
            }
        })
    })
}

exports.signin = (req, res) => {
    // only email and password required to signin

    // user.email
    User.findOne({ email: req.body.email}).exec( async (error, user) => { // async function

        if(error) return res.status(400).json( {error} )

        if(user && user.role === 'user') {
            // user.password
            // authenticate method is created in 'models/user.js'

            const validation = await user.authenticate(req.body.password); // await handles promise

            if(validation){
                // token
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' }) // expire in 1h
                const { _id, firstName, lastName, email, role, fullName } = user;
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