import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    firstName:{
        type:String,
        required:[true,'first name is required']
    },
    LastName:{
        type:String,
        required:[true,'last name is required']
    },
    phone:{
        type:String,
        required:[true,'Phone number is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    website:{
        type: String,
    },
    address:{
        type:String,
        required:[true,'address is required']
    },
    specialization:{
        type:String,
        required:[true,'specialization is required']
    },
    experience:{
        type:String,
        required:[true,'experience is required']
    },
    feesPerConsultaion:{
        type:Number,
        required:[true,'fee is required']
    },
    status:{
        type:String,
        default:'pending'
    },
    timings:{
        type:Object,
        required:[true,'working time is required'],
    }, 
},{timestamps:true});

const doctorModel =  mongoose.model('doctors',doctorSchema);

export default doctorModel;