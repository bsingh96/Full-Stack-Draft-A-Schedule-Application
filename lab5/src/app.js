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

const adapter3 = new FileSync('reviews.json');
const reviewsdb = low(adapter3);

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


var stringSimilarity = require('string-similarity');
const { object } = require('joi');

const access_token_secret ='d4a237f38b4104c40affd0d5c9139d7da8d5f11754faeeb129fa981fbf7fe6b8166b274c828b728fb0277895946423e715d8ea9e4f206d868c40ea4fd3c127b1';
const refresh_token_secret='1af26c8f92dd007bd5b198b2f116b93948853dec93f879d4e2c161b43e9d81dc4631a818ea6aa56d6a39aa79e6509b069727b51ab1d04a04347d815c3920ab3c';

const admin_access_token_secret ='e3e144166a8bb8271f9df78df180b959126c09d47f30ff540372f20510197e64ed01114524571e36a34844d186e3cc7f00f2b55bce04d9aafba51c12e66630b4';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// setup serving front-end code
app.use('/', express.static('Public'));
var storage1 =[]; // empty array declaration , this array stores the filtered search results
db1.defaults({users: []}).write()
reviewsdb.defaults({reviews:[]}).write()
db2.defaults({tokens:[]}).write()
// declare default in the database
db.defaults({schedule: []}).write()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
/*
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
    //description1 = req.query.ScheduleDescription;
    db.get('schedule').push({scheduleName: input, coursesInformation: []}).write()
    res.send({
        alert : "add"
    });
}); */
// Modified api call to create schedule and verify if they already exist
var verify =[]
app.put('/api/createschedule',(req,res)=>{
Schedulename= req.body.ScheduleName;
Scheduledescription = req.body.ScheduleDescription;
Creator = req.body.Name;
verify = db.get('schedule').find({scheduleName:Schedulename}).value()
if(verify == undefined || verify == null){
db.get('schedule').push({Createdby:Creator,scheduleName:Schedulename, Description:Scheduledescription,visibility:"private",coursesInformation: [] }).write();

res.send({
    message: "add"
})
}else{
    res.send({
        message:"exists"
    })
}
})

var array3 =[];
var array4 =[];

