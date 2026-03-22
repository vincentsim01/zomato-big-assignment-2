let express = require('express');
let app = express();
let port = 9120
let Mongo = require('mongodb');
let bodyParser = require('body-parser');
let cors = require('cors');
let {dbConnect,getData,postData,updateData,deleteData, getDataSort, getDataPagi} = require('./Controller/dbController');
const AuthController = require('./Controller/authController');

app.use(cors({
  origin: '*',
  exposedHeaders: ['x-access-token'],
  allowedHeaders: ['Content-Type', 'x-access-token']
}));
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/api/auth', AuthController);


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

app.get('/users', async(req,res) =>{
    let query = {};
    let collection = "user";
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

    }else if(req.query.menu_type){
        query = {"menu_type":req.query.menu_type}
    }
    let output = await getData(collection,query);
    res.send(output)
});


app.get('/cosort', async(req,res) =>{
    let query = {};
    let collection = "restaurants";
    let costsort= 1;

    if(req.query.costsorts){
        costsort = req.query.costsorts;

    }
    let output = await getDataSort(collection,query,costsort);
    res.send(output)
});



app.get('/datapagi', async(req,res) =>{
    let query = {};
    let collection = "restaurants";
    // let costsort= 1;
    if(req.query.pages){
        page = req.query.pages;

    }else{
        page=1;
    }


    // let output = await getDataPagi(collection,query,costsort,page);
    let output = await getDataPagi(collection,query,page);
    res.send(output)
});

app.get('/restaurants', async(req,res) =>{
    let query = {};
    if(req.query.stateId && req.query.foodTypeId){
        query = {
            "state_id":Number(req.query.stateId),
            "foodType.foodtype_id":Number(req.query.foodTypeId)
        } 
    }
    else if(req.query.stateId){
       query = {"state_id":Number(req.query.stateId)} 
    }
    
    
    else if(req.query.foodtypeId){
        query = {"foodType.foodtype_id":Number(req.query.foodtypeId)}
    }
    
    
    else if(req.query.mealId){
       query = {"mealTypes.mealtype_id":Number(req.query.mealId)} 
    }else if(req.query.ratingText){
       query = {"rating_text":Number(req.query.ratingText)} 
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





// get all mealtypes
app.get('/quicksearch', async(req,res) => {
    let query = {};
    let collection = "foodType";
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
    }
    


    
    
    
    else if(lcost && hcost){
        query = {
            "mealTypes.mealtype_id":Number(mealId),
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {"mealTypes.mealtype_id":Number(mealId)}
    }

    let collection = "restaurants";
    let output = await getData(collection,query);
    res.send(output)
})



app.get('/details', async(req,res) => {
    let query = {};
    let restIds = Number(req.query.restId);
    if(req.query.restId){
       query = {"restaurant_id":Number(req.query.restId)} 
    }   
    let collection = "restaurants";
    let output = await getData(collection,query);

    res.send(output);
})




app.get('/filtery/:foodtypeId',async(req,res) => {
    let mealId = Number(req.query.mealId);
    let foodtypeId = Number(req.params.foodtypeId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    console.log(mealId);
    console.log(foodtypeId);

    if(mealId){
        query = {
            "mealTypes.mealtype_id":Number(mealId),
            "foodType.foodtype_id":Number(foodtypeId)
        }
    }else if(lcost && hcost){
        query = {
            "foodType.foodtype_id":Number(foodtypeId),
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {"foodType.foodtype_id":Number(foodtypeId)}
    }

    let collection = "restaurants";
    let output = await getData(collection,query);
    res.send(output)
})







//menu of restaurants
app.get('/menu/:id',async(req,res) => {
    let collection = "restaurantmenu";
    let query = {restaurant_id:Number(req.params.id)}
    let output = await getData(collection,query);
    res.send(output)
})


//get orders
app.get('/orders',async(req,res) => {
    let query = {}
    let collection = "orders";
    if(req.query.email){
        query = {email:req.query.email}
    }
    let output = await getData(collection,query);
    res.send(output)
})

//placeOrder
app.post('/placeOrder',async(req,res) => {
    let body = req.body;
    let collection = 'orders';
    let response = await postData(collection,body);
    res.send(response)
})

// app.post('/users ',async(req,res) => {
//     let body = req.body;
//     let collection = 'users';
//     let response = await postData(collection,body);
//     res.send(response)
// })

// app.post('/register',async(req,res) => {
//     let body = req.body;
//     let collection = 'users';
//     let response = await postData(collection,body);
//     res.send(response)
// })




//menu wrt to id {"id":[4,8,11]}
app.post('/menuDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {menu_id:{$in:req.body.id}};
        let collection = "menu";
        let output = await getData(collection,query)
        res.send(output)
    }else{
        res.send('Please pass data in from of array')
    }
})


//update order status
app.put('/updateOrder',async(req,res) => {
   
    let collection = "orders";
    let condition = {"_id":new ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateData(collection,condition,data)
    res.send(output)
})



//delete order
app.delete('/deleteOrder',async(req,res) => {
    let collection = "orders";
    let condition = {"_id":new ObjectId(req.body._id)}
    let output = await deleteData(collection,condition)
    res.send(output)
})







app.listen(port,(err) => {
    dbConnect();
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})