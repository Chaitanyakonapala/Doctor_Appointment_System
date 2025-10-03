import { Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";

const DoctorAppointments = () => {

        const [appointments,setAppointments] = useState([]);
    
        const getAppointments = async()=>{
            try {
                const res = await axios.get('/api/v1/doctor/doctor-appointments',
                    
                    {
                    headers : {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Cache-Control': 'no-cache', // Force no caching
                    }
                })
                if(res.data.success){
                    setAppointments((prev) => [...res.data.data]);
                    // getAppointments();
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        useEffect(()=>{
            getAppointments();
        },[])

        const handleStatus = async(record,status)=>{
            try {
                const res = await axios.post('/api/v1/doctor/update-status',{appointmentsId : record._id,status},
                    {headers:{
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }}
                )
                if(res.data.success){
                    toast.success('Successfully Approved')
                    setAppointments((prevAppointments) =>
                        prevAppointments.map((appointment) =>
                          appointment._id === record._id
                            ? { ...appointment, status } // Update the status of the specific appointment
                            : appointment
                        )
                      );
                }
            } catch (error) {
                console.log(error);
            }
        }

    const columns = [
            {
                title : 'Id',
                dataIndex : '_id'
            },
            {
                title : 'Date & Time',
                dataIndex : 'date',
                render : (text,record) =>(
                    <span>
                        {moment(record.date).format('DD-MM-YYYY')} &nbsp; 
                        {moment(record.time).format('HH:mm')}
                    </span>
                )
            }, 
            {
                title : 'Status',
                dataIndex : 'status',
            }, 
            {
                title : 'Actions',
                dataIndex : 'actions',
                render : (text,record) => (
                    <div className="d-flex">
                        {record.status === "pending" && (
                            <div className="d-flex">
                                <button className='btn btn-success' onClick={()=>handleStatus(record,'approved')}>Approve</button>
                                <button className='btn btn-danger ms-2' onClick={()=>handleStatus(record,'reject')}>Reject</button>
                            </div>
                        )}
                    </div>
                )
            }, 
        ]

  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns = {columns} dataSource={appointments} rowKey="_id"/>
    </Layout>
  )
}

export default DoctorAppointments