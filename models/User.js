const mongoose   = require('mongoose')
const UserSchema = mongoose.Schema({
    
    Name:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    gender:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    
    role:{
        type:String,
        enum:["student","principle","admin","faculty"],
        default:null
        
    },
    birthdate:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    institution:{
        type: mongoose.Types.ObjectId,
        ref:'Institution'
    },
    createdAt:{
        type:Number,
        default:Date.now()
    }
    

})
mongoose.model('users',UserSchema)