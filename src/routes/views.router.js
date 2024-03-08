const {Router} = require('express');

const viewsRouter = Router();

/** middlewares */
const publicAccess = (req, res, next)=>{
    if(req.session.user) return res.redirect('/')
    next();
}

const privateAccess = (req, res, next)=>{
    if(!req.session.user) {
        console.log("not logged in")
        return res.redirect('/login')
    }
    next();
}


viewsRouter.get('/register', publicAccess, (req, res)=>{
    res.render('register',{})
})

viewsRouter.get('/login', publicAccess, (req,res)=>{
    res.render('login')
})


viewsRouter.get('/', privateAccess, (req,res)=>{
    res.render('profile',{user: req.session.user})
})

viewsRouter.get('/resetPassword', (req, res)=>{
    res.render('resetPassword', {})
})


module.exports = viewsRouter;