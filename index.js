const express = require('express')
const app = express()
const port = 5000
const {User} = require('./models/Users');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config=require('./config/key')
mongoose.connect(config.mongoURI)
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World! asdasdasdas')
})
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


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

app.listen(port, () => {
  console.log(`Example app listening on port ${port} dasdad`)
})
