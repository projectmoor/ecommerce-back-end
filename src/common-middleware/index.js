const jwt = require('jsonwebtoken')
const path = require('path') // for upload middleware
const multer = require('multer') // for upload middleware
const shortid = require('shortid') // for upload middleware

// create a upload middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
})
   
exports.upload = multer({ storage })

exports.requireSignin = (req, res, next) => {
    // client will send token in headers
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1] // 'authorization': 'Bearer token'. The 'Bearer ' prefix is just a standard
        const user = jwt.decode(token, process.env.JWT_SECRET) // decrypt {_id: user._id}
        req.user = user
    } else {
        return res.status(400).json({ message: 'Authorization required' })
    }
    next()
}

exports.userMiddleware = (req, res, next) => {
    if(req.user.role !== 'user'){
        return res.status(400).json({ message: 'Access denied' })
    }
    next()
}

exports.adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(400).json({ message: 'Access denied' })
    }
    next()
}