import express from 'express';
// import colors from 'colors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object 
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/user' , userRoutes);
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/doctor',doctorRoutes);

const port = process.env.PORT || 8080;
//listen port
app.listen(port,()=>{
    console.log(`Server running in ${process.env.NODE_MODE} Mode on port ${port}`)
})


