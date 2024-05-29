// import * as React from "react";
// import styles from "./Leavemanagement.module.scss";
// import { Layout, Menu } from "antd";
// import Sider from "antd/es/layout/Sider";
// import { useState } from "react";
// import { FormOutlined } from "@ant-design/icons";
// import ApplyLeave from "./ApplyLeave";
// import LeaveStatus from "../LeaveStatus/LeaveStatus";
// import { UserAvatar } from "./Avatar";
// import Approver from "../Approver/Approver";
// export default function Leave() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [SelectedKey, setSelectedKey] = useState("1");

//   const handleMenuClick = (e: any) => {
//     setSelectedKey(e.key);
//   };
//   console.log(setCollapsed);
//   const styl = `:where(.css-dev-only-do-not-override-17seli4).ant-layout .ant-layout-sider-light {
//       background: #ffffff;
//     max-width: 300px !important;
//     min-width: 270px !important;
//     width: 300px !important;
//     border-radius:11px;
//   }
//   :where(.css-dev-only-do-not-override-17seli4).ant-menu-light, :where(.css-dev-only-do-not-override-17seli4).ant-menu-light>.ant-menu {
//     color: rgba(0, 0, 0, 0.88);
//     background: #ffffff;
//     border-radius: 11px;
//     width:99%
// }
//   `;

//   return (
//     <div>
//       <style> {styl}</style>

//       <div className={styles.container}>
//         <Layout className={styles.sidenavbarheight}>
//           <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
//             <div className="demo-logo-vertical" />
//             <div
//               style={{
//                 display: "flex",
//               }}
//             >
//               <UserAvatar />
//             </div>
//             {/* <Menu
//               className={styles.margin}
//               theme="light"
//               mode="inline"
//               defaultSelectedKeys={["1"]}
//               items={[
//                 {
//                   key: "1",
//                   icon: <FormOutlined />,
//                   label: "Leave Management System",
//                 },
//               ]}
//             /> */}
//             <Menu
//               className={styles.margin}
//               theme="light"
//               mode="inline"
//               defaultSelectedKeys={["1"]}
//               items={[
//                 {
//                   key: "1",
//                   icon: <FormOutlined />,
//                   label: "Leave Management System",
//                   children: [
//                     {
//                       key: "1.2",
//                       label: "Approver",
//                       icon: <FormOutlined />,
//                     },
//                   ],
//                 },
//               ]}
//             />
//           </Sider>

//           <Layout className={styles.menuContainer}>
//             <Menu
//               onClick={handleMenuClick}
//               selectedKeys={[SelectedKey]}
//               mode="horizontal"
//             >
//               <Menu.Item key="1">Apply Leave</Menu.Item>
//               <Menu.Item key="2">Apply Permission</Menu.Item>
//               <Menu.Item key="3">Leave Status</Menu.Item>
//             </Menu>
//             {SelectedKey === "1" && <ApplyLeave />}
//             {SelectedKey === "3" && <LeaveStatus />}
//           </Layout>

//           <Layout className={styles.menuContainer}>
//             <Menu
//               onClick={handleMenuClick}
//               selectedKeys={[SelectedKey]}
//               mode="horizontal"
//             >
//               <Menu.Item key="1.2">Approver Dashboard</Menu.Item>
//               <Menu.Item key="1.2.1">Add Leave</Menu.Item>
//             </Menu>
//             {SelectedKey === "1.2" && <Approver />}
//           </Layout>
//         </Layout>
//       </div>
//     </div>
//   );
// }

// import * as React from "react";
// import styles from "./Leavemanagement.module.scss";
// import { Layout, Menu } from "antd";
// import Sider from "antd/es/layout/Sider";
// import { useState } from "react";
// import { FormOutlined } from "@ant-design/icons";
// import ApplyLeave from "./ApplyLeave";
// import LeaveStatus from "../LeaveStatus/LeaveStatus";
// import { UserAvatar } from "./Avatar";
// import ApproverMenu from "../Approver/ApproverMenu";
// export default function Leave() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [SelectedKey, setSelectedKey] = useState("1");

