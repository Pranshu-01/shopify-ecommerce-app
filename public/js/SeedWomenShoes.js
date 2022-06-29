const WomenShoes = require('../../models/Category/WomenShoes');

const { default: axios } = require('axios');

// console.log(req.params);
const url='https://dummyjson.com/products/category/womens-shoes';

const seedWomenShoes = async () => {
	await WomenShoes.deleteMany({});
	
	axios.get(url)
		.then((res) => {
            // console.log(res);
            for(let item of res.data.products){
				// console.log(item);
            // console.log(item.images);
			// console.log(res.data.products);
			// console.log(item.title);
			if(item.price){
				item.price=Math.round((item.price)*(40.59))
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
            WomenShoes.insertMany(products);
        }
			console.log('DB Seeded');


	
		})
		.catch((err) => {
			console.log(err);
		});
};
module.exports = seedWomenShoes;
