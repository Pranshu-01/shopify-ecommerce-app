const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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

const Category=mongoose.model('Category',categorySchema);

module.exports=Category;