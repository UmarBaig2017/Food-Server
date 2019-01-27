const mongoose = require('mongoose')

//Defining Book Database Schema
const orderSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Ph:{
        type:String,
        required:true
    },
    amt:{
        type:Number,
        required:true
    },
    ORD:[
        {
            finalPrice:Number,
            quant:Number,
            order:{
                name:String,
                price:Number
            }
        }
    ]
})

//Initializing and connecting to the books Collection with the defined Schema
var Order = module.exports = mongoose.model('order',orderSchema)

//Get all Books function
module.exports.getOrders = function(callback,limit){
    Order.find(callback).limit(limit)
}

//Get a single Book function
module.exports.getBookById = function(id,callback){
    Order.findById(id,callback)          //getBookByIdFunction
}

//Add Book Function
module.exports.addOrder = function(order,callback){
    Order.create(order,callback)
}

//Update Book Function
module.exports.updatedOrder = function(id,order,callback){
    let query = {_id:id}
    let updatedOrder = {
        name:order.name,
        Address:order.Address,
        Ph:order.Ph,
        amt:order.amt,
        ORD:order.ORD
    }
    Order.findOneAndUpdate(query,updatedOrder,{new:true},callback)
}

//Remove Book Function
module.exports.removeOrder = function(id,callback){
    let query = {_id:id}
    Order.remove(query,callback)
}