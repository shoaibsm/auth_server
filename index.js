const express = require('express');
const mainRouter = require('./routers/index')
const dotenv = require('dotenv');
const cors = require('cors')
const { dbConnect } = require('./dbConnect');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cloudinary = require("cloudinary").v2;

dotenv.config('./.env')

// configur cloudinary
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();

// middlewares
app.use(express.json())
app.use(morgan('common'))
app.use(cookieParser());

let origin = 'http://localhost:3000'
if (process.env.NODE_ENV === 'production') {
    origin = process.env.ORIGIN_URL
}
app.use(cors({
    credentials: true,
    origin
}))

app.use('/', mainRouter)

// app.get('/', (req, res) => {
//     res.send('Ok from server')
// })

dbConnect()
app.listen(4000, () => {
    console.log('Start listing on port 4000');
})