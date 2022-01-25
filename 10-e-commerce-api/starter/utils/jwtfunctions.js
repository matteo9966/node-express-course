const jwt = require('jsonwebtoken');

const createJWT = ({payload,secret,expires="1d"})=>{
    return jwt.sign(payload,secret,{expiresIn:expires})
}

const verifyJWT = ({token,secret})=>{
    return jwt.verify(token,secret)
}


module.exports={createJWT,verifyJWT}