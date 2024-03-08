const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const sessionRouter = require('./routes/sessions.router');
const viewsRouter = require('./routes/views.router');
const port = 8080; 
require('dotenv').config()
const passport = require('passport');
const initializePassport = require('./config/passport.config');




const app = express();

/** Database connection */
mongoose.connect(`mongodb+srv://angelpablocuevas1989:${process.env.MONGO_PASSWORD}@codercluster.5ny2sqo.mongodb.net/login`).then(()=>{
    console.log('connected successfully')
})

/** Session setting */
app.use(session({
    secret:'ourNewSecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://angelpablocuevas1989:${process.env.MONGO_PASSWORD}@codercluster.5ny2sqo.mongodb.net/login`,
        ttl: 3600
    })
}))

/** middlewares */
app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

/** passport */
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

/** handlebars config */
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

/** routes */
app.use('/api/sessions',sessionRouter)
app.use('/', viewsRouter);

app.listen(port, ()=>console.log(`up and running on port ${port}`))