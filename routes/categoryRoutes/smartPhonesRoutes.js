const express=require('express');
const router=express.Router();
const Category=require('../../models/Category/category');
const Review=require('../../models/review');
const {isLoggedIn}=require('../../middleware');

router.get('/products/category/smartphones',async(req,res)=>{
	try{
		const products = await Category.find({});
		res.render('Category/Smartphones/index', { products });
	}

	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

})

router.get('/products/category/smartphones/:id',async(req,res)=>{
	try{
	const {id}=req.params;
    console.log()

	const product=await Category.findById(id).populate('reviews');

	res.render('Category/Smartphones/show',{product});
	}

	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/products/category/smartphones/:id/edit',async(req,res)=>{
	try{
	const {id}=req.params;
	
	const product=await Category.findById(id);

	res.render('Category/Smartphones/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.patch('/products/category/smartphones/:id',async(req,res)=>{
	try{
	const updatedProduct=req.body;

	const {id}=req.params;

	await Category.findByIdAndUpdate(id,updatedProduct);
	res.redirect(`/products/category/smartphones/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});

router.delete('/products/category/smartphones/:id',async(req,res)=>{
	try{
	const {id}=req.params;
	await Category.findByIdAndDelete(id);
	res.redirect('/products/category/smartphones');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});


router.post('/products/category/smartphones/:id/review',isLoggedIn,async(req,res)=>{
	try{
	
	const {id}=req.params;

	const product=await Category.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/products/category/smartphones/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

router.delete('/products/category/smartphones/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;
	await Review.findByIdAndDelete(id);
	await Category.findByIdAndDelete(id);
	res.redirect(`/products/category/smartphones`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})







module.exports=router;