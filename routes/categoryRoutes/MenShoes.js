const express=require('express');
const { isLoggedIn } = require('../../middleware');
const router=express.Router();
const MenShoes=require('../../models/Category/MenShoes');
const Review=require('../../models/review');

router.get('/products/category/men-shoes',async(req,res)=>{
	try{
    const products = await MenShoes.find({});
	res.render('Category/MenShoes/index', { products });
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/men-shoes/:id',async(req,res)=>{
	try{
	const {id}=req.params;
    console.log()

	const product=await MenShoes.findById(id).populate('reviews');

	res.render('Category/MenShoes/show',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/men-shoes/:id/edit',async(req,res)=>{
	try{
	const {id}=req.params;
	
	const product=await MenShoes.findById(id);

	res.render('Category/MenShoes/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.patch('/products/category/men-shoes/:id',async(req,res)=>{
	try{
	const updatedProduct=req.body;

	const {id}=req.params;

	await MenShoes.findByIdAndUpdate(id,updatedProduct);
	res.redirect(`/products/category/men-shoes/${id}`);
	}	
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});

router.delete('/products/category/men-shoes/:id',async(req,res)=>{
	try{
	const {id}=req.params;
	await MenShoes.findByIdAndDelete(id);
	res.redirect('/products/category/men-shoes');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})


router.post('/products/category/men-shoes/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await MenShoes.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/products/category/men-shoes/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

router.delete('/products/category/men-shoes/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;
	await Review.findByIdAndDelete(id);
	await MenShoes.findByIdAndDelete(id);
	res.redirect(`/products/category/men-shoes`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})








module.exports=router;