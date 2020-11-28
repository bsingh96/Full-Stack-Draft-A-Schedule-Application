const express = require('express');
const low = require('lowdb');
const app = express();
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter);
const joi = require('joi'); // input sanitization for joi
const port = 3000;
var subject_arr = [];
var cors = require('cors');
app.use(cors());
var data = require('./Lab3-timetable-data.json');
var data_length = Object.keys(data).length;
// setup serving front-end code
app.use('/', express.static('Public'));
var storage1 =[]; // empty array declaration , this array stores the filtered search results

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
}else if(subject !="all_subjects" && number == "" && component == "all_components"){
    for(a=0;a<data.length;a++){
        if(subject==data[a].subject ){
            storage1.push(data[a])
    }
    }
    res.send(storage1);
}else if (subject !="all_subjects" && number != "" && component == "all_components"){
 for(a=0;a<data.length;a++){
        if(subject==data[a].subject && number == data[a].catalog_nbr ){
            storage1.push(data[a])
            console.log(storage1);
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

app.listen(port, () => console.log('Listening on port ${port}'));





