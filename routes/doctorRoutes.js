import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { doctorAppointmentsController, getDoctorByIdController, getDoctorInfoController,updateProfileController, UpdateStatusController } from '../controllers/doctorCtrl.js';


const router = express.Router();


//POST SINGLE DOC INFO
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController);

//POST UPDATE PROFILE
router.post('/updateProfile',authMiddleware,updateProfileController);


router.post('/getDoctorById',authMiddleware,getDoctorByIdController);


router.get('/doctor-appointments',authMiddleware,doctorAppointmentsController);


router.post('/update-status',authMiddleware,UpdateStatusController)

export default router;