const express = require('express');
const low = require('lowdb');
const app = express();
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter);
// users database
const adapter1= new FileSync('users_database.json');
const db1 = low(adapter1);

const adapter2 = new FileSync('user_tokens.json');
const db2 = low(adapter2);

const joi = require('joi'); // input sanitization for joi
const port = 3000;
var subject_arr = [];
var cors = require('cors');
app.use(cors());
var data = require('./Lab3-timetable-data.json');
var data_length = Object.keys(data).length;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var bodyParser = require('body-parser')

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// setup serving front-end code
app.use('/', express.static('Public'));
var storage1 =[]; // empty array declaration , this array stores the filtered search results
db1.defaults({users: []}).write()

db2.defaults({tokens:[]}).write()
// declare default in the database
db.defaults({schedule: []}).write()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.put('/api/schedules',(req,res)=>{
    const schema = joi.object({
        ScheduleName: joi.string().max(18).required()
    })
    const validation =  schema.validate(req.query)
    if(validation.error){
        res.status(400).send({alert: "Bad Input "})
    return;
    }

    input = req.query.ScheduleName;
    db.get('schedule').push({scheduleName: input, coursesInformation: []}).write()
    res.send({
        alert : "add"
    });
});

var array3 =[];
var array4 =[];

app.get('/api/schedule/find/schedule', (req,res)=>{
    // input sanitization ( set max input number to 18)
    const schema = joi.object({
        scheduleName: joi.string().max(18).required()
    })
    const validation =  schema.validate(req.query)
    if(validation.error){
         res.status(400).send({alert: "Bad Input "})
     return;
    }
    
    findSchedule = req.query.scheduleName;
    array3 = db.get('schedule').map('scheduleName').value();
    //console.log(array3);
    for(a=0;a<array3.length;a++){
        if(array3[a] == findSchedule){
            var index = a;
        }
    }
  array4 = db.get('schedule['+index+'].coursesInformation').map().value();
  if(array4.length != 0){
    res.status(200).send(array4);
  }else{
      res.send({
          alert: "No courses found."
      })
  }
})
var array2 =[]
// adding courses under a specific schedule
app.put('/api/schedule/savedCourse' , (req,res)=>{
  // input sanitization for the saving a schedule with course information 
   
    schedulename = req.query.Schedulenaming;
    Subject = req.query.course_subject;
    code1 = req.query.button_id;
    coursename = req.query.name;
    array2 = db.get('schedule').map('scheduleName').value();
    console.log(array2.length);
    console.log(schedulename);
    for(a=0;a<array2.length;a++){
        if(array2[a]==schedulename){

        db.get('schedule['+ a+'].coursesInformation').push({courseSubject:Subject,courseCode:code1,courseName:coursename}).write();
        
        return res.status(200).send({// good
            alert : "Sucessfully Added."
        })
        }

}
res.status(400).send({ // bad request
    alert : "Can't be Added."
})
//res.send("gotthis:"+code);
})
// get request to get the existing name of saved courses
var savedName =[];
app.get('/api/schedule/saved',(req,res)=>{
savedName= db.get('schedule').value()
res.send(savedName);
})
// set up queries for getting results based on input
app.get('/api/courses',(req,res)=>{
subject = req.query.course;
number = req.query.courseNum;
component = req.query.courseComponent;
storage1 =[];
if(subject == "all_subjects" && number == "" ){
    //res.sendFile(__dirname + "/index.html");
       res.send({
           error1: "Ok"
       });
}else if (subject !="all_subjects" && number == "" && component != "all_components" ){// return results based on subject code and component name
    
    for(a=0;a<data.length;a++){
        if(subject==data[a].subject && component == data[a].course_info[0].ssr_component){ // match input with json file courses

            storage1.push(data[a]);// push data that matches into storage array
        }
    }
     res.send(storage1);// send back storage array 
} else if(subject !="all_subjects" && number != "" && component != "all_components" ){ // return  results based on subject code
    for(a=0;a<data.length;a++){
        if(subject==data[a].subject && number == data[a].catalog_nbr &&component == data[a].course_info[0].ssr_component){
            storage1.push(data[a])
    }
    }
    res.send(storage1);
}else if(subject !="all_subjects" && number == "" && component == "all_components"){ // search by subject and all components
    for(a=0;a<data.length;a++){
        if(subject==data[a].subject ){
            storage1.push(data[a])
    }
    }
    res.send(storage1);
}else if (subject !="all_subjects" && number != "" && component == "all_components"){ 
// search by subject and course code
 for(a=0;a<data.length;a++){
        if(subject==data[a].subject && number == data[a].catalog_nbr ){
            storage1.push(data[a])
           // console.log(storage1);
    }
    }
res.send(storage1);
}else{
    res.status(400).send({
        error1: "Cannot Find Course"
    })
    }
});
// remove multiple duplicates of the same course code from the array 
function removeMultiples(arr){
    return arr.filter((a,b)=> arr.indexOf(a) === b)
}
//get subjects from the JSON file
app.get('/api/courses/subject', (req, res) => { 
   
    for(var i=0;i<data_length; i++){
        subject_arr[i] = data[i].subject;
    };
    subject_arr = removeMultiples(subject_arr);
    res.send(subject_arr);

});
// declare a catalog number array
const catalog_arr = [];
// get request to get the catalog numbers from the json file
app.get('/api/courses/catalog_nbr',(req,res) =>{
    for(var i=0;i<data_length; i++){
        catalog_arr[i] = data[i].catalog_nbr;
    };
    res.send(catalog_arr);
});

