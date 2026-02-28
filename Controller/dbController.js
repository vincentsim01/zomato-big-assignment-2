let mongo = require('mongodb');
let {MongoClient} = require('mongodb');
let mongoUrl = "mongodb+srv://vincentkiathadi:YIfp7gktEi2USAWW@cluster0.nt2oupy.mongodb.net/?retryWrites=true&w=majority";
let client = new MongoClient(mongoUrl);
const mongoose = require('mongoose');

async function dbConnect(){
    await client.connect();
}

let db = client.db('Restaurant');

async function getData(colName,query){
    let output = [];
    try{
        const cursor = db.collection(colName).find(query);
        for await(const data of cursor){
            output.push(data)
        }
        cursor.closed
    }catch(err){
        output.push({"Error":"Error in getting data"})
    }
    return output
}


async function getDataSort(colName,query,costsort){
    let output = [];
    try{
        const cursor = db.collection(colName).find(query).sort({cost:costsort});
        for await(const data of cursor){
            output.push(data)
        }
        cursor.closed
    }catch(err){
        output.push({"Error":"Error in getting data"})
    }
    return output
}


async function getDataPagi(colName,query,page){
    let output = [];
    const itemsperpage=2;
    // let page=1;
    let startIndex=itemsperpage*page-itemsperpage;
    let endIndex=itemsperpage*page;


    // console.log(endIndex);

    
    try{

        const cursor = db.collection(colName).find(query)
        // .then(res=>{
        //     const filteredResponse=res.slice(startIndex,endIndex);
            
        //     console.log("this is filtered response "+filteredResponse);
        //     return res.status(200).json({
        //         message:"Restaurants fetched successfully",
        //         restaurants:filteredResponse
        
        //     }).catch(err=>{
        //         return res.status(400).json({error:err});
        //     })
        // });
        ;

        // const filteredResponse=cursor

        // const sliced = Object.fromEntries(
        //     Object.entries(cursor).slice(startIndex,endIndex)
        // )
        // console.log(filteredResponse);

        // console.log(sliced);

        // output.push(sliced);

        // console.log(cursor);
        for await(const data of cursor){

            output.push(data)
            // const filteredResponse=cursor.slice(startIndex,endIndex);
            // console.log(filteredResponse);
            // console.log(data);
        }
        cursor.closed
    }catch(err){
        output.push({"Error":"Error in getting data"})
    }

    // console.log(output);

    return output.slice(startIndex,endIndex)

}



async function postData(colName,data){
    let output;
    try{
        output = await db.collection(colName).insertOne(data);
    }catch(err){
        output = {"response":"Error in post data"}
    }
    return output
}

async function updateData(colName,condition,data){
    let output;
    try{
        output = await db.collection(colName).updateOne(condition,data);
    }catch(err){
        output = {"response":"Error in post data"}
    }
    return output
}

async function deleteData(colName,condition,){
    let output;
    try{
        output = await db.collection(colName).deleteOne(condition);
    }catch(err){
        output = {"response":"Error in post data"}
    }
    return output
}

let page=1;


const itemsperpage=2;
let payload={};

let startIndex=itemsperpage*page-itemsperpage;
let endIndex=itemsperpage*page;

module.exports = {
    dbConnect,
    getData,
    postData,
    updateData,
    deleteData,
    getDataSort,
    getDataPagi
}