app.get('/api/schedule/find/schedule', (req,res)=>{
    // input sanitization ( set max input number to 18)
    const schema = joi.object({
        scheduleName: joi.string().max(18).required()
    })
    const validation =  schema.validate(req.query)
    if(validation.error){
         res.send({alert: "Bad Input "})
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
    res.send(array4);
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
    res.send({
        error: "Cannot Find Course"
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

// delete a saved schedule for a user 
app.delete('/api/schedule/savedCourse/delete',(req,res)=>{
    schedule = req.query.Schedulenaming;
    db.get('schedule').remove({scheduleName:schedule}).write()
    res.send({
    alert: "sucessfully deleted."
})
})

// method to delete a course under any schedule
app.put('/api/schedule/delete/course' , (req,res)=>{
    // input sanitization for the saving a schedule with course information 
     
      schedulename = req.body.Schedulenaming;
      Subject = req.body.course_subject;
      code1 = req.body.button_id;
      coursename = req.body.name;
      array2 = db.get('schedule').map('scheduleName').value();
      console.log(array2.length);
      console.log(schedulename);
      for(a=0;a<array2.length;a++){
          if(array2[a]==schedulename){
  
          db.get('schedule['+ a+'].coursesInformation').remove({courseSubject:Subject,courseCode:code1,courseName:coursename}).write();
          
          return res.send({// good
              alert : "Sucessfully deleted."
          })
          }
  
  }
  res.send({ // bad request
      alert : "Can't be removed."
  })
  //res.send("gotthis:"+code);
  })
// deltining a specific course in schedule
var x = []
app.delete('/api/schedule/removecourse',(req,res)=>{
subject = req.body.Subject;
code = req.body.Code
classname = req.body.ClassName;
schedule = req.body.Schedule;
 x = db.get('schedule').value()
console.log(x.length)
//console.log(x)
var index;

for(i=0;i<x.length; i++){
    if(x[i].scheduleName == schedule){
        index = i;
        console.log(index)

}
 c= db.get('schedules[' + 0 + '].coursesInformation').find({ courseSubject: subject, courseCode: code, courseName: classname }).value();
 console.log(c)
}

//db.get('schedule').find({courseName:classname}).remove().write()
    //res.send({
   // alert: "sucessfully deleted."
//})

})

// delete all schedules
app.delete('/api/schedule/deleteAll',(req,res)=>{
       db.get('schedule').remove({}).write();
    return res.send({alert: "sucessfully deleted." });

})
// get details of a path
// register a user
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
res.send({message:"User added"});
   
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
//update password 
app.post('/api/secure/updatepassword', async(req,res)=>{
user_pass = req.body.Password;
mail = req.body.Email;
const salt = await bcrypt.genSalt();
const Newpass =  await bcrypt.hash(user_pass,salt);

x= db1.get('users').find({email:mail}).assign({password:Newpass}).write()

res.send({message:"Password changed"})
})


//login user mechanism that checks if user is an admin or regular user
// assigns jwt tokens based on user's role
app.post('/api/secure/login' , async (req,res)=>{
//console.log(req.body)
const useremail = req.body.email;
const userpass = req.body.password;
const user = {
    email: useremail,
    password: userpass
}
const admin_email = "admin3316@uwo.ca";
const admin_pass = "se3316lab5";

if(useremail == admin_email && userpass == admin_pass){
const admin_user ={
    name: "Admin",
    email: useremail,
    password:userpass
}

const access_token = jwt.sign({admin_user},admin_access_token_secret,{expiresIn: '15m'});
       // console.log("access_token " + access_token);
        const refresh_token = jwt.sign({admin_user},admin_access_token_secret);
        //console.log("refresh_token" +refresh_token);
        db2.get('tokens').push({adminRefreshToken:refresh_token}).write();

        //console.log("access")

    res.send({
            name: admin_user.name,
            access_token: access_token,
            refreshToken_token : refresh_token,
            message: "Welcome Admin"
        })
//res.send("welcome admin");
}else if(user.email == admin_email && user.password !=admin_pass){
    res.send({
        message: "Incorrect Pasword for admin"
    })
}else{
// normal user
console.log(useremail);
const find = db1.get('users').find({email:useremail}).value();
console.log(find);
//console.log(find.password);
if(find == undefined){
    res.send({
        message: "Account does not exist"
    })
}else if(find != undefined){
    //res.status(201).send({message:"account found"})
    if (find.status == "deactivated"){
        return res.send({message:"user deactivated"})
    }
try{
    const b= await bcrypt.compare(req.body.password, find.password);
    console.log(b)
    
   if(await bcrypt.compare(req.body.password, find.password)) {
     
       
       if(find.status != "inactive"){
        const access_token = jwt.sign({user},access_token_secret,{expiresIn: '15m'});
       // console.log("access_token " + access_token);
        const refresh_token = jwt.sign({user},refresh_token_secret);
        //console.log("refresh_token" +refresh_token);
        db2.get('tokens').push({refreshToken:refresh_token}).write();

        //console.log("access")

        res.status(201).send({
            name: find.name,
            access_token: access_token,
            refreshToken_token : refresh_token,
            email: find.email,
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
}
//res.send("ok")

})



// method to get all  users by email 
var users_list =[];
app.get('/api/secure/allusers', (req,res)=>{

    users_list= db1.get('users').map('email').write()
    res.send(users_list);
})

// method to deactivate a user by email 
app.put('/api/secure/deactivateuser', (req,res)=>{
email_deactivate = req.body.email;
console.log(email_deactivate);
x= db1.get('users').find({email:email_deactivate}).assign({status: "deactivated"}).write()

res.send({message:"Sucessfully deactivated"})

})

//method to find a schedule made by the user
var store_schedule =[];
var storeall =[];
app.put('/api/secure/savedschedules',(req,res)=>{
storeall =[]
username = req.body.Name;
store_schedule= db.get('schedule').value()

//console.log(username)
for(i=0;i<store_schedule.length;i++){
    if(store_schedule[i].Createdby == username){
        storeall.push(store_schedule[i])
    }
}
res.send(storeall)
})

//method to get schedule based on username and schedule name
var store_schedule1 =[];
var storeall1 =[];
app.put('/api/secure/loadschedule',(req,res)=>{
storeall1 =[]
username1 = req.body.Name;
schedulename1 = req.body.ScheduleName
store_schedule1= db.get('schedule').value()


console.log(username1)
console.log(store_schedule1.length)
for(i=0;i<store_schedule1.length;i++){
    if(store_schedule1[i].scheduleName==schedulename1 && store_schedule1[i].Createdby ==username1){
        storeall1.push(store_schedule1[i])
    }
}
res.send(storeall1)
})

// method to activate a user by email 
app.put('/api/secure/activateuser', (req,res)=>{
    email_activate = req.body.email;
    console.log(email_activate);
    x= db1.get('users').find({email:email_activate}).assign({status: "active"}).write()
    
    res.send({message:"Sucessfully activated"})
    
    })


//method to check if the token exists in the database
var store_tk = []
app.put('/api/secure/tokens', (req,res)=>{
token = req.body.RefreshToken
store_tk = db2.get('tokens').find({refreshToken:token}).value();
console.log(store_tk);
if(store_tk == undefined || store_tk == null){
    console.log("in")
    res.send({message:"not granted"})
}else{
    res.send({message:"granted"})
}

})

//method to return keyword searched results

var store =[]

for(a=0;a<data.length;a++){
    store.push(data[a].className);
    store.push(String(data[a].catalog_nbr));
}

let result =[]

app.get("/api/courses/keywordmatch",(req,res)=>{
result =[];
var match = removeMultiples(store);
var userInput= req.query.Input;
var user_final = userInput.toUpperCase();
//console.log(user_final);
let output = stringSimilarity.findBestMatch(user_final,match);
console.log(output)
var matches = output.ratings.filter(result => result.rating > 0.5);
//console.log(matches)
//console.log(data.length);
for(a=0;a<matches.length;a++){
    for(b=0;b<data.length;b++){
        if(matches[a].target == String(data[b].catalog_nbr) || matches[a].target == data[b].className ){
            //console.log("in");
            result.push(data[b]);
        }
    }
}

return res.send(result);


})
// make a schedule public
app.put('/api/schedule/makepublic',(req,res)=>{
schedule = req.body.scheduleName;

console.log(schedule);
x= db.get('schedule').find({scheduleName:schedule}).assign({visibility: "public"}).write()

res.send({message:"made public"})
})

// make a schedule private
app.put('/api/schedule/makeprivate',(req,res)=>{
    schedule = req.body.scheduleName;
    
    console.log(schedule);
    x= db.get('schedule').find({scheduleName:schedule}).assign({visibility: "private"}).write()
    
    res.send({message:"made private"})
    })
// method to save a course under a specific schedule
var store_1 =[]
app.put('/api/schedule/save/course' , (req,res)=>{
    
     
      schedulename = req.body.ScheduleName;
      Subject = req.body.subject;
      code1 = req.body.Code;
      coursename = req.body.Name;
      store_1 = db.get('schedule').map('scheduleName').value();
      console.log(store_1.length);
      console.log(schedulename);
      for(a=0;a<store_1.length;a++){
          if(store_1[a]==schedulename){
  
          db.get('schedule['+ a+'].coursesInformation').push({courseSubject:Subject,courseCode:code1,courseName:coursename}).write();
          
          return res.send({// good
              alert : "Sucessfully Added."
          })
          }
  
  }
})
// add course reviews 
app.put('/api/courses/addreview',(req,res)=>{
    const info ={
        User: req.body.Username,
        subject: req.body.Subject,
        code: req.body.Code,
        name: req.body.Name,
        review: req.body.Review,
        visibility: req.body.Visibility,
        time: req.body.Time

      }
    reviewsdb.get('reviews').push(info).write();

    res.send({message:"successfully added"});
})



// get course reviews

app.put("/api/courses/reviews",(req,res)=>{
coursename = req.body.CourseName;
storeall =[]

store_schedule= reviewsdb.get('reviews').value()

//console.log(username)
for(i=0;i<store_schedule.length;i++){
    if(store_schedule[i].name == coursename){
        storeall.push(store_schedule[i])
    }
}
res.send(storeall)
})


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





