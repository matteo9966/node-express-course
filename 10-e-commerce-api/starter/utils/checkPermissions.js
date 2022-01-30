const customError = require('../errors');
const checkPermissions =(user,resourceID)=>{
  const role = user.role;
  const userId=user._id;

  if(role==="admin") return;
  if(userId===resourceID) return;
  throw new customError.UnauthenticatedError("you dont have the permission!");

}

module.exports = checkPermissions;