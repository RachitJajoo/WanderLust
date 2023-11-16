const User = require("../models/user.js");
const passport = require("passport");


module.exports.renderSignupForm = (req ,res)=>{
    res.render("user/signup.ejs");
};

module.exports.userSignUp = async(req , res) =>{
    try{
        let {username , email , password } = req.body;
        const newUser = new User({email,username});
        const regUser = await User.register(newUser , password);
        req.login(regUser , (err)=>{ // to directly login after Signup
            if(err){
                return next(err);
            }else{
                req.flash("success" , `${username} welcome to WanderLust`);
                res.redirect("/listings");
            }
        });
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req ,res) =>{
    res.render("user/login.ejs");
};

module.exports.userLogin =  async(req ,res) =>{
    req.flash("success", "Welcome Back to WanderLust");
    res.redirect(res.locals.redirectUrl);
};

module.exports.userLogout = (req ,res)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }else{
            req.flash("success" , "logged out");
            res.redirect("/listings");
        }
    })
};