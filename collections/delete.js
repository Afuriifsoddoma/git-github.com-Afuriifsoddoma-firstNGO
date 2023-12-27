
const mongoose=require("mongoose");
const memberSchema=new mongoose.Schema({
    name:String,
    position:String,
    image:String
  })
  const Member=mongoose.model("Member",memberSchema);

  module.exports=Member;