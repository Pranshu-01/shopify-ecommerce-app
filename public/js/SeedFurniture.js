const Furniture = require('../../models/Category/Furniture');

const { default: axios } = require('axios');


const url='https://dummyjson.com/products/category/furniture';

const seedFurniture = async () => {
	await Furniture.deleteMany({});
	axios.get(url)
		.then((res) => {
            // console.log(res);
            for(let item of res.data.products){
				// console.log(item);
            // console.log(item.images);
			// console.log(res.data.products);
			// console.log(item.title);
			if(item.price<50){
				item.price=Math.round((item.price)*(1000.59))
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
            Furniture.insertMany(products);
        }
			console.log('DB Seeded');


	
		})
		.catch((err) => {
			console.log(err);
		});
};


module.exports = seedFurniture;
