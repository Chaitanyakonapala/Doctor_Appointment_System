import express from 'express';
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllDoctorsController, getAllUsersController,changeAccountStatusController } from '../controllers/adminCtrl.js';

const router = express.Router();

//GET METHOD || USER
router.get('/getAllUsers',authMiddleware,getAllUsersController);    

//GET METHOD || DOCTORS
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);

//POST ACCOUNT STATUS
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)


export default router;