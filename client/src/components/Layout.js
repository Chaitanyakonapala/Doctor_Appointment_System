import React, { useState } from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // for mobile sidebar

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged Out Successfully!");
    navigate("/login");
  };

  const doctorMenu = [
    {
      name: "Home",
      path: "/home",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className={`layout ${collapsed ? "collapsed" : ""}`}>
        {/* ===== Sidebar ===== */}
        <div
          className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
          onClick={() => mobileOpen && setMobileOpen(false)} // close on click
        >
          <div className="logo">
            <i className="fa-solid fa-stethoscope logo-icon"></i>
            {!collapsed && <h3>DocApp</h3>}
          </div>
          <hr />
          <div className="menu">
            {SidebarMenu.map((menu, id) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={id}
                  to={menu.path}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <i className={`${menu.icon} menu-icon`}></i>
                  {!collapsed && <span className="menu-link">{menu.name}</span>}
                </Link>
              );
            })}

            {/* Logout */}
            <div
              className="menu-item logout"
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
            >
              <i className="fa-solid fa-right-from-bracket menu-icon"></i>
              {!collapsed && <span className="menu-link">Logout</span>}
            </div>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="content">
          {/* ===== Header ===== */}
          <div className="header">
            <div
              className="header-left"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
            >
              <i
                className={`fa-solid ${
                  mobileOpen ? "fa-xmark" : "fa-bars"
                } menu-toggle`}
              ></i>
            </div>
            <div className="header-right" style={{ cursor: "pointer" }}>
              <Badge
                count={user && user.notification.length}
                onClick={() => navigate("/notification")}
              >
                <i className="fa-solid fa-bell bell-icon"></i>
              </Badge>
              <div className="user-name">{user?.name}</div>
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="body-content" key={location.pathname}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
