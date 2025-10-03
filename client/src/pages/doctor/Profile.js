import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Col, Form, Input, message, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import CustomTimeRangePicker from "../../components/TimePicker";
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const handleTimeRangeChange = (timeRange) => {
    console.log("Selected Time Range:", timeRange);
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          phone: values.phoneNumber,
          feesPerConsultaion: values.fee,
          LastName: values.lastName,
          timings: values.timings,
          specialization : values.specialization,
          experience : values.experience,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
  
      console.log("Profile update response:", res);
  
      if (res.data.success) {
        setDoctor(res.data.data);
        setTimeout(() => {
          toast.success("Profile updated successfully!"); 
        }, 100);
        navigate("/");
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error in profile update:", error);
      toast.error("Something went wrong");
    }
  };

  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();

  //getDocDetails
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const data = res.data.data;

      setDoctor({
        ...data,
        lastName: data.LastName, 
        phoneNumber: data.phone, 
        fee: data.feesPerConsultaion, 
        timings: data.timings || ["", ""], 
      });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h1>Manage Profile</h1>
      {doctor && (
        <>
        <Form key={doctor ? doctor._id : "new"} layout="vertical" onFinish={handleFinish} className="m-3" initialValues={doctor}>
          <h4>Personal Details:</h4>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Phone No"
                name="phoneNumber"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true, type: "email" }]}
              >
                <Input type="email" placeholder="Your email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Website"
                name="website"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your address" />
              </Form.Item>
            </Col>
          </Row>
          <h4>Proffessional Details:</h4>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Fees per Consultation"
                name="fee"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your fee" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Timings"
                name="timings"
                required
                rules={[{ required: true }]}
              >
                <CustomTimeRangePicker value={doctor?.timings || ["",""]} onChange={handleTimeRangeChange} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}></Col>
            <Col xs={24} md={12} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
        <div>
    </div>
        </>
      )}
    </Layout>
  );
};

export default Profile;
