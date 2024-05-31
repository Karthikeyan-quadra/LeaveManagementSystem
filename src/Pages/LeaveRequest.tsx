import * as React from "react";
import styles from "../Styles/Leavemanagement.module.scss";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState, useEffect } from "react";
import { FormOutlined, DashboardOutlined } from "@ant-design/icons";
import { getCurrentUserEmail, getApproverList } from "../Data/GetSiteLit";
import ApplyLeave from "./ApplyLeave";
import LeaveStatus from "./LeaveStatus";
import { UserAvatar } from "../Component/Avatar";
import Approver from "./Approver";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import ManageApprover from "./ManageApprover";
import DepartmentUser from "./DepartmentUser";

export default function Leave() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [isApprover, setIsApprover] = useState(false);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const styl = `
    :where(.css-dev-only-do-not-override-17seli4).ant-layout .ant-layout-sider-light,
    :where(.css-17seli4).ant-layout .ant-layout-sider-light {
      background: #ffffff;
      max-width: 300px !important;
      min-width: 270px !important;
      width: 300px !important;
      border-radius: 11px;
    }
    :where(.css-dev-only-do-not-override-17seli4).ant-menu-light, :where(.css-dev-only-do-not-override-17seli4).ant-menu-light>.ant-menu,
    :where(.css-17seli4).ant-menu-light, :where(.css-17seli4).ant-menu-light>.ant-menu {
      color: rgba(0, 0, 0, 0.88);
      background: #ffffff;
      border-radius: 11px;
      width: 99%;
    }
  `;
  const isUserApprover = async () => {
    const email = await getCurrentUserEmail();
    const approvers = await getApproverList();

    return approvers.some((approver: any) => approver.EmailId === email);
  };

  useEffect(() => {
    async function checkIfApprover() {
      const approver = await isUserApprover();
      setIsApprover(approver);
    }
    checkIfApprover();
  }, []);
  function ConditionalMenus() {
    const location = useLocation();
    const isApproverPath = location.pathname.startsWith("/approver");

    return (
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[selectedKey]}
        mode="horizontal"
      >
        {!isApproverPath && (
          <>
            <Menu.Item key="1">
              <Link to="/" style={{ color: "black", textDecoration: "none" }}>
                Apply Leave
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link
                to="/leave-status"
                style={{ color: "black", textDecoration: "none" }}
              >
                Leave Status
              </Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  }

  return (
    <Router>
      <div>
        <style>{styl}</style>
        <div className={styles.container}>
          <Layout className={styles.sidenavbarheight}>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              theme="light"
            >
              <div className="demo-logo-vertical" />
              <div style={{ display: "flex" }}>
                <UserAvatar />
              </div>
              <Menu
                className={styles.margin}
                theme="light"
                mode="inline"
                defaultSelectedKeys={["1"]}
                onClick={handleMenuClick}
              >
                <Menu.Item key="1" icon={<FormOutlined />}>
                  <Link
                    to="/"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    New Request
                  </Link>
                </Menu.Item>
                {isApprover && (
                  <Menu.SubMenu
                    key="2"
                    icon={
                      <img
                        // src={require("../../Images/Verified.png")}
                        src={require("../webparts/leavemanagement/Images/Verified.png")}
                        style={{ width: "24px", height: "24px" }}
                      />
                    }
                    title="Approver"
                  >
                    <Menu.Item
                      key="2.1"
                      icon={
                        <img
                          // src={require("../../Images/Verified.png")}
                          src={require("../webparts/leavemanagement/Images/dashboard.png")}
                          style={{ width: "24px", height: "24px" }}
                        />
                      }
                    >
                      <Link
                        to="/approver/approver-dashboard"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        Approver Dashboard
                      </Link>
                    </Menu.Item>
                    {/* <Menu.Item
                      key="2.2"
                      icon={
                        <img
                          // src={require("../../Images/Verified.png")}
                          src={require("../webparts/leavemanagement/Images/approver.png")}
                          style={{ width: "24px", height: "24px" }}
                        />
                      }
                    >
                      <Link
                        to="/approver/manage-approver"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        Manage Approver
                      </Link>
                    </Menu.Item> */}
                    {/* <Menu.Item
                      key="2.3"
                      icon={
                        <img
                          // src={require("../../Images/Verified.png")}
                          src={require("../webparts/leavemanagement/Images/users.png")}
                          style={{ width: "24px", height: "24px" }}
                        />
                      }
                    >
                      <Link
                        to="/approver/department-user"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        Deapartment User
                      </Link>
                    </Menu.Item> */}
                    {/* Add more submenu items if needed */}
                  </Menu.SubMenu>
                )}

                <Menu.SubMenu
                  key="3"
                  icon={
                    <img
                      // src={require("../../Images/Verified.png")}
                      src={require("../webparts/leavemanagement/Images/HR.png")}
                      style={{ width: "24px", height: "24px" }}
                    />
                  }
                  title="HR Adimn"
                >
                  {/* <Menu.Item
                    key="3.1"
                    icon={
                      <img
                        // src={require("../../Images/Verified.png")}
                        src={require("../webparts/leavemanagement/Images/dashboard.png")}
                        style={{ width: "24px", height: "24px" }}
                      />
                    }
                  >
                    <Link
                      to="/approver/approver-dashboard"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Approver Dashboard
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item
                    key="3.1"
                    icon={
                      <img
                        // src={require("../../Images/Verified.png")}
                        src={require("../webparts/leavemanagement/Images/approver.png")}
                        style={{ width: "24px", height: "24px" }}
                      />
                    }
                  >
                    <Link
                      to="/approver/manage-approver"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Manage Approver
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    key="3.2"
                    icon={
                      <img
                        // src={require("../../Images/Verified.png")}
                        src={require("../webparts/leavemanagement/Images/users.png")}
                        style={{ width: "24px", height: "24px" }}
                      />
                    }
                  >
                    <Link
                      to="/approver/department-user"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Organization User
                    </Link>
                  </Menu.Item>
                  {/* Add more submenu items if needed */}
                </Menu.SubMenu>
              </Menu>
            </Sider>

            <Layout className={styles.menuContainer}>
              <ConditionalMenus />
              <Routes>
                <Route path="/" element={<ApplyLeave />} />
                <Route path="/leave-status" element={<LeaveStatus />} />
                <Route
                  path="/approver/approver-dashboard"
                  element={<Approver />}
                />
                <Route
                  path="/approver/manage-approver"
                  element={<ManageApprover />}
                />
                <Route
                  path="/approver/department-user"
                  element={<DepartmentUser />}
                />
                {/* Add more routes if needed */}
              </Routes>
            </Layout>
          </Layout>
        </div>
      </div>
    </Router>
  );
}
