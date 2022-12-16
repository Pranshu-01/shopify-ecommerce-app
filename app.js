
if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const axios=require('axios');
const seedDB=require('./seed');
const seedSmartPhone=require('./public/js/SeedSmartphones');
const seedFurniture=require('./public/js/SeedFurniture');
const seedMenShoes=require('./public/js/SeedMenShoes');
const seedWomenShoes=require('./public/js/SeedWomenShoes');
const User=require('./models/user');
const methodOverride=require('method-override');
const {isLoggedIn}=require('./middleware');




const session =require('express-session');
const flash=require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');


//  https://online.codingblocks.com/app/player/207355/content/208449/13406/lecture
//3:09 :35

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('DB Connected'))
.catch((err)=>console.log(err))

seedDB();

// seedSmartPhone();
// seedFurniture();
// seedMenShoes();
// seedWomenShoes();
// seedSearch();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// mongoose.set('strictQuery', true);

const sessionConfig={
    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    res.locals.isSeller=req.user;
    
    next();
})


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/error',(req,res)=>{
    res.render('error');
})

app.get('/shipping-details',isLoggedIn,async(req,res)=>{
    const userid=req.user._id;
    const user=await User.findById(userid).populate('cart');
    res.render('details',{user});
})

app.post('/shipping-details',isLoggedIn,async(req,res)=>{
    res.redirect('/payment');
})

app.get('/payment',isLoggedIn,async(req,res)=>{
    const userid=req.user._id;
    const user=await User.findById(userid).populate('cart');
    res.render('payment',{user});
})

app.post('/payment',isLoggedIn,async(req,res)=>{
    req.flash('success','Your Order has been Placed');
    res.redirect('/products');
})
const productRoutes=require('./routes/productRoutes');
const smartPhonesRoutes=require('./routes/categoryRoutes/smartPhonesRoutes');
const furnitureRoutes=require('./routes/categoryRoutes/FurnitureRoutes');
const menShoesRoutes=require('./routes/categoryRoutes/MenShoes');
const womenShoesRoutes=require('./routes/categoryRoutes/WomenShoes');
const searchRoutes=require('./routes/categoryRoutes/SearchRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');

app.use(productRoutes);
app.use(smartPhonesRoutes);
app.use(furnitureRoutes);
app.use(menShoesRoutes);
app.use(womenShoesRoutes);
app.use(searchRoutes);
app.use(authRoutes);
app.use(cartRoutes);


app.listen(process.env.PORT||2323,(req,res)=>{
    console.log('server running at port 2323');
})