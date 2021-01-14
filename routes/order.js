const express = require('express');
const router = express.Router();
const {requireSignin,isAuth,isAdmin} = require("../controllers/auth");

const {userById, addOrderToUserHistory} = require("../controllers/user") ;
const {create,listOrders,getStatusValue,orderById,updateOrderStatus} = require("../controllers/order") ;
const {decreaseQuantity} = require("../controllers/product") ;



router.post('/order/create/:userId',requireSignin,isAuth,addOrderToUserHistory,decreaseQuantity,create);
router.get('/order/status-value/:userId',requireSignin,isAuth, getStatusValue);
router.get('/order/list/:userId',requireSignin,isAuth, listOrders);
router.put('/order/:orderId/status/:userId',requireSignin,isAuth, updateOrderStatus);

router.param('userId',userById);
router.param('orderId',orderById);

module.exports = router;
