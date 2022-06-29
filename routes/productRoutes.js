const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const Review=require('../models/review');
const {isLoggedIn}=require('../middleware');
//Display all products

router.get('/products', async (req, res) => {
	try{
	const products = await Product.find({});
	res.render('products/index', { products });
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

//Display New Template

router.get('/products/new', (req, res) => {
	res.render('products/new');
});

//Create New Product
router.post('/products', async (req, res) => {
	try{
		const newProduct = {
			...req.body,
		};
	
		await Product.create(newProduct);
		req.flash('success', 'Product created Successfully!!!');
	
		res.redirect('/products');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}


});

//Show Product

	router.get('/products/:id',async(req,res)=>{
		try{
			const {id}=req.params;
	
			const product=await Product.findById(id).populate('reviews');
	
			res.render('products/show',{product});
		}

		catch{
			req.flash('error','opps something went wrong');
			res.redirect('/error');
		}
		
	})




//Edit Template

router.get('/products/:id/edit',async(req,res)=>{
	try{
		const {id}=req.params;
	
		const product=await Product.findById(id);

		res.render('products/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

	
})


//Update Product
router.patch('/products/:id',async(req,res)=>{
	try{
		const updatedProduct=req.body;

		const {id}=req.params;
	
		await Product.findByIdAndUpdate(id,updatedProduct);
		res.redirect(`/products/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

//Delete Product
router.delete('/products/:id',async(req,res)=>{
	try{
		const {id}=req.params;

		await Product.findByIdAndDelete(id);

		res.redirect('/products');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
	
});

router.post('/products/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await Product.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/products/${id}`);
	}

	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
	

});

router.delete('/products/:id/review',isLoggedIn,async(req,res)=>{
	try{
		const {id}=req.params;
		await Review.findByIdAndDelete(id);
		await Product.findByIdAndDelete(id);
		res.redirect(`/products`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

	
})

module.exports=router;