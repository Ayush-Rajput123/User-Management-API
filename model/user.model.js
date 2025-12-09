import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name:{
        type:String, 
        required:true 
    },
    age:{
        type:Number,
        required:true,  
        min:18,
        max:100 

    },
    email:{
        type:String,
        required:true,
        unique:true, 
        validate:{
            validator: function(email){
                return /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(email)
            },
            message:"{VALUE} is not a valid email"
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:20
    },
    role:{
        type:String,
        enum:["user", "admin", "superadmin", "guest"], 
        default:"user", 
        required:true
    }
})

const User = mongoose.model("Users", userSchema);
export default User
