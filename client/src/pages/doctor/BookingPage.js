import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { toast,ToastContainer } from "react-toastify";
import "../../styles/BookingPage.css"
import "react-toastify/dist/ReactToastify.css";



const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  //login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if(!date && !time){
         toast.info("Date & Time Required");
         return
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          time: time,
          userInfo: user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        //message
        toast.success("Appointment Booked Successfully")
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // useEffect(() => {
  //   toast.success("Toast is working!");
  // }, []);

  const handleAvailabilty = async () => {
    try {
      if (!date) {
        toast.info("Please select a date.");
        return;
      }
    
      if (!time) {
        toast.info("Please select a time.");
        return;
      }
      const currentDateTime = new Date();
    
    // Combine selected date and time into a single Date object
    const selectedDateTime = new Date(`${date}T${time}`);

    // Check if the selected time is in the past
    if (selectedDateTime < currentDateTime) {
      toast.error("Selected date and time cannot be in the past.");
      return;
    }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
  
      // Check for success
      if (res.data.success) {
        setIsAvailable(true);
        toast.success("Slot is Available");
      } else {
        toast.error(res.data.message || "Slot is not Available"); // Fallback message if no specific message
      }
    } catch (error) {
      toast.error("Error checking availability");
    }
  };
  

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value; // Get the time value
    setTime(selectedTime); // Set the time state
  };

  return (
    <>
  <Layout>
    <div className="booking-container">
      <h3>Book an Appointment</h3>
      <div className="doctor-info">
        {doctors && (
          <>
            <h4>Dr. {doctors.firstName} {doctors.LastName}</h4>
            <h4>Fees: ₹{doctors.feesPerConsultaion}</h4>
            <h4>
              Timings:{" "}
              {doctors.timings?.[0] && doctors.timings?.[1]
                ? `${doctors.timings[0]} - ${doctors.timings[1]}`
                : "Not Available"}
            </h4>
          </>
        )}
      </div>

      <div className="appointment-controls">
        <DatePicker
          className="m-2"
          format="DD-MM-YYYY"
          onChange={(value) => {
            setDate(moment(value).format("DD-MM-YYYY"));
          }}
          />

        <div>
          <label htmlFor="time">Select Appointment Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={handleTimeChange}
            />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAvailabilty}
          >
          Check Availability
        </button>
        <button
          className="btn btn-dark"
          onClick={handleBooking}
          >
          Book Now
        </button>

      </div>
    </div>
    {/* <ToastContainer /> */}
  </Layout>
  </>
);

};

export default BookingPage;
