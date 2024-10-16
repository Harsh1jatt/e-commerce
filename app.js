require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
const connectDB  = require('./config/mongodb')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const productRouter = require('./routes/products')

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})