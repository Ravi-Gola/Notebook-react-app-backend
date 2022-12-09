const express = require("express");
const { models } = require("mongoose");
const router = express.Router(); // import router
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser=require('../middleware/fetchUser')
const JWT_SECRET = "raviPrajapati$$$5g";

//route for create user
router.post(
  "/createUser",
  [
    body("name", "enter a valid name with atleast 3 character").isLength({
      min: 3,
    }),
    body("email", "enter valid email").isEmail(),
    body("password", "enter valid password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(500).json({ errors: "Email already exists",success:false });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ token: token,success:true });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({errors:"Some error occured",success:false});
    }
  }
);

//route for login user
router.post(
  "/loginUser",
  [
    body("email", "please Enter valid email").isEmail(),
    body("password", "Enter valid password with min atleast 8 char.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(500).json({ errors: "User does not exists",success:false });
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        return res
          .status(500)
          .json({ errors: "please enter valid credentials",success:false });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ token: token,success:true });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({errors:"Some error occured",success:false});
    }
  }
);

// route for getuser:login required
router.post('/getUser',fetchUser,async (req,res)=>{
       try {
             const userid=req.user.id;
             const user=await User.findById(userid).select("-password")
             res.json({user:user,success:true})

       } catch (error) {
              console.log(error.message);
              res.status(500).send({errors:"Some error occured",success:false});
       }
})

// router.get('/',(req,res)=>{
//     obj={
//         name:"ravi",
//         gender:"male"
//     } // dummy javascript object
//     const requestCotent=req.body //body content which is send by a user as a request
//     res.send(obj) // for send responce to user screen
//     console.log(requestCotent) // for print it to console
// })
module.exports = router;
