const express=require('express');
const { isLoggedIn } = require('../../middleware');
const router=express.Router();
const WomenShoes=require('../../models/Category/WomenShoes');
const Review=require('../../models/review');

router.get('/products/category/women-shoes',async(req,res)=>{
	try{
    const products = await WomenShoes.find({});
	res.render('Category/WomenShoes/index', { products });
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/women-shoes/:id',async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await WomenShoes.findById(id).populate('reviews');

	res.render('Category/WomenShoes/show',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/women-shoes/:id/edit',async(req,res)=>{
	try{
	const {id}=req.params;
	
	const product=await WomenShoes.findById(id);

	res.render('Category/WomenShoes/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.patch('/products/category/women-shoes/:id',async(req,res)=>{
	try{
	const updatedProduct=req.body;

	const {id}=req.params;

	await WomenShoes.findByIdAndUpdate(id,updatedProduct);
	res.redirect(`/products/category/women-shoes/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});

router.delete('/products/category/women-shoes/:id',async(req,res)=>{
	try{
	const {id}=req.params;
	await WomenShoes.findByIdAndDelete(id);
	res.redirect('/products/category/women-shoes');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})


router.post('/products/category/women-shoes/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await WomenShoes.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/products/category/women-shoes/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

router.delete('/products/category/women-shoes/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;
	await Review.findByIdAndDelete(id);
	await WomenShoes.findByIdAndDelete(id);
	res.redirect(`/products/category/women-shoes`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})







module.exports=router;