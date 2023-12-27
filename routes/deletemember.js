const express =require("express");
const router = express.Router();
const Member=require("../collections/delete");
const path=require("path");
const fs=require("fs");


router.get("/",(req,res)=>{
  const refer=req.get("Referer");
  if(refer && refer.includes('/adminLinks') ){
     Member.find()
     .then((array)=>{
        res.render("listmember",{array:array})
     })
     .catch((err)=>{
        res.redirect("deletemember");
     })
    }
    else{
      res.redirect("/administrator");
    }
})
router.get("/specific/:member",(req,res)=>{
    const deletedMemb=req.params.member;
    // const special= deletedMemb.slice(5);
    const filePath = path.join(__dirname, '../uploads', deletedMemb);
   Member.deleteOne({ image: deletedMemb}) // Filter to find the document to delete
  .then((result) => {
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          // Handle error, if any
        } else {
           res.redirect("/deletemember");
          // Continue with the update logic after deletion
        }
      });
  })
  .catch((error) => {
    console.error(error);
  });
})

module.exports=router;