import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Row, Col } from "antd";
import DoctorList from "../components/DoctorList";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const location = useLocation();

  //login user data
  const getUserData = async () => {
    try {
      const res = await axios.get("./api/v1/user/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [location.pathname]);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>

<Row gutter={[24, 24]}>
  {doctors && doctors.map((doctor, id) => (
    <Col 
      key={id} 
      xs={24} sm={12} md={12} lg={12} xl={6} 
    >
      <DoctorList doctor={doctor} />
    </Col>
  ))}
</Row>

    </Layout>
  )
}

export default HomePage;
