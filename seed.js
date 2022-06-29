const Product = require('./models/product');

const { default: axios } = require('axios');

const url='https://dummyjson.com/products';

const seedDB = async () => {
	await Product.deleteMany({});
	axios.get(url)
		.then((res) => {
            for(let item of res.data.products){
				console.log(item);
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
            Product.insertMany(products);
        }
			console.log('DB Seeded');


	
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = seedDB;
