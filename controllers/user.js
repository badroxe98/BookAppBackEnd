const {Order} = require('../model/order');
const {errorHandler} = require('../helpers/dbErrorHandler');
const User = require('../model/user');

exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'Utilisateur non trouvé'
            })
        }
        req.profile = user;
        next();
    })
};


exports.read = (req,res) =>{
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);

};

exports.update = (req,res)=>{
    User.findOneAndUpdate({_id:req.profile._id},
        {$set:req.body},
        {new:true},
        (err, user)=>{
        if (err){
            return res.status(400).json({
                error:"Vous n'êtes pas autorisé à effectuer cette action"
            })
        }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }


    );
};

exports.addOrderToUserHistory = (req,res,next)=>{
  let history = [];

    req.body.order.products.forEach((item)=>{
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id:req.body.order.transaction_id,
            amount:req.body.order.amount
        })
    });

    User.findOneAndUpdate({_id: req.profile._id},
        {$push : {history: history}},
        {new: true},
        (error,data) =>{
        if(error){
            return res.status(400).json({
                error:"Impossible de mettre à jour l'historique des achats de l'utilisateur"
            });
        }
        next();
    })
};

exports.purchaseHistory = (req,res)=>{
  Order.find({user: req.profile._id})
      .populate('user','_id name')
      .sort("-created")
      .exec((err,orders)=>{
          if(err){
              return res.status(400).json({
                error: errorHandler(err)
              })
          }
          res.json(orders);
      })
};
