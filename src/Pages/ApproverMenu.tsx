import * as React from "react";
import { Layout, Menu } from "antd";
import Approver from "./Approver";
import { useState } from "react";

export default function ApproverMenu() {
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  return (
    <Layout>
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[selectedKey]}
        mode="horizontal"
      >
        <Menu.Item key="1">Approver Dashboard</Menu.Item>
        {/* <Menu.Item key="2">Add Leave</Menu.Item> */}
      </Menu>
      {selectedKey === "1" && <Approver />}
      {/* {selectedKey === "2" && <AddLeave />} */}
    </Layout>
  );
}
