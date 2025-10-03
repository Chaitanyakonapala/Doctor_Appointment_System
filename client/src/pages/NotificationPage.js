import React from "react";
import Layout from "../components/Layout";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const handleMarkAllRead = async () => {
    try {
      const updatedUser = {
        ...user,
        notification: [],
        seenNotification: [...user.notification, ...user.seenNotification],
      };
      dispatch({ type: "user/setUser", payload: updatedUser });
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success("Marked as Read");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      const updatedUser = { ...user, seenNotification: [] };
      dispatch({ type: "user/setUser", payload: updatedUser });
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success("Deleted All Read");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
      message.error("Something went wrong in notification");
    }
  };

  // Tabs content
  const items = [
    {
      key: "0",
      label: "Unread",
      children: (
        <div>
          <div className="d-flex justify-content-end">
            <h4 className="p-2" style={{ cursor: "pointer" }} onClick={handleMarkAllRead}>
              Mark All Read
            </h4>
          </div>
          {user?.notification.map((notificationMsg, index) => (
            <div className="card" style={{ cursor: "pointer" }} key={index}>
              <div
                className="card-text"
                // onClick={() => navigate(notificationMsg.onClickPath)}
              >
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "1",
      label: "Read",
      children: (
        <div>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2 text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead}
            >
              Delete All Read
            </h4>
          </div>
          {user?.seenNotification.map((notificationMsg, index) => (
            <div className="card" style={{ cursor: "pointer" }} key={index}>
              <div
                className="card-text"
                // onClick={() => navigate(notificationMsg.onClickPath)}
              >
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs defaultActiveKey="0" items={items} />
    </Layout>
  );
};

export default NotificationPage;
