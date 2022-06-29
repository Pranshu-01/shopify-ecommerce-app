const mongoose = require('mongoose');

const womenShoesSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	price: {
		type: Number,
		min: 0,
	},
	img: {
		type: String,
		trim: true,
		default: '/images/product.jpg',
	},
	desc: {
		type: String,
		trim: true,
	},
	rating:{
		type:Number
	},
	reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

const WomenShoes=mongoose.model('WomenShoes',womenShoesSchema);

module.exports=WomenShoes;