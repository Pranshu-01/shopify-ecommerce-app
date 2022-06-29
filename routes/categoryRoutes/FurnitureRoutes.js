const express=require('express');
const router=express.Router();
const Furniture=require('../../models/Category/Furniture');
const Review=require('../../models/review');
const {isLoggedIn}=require('../../middleware');


router.get('/products/category/furniture',async(req,res)=>{
	try{
    const products = await Furniture.find({});
	res.render('Category/Furniture/index', { products });
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/furniture/:id',async(req,res)=>{
	try{
	const {id}=req.params;
    console.log()

	const product=await Furniture.findById(id).populate('reviews');

	res.render('Category/Furniture/show',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/furniture/:id/edit',async(req,res)=>{
	try{
	const {id}=req.params;
	
	const product=await Furniture.findById(id);

	res.render('Category/Furniture/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.patch('/products/category/furniture/:id',async(req,res)=>{
	try{
	const updatedProduct=req.body;

	const {id}=req.params;

	await Furniture.findByIdAndUpdate(id,updatedProduct);
	res.redirect(`/products/category/furniture/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});

router.delete('/products/category/furniture/:id',async(req,res)=>{
	try{
	const {id}=req.params;
	await Furniture.findByIdAndDelete(id);
	res.redirect('/products/category/furniture');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})


router.post('/products/category/furniture/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await Furniture.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/products/category/furniture/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

router.delete('/products/category/furniture/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;
	await Review.findByIdAndDelete(id);
	await Furniture.findByIdAndDelete(id);
	res.redirect(`/products/category/furniture`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})








module.exports=router;