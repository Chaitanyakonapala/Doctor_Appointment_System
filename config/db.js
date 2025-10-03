import mongoose from 'mongoose';

const connectDB = async() =>{

    try{
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${connection.connection.host} `);
    } catch(error){
        console.log(`Mongodb Server Issue ${error}`)
    }

}

export default connectDB;