import jsonwebtoken from 'jsonwebtoken'



const secret =  process.env.JWT_SECRET
//to create a token
const createToken= (user)=>{
    const token= jsonwebtoken.sign(
        {
            //payload
            id:user._id,
            email:user.email,
            role:user.role
        },
        // secret key
       secret,
        {
            //options
            expiresIn:"1y",
            algorithm:"HS256",
            issuer:"Vishoo's Server"
        }
    )

    return token
}



//to verify a token
const verifyToken = (req, res, next) =>{
    //Token extraction from the Authorization Headers from the Req json
    let token = req.headers.authorization
    
    if(!token){
        res.status(400).json({
            message:"No Token Provided"
        })
    }

    token = token.split(' ')[1];
    const user = jsonwebtoken.verify(
            token,
            secret
        )
    console.log(user)
        req.user = user;
        next();
}


export {
    createToken,
    verifyToken
}