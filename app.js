require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const crypto=require("crypto");
const path=require("path");
const ejs=require("ejs");
// const connection=require("./db");
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const multer=require("multer");
const Grid=require("gridfs-stream");
const methodOverride=require("method-override");
const fs=require("fs");
const DeleteMember=require("./routes/deletemember");
const Member=require("./collections/delete");

const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
// const md5=require("md5");
// const bcrypt=require("bcrypt");
// const encryption=require("mongoose-encryption"); 
const PORT=process.env.PORT || 3000;

mongoose.set("strictQuery", false);

const connectDB = async ()=>{
    try{
        const conn=mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO DB CONNECTED`);
    }
     catch (error){
        console.log(error);
        process.exit(1);
     }
}
const saltRounds = 10;
const app=express();
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride("_method"));
 
app.set("view engine","ejs");
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
// connection();

// routes define here



app.use("/deletemember",DeleteMember);

// fs.unlink(filePath, (err) => {
//   if (err) {
//     console.error('Error deleting file:', err);
//     return;
//   }
//   console.log('File deleted successfully');
// });

app.use(session({
  secret: 'Sabo Secrets',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
 


// Connect to MongoDB using Mongoose
// mongoose.connect('mongodb://127.0.0.1:27017/abrehot', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';

    // Check the fieldname to determine the destination folder
    switch (file.fieldname) {
      case 'support':
        uploadPath = 'uploads/support/';
        break;
      case 'photos':
        uploadPath = 'uploads/photos/';
        break;
      default:
        uploadPath = 'uploads/';
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    
    const origin=file.originalname;
    const splitted=origin.split(".");
    const real=splitted[0];
     
   cb(null, file.fieldname + real + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage: storage });

// Define a Mongoose model for the image
 
 const imageSchema =new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
 })
  const journalSchema = new mongoose.Schema({
    name:String,
    text:String,
    imageFilename:String
  });
  const authenticationSchema= new mongoose.Schema({
    email:String,
    password:String
  });
  // const memberSchema=new mongoose.Schema({
  //   name:String,
  //   position:String,
  //   image:String
  // })
  const commentSchema=new mongoose.Schema({
    name:String,
    comment:String,
    title:String
  })
  const adminSchema=new mongoose.Schema({
    username:String,
    password:String,
    status:String
  })
  const supportSchema=new mongoose.Schema({
        name:String,
        ibsa:String,
        image:String,
  })
  // authenticationSchema.plugin(passportLocalMongoose);
  // passport.use(authenticationSchema.createStrategy());

  // passport.serializeUser(authenticationSchema.serializeUser());
  // passport.deserializeUser(authenticationSchema.deserializeUser()); 
  // authenticationSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ['password']});
  const User= mongoose.model("User",authenticationSchema);
  const Admin=mongoose.model("Admin",adminSchema);
   const Image=mongoose.model("Image",imageSchema);
  const Journal=mongoose.model("Journal",journalSchema);
  // const Member=mongoose.model("Member",memberSchema);
  const Comment=mongoose.model("Comment",commentSchema);
  const Supporters=mongoose.model("Supporter", supportSchema);
  const newAdmin= new Admin({
    username:process.env.USER,
    password:process.env.PASSWORD,
    status:"notupdated"
  })

  Admin.findOne({username:process.env.USER})
  .then((docs)=>{
    if(docs){
      console.log(docs);
    }
    else{
      newAdmin.save();
    }
  })
  .catch((err)=>{
    console.log(err);
  })
  let posts=[];
  let comment;
  app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
  })
  app.get("/register",(req,res)=>{
    res.render("register");
  });
  app.post("/register",(req,res)=>{
//     bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
//     // Store hash in your password DB.
//     const newUser= new User({
//       email:req.body.email,
//       password:hash
//     });
//     newUser.save()
//     .then(()=>{
//       console.log("saved");
//     })
//     .catch((err)=>{
//       console.log(err);
//     })
//     res.render("success");
// });

    
  })
  app.get("/login",(req,res)=>{
    res.render("login");
  });
  app.post("/login",(req,res)=>{
//     User.findOne({email:req.body.email})
//     .then((docs)=>{
//       bcrypt.compare(req.body.password, docs.password, function(err, result) {
//         if(result){
//             res.render("compose");
//         }
//         else{
//             console.log("not exist");
//         }
// });
//      })
//     .catch((err)=>{
//       console.log(err);
//     })
  })

app.get("/news",async (req,res)=>{
    try {
      await Journal.find()
            .then((array)=>{
              if(array.length > 4){
                posts=array.slice(-4);
              }
              else{
                posts=array;
              }
              res.render("news",{posts:posts});
            })
            .catch((err)=>{
              res.render("error")
            })
        
    } catch (err) {
      res.render("news", {posts:posts ,files:false});
    }
});
app.get("/administrator",(req,res)=>{
  res.render("login");
})
app.post("/adminLogin",(req,res)=>{
  const pass = req.body.password;
  const username = req.body.username;

  Admin.findOne({ username: username })
      .then((docs) => {
          if (!docs) {
              // No document found
              
              res.render("adminLoginPageMessage",{message:"Wrong UserName Please Try Again"});
          } else {
              if (
                  docs.username === username &&
                  docs.password === pass &&
                  docs.status === "updated"
              ) {
                  
                  res.redirect("/adminLinks");
              } else if (docs.username === username && docs.password === pass) {
                  res.render("updatePass", { message: process.env.USER});
              } else {
                   res.render("adminLoginPageMessage",{message:"Invalid Credentials"});
              }
          }
      })
      .catch((err) => {
          // Handle any potential errors here
          console.error(err);
           res.render("adminLoginPageMessage",{message:"Please Try Again"});
      });
})
app.post("/updatePass/:user",(req,res)=>{
  const user=req.params.user;
  const newPass=req.body.newPassword;
  Admin.findOneAndUpdate({username:user},{status:"updated", password:newPass})
  .then((updated)=>{
      res.redirect("/adminLinks");
  })
  .catch((err)=>{
    res.render("error");
  })
})
const allowedReferrers = [
  '/editposts',
  '/addmember',
  '/administrator',
  '/compose',
  '/deletecomments',
  '/deletemember',
  '/support',
  '/deletesupport',
  '/addsupport'
  // Add more allowed referrers as needed
];
app.get("/adminLinks",(req,res)=>{
  const referrer = req.get('Referer'); // Get the referrer from the request header

// Check if the referrer matches any of the allowed referrers
const isAuthorizedReferrer = referrer && allowedReferrers.some(allowedReferrer => {
  // Convert both referrer and allowedReferrer to lowercase for case-insensitive matching
  return referrer.toLowerCase().includes(allowedReferrer.toLowerCase());
});

if (isAuthorizedReferrer) {
  // Access granted
  res.render("adminLinks");
} else {
  // Access denied
  res.redirect("/administrator");
}

})
app.get("/editposts",(req,res)=>{
  const refer = req.get("Referer");

if (refer && refer.includes("/adminLinks")) {
  try {
    Journal.find()
      .then((array) => {
        const posts = array.length > 4 ? array.slice(-4) : array;
        res.render("edit", { posts: posts });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/administrator");
      });
  } catch (err) {
    console.log("error:", err);
    res.redirect("/administrator");
  }
} else {
  res.redirect("/administrator");
}

})
app.get("/images/:filename", async (req,res)=>{
    const filename = req.params.filename;
    try{
     var image= await gfs.files.findOne({filename:filename});
     if(image.contentType==="image/jpeg" || image.contentType === "image/png"){
       var readstream = gfs.createReadStream(image);
       readstream.pipe(res);
     }
    }
    catch(err){
      res.json(err);
    }
    
 });
 app.get("/compose",function(req,res){
    const refer=req.get("Referer");
    if(refer && refer.includes("/adminLinks")){
      res.render("compose");
    }
    else{
      res.redirect("/administrator");
    }
    

  });
 app.post("/uploads", upload.single("image"), (req,res)=>{
   
    console.log(req.file);
    
    const newText = new Journal({
      name:req.body.postTitle,
      text:req.body.postBody,
      imageFilename:req.file.fieldname + req.file.originalname.split(".")[0]+ '.'+ req.file.originalname.split('.').pop()
    })
     newText.save()
    .then((saved)=>{
      res.render("composeWithMessage",{message:"Post Taheera"});
    })
    .catch((err)=>{
      res.render("composeWithMessage",{message:"Post Hin Taane Irra deebi'aa Yaalaa"});
    })
  // console.log(generatedName);
  //  res.render("news",{imageName:generatedName});
 
})
app.get("/support",(req,res)=>{
   const refer=req.get("Referer");
   if(refer && refer.includes("/adminLinks")){
    res.render("addsupport");
   }
   else{
    res.redirect("/administrator");
   }
})
app.get("/supporters",(req,res)=>{
  Supporters.find()
  .then((array)=>{
    res.render("supporters",{array:array})
  })
  .catch((err)=>{
    res.redirect("/");
  })
 
})
app.post("/addsupport",upload.single("support"), (req,res)=>{
  const newSupporter= new Supporters({
    name:req.body.maqaa,
    ibsa:req.body.ibsa,
    image:req.file.fieldname + req.file.originalname.split(".")[0]+ '.'+ req.file.originalname.split('.').pop()
  })
  newSupporter.save()
  .then((save)=>{
    res.render("addSupport",{})
  })
  .catch((err)=>{
    res.redirect("/administrator");
  })
})
app.get("/show/:specific", async (req,res)=>{
  const specific=req.params.specific;
  let eightElementArray=[];
  let newArray=[];
  let imageShow="";
  let count=0;
  let header="";
  let content="";
  let imageName="";
  // Journal.findOne({imageFilename:specific})
  // .then((docs)=>{
  //   res.render("show",{docs:docs});
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })

  try{
     await Journal.find()
    .then((array)=>{
        newArray=array;
        count=newArray.length;
        newArray.forEach((item)=>{
          if(item.imageFilename === specific){
              imageShow=specific;
              header=item.name;
              content=item.text;
              
          }
         })
         Comment.find({title:header})
         .then((arr)=>{
           comment=arr;
           if(count < 4){
            res.render("show",{docs:imageShow,header:header,content:content,arrays:newArray,image:imageName, comment:comment});  
           }
           else{
             eightElementArray=newArray.slice(-4);
             res.render("show",{docs:imageShow,header:header,content:content,arrays:eightElementArray, comment:comment}); 
           }
         })
         .catch((err)=>{
          res.render("error");
         })
    })
   

  }
  catch(err){
    res.render("error");
  }
  
})
app.get("/shows/:specific", async (req,res)=>{
  const specific=req.params.specific;
  let eightElementArray=[];
  let newArray=[];
  let imageShow="";
  let count=0;
  let header="";
  let content="";
  // Journal.findOne({imageFilename:specific})
  // .then((docs)=>{
  //   res.render("show",{docs:docs});
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })

  try{
     await Journal.find()
    .then((array)=>{
        newArray=array;
        count=newArray.length;
        newArray.forEach((item)=>{
          if(item.imageFilename === specific){
            console.log(newArray.indexOf(item));
              imageShow=specific;
              header=item.name;
              content=item.text;
              
          }
         })
         Comment.find({title:header})
         .then((arr)=>{
           comment=arr;
           if(count < 4){
            res.render("newshow",{docs:imageShow,header:header,content:content,arrays:newArray,image:imageName, comment:comment});  
           }
           else{
             eightElementArray=newArray.slice(-4);
             res.render("newshow",{docs:imageShow,header:header,content:content,arrays:eightElementArray, comment:comment}); 
           }
         })
         .catch((err)=>{
          console.log(err);
         })
    })
   

  }
  catch(err){
    res.render("error");
  }
  
})
app.get("/test",(req,res)=>{
  res.render("comment");
})

// comment Section



app.post("/postComment/:title",(req,res)=>{
  const specificTitle=req.params.title;
    const newComment= new Comment({
      name:req.body.name,
      comment:req.body.comment,
      title:specificTitle
    })
    newComment.save()
    .then((save)=>{
       res.redirect("/showWithComment/"+specificTitle+"");
    })
    .catch((err)=>{
      res.render("error");
    })
})
app.get("/showWithComment/:sec", async (req,res)=>{
  const specific=req.params.sec;
  let eightElementArray=[];
  let newArray=[];
  let imageShow="";
  let count=0;
  let header="";
  let content="";
  let commentName=[];
  let comment=[];

  Comment.find({title:specific})
  .then((arr)=>{
     comment=arr;
  })
  .catch((err)=>{
    res.render("error");
  })
  
  // Journal.findOne({imageFilename:specific})
  // .then((docs)=>{
  //   res.render("show",{docs:docs});
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })

  try{
     await Journal.find()
    .then((array)=>{
        newArray=array;
        count=newArray.length;
        newArray.forEach((item)=>{
          if(item.name === specific){
            console.log(newArray.indexOf(item));
              imageShow=item.imageFilename;
              header=specific;
              content=item.text;
              
          }
         })
        if(count < 4){
         res.render("showWithComments",{docs:imageShow,header:header,content:content,arrays:newArray, comment:comment});  
        }
        else{
          eightElementArray=newArray.slice(-5);
          res.render("showWithComments",{docs:imageShow,header:header,content:content,arrays:eightElementArray, comment:comment}); 
        }
    })
   

  }
  catch(err){
    res.render("error");
  }
})
let document;
app.get("/edit/:name",(req,res)=>{
  const editPost=req.params.name;
  Journal.findOne({name:editPost})
  .then((docs)=>{
    document=docs;
    res.render("editpage",{post:document});
  })
  .catch((err)=>{
    res.render("error");
  })

   
  

})
app.post("/textedit/:name",(req,res)=>{
  const editParams=req.params.name;
  const editName=req.body.name;
  const editText=req.body.text;
    Journal.findOneAndUpdate(
    { name:editParams}, // Filter criteria to find the user
    { $set:{text: editText, name: editName}}, // Update to be applied (in this case, setting the age to 30)
    { new: true } // To get the updated document as the result (optional)
  )
    .then(updatedUser => {
       res.render("editWithMessage",{message:"Poostin kun update ta'eera"});
    })
    .catch(err => {
       res.render("editeWithMessage",{message:"poostin kun edit hin taane irra deebi'a yaalaa"});
    });
})
app.get("/shows/:new",(req,res)=>{
  const imageFile=req.params.new;
  Journal.findOne({imageFilename:imageFile})
  .then((docs)=>{
    res.render("new",{images:docs});
    console.log(docs);
  })
  .catch((err)=>{
    res.render("error");
  })
  
})
app.post("/updateImage/:new",upload.single("updatedImage"), (req,res)=>{
  const updatedImage=req.params.new;
  const filePath = path.join(__dirname, 'uploads', updatedImage);
  let maqaa=req.file.fieldname + req.file.originalname.split(".")[0]+ '.'+ req.file.originalname.split('.').pop()
  Journal.findOneAndUpdate(
    { imageFilename:updatedImage}, // Filter to find the document
    { $set: { imageFilename:maqaa} }, // Changes to be applied
    { new: true } // To return the updated document
  )
    .then((updatedItem) => {
      console.log('Updated Item:', updatedItem);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          // Handle error, if any
        } else {
           res.render("correct",{message:updatedItem.name+" update taheera", link:"editposts"})
          // Continue with the update logic after deletion
        }
      });
    })
    .catch((error) => {
      res.render("error");
    });
  
  res.redirect("/editposts");
})
app.get("/deletePost/:new",(req,res)=>{
   const deltedPost=req.params.new;
   const filePath = path.join(__dirname, 'uploads', deltedPost);
   Journal.deleteOne({ imageFilename: deltedPost}) // Filter to find the document to delete
  .then((result) => {
    console.log("document deleted");
  })
  .catch((error) => {
    console.error(error);
  });
   fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      // Handle error, if any
    } else {
      console.log('Old image deleted successfully');
      // Continue with the update logic after deletion
    }
  });
  res.redirect("/admin");

})

app.get("/member",(req,res)=>{
  Member.find()
  .then((array)=>{
    res.render("member",{array:array});
  })
  .catch((err)=>{
    console.log(err);
  })
 
})
 

app.get("/addmember",(req,res)=>{
  const refer = req.get("Referer");

if (refer && refer.includes("/adminLinks")) {
  res.render("addmember");
} else {
  res.redirect("/administrator");
}


 
})
app.post("/addmember",upload.single("image"),(req,res)=>{
   
    const newAdd= new Member({
      name:req.body.name,
      position:req.body.otherJob,
      image:req.file.fieldname + req.file.originalname.split(".")[0]+ '.'+ req.file.originalname.split('.').pop()
    })
    const newMember= new Member({
        name:req.body.name,
        position:req.body.job,
        image:req.file.fieldname + req.file.originalname.split(".")[0]+ '.'+ req.file.originalname.split('.').pop()
    })
    if(req.body.job === "Other"){
      newAdd.save()
      .then((saved)=>{
        const message= saved.name+" save ta'eeraa";
         res.render("addmemberWithMessage",{message:message});
      })
      .catch((err)=>{
      const errmessage=saved.name+" save hin taane";
         res.render("addmemberWithMessage",{message:errmessage});
      })
    }
    else{
      newMember.save()
      .then((saved) => {
        const message= saved.name+" save ta'eeraa";
         res.render("addmemberWithMessage",{message:message});
      })
      .catch((err) => {
        const errmessage=saved.name+" save hin taane";
        res.render("addmemberWithMessage",{message:errmessage});
      });
    }
   
})
app.get("/practice",(req,res)=>{
  res.json({
    message:"saboo"
  });
})
app.get("/picEdit/:new",(req,res)=>{
  const imageUrl=req.params.new;
  res.render("picedit",{image:imageUrl});
})
app.get("/deletecomments",(req,res)=>{
  const refer = req.get("Referer");

  if(refer && refer.includes("/adminLinks")){
    Comment.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).exec()
    .then(items => {
      res.render("deletecomments",{array:items});
      // Process the sorted items
    })
    .catch(err => {
       res.redirect("/administrator");
      // Handle error
    });
  }
  else{
    res.redirect("/administrator");
  }
  
  
})
let messa;
app.get("/deleteSpecificComment/:spec",(req,res)=>{
  const comn=req.params.spec;
  Comment.findOneAndDelete({comment:comn})
  .then((del)=>{
     messa="Koomentiin "+del.name+" haqameera";
    res.render("deleteWithMessage",{message:messa})
  })
  .catch((err)=>{
    messa="koomentin kun hin haqamne irra deebi'aa yaalaa";
    res.render("deleteWithMessage",{message:messa});
  })
})

 app.get("/deletesupport",(req,res)=>{
  Supporters.find()
  .then((array)=>{
    res.render("deletesupporters",{array:array})
  })
  .catch((err)=>{
    console.log(err);
  })
 })
 app.get("/deletesupport/specific/:image",(req,res)=>{
  const delimg = req.params.image;
  const filePath = path.join(__dirname, 'uploads/support', delimg);
  
  // Assuming Supporters is a Mongoose model
  Supporters.findOneAndDelete({ image: delimg })
    .then((deletedSupporter) => {
      if (!deletedSupporter) {
        // Handle case where the supporter with the specified image name was not found
        res.render("error");
        return;
      }
  
      fs.unlink(filePath, (err) => {
        if (err) {
          res.render("error");
          // Handle error, if any, when deleting the file
        } else {
          res.render("correct",{message:deletedSupporter.name+" delete Taheera", link:"deletesupport"});
          // Continue with any further logic after successful deletion
        }
      });
    })
    .catch((err) => {
      res.render("error");
      // Handle any errors that occur during the deletion or database operation
    });
  
 })
 app.get("/education",(req,res)=>{
  res.render("education");
 })

 connectDB().then(()=>{
  app.listen(PORT, ()=>{
      console.log(`Listening on PORT ${PORT}`);
  })
})