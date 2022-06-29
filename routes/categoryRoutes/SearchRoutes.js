// const { application } = require('express');
const express=require('express');
const router=express.Router();
const Search = require('../../models/Category/search');
const Review=require('../../models/review');
const {isLoggedIn}=require('../../middleware');




router.post('/search',async(req,res,next)=>{
	
    const {searchTxt}=req.body;
    // console.log(req.query.searchTxt);
    console.log(searchTxt);
	
  

const { default: axios } = require('axios');

// console.log(req.params);

const url=`https://dummyjson.com/products/search?q=${searchTxt}`;


const seedSearch = async () => {
	

	axios.get(url)
		.then((res) => {
			
            // console.log(res);
            for(let item of res.data.products){
				// console.log(item);
            // console.log(item.images);
			// console.log(res.data.products);
			// console.log(item.title);
			if(item.price>120){
				item.price=Math.round((item.price)*(77.59))
			}

			
			const products =[
				{
					name:item.title,
                    // price:Math.round((item.price)*(77.59)),
					price:item.price,
                    img:item.images[0],
                    desc:item.description,
					rating:item.rating
				},
			];
			
            const seed2=async()=>{
				// await Search.deleteMany({});
				await Search.insertMany(products);
            }
			
			seed2();
           
			

        }
			console.log('DB Seeded');

	
		})
		.catch((err) => {
			console.log(err);
		});
   
    };
	 seedSearch();
	
    
   res.redirect('/search');
 
})

router.get('/search',async(req,res)=>{
	try{
	const products = await Search.find({});

    res.render('Search/index',{products});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

})

router.get('/search/:id',async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await Search.findById(id).populate('reviews');
	
	res.render('Search/show',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.get('/search/:id/edit',async(req,res)=>{
	try{
	const {id}=req.params;
	
	const product=await Search.findById(id);

	res.render('Search/edit',{product});
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})

router.patch('/search/:id',async(req,res)=>{
	try{
	const updatedProduct=req.body;

	const {id}=req.params;

	await Search.findByIdAndUpdate(id,updatedProduct);
	res.redirect(`/search/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
});

router.delete('/search/:id',async(req,res)=>{
	try{
	const {id}=req.params;
	await Search.findByIdAndDelete(id);
	res.redirect('/search');
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})


router.post('/search/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;

	const product=await Search.findById(id);

	const {rating,comment}=req.body;

	const review=new Review({rating,comment,user:req.user.username});

	product.reviews.push(review);

	await product.save();
	await review.save();

	res.redirect(`/search/${id}`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}

});

router.delete('/search/:id/review',isLoggedIn,async(req,res)=>{
	try{
	const {id}=req.params;
	await Review.findByIdAndDelete(id);
	await Search.findByIdAndDelete(id);
	res.redirect(`/search`);
	}
	catch{
		req.flash('error','opps something went wrong');
		res.redirect('/error');
	}
})




module.exports=router;