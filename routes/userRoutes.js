import express from "express";
import {authController, loginController,registerController,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDoctorsController, bookAppointmentController, bookingAvailabiltyController, userAppointmentsController} from "../controllers/userCtrl.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendOtp, verifyOtp } from "../controllers/otpCtrl.js";


const router = express.Router();

//login
router.post('/login',loginController);

//register
router.post('/register',registerController);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

//Auth
router.post('/getUserData',authMiddleware ,authController);


router.post('/apply-doctor',authMiddleware ,applyDoctorController);


router.post('/get-all-notification',authMiddleware ,getAllNotificationController);


router.post('/delete-all-notification',authMiddleware ,deleteAllNotificationController);


router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);


router.post('/book-appointment',authMiddleware,bookAppointmentController);


router.post('/booking-availability',authMiddleware,bookingAvailabiltyController);


router.get('/user-appointments',authMiddleware,userAppointmentsController);

export default router;