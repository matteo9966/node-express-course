const express = require('express')
const User = require('../models/Users');
const {StatusCodes} = require('http-status-codes');
const {createJWT,attachCookiesToResponse,filterKeys}=require('../utils')

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function register(req,res){
 const body= req.body;
 const {email,name,password} = body;
 const user = await User.findOne({email})
 if(user){
     console.log(email);
    throw new Error("email already exists!");
 }
 const response = await User.create({email,name,password});

 const objResponse = response.toObject();
 filterKeys(objResponse,'password');
 
 const usertoken = createJWT({payload:objResponse,secret:process.env.JWT_SECRET})


 attachCookiesToResponse(res,['usertoken',usertoken],{signed:false,httpOnly:true});
 res.status(StatusCodes.CREATED).send({user:response,obj:objResponse});
  
    
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function login(req,res){
    const error = new Error;
    let {email,password} =req.body;
    
    if(!email || !password){
        // const error = new Error();
        error.message="no email or no password"
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({email});
    
    if(!user){
        error.message="no user found!"
        throw error;
    }
     
     const isMatch = await user.comparePasswords(password)
     
    if(!isMatch){
      error.message="wrong password"
      throw error;
    }
       
    const objResponse = user.toObject();
    filterKeys(objResponse,'password');  

    const usertoken = createJWT({payload:objResponse,secret:'jwtSecret'});
   
    attachCookiesToResponse(res,['usertoken',usertoken],{signed:false,httpOnly:true});
    res.status(StatusCodes.OK).send({user});
    
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function logout(req,res){
    attachCookiesToResponse(res,['usertoken',"no-token"],{signed:false,httpOnly:true,expires:new Date(Date.now()+10*1000)});
    res.clearCookie('tokenUser');
    res.send('logout controller')
}


module.exports={
    login,
    logout,
    register,
}