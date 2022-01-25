const {verifyJWT} = require('../utils/jwtfunctions');
const {CustomAPIError,UnauthenticatedError} =require('../errors/index')
const authentication=(req,res,next)=>{
    
    const usertoken = req.cookies.usertoken;
    
    if(!usertoken){
        throw new CustomAPIError("no token present");
    }
    const isValid = verifyJWT({token:usertoken,secret:'jwtSecret'});
    if(!isValid){
        throw new CustomAPIError("token is not valid")
    }
    const {name,email,role,id}=isValid;
    req.user={name,email,role,id};

    next();
}

/**
 * @description authorize returns a middleware function. pass a list of roles that can access the route ie authorize(owner,admin)
 */

const authorize = (...roles)=>{
    
    const authorizationAdmin =(req,res,next)=>{
         const {role} = req.user;
         
         if(!roles.includes(role)){
             throw new UnauthenticatedError('you must be and admin!');
    
         }
         next();
    }

    return authorizationAdmin
   
}


module.exports ={authentication,authorize}