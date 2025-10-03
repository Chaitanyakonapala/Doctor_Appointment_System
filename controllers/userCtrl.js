import { message } from "antd";
import userModel from "../models/UserModules.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import doctorModel from '../models/doctorModel.js'
import appointmentModel from "../models/appointmentModel.js";
import moment from "moment";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//register callback
const registerController = async (req, res) => {
  try {
    console.log("Incoming register request:", req.body); // <-- Add this
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user, 
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      succes: false,
      error,
    });
  }
};

const applyDoctorController = async(req,res)=>{
  try {
    const newDoctor = await doctorModel({...req.body,status : 'pending'});
    await newDoctor.save();
    const adminUser = await userModel.findOne({isAdmin:true});
    const notification = adminUser.notification;
    notification.push({
      type:'apply-doctor-request',
      message: `${newDoctor.firstName}  ${newDoctor.LastName} has applied for a Doctor account`,
      data:{
        doctorId : newDoctor._id,
        name : newDoctor.firstName + " " + newDoctor.LastName,
        onClickPath : '/admin/doctors'
      }
    })
    await userModel.findByIdAndUpdate(adminUser._id,{notification});
    res.status(201).send({
      success : true,
      // message : 'Doctor Account applied successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      // message:'Error while applying for doctor'
    })
  }
};

const getAllNotificationController = async (req,res)=>{
  try {
    const user = await userModel.findById({_id:req.body.userId})
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success : true,
      message : 'All notifications marked as read',
      data:updatedUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message : 'Error in Notification',
      success : false,
      error
    })
  }
}

const deleteAllNotificationController = async(req,res)=>{
  try {
    const user = await userModel.findOne({_id:req.body.userId});
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success : true,
      message : 'Notifications Deleted Successfully',
      data : updatedUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success : false,
      message : 'Unable to delete all Notifications',
      error
    })
  }
}

const getAllDoctorsController = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({status : 'approved'});
    res.status(200).send({
      success : true,
      message : 'Doctors lists fetched successfully',
      data : doctors
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success : false,
      error,
      message : 'Error While fetching doctors'
    })
  }
}

const bookAppointmentController = async(req,res)=>{
  try {
    req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time,'HH:mm').toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({_id : req.body.doctorInfo.userId});
    user.notification.push({
      type : 'New-Appointment-request',
      message : `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath:'/user/appointments'
    })
    await user.save();
    res.status(200).send({
      success : true,
      message : 'Appointment Booked Successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success : true,
      error,
      message : 'Error while booking appointment'
    })
  }
}

const bookingAvailabiltyController = async (req, res) => {
  try {
    const { date, time, doctorId } = req.body;

    // Step 1: Fetch Doctor's Availability
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const [availableFrom, availableTo] = doctor.timings; // Assuming timings is an array like ['09:00', '17:00']
    const inputTime = moment(time, "HH:mm");
    const fromTime = inputTime.clone().subtract(1, "hours");
    const toTime = inputTime.clone().add(1, "hours");
    console.log(inputTime);

    // Step 2: Validate Input Time Against Availability
    const availableStart = moment(availableFrom, "HH:mm");
    const availableEnd = moment(availableTo, "HH:mm");

    if (!inputTime.isBetween(availableStart, availableEnd, null, "[]")) {
      return res.status(200).send({
        success: false,
        message: "Selected time is outside the doctor's availability.",
      });
    }

    // Step 3: Check for Existing Appointments
    const dateISO = moment(date, "DD-MM-YYYY").toISOString();
    const appointments = await appointmentModel.find({
      doctorId,
      date: dateISO,
      time: {
        $gte: fromTime.toISOString(),
        $lte: toTime.toISOString(),
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Appointments not available at this time",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment is available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Booking",
    });
  }
};
// const bookingAvailabiltyController = async (req, res) => {
//   try {
//     const { date, time, doctorId } = req.body;

//     // Step 1: Fetch Doctor's Availability
//     const doctor = await doctorModel.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     // Assuming the doctor's availability is stored in the format ["09:00", "17:00"]
//     const [availableFrom, availableTo] = doctor.timings;

//     // Convert doctor's availability to full ISO 8601 format (same day, with time range)
//     const availableStart = moment(`${date}T${availableFrom}:00.000Z`).utc(); // UTC start time
//     const availableEnd = moment(`${date}T${availableTo}:00.000Z`).utc();   // UTC end time

//     // Convert input time to UTC ISO 8601 format
//     const inputTime = moment(`${date}T${time}:00.000Z`).utc(); // Format input time into ISO 8601 and convert to UTC

//     // Debugging: Log the variables to see the actual values
//     console.log('Available Start Time:', availableStart.format());  // e.g., 2025-01-17T09:00:00.000Z
//     console.log('Available End Time:', availableEnd.format());      // e.g., 2025-01-17T17:00:00.000Z
//     console.log('Input Time:', inputTime.format());                 // e.g., 2025-01-17T18:30:00.000Z

//     // Step 2: Validate Input Time Against Availability
//     if (inputTime.isBefore(availableStart) || inputTime.isAfter(availableEnd)) {
//       return res.status(400).send({
//         success: false,
//         message: "Selected time is outside the doctor's availability.",
//       });
//     }

//     // Step 3: Check for Existing Appointments
//     const dateISO = moment(date, "DD-MM-YYYY").toISOString(); // Format date as ISO 8601
//     const appointments = await appointmentModel.find({
//       doctorId,
//       date: dateISO,
//       time: inputTime.toISOString(), // Compare exact time in ISO 8601 format
//     });

//     if (appointments.length > 0) {
//       return res.status(200).send({
//         success: true,
//         message: "Appointments not available at this time",
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         message: "Appointment is available",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Booking",
//     });
//   }
// };



const userAppointmentsController = async(req,res)=>{
  try {
    const appointments = await appointmentModel.find({userId : req.body.userId});
    res.status(200).send({
      success : true,
      message : 'User Appointments fetch Successfully',
      data : appointments
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success : false,
      error,
      message : 'Error in User Appointments'
    })
  }
}

export { loginController, registerController, authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDoctorsController,bookAppointmentController,bookingAvailabiltyController,userAppointmentsController};
