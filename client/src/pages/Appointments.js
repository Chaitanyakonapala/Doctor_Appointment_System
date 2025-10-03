import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import moment from 'moment';
import { Table } from 'antd';
import { useLocation } from 'react-router-dom';

const Appointments = () => {

    const location = useLocation();

    const [appointments,setAppointments] = useState([]);

    const getAppointments = async()=>{
        try {
            const res = await axios.get('/api/v1/user/user-appointments',{
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(res.data.success){
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=>{
        getAppointments();
    },[location.pathname])

    const columns = [
        {
            title : 'ID',
            dataIndex : '_id'
        },
        // {
        //     title : 'Name',
        //     dataIndex : 'name',
        //     render : (text,record) =>(
        //         <span>
        //             {record.doctorId.firstName} {record.doctorId.LastName}
        //         </span>
        //     )
        // }, 
        // {
        //     title : 'Phone',
        //     dataIndex : 'phone',
        //     render : (text,record) =>(
        //         <span>
        //             {record.doctorId.phone}
        //         </span>
        //     )
        // }, 
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

    ]

  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns = {columns} dataSource={appointments}/>
    </Layout> 
  )
}

export default Appointments
