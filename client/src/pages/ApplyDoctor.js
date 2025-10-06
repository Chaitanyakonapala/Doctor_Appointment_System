import React from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, message, Row } from "antd";
import CustomTimeRangePicker from "../components/TimePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ApplyDoctor = () => {

  const {user} = useSelector(state => state.user); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/apply-doctor',{...values,userId:user._id,phone: values.phoneNumber,feesPerConsultaion: values.fee,
        LastName: values.lastName,},{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      dispatch(hideLoading());
      if(res.data.success){
        toast.success("Applied Successfully")
        navigate('/home');
      }
      else{
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error('Something went wrong');
    }
  };

  const handleTimeRangeChange = (timeRange) => {
    console.log("Selected Time Range:", timeRange);
  };

  return (
    <Layout>
      <h1 className="text-center">Apply</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
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
              <CustomTimeRangePicker onChange={handleTimeRangeChange} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}></Col>
          <Col xs={24} md={12} lg={8}>
            <button className="btn btn-primary form-btn" type="submit">
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
