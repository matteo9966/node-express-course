const filterKeys=(obj,...keys ) => {
   if(!typeof obj === 'object'){
       return obj
   }
   keys.forEach(key=>{
       if(key in obj){
            delete obj[key]
       }
   })
}

module.exports = filterKeys