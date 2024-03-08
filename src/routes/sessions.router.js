const {Router} = require('express');
const passport  = require('passport');
const userModel = require('../models/user');
const { createHash, isValidPasword } = require('../utils');

const sessionRouter = Router();

sessionRouter.post('/register', passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail'}) , async (req, res)=>{
    res.send({status: 'success', mesage: 'user registered'})
})

sessionRouter.get('/registerFail', (req, res)=>{
    res.status(401).send({status:'error', error: 'authentication error'})
})


sessionRouter.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail'}) ,  async (req, res)=>{

    const user = req.user; 
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age 
    }
    
    res.send({status:'success', payload: req.session.user, message:'Successfully logged in'})
})

sessionRouter.get('/loginFail', (req, res)=>{
    res.status(401).send({status:'error', error: 'login fail'})
})

sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})


sessionRouter.post('/resetPassword', async (req, res)=>{
    const { email, password } = req.body; 

    if(!email || !password){
        return res.status(400).send({status: 'error', error:'Missing data'})
    }

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).send({status:'error', error:'User not found'})
    }

    const hashedPassword = createHash(password);

    const result = await userModel.updateOne({_id: user._id}, {$set:{password: hashedPassword}})

    res.send({status:'success', message:'Password reset successfull' ,details:result})
})

module.exports = sessionRouter;