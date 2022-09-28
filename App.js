const express=require('express');
const app=express();
const TaskSchema=require('./database/models/task');
const TaskList = require('./database/models/taskList');
const TaskListSchema=require('./database/models/taskList');

const mongoose=require('./database/mongoose');
//example of middleware
app.use(express.json()); // 3rd party body parser

/*
CORS- Cross Origin Request Security
Backend-http://localhost:3000
Frontend-http://localhost:4200
*/

//3rd party library app.use(cors()); --this would have directly given access to all possible requests out there

app.use(
    (req,res,next)=>{
        //Website you wish to allow
        res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');

        //Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods','GET,POST,ACTION,PUT,PATCH,DELETE');

        //Request Headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Accept');

        //Set to true if you need the website to include cookies in the requests sent
        //to the API 

        // res.setHeader('Access-Control-Allow-Credentials',true); 

        //pass the next layer of the middleware
        next();

    }
)

//Get List
app.get('/tasklists',(req,res)=>{
    TaskList.find({})
    .then((lists)=>{
        res.send(lists)
    })
    .catch((error)=>{console.log("ERROR: ",error)})

})

//Get List of specific id
app.get('/tasklists/:tasklistID',(req,res)=>{
    let tasklistID=req.params.tasklistID;
    TaskList.find({_id:tasklistID})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log(tasklistID)
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})

//Create a Tasklist
app.post('/tasklists',(req,res)=>{
    console.log("This is the formula for creating a post method.");
    let taskListObj={'title':req.body.title};
    TaskList(taskListObj).save()
    .then((taskList)=>{res.status(201).send(taskList)})
    .catch((error)=>{console.log(error)})
})

/*Update APIS*/
//PATCH is used to update only partial part of API where as PUT is used to update the entire

app.patch('/tasklists/:tasklistID',(req,res)=>{
    let ID=req.params.tasklistID
    TaskList.findOneAndUpdate({ _id:ID},{ $set:req.body})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log("Has been updated!")
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})


//Delete Task API
app.delete('/tasklists/:tasklistID',(req,res)=>{
    let ID=req.params.tasklistID
    TaskList.findOneAndDelete({ _id:ID})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log(ID,"Has been deleted!")
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})


app.listen(3000,function(){ 
    console.log("Server started on port : 3000");
})