import jsonwebtoken from 'jsonwebtoken'

const secret =  process.env.JWT_SECRET
const createToken= (user)=>{
    const token= jsonwebtoken.sign(
        {
            id:user._id,
            email:user.email,
            role:user.role
        },
       secret,
        {
            expiresIn:"1y",
            algorithm:"HS256",
            issuer:"Vishoo's Server"
        }
    )

    return token
}

const verifyToken = (req, res, next) =>{
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