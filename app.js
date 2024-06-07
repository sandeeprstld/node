const express= require('express')
const app=express()
const path= require("path")
const session=require('express-session');
const flash = require('express-flash');

require('dotenv').config();
app.use(express.json())
const port=process.env.PORT || 3000
//app.set('views', path.join(__dirname ,'views'))
app.set('view engine', 'ejs');
const publicPath = path.join(__dirname, 'public');

// Serve static files from the public directory
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }))
//app.use(upload.single('image'));
app.use(session({
    secret : 'secretKey',
    cookie: { maxAge: 31536000000 },
    resave: true,
    saveUninitialized: true
  }));
app.use(flash())
//routes
app.use(require('./routes/userRoutes'));


app.listen(port, () => {
    console.log(`server running on port" ${port}`)
})
