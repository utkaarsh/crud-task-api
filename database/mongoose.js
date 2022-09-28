const mongoose=require('mongoose');

mongoose.Promise=global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/taskmanagerdb')
.then(
    ()=>{
    console.log("Database connected successfully !")
}
)
.catch(
    (error)=>{
        console.log("Error",error);
    }
)
module.exports=mongoose;