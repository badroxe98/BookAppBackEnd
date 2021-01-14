const Auth = require('../model/user');
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req,res) =>{
    console.log("req.body",req.body);
    const user = new Auth(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
};

exports.signin = (req, res) =>{
    const {email,password} = req.body;
    Auth.findOne({email},(err, user)=>{
        if(err || !user){
            return res.status(400).json({
                err: "L'authentification avec cet e-mail n'existe pas. Inscrivez vous s'il vous plait"
            });
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "L'adresse e-mail et le mot de passe ne correspondent pas"
            })
        }



    const token = jwt.sign({_id: user._id},process.env.JWT_SECRET);
        res.cookie('t',token,{expire: new Date() + 9999});
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id,email,name,role}});
    });
};


exports.signout = (req,res)=>{
    res.clearCookie('t');
    res.json({message : "Déconnexion réussie"});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty : "auth"
});


exports.isAuth = (req,res,next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
        return res.status(403).json({
            error:"Accès refusé"
        });
    }
    next();
};

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role ===0){
        return res.status(403).json({
            error : "Ressource d'administration! Accès refusé"
        })
    }
    next();
};

