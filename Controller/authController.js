const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
// const User = require('../model/userSchema');
const router = express.Router();
let mongo = require('mongodb');
let {MongoClient} = require('mongodb');
let {dbConnect,getData,postData,updateData,deleteData, getDataSort, getDataPagi} = require('./dbController');
let mongoUrl = "mongodb+srv://vincentkiathadi:YIfp7gktEi2USAWW@cluster0.nt2oupy.mongodb.net/?retryWrites=true&w=majority";
let client = new MongoClient(mongoUrl);

// async function dbConnect(){
//     await client.connect();
// }

// let db = client.db('Restaurant');




router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

//list all user
// router.get('/users',(req,res) => {
//     User.find({}).then(function (users) {
//         res.send(users);
//         });

// })

router.get('/users', async(req,res) => {
    let query = {};
    let restIds = Number(req.query.restId);
    let collection = "users";
    let output = await getData(collection,query);

    res.send(output);
})


// module.exports={
//     try{
//         const User=await User.find()
//         res.status(200).son(User)
//     }catch(error){
//         res.status(400).json({message:"error finding users"})
//     }
//     }







//register user
// router.post('/register',(req,res) => {
//     let hashpassword = bcrypt.hashSync(req.body.password,8);
//     User.create({
//         name:req.body.name,
//         email:req.body.email,
//         password:hashpassword,
//         phone:req.body.phone
//         // role:req.body.role?req.body.role:'User'
//     })
//     .then(function (users) {
//         res.send(users);
//         });
// })

router.post('/register', async (req, res) => {
    try {
        let collection = "users";

        // check if user already exists
        let checkUser = await getData(collection, { email: req.body.email });

        if (checkUser.length > 0) {
            return res.status(400).send({ message: "User already exists" });
        }

        // hash password
        let hashpassword = bcrypt.hashSync(req.body.password, 8);

        let data = {
            name: req.body.name,
            email: req.body.email,
            password: hashpassword,
            phone: req.body.phone,
            // role: "User"
        };

        let response = await postData(collection, data);

        res.status(201).send({
            message: "User registered successfully",
            data: response
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

//login user
// router.post('/login',(req,res) => {
//     User.findOne({email:req.body.email},(err,user) => {
//         if(err) return res.status(500).send({auth:false,token:'There is problem while login'})
//         if(!user) return res.status(201).send({auth:false,token:'No User Found Register First'});
//         else{
//             const passIsvalid = bcrypt.compareSync(req.body.password,user.password);
//             if(!passIsvalid) return res.status(201).send({auth:false,token:'Invalid Password'});
//             let token = jwt.sign({id:user._id},config.secert,{expiresIn:86400})
//             return res.status(200).send({auth:true,token});
//         }
//     })
// })



router.post('/login', async (req, res) => {
    try {
        let collection = "users";

        // find user by email
        let userData = await getData(collection, { email: req.body.email });

        if (userData.length === 0) {
            return res.status(404).send({
                auth: false,
                message: "No user found. Please register first."
            });
        }

        let user = userData[0];

        // compare password
        const passIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passIsValid) {
            return res.status(401).send({
                auth: false,
                message: "Invalid password"
            });
        }

        // create token
        let token = jwt.sign(
            { id: user._id },
            config.secret,   // make sure spelling is correct (not secert)
            { expiresIn: 86400 } // 24 hours
        );

        res.setHeader("x-access-token", token);

        return res.status(200).send({
            auth: true,
            token: token,
            user: user
        });

    } catch (err) {
        return res.status(500).send({
            auth: false,
            message: "There was a problem logging in",
            error: err.message
        });
    }
});
        
        
        
    //     ,(err,user) => {
    //     if(err) return res.status(500).send({auth:false,token:'There is problem while login'})
    //     if(!user) return res.status(201).send({auth:false,token:'No User Found Register First'});
    //     else{
    //         const passIsvalid = bcrypt.compareSync(req.body.password,user.password);
    //         if(!passIsvalid) return res.status(201).send({auth:false,token:'Invalid Password'});
    //         let token = jwt.sign({id:user._id},config.secert,{expiresIn:86400})
    //         return res.status(200).send({auth:true,token});
    //     }
    // })




// router.get('/userInfo',(req,res) => {
//     let token = req.headers['x-access-token']
//     if(!token) return res.status(201).send({auth:false,token:'No Token Provided'});
//     jwt.verify(token,config.secret,(err,data) => {
//         if(err) return res.status(201).send({auth:false,token:'Invalid Token'});
//         User.findById(data.id,(err,user) => {
//             res.send(user)
//         })
//     })


//     jwt.verify(token,config.secret)

//         if(!token) {
//             return res.status(201).send({auth:false,token:'No Token Provided'});
//         }
//         else{
//             jwt.verify(token,config.secret,(err, data) => {
//                 if (err) {
//                   console.log(err);
//                   return res.status(201).send({auth:false,token:'Invalid Token'});
//                 }else{
//                     User.findById(data.id)
//                         .then((user) => {res.send(user)});
//                     res.send(user);
//                     console.log(user);
//                     sessionStorage.setItem('userInfo',user);

//                 }

//         }
//             )
//     }


    // .catch((err) => {
    //     return res.status(201).send({auth:false,token:'Invalid Token'});
    // }
    // )
        
        
        
        

// })



router.get('/userInfo', async (req, res) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: "No Token Provided" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ auth: false, message: "Invalid Token" });
        }

        try {
            const { ObjectId } = require('mongodb');
            let collection = "users";
            let userData = await getData(collection, { _id: new ObjectId(decoded.id) });

            if (userData.length === 0) {
                return res.status(404).send({ message: "User not found" });
            }

            res.status(200).send(userData[0]);

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });
});
module.exports = router;