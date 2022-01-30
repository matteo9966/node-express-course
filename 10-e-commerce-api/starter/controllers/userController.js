//  export (getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword) functions
const {BadRequestError} = require('../errors');
const Users = require('../models/Users');
const { createJWT,attachCookiesToResponse,checkPermissions } = require('../utils');

const getAllUsers =async (req,res)=>{
    const allUsers = await Users.find({role:'user'})
    console.log(req.user);
    //un altra alternativa è usare il metodo SELECT di mongoose per rimuovere una proprietà dal documento
    const users = allUsers.map(user=>{
        user= user.toObject();
        const {password,...other} = user;
        return other
    })

//    const users= allUsers.map(user=>{
//        const objUser = user.toObject();
//       delete objUser["password"];
//       return objUser
//     })


    res.send(users);
};
const getSingleUser = async (req,res)=>{
   const id= req.params?.id;
    
   let user = await Users.findById(id)
   
   checkPermissions(req.user,id);

   if(!user){
       const err = new Error();
       err.message="no user with this id"
       err.statusCode = 404
       throw err;
   }
   user = user.toObject()

   const {password,...other}= user;
   
   
    res.send(other)
};
const showCurrentUser = async (req,res)=>{
    const user= req.user;
    res.send({user:user});
};
const updateUser =async (req,res)=>{
    const {email,password,role,...updateObject} = req.body;
    if(!email || !password){
        throw new BadRequestError(' email or password is missing');

    }
    if(!req.user){
        throw new BadRequestError('error, it wasnt possible to update user!');
    }

    const user = await Users.findById(req.user._id).select('-password');

    if(!user) throw new Error('no user found!');

    
 
    const validAttributes  = Object.keys(Users.schema.paths).filter(string=>!string.toString().startsWith('_')); 
    Object.keys(updateObject).forEach(key=>{
        if(validAttributes.includes(key)){
            user[key]=updateObject[key];
        }
    })
    const updated = await user.save();
    
    const token = createJWT({payload:updated.toObject(),secret:process.env.JWT_SECRET,expires:'1d'})
     attachCookiesToResponse(res,['usertoken',token],{httpOnly:true})
    //devo aggiornare il token e il cookie dopo aver aggiornato i dati!

    res.send({updated,obj:updated.toObject()});
    


};



const updateUserPassword =async (req,res)=>{
    const {oldPassword,newPassword} =req.body;
    if(!oldPassword || !newPassword){
        throw new BadRequestError("must provide old password and new password! ");
    }
    const {_id} = req.user;
    const user = await Users.findById(id);
    if(!user){
        throw new Error(" no user with Id: "+id);
    }
    const isMatch = await user.comparePasswords(oldPassword);
    if(!isMatch){
        throw new BadRequestError("old Password must be valid"); 
    }
   user.password = newPassword;
   const saved= await  user.save();
                    
    res.send(saved);
};

module.exports={getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword};
