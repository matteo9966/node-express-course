//  export (getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword) functions
const Users = require('../models/Users')

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
   if(!user.id){
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
    res.send('updateuser')
};
const updateUserPassword =async (req,res)=>{
    res.send('updateuserpass')
};

module.exports={getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword};
