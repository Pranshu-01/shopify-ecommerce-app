const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Category=require('../models/Category/category');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
    role: {
        type: String,
        default:'buyer'
    },

	cart:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Product',
		},
	],
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;
