const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        min: 3,
        max: 50
    },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    contactNumber: {
        type: String
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true })

// // create virtual fields (mongoose features)
// userSchema.virtual('password').set(function(password){
//     // use the virtual field password to encrypt password and store encrypted password in hash_password field
//     this.hash_password = bcrypt.hashSync(password, 10)
// })

// create virtual field: fullName
userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`
})

// create methods
userSchema.methods = {
    // verify password
    authenticate: async function(password){ // async function returns promise
        return await bcrypt.compare(password, this.hash_password) // promise - true/false
    }
}

module.exports = mongoose.model('User', userSchema)