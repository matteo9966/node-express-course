const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a valid name"],
    minlength: 3,
    maxlength: 20,
  },
  password: {
    required: [true, "please provide a password"],
    minlength: 6,
    maxlength: 20,
    type: String,
  },

  email: {
    type: String,
    unique:true,
    required: [true, "please provide a valid password"],
    validate: {
      validator: validator.isEmail,
      message: "Email not valid!",
    },
    minlength: 3,
    maxlength: 20,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

User.pre('save',async function(){
  if(!this.isModified('password')){
    return  
  }
    const pass = this.password;
    const salt =await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    this.password=hash;
})

User.methods.comparePasswords = async function(insertedPassword){
  
    const isMatch = await bcrypt.compare(insertedPassword,this.password);
    return isMatch
}

module.exports = mongoose.model("User", User);
