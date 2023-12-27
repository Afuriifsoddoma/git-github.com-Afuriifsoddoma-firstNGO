const mongoose=require("mongoose");

module.exports = async function connection(){
    try{
      const connectionParams ={
        useNewUrlParser:true,
        useUnifiedTopology:true
      }
      await mongoose.connect(process.env.DB,connectionParams)
    }
    catch(err){
       console.log(err);
       console.log("could not connect to DB");
    }
}