// delete a specific course
app.delete('/api/schedule/savedCourse/delete',(req,res)=>{
    schedule = req.query.Schedulenaming;
    db.get('schedule').remove({scheduleName:schedule}).write()
    res.send({
    alert: "sucessfully deleted."
})
})

// delete all schedules
app.delete('/api/schedule/deleteAll',(req,res)=>{
       db.get('schedule').remove({}).write();
    return res.send({alert: "sucessfully deleted." });

})
// get details of a path

var store =[];
app.post('/api/public/register',  async (req,res)=>{
//console.log(req.body);
try{
// use bcrypt to encrypt the password
const salt = await bcrypt.genSalt();
const hashed_password =  await bcrypt.hash(req.body.password,salt);
console.log(salt);
console.log(hashed_password);
checkmail = req.body.email;
console.log(checkmail)
const user = { // create a model for the object that is to be passed into the database , retrieve the values from the body
    name: req.body.name,
    email: req.body.email,
    password:hashed_password,
    role: req.body.role,
    status: req.body.status
    
}
// check if an email already exists in the database
store = db1.get('users').find({ email:checkmail}).value();
console.log(store);
if(store == undefined || store.length == 0 || store ==null){ // continue to add user if the store array is empty
    //console.log("hi")

    db1.get('users').push(user).write(); // store users model into the database
//console.log(user);
res.status(201).send({message:"User added"});
   
}else{ // if the store array is not empty, email exists and send a message saying that the account already exists
    res.send({
        message: "Account Exists"
    })

}
} catch{
res.send({
    message: "Something went wrong"
})
}
})

var x=[]
app.put('/api/public/authenticate', (req,res)=>{
    mail = req.body.email;
    console.log(mail);
    x= db1.get('users').find({email:mail}).assign({status: "active"}).write()
    
    res.send({message:"Sucessfully Activated"})
    
})

app.post('/api/secure/login' , async (req,res)=>{
//console.log(req.body)
const useremail = req.body.email;
const userpass = req.body.password;
const user = {
    email: useremail,
    password: userpass
}


console.log(useremail);
const find = db1.get('users').find({email:useremail}).value();
console.log(find);
//console.log(find.password);
if(find == undefined){
    res.status(400).send({
        message: "Account does not exist"
    })
}else if(find != undefined){
    //res.status(201).send({message:"account found"})
try{
    const b= await bcrypt.compare(req.body.password, find.password);
    console.log(b)
   if(await bcrypt.compare(req.body.password, find.password)) {
       
       if(find.status != "inactive"){
        const access_token = jwt.sign({user},process.env.access_token,{expiresIn: '15m'});
       // console.log("access_token " + access_token);
        const refresh_token = jwt.sign({user},process.env.refresh_token);
        //console.log("refresh_token" +refresh_token);
        db2.get('tokens').push({refreshToken:refresh_token}).write();

        //console.log("access")

        res.status(201).send({
            name: find.name,
            access_token: access_token,
            refreshToken_token : refresh_token,
            message: "access granted"
        })
       }else{
           res.send({message:"access not granted"})
       }
   }else{
       res.send({message:"password incorrect"})
   }
} catch{
    res.send({message:"something went wrong"})
}

}
//res.send("ok")

})
app.post('/api/posts', authenticateToken,(req,res)=>{
    
    //res.send(db1.get('users').find({email:req.user.useremail}).value())
    jwt.verify(req.token, process.env.access_token, (err,user) => {
        if(err){
            return res.sendStatus(403)
        }else{
            res.json({
                user,
                message: "welcome"
            })
        }
    
        //req.user = user;
        //next();
    })
    })


app.post('/api/secure/userlogin', async (req,res)=>{
     const email = req.body.email;
     const password = req.body.password;
    console.log(email + " " + password)

    const adminEmail = "admin3316@uwo.ca";
    const adminPassword = "se3316lab5";
    if(email == adminEmail && password== adminPassword){
        console.log('iwork')
        let user ={
            name: "Admininstrator",
            email:email,
            password: password
        }

        try{
        console.log("admin")
        const admin_access_token = makeToken(user);
        console.log("from admin" + admin_token_refresh);
        const admin_token_refresh = jwt.sign(user,process.env.refresh_token);
       
        db2.get('tokens').push({ adminRefreshToken:admin_token_refresh} ).write();
        return res.send({
            access_token: admin_access_token,
            refresh_toke: admine_token_refresh,
            name: user.name,
            message: "Welcome Admin"
        })
        }catch{
            res.send({
                message: "Could not login"
            })

        }

    }
})
/*
function makeToken(user){
    console.log("enter")
    return jwt.sign(user,process.env.access_token,{expiresIn: '1h'})

    
}*/

function authenticateToken(req,res,next){
const bearer_header = req.headers['authorization']

if(typeof bearer_header !== 'undefined'){
const bearerToken = bearer_header.split(' ')[1];
req.token = bearerToken;
next();

}else{
    res.sendStatus(403);
}

}


app.listen(port, () => console.log('Listening on port ${port}'));





