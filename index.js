//Imports
const express = require('express')
const app = express()
const process = require('process')
const bodyParser = require('body-parser')
const mongooose = require('mongoose')
const Food = require('./models/Food')
const port = process.env.PORT || 8800
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
mongooose.connect('mongodb://admin:admin123@ds149344.mlab.com:49344/demo',{useNewUrlParser:true}).then(()=>console.log('connectedn')) //MongoDB connection using Mongoose
var db = mongooose.connection //Mongo Connection Instance
app.get('/',function(req,res){  //HomePage for API
    res.send('Hello world form Order App...')
})

//Get all Orders
app.get('/api/orders',function(req,res){
    Food.getOrders(function(err,orders){
        if(err)throw err

        res.json(orders)
    })
})

//Insert a Genre
app.post('/api/order',function(req,res){
    let order = req.body
    Food.addOrder(order,function(err,order){
        if(err)throw err

        res.json(order)
    })
})
//Update a Genre
// app.put('/api/genres/:_id',function(req,res){
//     let id = req.params._id
//     let genre = req.body
//     delete genre.id
//     Genre.updateGenre(id,genre,function(err,genre){
//         if(err){res.json({message:err})}

//         res.json(genre)
//     })
// })

//Delete a Genre
app.delete('/api/genres/:_id',function(req,res){
    let id = req.params._id
    Food.removeOrder(id,function(err,order){
        if(err)throw err

        res.json(order)
    })
})

//Get all Books
app.get('/api/books',function(req,res){
    Book.getBooks(function(err,books){
        if(err)throw err
        res.json(books)
    })
})

//Insert a Book
app.post('/api/books',function(req,res){
    let book = req.body
    Book.addBook(book,function(err,book){
        if(err)throw err;
        res.json(book)
    })
})

 //get single Book By Id
app.get('/api/books/:_id',function(req,res){
    Book.getBookById(req.params._id,function(err,book){
        if(err)throw err

        res.json(book)
    })
})

//Update a Book
app.put('/api/books/:_id',function(req,res){
    let id = req.params._id
    let book = req.body
    Book.updateBook(id,book,function(err,book){
        if(err)throw err
        res.json(book)
    })
})

//Delete a Book
app.delete('/api/books/:_id',function(req,res){
    let id = req.params._id
    Book.removeBook(id,function(err,book){
        if(err)throw err

        res.json(book)
    })
})
/* ******************** Login ************************* */
app.post('/api/accounts/signup',(req,res)=>{
    const {body} = req
    let {
        firstName,lastName,email,password
    } = body
    if(!firstName){return res.send({success:false,message:"User must must have First Name"})}
    if(!email){return res.send({success:false,message:"User must must have Email"})}
    if(!password){return res.send({success:false,message:"User must must have Password"})}
    if(!lastName){return res.send({success:false,message:"User must must have Last Name"})}
    email = email.toLowerCase()
    User.find({
        email:email
    },(err,prevUser)=>{
        if(err){console.error(err);return res.send({success:false,message:"Internal Server Error"})}
        else if(prevUser.length>0){return res.send({success:false,message:"User already exist"})}
        
        let newUser = new User();
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password)
        newUser.save((err,user)=>{
            if(err){
                console.error(err);
                return res.send({success:false,message:"Internal Server Error"})
            }
            return res.send(user)
        })
    })
})
app.post('/api/accounts/signin',(req,res)=>{
  const {body} = req
  let {
      email,password
  } = body

  email = email.toLowerCase()
  if(!email){return res.send({success:false,message:"User must must have an Email"})};
  if(!password){return res.send({success:false,message:"User must must have a Password"})}
  User.find({email:email},(err,users)=>{
      if(err){
          return res.send({success:false,message:'Internal Server Error'})
      }
      if(users.length!=1){
          return res.send({success:false,message:'Invalid Login'})
      }
      const user = users[0]
      if(!user.validPassword(password)){
          return res.send({success:false,message:'Invalid Password'})
      }
      let userSession = new UserSession()
      userSession.userId = user._id
      userSession.save((err,doc)=>{
          if(err){

              return res.send({success:false,message:'Internal Server Error'})
          }
          return res.send({
              success:true,
              message:'Sign in Succesfully',
              token:doc._id,
              firstName:user.firstName
          })
      })


  })

})
app.get('/api/accounts/verify/:token',(req,res)=>{
const {token} = req.params
console.log(token)
UserSession.findOne({userId:token},(err,session)=>{
    if(err){
        return res.send({success:false,message:"Internal Server Error"})
    }
    if(!session.isDeleted)
        return res.send({
            success:true,
            message:'Good'
        })
    else
    return res.send({success:false,message:"Session deleted"})
    
})
})
app.post('/api/accounts/logout',(req,res)=>{
const {token} = req.body
// UserSession.findByIdAndUpdate(token,$set({isDeleted:true}),null,(err,session)=>{
//     if(err){
//         return res.send({success:false,message:"Internal Server Error"})
//     }
//     return res.send({success:true,message:"Session deleted"})
    
// })
UserSession.findOneAndUpdate({userId:token}, { $set: { isDeleted: true }}, { new: true },  (err, session)=>{
        if(err){
        console.error(err)
        return res.send({success:false,message:"Internal Server Error"})
    }
    return res.send({success:true,message:"Session deleted"})
})
})

//Server
app.listen(port,function(){
    console.log('Listening on port'+port)
})