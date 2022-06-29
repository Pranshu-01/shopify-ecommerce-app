const express=require('express');
const router=express.Router();
const User=require('../models/user');
const Product=require('../models/product');
const Category=require('../models/Category/category');
const {isLoggedIn}=require('../middleware');

router.post('/cart/:productid/add',isLoggedIn,async(req,res)=>{

    const {productid}=req.params;

    const product=await Product.findById(productid);

    const currentUser=req.user;

    currentUser.cart.push(product);

    await currentUser.save();

    req.flash('success','Item added to your cart Successfully');

    res.redirect(`/products/${productid}`);
});

// router.post('/cart1/:productid/add',isLoggedIn,async(req,res)=>{

//     const {productid}=req.params;

//     const product=await Category.findById(productid);

//     const currentUser=req.user;

//     currentUser.cart.push(product);

//     await currentUser.save();

//     req.flash('success','Item added to your cart Successfully');

//     res.redirect(`/products/category/smartphones/${productid}`);
// });


router.get('/user/cart',isLoggedIn,async(req,res)=>{
    const userid=req.user._id;

    const user=await User.findById(userid).populate('cart');

    res.render('cart/userCart',{user});
});






// router.get('/user/cart',isLoggedIn,async(req,res)=>{
//     const userid=req.user._id;

//     const user=await User.findById(userid).populate('cartcart');

//     res.render('cart/userCart',{user});
// });

router.delete('/cart/:id/remove',isLoggedIn,async(req,res)=>{
    const productid=req.params.id;

    const userid=req.user._id;

    await User.findByIdAndUpdate(userid,{$pull:{cart:productid}});

    res.redirect('/user/cart');

})


module.exports=router;