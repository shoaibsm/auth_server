const express = require('express');
const mainRouter = require('./routers/index')
const dotenv = require('dotenv');
const cors = require('cors')
const { dbConnect } = require('./dbConnect');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const originUrl = process.env.ORIGIN_URL

dotenv.config()

const app = express();

// middlewares
app.use(express.json())
app.use(morgan('common'))
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: originUrl
}))
app.use('/', mainRouter)

// app.get('/', (req, res) => {
//     res.send('Ok from server')
// })

dbConnect()
app.listen(4000, () => {
    console.log('Start listing on port 4000');
})