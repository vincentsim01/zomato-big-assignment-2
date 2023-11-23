let express = require('express');
let app = express();
let port = 3000
let Mongo = require('mongodb');
let bodyParser = require('body-parser');
let cors = require('cors');
let {dbConnect,getData} = require('./Controller/dbController');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/',(req,res) => {
    res.send("Hiii From Express")
})

// get all location

app.get('/location', async(req,res) =>{
    let query = {};
    let collection = "location";
    let output = await getData(collection,query);
    res.send(output)
});

app.get('/locationing', async(req,res) =>{
    let query = {};
    let collection = "location";
    if(req.query.location_id){
        query = {"location_id":Number(req.query.location_id)}

    }
    let output = await getData(collection,query);
    res.send(output)
});



app.get('/restaurantmenu', async(req,res) =>{
    let query = {};
    let collection = "restaurantmenu";
    if(req.query.restaurant_id){
        query = {"restaurant_id":Number(req.query.restaurant_id)}

    }
    let output = await getData(collection,query);
    res.send(output)
});


app.get('/menu', async(req,res) =>{
    let query = {};
    let collection = "menu";
    if(req.query.restaurant_id){
        query = {"restaurant_id":Number(req.query.restaurant_id)}

    }
    let output = await getData(collection,query);
    res.send(output)
});

app.get('/restaurants', async(req,res) =>{
    let query = {};
    if(req.query.stateId && req.query.mealId){
        query = {
            "state_id":Number(req.query.stateId),
            "mealTypes.mealtype_id":Number(req.query.mealId)
        } 
    }
    else if(req.query.stateId){
       query = {"state_id":Number(req.query.stateId)} 
    }else if(req.query.mealId){
        query = {"mealTypes.mealtype_id":Number(req.query.mealId)}
    }
    let collection = "restaurants";
    let output = await getData(collection,query);
    res.send(output)
});

// get all mealtypes
app.get('/mealType', async(req,res) => {
    let query = {};
    let collection = "mealType";
    let output = await getData(collection,query);
    res.send(output);
})

app.get('/filter/:mealId',async(req,res) => {
    let mealId = Number(req.params.mealId);
    let foodtypeId = Number(req.query.foodtypeId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    console.log(mealId);
    console.log(foodtypeId);

    if(foodtypeId){
        query = {
            "mealTypes.mealtype_id":Number(mealId),
            "foodType.foodtype_id":Number(foodtypeId)
        }
    }else if(lcost && hcost){
        query = {
            "mealTypes.mealtype_id":Number(mealId),
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {}
    }

    let collection = "restaurants";
    let output = await getData(collection,query);
    res.send(output)
})



app.listen(port,(err) => {
    dbConnect();
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})