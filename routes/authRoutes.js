const express=require('express');
const bcrypt=require('bcryptjs');
const User=require('../model/userSchema.js');

const jwt=require('jsonwebtoken');
const router=express.Router();

//These are APIs
router.post('/signup',async(req,res)=>{
    const{name,email,password}=req.body; //while signup this will be send and required
    try{
        //if user already exists
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User already exists'});
        }
        //if user doesn't exists, convert password into hash
        /*bcrypt.genSalt(10) generates a salt, which is a random string used to strengthen the security of hashed passwords.
The argument 10 is the "salt rounds" (or cost factor). It determines how complex the salt will be and how long it will take to generate it. The higher the number, the more time it takes to generate the salt, which makes it harder for attackers to crack the password using brute-force attacks. A common value is 10.
await is used because bcrypt.genSalt() returns a promise. This allows the function to wait for the salt generation process to complete.
*/
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        /*The hash function combines the password with the salt and applies a cryptographic algorithm to generate a fixed-length, secure hash. 
        This hashed password is what gets stored in the database, not the plain text password. */
        user=new User({
            name,
            email,
            password:hashedPassword,
        }); 

        //save this user now
        await user.save();
        res.status(201).json({message:'User created successfully'});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
})
router.post('/login',async(req,res)=>{
    const{email,password}=req.body; //while login this will be send and required
    try{
        //if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'}); 
        }
        //if password is wrong and to check it match with the entered pass to the actual password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials!'});
        }
        //if matched
        const payload={ //A payload is the data that will be included in the JWT. It contains information that you want to encode and send to the client. 
            user:{
                id:user.id,
            },
        };
        jwt.sign(
            payload,process.env.JWT_SECRET,{ expiresIn:'1h'},
            (err,token)=>{ //if theres any error then
                if(err)throw err;
                res.json({token});
            });
        }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
})
module.exports = router;
