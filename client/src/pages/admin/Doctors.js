import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async(record,status) => {
    try {
      const res = await axios.post("/api/v1/admin/changeAccountStatus",{doctorId: record._id,userId: record.userId,status : status},{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      if(res.data.success){
        //message
        const updatedDoctors = doctors.map((doctor) =>
          doctor._id === record._id ? { ...doctor, status } : doctor
        );
        setDoctors(updatedDoctors);
        toast.success('Updated Successfully')
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.LastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, 'approved')}
            >
              Approve
            </button>
          )}
          {record.status === "pending"  && (
            <button
              className="btn btn-danger ms-2"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
    
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default Doctors;