//   const handleMenuClick = (e: any) => {
//     setSelectedKey(e.key);
//   };
//   console.log(setCollapsed);
//   const styl = `:where(.css-dev-only-do-not-override-17seli4).ant-layout .ant-layout-sider-light {
//       background: #ffffff;
//     max-width: 300px !important;
//     min-width: 270px !important;
//     width: 300px !important;
//     border-radius:11px;
//   }
//   :where(.css-dev-only-do-not-override-17seli4).ant-menu-light, :where(.css-dev-only-do-not-override-17seli4).ant-menu-light>.ant-menu {
//     color: rgba(0, 0, 0, 0.88);
//     background: #ffffff;
//     border-radius: 11px;
//     width:99%
// }
//   `;

//   return (
//     <div>
//       <style> {styl}</style>

//       <div className={styles.container}>
//         <Layout className={styles.sidenavbarheight}>
//           <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
//             <div className="demo-logo-vertical" />
//             <div
//               style={{
//                 display: "flex",
//               }}
//             >
//               <UserAvatar />
//             </div>
//             {/* <Menu
//               className={styles.margin}
//               theme="light"
//               mode="inline"
//               defaultSelectedKeys={["1"]}
//               items={[
//                 {
//                   key: "1",
//                   icon: <FormOutlined />,
//                   label: "Leave Management System",
//                 },
//               ]}
//             /> */}
//             <Menu
//               className={styles.margin}
//               theme="light"
//               mode="inline"
//               defaultSelectedKeys={["1"]}
//               items={[
//                 {
//                   key: "1",
//                   icon: <FormOutlined />,
//                   label: "Leave Management System",
//                   children: [
//                     {
//                       key: "1.2",
//                       label: "Approver",
//                       icon: <FormOutlined />,
//                       onClick: handleMenuClick,
//                     },
//                   ],
//                 },
//               ]}
//               onClick={handleMenuClick}
//             />
//           </Sider>

//           <Layout className={styles.menuContainer}>
//             <Menu
//               onClick={handleMenuClick}
//               selectedKeys={[SelectedKey]}
//               mode="horizontal"
//             >
//               <Menu.Item key="1">Apply Leave</Menu.Item>
//               <Menu.Item key="2">Apply Permission</Menu.Item>
//               <Menu.Item key="3">Leave Status</Menu.Item>
//             </Menu>
//             {SelectedKey === "1" && <ApplyLeave />}
//             {SelectedKey === "3" && <LeaveStatus />}
//             {SelectedKey === "1.2" && <ApproverMenu />}
//           </Layout>
//         </Layout>
//       </div>
//     </div>
//   );
// }

// import * as React from "react";
// import styles from "./Leavemanagement.module.scss";
// import { Layout, Menu } from "antd";
// import Sider from "antd/es/layout/Sider";
// import { useState } from "react";
// import { FormOutlined, DashboardOutlined } from "@ant-design/icons";
// import ApplyLeave from "./ApplyLeave";
// import LeaveStatus from "../LeaveStatus/LeaveStatus";
// import { UserAvatar } from "./Avatar";
// import ApproverMenu from "../Approver/ApproverMenu";
// import Approver from "../Approver/Approver";
// import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

// export default function Leave() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [selectedKey, setSelectedKey] = useState("1");

//   const handleMenuClick = (e: any) => {
//     setSelectedKey(e.key);
//   };

//   const styl = `
//     :where(.css-dev-only-do-not-override-17seli4).ant-layout .ant-layout-sider-light {
//       background: #ffffff;
//       max-width: 300px !important;
//       min-width: 270px !important;
//       width: 300px !important;
//       border-radius: 11px;
//     }
//     :where(.css-dev-only-do-not-override-17seli4).ant-menu-light, :where(.css-dev-only-do-not-override-17seli4).ant-menu-light>.ant-menu {
//       color: rgba(0, 0, 0, 0.88);
//       background: #ffffff;
//       border-radius: 11px;
//       width: 99%;
//     }
//   `;

//   return (
//     <Router>
//       <div>
//         <style>{styl}</style>

