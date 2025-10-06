import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/UserModules.js';


const getDoctorInfoController = async(req,res) =>{
    try {
        const doctor = await doctorModel.findOne({userId : req.body.userId});
        res.status(200).send({
            success : true,
            message : 'doctor data fetched successfully',
            data : doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            error,
            message : "Error in fetching doctor details"
        })
    }
}


const updateProfileController = async (req, res) => {
    try {
      const { userId, phone,firstName, LastName, feesPerConsultaion,timings,specialization,experience } = req.body;
  
      // Update the doctor's profile
      const updatedDoctor = await doctorModel.findOneAndUpdate(
        { userId }, // Find doctor by userId
        { 
          phone, 
          LastName, 
          feesPerConsultaion,
          timings,
          specialization, 
          experience,
          firstName
        }, // Update these fields
        { new: true } // Return the updated document
      );
  
      if (!updatedDoctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor not found",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        data: updatedDoctor, // Return the updated doctor
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while updating profile",
        error,
      });
    }
  };

  const getDoctorByIdController = async(req,res)=>{
    try {
     const doctor = await doctorModel.findOne({_id : req.body.doctorId});
     res.status(200).send({
      success : true,
      message : 'Single Doc Info fetched',
      data : doctor
     }) 
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success : false,
        error,
        message : 'Error while fetchind doctor'
      })
    }
  }

  const doctorAppointmentsController = async(req,res)=>{
    try {
      const doctor = await doctorModel.findOne({userId : req.body.userId});
      const appointments = await appointmentModel.find({doctorId : doctor._id});
      res.status(200).send({
        success : true,
        message : 'Doctor Appointment Fetch Successfully',
        data : appointments
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success : false,
        error,
        message : 'Error in Doc Appointments'
      })
    }
  }

  const UpdateStatusController = async(req,res)=>{
    try {
      const {appointmentsId,status} = req.body;
      const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status});
      const user = await userModel.findOne({_id : appointments.userId});
      const notification = user.notification;
      notification.push({
      type : 'Status-updated',
      message : `Your appointment has been updated ${status}`,
      onClickPath:'/doctor-appointments'
    })
    await user.save();
    res.status(200).send({
      success : true,
      // message : 'Appointment Status Updated'
    }) 
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success : false,
        error,
        message : 'Error in Status Update'
      })
    }
  }

export {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,UpdateStatusController}