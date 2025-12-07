//enable env variables inside project
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express()
import UserRoutes from "./view/user.view.js"
app.use(express.json())
import aggregationRoutes from "./view/aggregation.js"

//Database connection code
const uri = process.env.MONGO_URI
//URI -> Uniform Resource Identifier 

//cors implementation
import cors from 'cors';

const corsOptions = {
    origin:"http://localhost:5000", 
    methods:["GET","POST"],
    allowedHeaders:["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))



// rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs:15*60*1000, 
    max:5, 
    message:"Too Many Requests, Please Try Again Later"
})


app.use(limiter)




import mongoose from 'mongoose';

//implement a db connection promise 
mongoose.connect(uri)
.then(()=>console.log("Connected to Database Successfully"))
.catch(err=>console.error(err.message))

import User from "./model/user.model.js"



app.get("/", (req, res)=>{
    res.send("Welcome to the user management api")
})
app.use(aggregationRoutes)
app.use(UserRoutes)

//fetch 
app.get("/users", (req, res)=>{
    res.json({
        users
    })
})



app.get("/xss-example", (req, res)=>{
    const userInput = req.query.input;

    const html = `
    <h1>Xss Example</h1>
    
    <p>User Input: ${userInput}`

    res.send(html);
})



app.listen(3000, ()=>{
    console.log("Server is live on http://localhost:3000/")
})