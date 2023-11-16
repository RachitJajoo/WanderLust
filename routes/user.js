const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const { renderSignupForm, userSignUp, renderLoginForm, userLogin, userLogout } = require("../controller/user.js");


router.get("/signup" , renderSignupForm);


router.post("/signup" ,wrapAsync( userSignUp ));

router.get("/login" , renderLoginForm);

router.post( "/login" ,saveRedirectUrl , passport.authenticate("local" ,
{failureRedirect: "/login" ,
failureFlash:true,}
) ,userLogin);

router.get("/logout" , isLoggedIn ,userLogout);


module.exports = router;