const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT=7799;
const fs=require('fs')
const ejs=require('ejs');
const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForMobile=RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/)
const db="mongodb://localhost:27017/UserInfo";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   
app.set('view engine', 'ejs');

const connectDB=async()=>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true});
        console.log("MongoDB connected")
    }
    catch(err){
        console.log(err.message)
    }
}
connectDB();

const empModel=require('./db/empSchema')

app.get('/',(req,res)=>{
    empModel.find({},(err,data)=>{
        if(err) throw err;
        else{
        res.render('form_data',{postData:data});
        }
    })
    // const error={name:'',email:'',age:'',mobile:'',salary:''}
   
    // res.render('empData',{error:error})
   
})

app.get('/addpost', (req, res) => {
    const error={name:'',email:'',age:'',mobile:'',salary:''}
   
    res.render('layout',{error:error})
});

app.post('/postdata', function(req, res){
    const error={name:'',email:'',age:'',mobile:'',salary:''}
    error.name=regForName.test(req.body.name)?'':'Please Enter Valid Name'
    error.email=regForName.test(req.body.email)?'':'Please Enter Valid Email Address'
    error.age=req.body.age> 0?'':'Please Enter Valid Age'
    error.mobile=regForMobile.test(req.body.mobile)?'':'Please Enter Valid Phone'
    error.salary=req.body.salary.length>4?'':'City Character length Must be 3 to 20 '
    if(error.name!==''||error.email!=='' || error.age!==''||error.mobile!=='' || error.salary!==''){
        res.render('layout',({error:error}))
        console.log(error)
    }

    else{
         console.log(req.body)
    let name=req.body.name;
    let email=req.body.email
    let age=req.body.age;
    let mobile=req.body.mobile;
    let salary=req.body.salary;
    //insert data
    let ins=new empModel({name:name,email:email,age:age,mobile:mobile,salary:salary});
    ins.save((err)=>{
        if(err){ res.send("Already Added")}
        else{
        res.redirect('/')
        }
    })
    }

    // res.redirect('/')
   //store data or append data in post.json
//    res.json({"err":0,"msg":"Post Save"});
});

app.get(`/updatepost/:id`,(req,res)=>{
    fs.readFile('./post.json', 'utf-8', function(err, data) {
        var postData=[]
        if (err) throw err
        postData = JSON.parse(data)
        console.log(postData)
        res.render('update',{postData:postData.posts[req.params.id],index:req.params.id})
    })
})

app.post(`/fupdatepost/:id`,(req,res)=>{
    fs.readFile('./post.json', 'utf-8', function(err, data) {
        var arrayOfObjects=[]
        if (err) throw err
    
        arrayOfObjects = JSON.parse(data)
        console.log(req.body)
        
        arrayOfObjects.posts[req.params.id].title=req.body.title,
        arrayOfObjects.posts[req.params.id].des=req.body.des,
       
        console.log(arrayOfObjects)
        fs.writeFile('./post.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
            if (err) throw err
            console.log('Done!')
        })
        
    })
    res.redirect('/')
})

app.get(`/deletepost/:id?`,(req,res)=>{
    fs.readFile('./post.json', 'utf-8', function(err, data) {
        let arr=JSON.parse(data)
        //  empData=arr.emp
         arr.posts.splice(req.params.id,1)
        //  console.log(empData);
         fs.writeFile('./post.json', JSON.stringify(arr), 'utf-8', function(err) {
          if (err) throw err
          res.end();
          })
          
        })
        res.redirect('/');
    // res.json({"err":0,"msg":"Post Deleted!!"});
})

app.listen(PORT,(err)=>{
    if (err) throw err
    console.log(`Work on ${PORT}`);
})
