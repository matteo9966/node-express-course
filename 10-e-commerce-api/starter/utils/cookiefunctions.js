
const attachCookiesToResponse = (res, [key,cookie],options={})=>{
    const cookieOptions = {
        httpOnly:true,
        expires: new Date(Date.now() +1000*60*60*24),

    }
    
    Object.assign(cookieOptions,options)
    console.log(key,':',cookie);
   res.cookie(key,cookie,cookieOptions);

   return res;
}

module.exports = {attachCookiesToResponse}