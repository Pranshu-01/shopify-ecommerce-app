const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');

// https://online.codingblocks.com/app/player/207355/content/208449/13406/lecture
// 1:25:00

//get the sign up page
router.get('/register',(req,res)=>{
    res.render('auth/signup');
});

//register new user
router.post('/register',async(req,res)=>{
    try{
        const {username,email,role,password}=req.body;

        const user=new User({
            username:username,
            email:email,
            role:role
        });
    
        await User.register(user,password);
    
        req.flash('success',`Welcome ${username},Please Login to continue`);
        res.redirect('/products');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
});

//get the login page
router.get('/login',(req,res)=>{
    res.render('auth/login');
});

router.post('/login',
     passport.authenticate('local',
     {
         failureRedirect:'/login',
         failureFlash:true
        }),
     (req,res)=>{
         const {username}=req.user;
        //  req.flash('success',`Welcome back ${username} Again!!`);
         res.redirect('/products');
});

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.flash('success','Logout Successfully!!!');
        res.redirect('/login');
    })
    
})





module.exports=router;