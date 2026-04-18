import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String
    },
    password: {
      type: String,
      required: true
    },
    nationalId: {
        type: String,
        required: true,
        unique: true
        },
    refresh_token: {
            type: String,
            default: null,
        },
    last_login_date: {
            type: Date,
            default: null,
        },
  
    role:{
        type:String,
        enum:['admin','agent','client'],
        default:'client'
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
  index: true
},
},
{timestamps:true}
)
const UserModel=new mongoose.model('User',userSchema);
export default UserModel;