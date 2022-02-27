const express = require('express')
const app = express()
const port = 5000
const {User} = require('./models/Users');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config=require('./config/key')
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth.js');

mongoose.connect(config.mongoURI)
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World! asdasdasdas')
})
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.post("/register", (req,res)=>{
  //회원가입에 필요한 정보들을 client에서 가져오면
  const user= new User(req.body);
  //그것들을 데이터 베이스에 넣어준다
  user.save((err,userInfo)=>{
    if(err){
      return res.json({success:false,err})
    }
    return res.status(200).json({success:true})
  });
})

app.post("/api/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
      if (!user)
          return res.json({
              loginSuccess: false,
              message: "Auth failed, email not found"
          });

      user.comparePassword(req.body.password, (err, isMatch) => {
          if (user.password !== req.body.password)
              return res.json({ loginSuccess: false, message: "Wrong password" });

          user.generateToken((err, user) => {
              if (err) return res.status(400).send(err);
              res.cookie("x_authExp", user.tokenExp);
              res
                  .cookie("x_auth", user.token)
                  .status(200)
                  .json({
                      loginSuccess: true, userId: user._id
                  });
          });
      });
  });
});

app.get("api/users/auth",auth,(req,res)=>{
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role===0?false:true,
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image

  })
})

app.get('/api/users/logout',auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id},
    {token:""},
    (err,user)=>{
      if(err) return res.json({success:false, err})
      return res.status(200).send({success:true})
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} dasdad`)
})
