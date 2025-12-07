import mongoose from 'mongoose';

//defined the schema 
//define the fields that are allowed
//defining rules for each and every field 
//mongoose has built in validators 

//OOP -> DOP-> Document oriented programming 
const userSchema = mongoose.Schema({
    name:{
        //string
        type:String, //this will allow only string to be added in this field 
        required:true //this will make name to be included mandatorily in every document 
    },
    age:{
        type:Number,
        required:true,  
        min:18, //minimum allowed value of the number
        max:100 //maximum allowed value of the number

    },
    email:{
        type:String,
        required:true,
        unique:true, //this will make sure that no duplicated email is used by an user 
        validate:{
            validator: function(email){
                // return (email.includes("@") && email.includs(".com"))
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
        enum:["user", "admin", "superadmin", "guest"], //enumeration -> array of allowed values 
        default:"user", //if the user doesnt manually add role, use this value
        required:true

    }
})

const User = mongoose.model("Users", userSchema);

export default User
