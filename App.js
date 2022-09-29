const express=require('express');
const Task = require('./database/models/task');
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

//Update a Specific Task from Tasklist
app.patch('/tasklists/:tasklistID/tasks/:taskID',(req,res)=>{
    let ID=req.params.tasklistID
    Task.findOneAndUpdate({ _id:req.params.taskID,_tasklistId:ID},{ $set:req.body})
    .then((task)=>{
        res.status(200).send(task);
        console.log("The task has been updated successfully!")
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

//Delete Specific Task from Tasklist
app.delete('/tasklists/:tasklistID/tasks/:taskID',(req,res)=>{
    let ID=req.params.tasklistID
    Task.findByIdAndDelete({_id:req.params.taskID})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log("The Task has been deleted!")
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})


/* CRUD operation for task, a task shoild always belong to a tasklist  */

//Create a Task inside a particular tasakfield

app.post('/tasklists/:tasklistId/tasks',(req,res)=>{
    let taskObj={
        'title': req.body.title,
        '_tasklistId': req.params.tasklistId
    }
    Task(taskObj).save()
    .then((taskObj)=>{res.status(201).send(taskObj)})
    .catch((error)=>{console.log(error)
    })

})





// To get all tasklists for a Task- http://localhost:3000/tasklists/:tasklistID/tasks
app.get('/tasklists/:tasklistID/tasks',(req,res)=>{
    Task.find({_tasklistId:req.params.tasklistID})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log("TASKS Displayed successfully check Postman")
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})

//To get Specific tasks from a Task list - https://localhost:3000/tasklists/:tasklistID/tasks/:taskID
app.get('/tasklists/:tasklistID/tasks/:taskID',(req,res)=>{
    Task.findOne({_tasklistId:req.params.tasklistID,_id:req.params.taskID})
    .then((taskl)=>{
        res.status(200).send(taskl);
        console.log("TASKS Displayed successfully check Postman")
    })
    .catch((error)=>{
        console.log("ERROR:",error);
        res.status(500);
    })
})







app.listen(3000,function(){ 
    console.log("Server started on port : 3000");
})