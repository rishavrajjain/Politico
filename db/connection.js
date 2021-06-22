const mongoose=require('mongoose')
require('dotenv').config()
//connection to the database

mongoose.connect(`mongodb+srv://abhay:${process.env.DB_PASSWORD}@cluster0.79lea.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{
    
    useNewUrlParser:true,
    useCreateIndex:true
})

console.log('connected');