//         <div className={styles.container}>
//           <Layout className={styles.sidenavbarheight}>
//             <Sider
//               trigger={null}
//               collapsible
//               collapsed={collapsed}
//               theme="light"
//             >
//               <div className="demo-logo-vertical" />
//               <div style={{ display: "flex" }}>
//                 <UserAvatar />
//               </div>
//               <Menu
//                 className={styles.margin}
//                 theme="light"
//                 mode="inline"
//                 defaultSelectedKeys={["1"]}
//                 onClick={handleMenuClick}
//               >
//                 <Menu.Item key="1" icon={<FormOutlined />}>
//                   <Link
//                     to="/"
//                     style={{ color: "black", textDecoration: "none" }}
//                   >
//                     New Request
//                   </Link>
//                 </Menu.Item>
//                 <Menu.SubMenu
//                   key="2"
//                   icon={<DashboardOutlined />}
//                   title="Approver"
//                 >
//                   <Menu.Item key="2.1">
//                     <Link
//                       to="/approver"
//                       style={{ color: "black", textDecoration: "none" }}
//                     >
//                       Approver Dashboard
//                     </Link>
//                   </Menu.Item>
//                   {/* Add more submenu items if needed */}
//                 </Menu.SubMenu>
//               </Menu>
//             </Sider>

//             <Layout className={styles.menuContainer}>
//               <Menu
//                 onClick={handleMenuClick}
//                 selectedKeys={[selectedKey]}
//                 mode="horizontal"
//               >
//                 <Menu.Item key="1">
//                   <Link
//                     to="/"
//                     style={{ color: "black", textDecoration: "none" }}
//                   >
//                     Apply Leave
//                   </Link>
//                 </Menu.Item>
//                 <Menu.Item key="3">
//                   <Link
//                     to="/leave-status"
//                     style={{ color: "black", textDecoration: "none" }}
//                   >
//                     Leave Status
//                   </Link>
//                 </Menu.Item>
//               </Menu>
//               {/* {selectedKey === "1" && <ApplyLeave />}
//             {selectedKey === "3" && <LeaveStatus />}
//             {selectedKey === "2.1" && <Approver />} */}
//               <Routes>
//                 <Route path="/" element={<ApplyLeave />} />
//                 <Route path="/leave-status" element={<LeaveStatus />} />
//                 <Route path="/approver" element={<Approver />} />
//                 {/* Add more routes if needed */}
//               </Routes>
//             </Layout>
//           </Layout>
//         </div>
//       </div>
//     </Router>
//   );
// }

import * as React from "react";
// import styles from "../webparts/leavemanagement/components/ApplyLeave/Leavemanagement.module.scss";
import styles from "../Styles/Leavemanagement.module.scss";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { FormOutlined, DashboardOutlined } from "@ant-design/icons";
import ApplyLeave from "./ApplyLeave";
import LeaveStatus from "./LeaveStatus";
import { UserAvatar } from "../Component/Avatar";
import ApproverMenu from "./ApproverMenu";
import Approver from "./Approver";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import ManageApprover from "./ManageApprover";

export default function Leave() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const styl = `
    :where(.css-dev-only-do-not-override-17seli4).ant-layout .ant-layout-sider-light {
      background: #ffffff;
      max-width: 300px !important;
      min-width: 270px !important;
      width: 300px !important;
      border-radius: 11px;
    }
    :where(.css-dev-only-do-not-override-17seli4).ant-menu-light, :where(.css-dev-only-do-not-override-17seli4).ant-menu-light>.ant-menu {
      color: rgba(0, 0, 0, 0.88);
      background: #ffffff;
      border-radius: 11px;
      width: 99%;
    }
  `;

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
                  <Menu.Item key="2.1">
                    <Link
                      to="/approver/approver-dashboard"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Approver Dashboard
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2.2">
                    <Link
                      to="/approver/manage-approver"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Manage Approver
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
                {/* Add more routes if needed */}
              </Routes>
            </Layout>
          </Layout>
        </div>
      </div>
    </Router>
  );
}
