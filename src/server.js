const express = require('express')
const app = express()
const env = require('dotenv')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

// environment variable
env.config()

// cors
app.use(cors())
// parse data sent with req (Express 4.16+ body-parser integrated)
app.use(express.json()) //Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) //Parse URL-encoded bodies

// when browser visits /public route, expose static files stored in /uploads folder
app.use('/public', express.static(path.join(__dirname, '../', 'uploads')))

// routes
const userRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')
const addressRoutes = require('./routes/address')
const orderRoutes = require('./routes/order')
const adminOrderRoute = require('./routes/admin/order')

// middleware - use userRoutes
app.use('/api', userRoutes)
// middleware - use adminRoutes
app.use('/api', adminRoutes)
// middleware - use categoryRoutes
app.use('/api', categoryRoutes)
// middleware - use productRoutes
app.use('/api', productRoutes)
// middleware - use cartRoutes
app.use('/api', cartRoutes)
// middleware - use initialDataRoutes
app.use('/api', initialDataRoutes)
// middleware - use pageRoutes (admin)
app.use('/api', pageRoutes)
// middleware - addressRoutes 
app.use('/api', addressRoutes)
// middleware - orderRoutes 
app.use('/api', orderRoutes)
// middleware - adminOrderRoute
app.use('/api', adminOrderRoute)

// connect to database
let dbConnect;

if (process.env.NODE_ENV == 'development') {
    dbConnect = `mongodb://localhost:27017/${process.env.MONGO_DB_DATABASE}`;
    console.log('connecting to development database');

} else {
    dbConnect = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_DATABASE}`
    console.log('connecting to production database');
}
mongoose.connect(
    dbConnect, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify: false
    }
).then( () => {
    console.log('Database connected')
})

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello from Server'
    })
})

app.post('/data', (req, res, next) => {
    res.status(200).json({
        message: req.body
    })
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})