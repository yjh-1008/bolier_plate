const mongoose=require('mongoose');
const userShcema=mongoose.Schema({
    name:{
        type:String,
        maxlength:50,
    },
    email:{
        type:String,
        trim:true, //공백 없애기
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        laxlength:50,
    },
    role:{//관리자
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String,
    },
    tokenExp:{//토큰의 유효 기간
        type:Number,
    }
})

const User = mongoose.model('User',userShcema)

module.exports={User} //외부로 보내기 export랑 동일