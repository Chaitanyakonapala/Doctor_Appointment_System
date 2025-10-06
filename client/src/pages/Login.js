import React from "react";
import { Form, Input, message } from "antd";
import "../styles/RegisterStyles.css";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const onFinishHandler = async (values) => {
    try {
      const res = await axios.post("./api/v1/user/login", values);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successful");
        navigate("/home");
      } else {
        toast.error('Invalid Username or Password')
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="register-form"
        >
          <h3 className="text-center">Login Form</h3>
          <Form.Item label="Email" name="email" autoComplete="username">
            <Input type="email" required autoComplete="username" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required autoComplete="current-password" />
          </Form.Item>
          <Link to="/register" className="m-2">
            Doesn't have an account?
          </Link>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form>
      </div>
    </>
  );
};

export default Login;
