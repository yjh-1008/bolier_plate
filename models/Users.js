const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const saltRounds=10
const userSchema=mongoose.Schema({
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
        minlength:5,
        maxlength:50
    },
    lastname:{
        type:String,
        maxlength:50,
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

userSchema.pre('save',function(next){
    //비밀번호 암호화
    var user =this;
    if(user.isModified('password')){ //비밀번호가 재설정이나 생성될 경우에만 암호화를 진행해야한다.
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password=hash
                next()

            })
        })
    }else{
        next()
    }

})

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken=function(cb){
    var user=this;
    //jsonwebtoken을 이용해서 token을 생성하기
    var token=jwt.sign(user._id.toHexString(),'1234');
    user.token= token
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user);
    })

}

userSchema.statics.findByToken=function(token, cb){
    var user = this;
    console.log(this.token)
    console.log(user.token)
    console.log(user._id)
    console.log(token)
    jwt.verify(token,'1234',function(err, decoded){
        user.findOne({"_id": decoded},function(err,user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}
const User = mongoose.model('User',userSchema)

module.exports={User} //외부로 보내기 export랑 동일