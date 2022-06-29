const Category = require('../../models/Category/category');

const { default: axios } = require('axios');

// console.log(req.params);
const url='https://dummyjson.com/products/category/smartphones';

const seedSmartPhone = async () => {
	await Category.deleteMany({});
	
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
			
			const products = [
				{
					name:item.title,
                    // price:Math.round((item.price)*(77.59)),
					price:item.price,
                    img:item.images[0],
                    desc:item.description,
					rating:item.rating
				},
			];
            Category.insertMany(products);
        }
			console.log('DB Seeded');


	
		})
		.catch((err) => {
			console.log(err);
		});
};
module.exports = seedSmartPhone;
