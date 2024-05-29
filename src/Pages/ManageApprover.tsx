import * as React from "react";
import { getApproverList, getDepartmentList } from "../Data/GetSiteLit";
import { useForm } from "antd/es/form/Form";
import {
  Row,
  Col,
  Button,
  Drawer,
  Form,
  notification,
  Input,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { SPFI } from "@pnp/sp";
import { getSp } from "../Services/PnpConfig";
import "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import styles from "../Styles/Approver.module.scss";
const { Option } = Select;

export default function ManageApprover() {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(true);
  const [add_UserName, setAddUserName] = useState<any>();
  const [add_EmailID, setAddEmailID] = useState<any>();
  const [departments, setDepartments] = useState([]);
  const [subdepartments, setSubdepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      const dept: any = await getDepartmentList();
      setDepartments(dept);
      console.log(dept);
    };
    fetchDepartments();
  }, []);

  const showDrawer = () => {
    setOpen(true);
    setIsAdded(true);
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };
  const openNotification = () => {
    notification.info({
      message: (
        <span style={{ color: "green", fontWeight: "bold" }}>Added</span>
      ),
      description: "User added successfully",
      placement: "top",
      icon: (
        <img
          // src={require("../../Images/CheckMark.png")}
          src={require("../webparts/leavemanagement/CheckMark.png")}
          alt="Success"
          style={{ width: "20%" }}
        />
      ),
    });
  };
  const handleadd_Username = (e: any) => {
    setAddUserName(e.target.value);
    console.log(add_UserName);
  };
  const handleadd_EmailId = (e: any) => {
    setAddEmailID(e.target.value);
    console.log(add_EmailID);
  };

  const handleAddUser = async () => {
    console.log("handleAddUser function called");

    const newRequest = {
      UserName: add_UserName,
      EmailId: add_EmailID,
    };
    const sp: SPFI = getSp();

    try {
      // Add the new leave request to the SharePoint list
      const datainlist = await getApproverList();
      console.log(datainlist);
      const response = await sp.web.lists
        .getByTitle("ApproverList")
        .items.add(newRequest);
      console.log("User added:", response);
      openNotification();
    } catch (error) {
      console.error("Error adding  user:", error);
    }

    setOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div>
        <div style={{ marginTop: "20px" }}>
          <Row className={styles.ManageApprover}>
            <Col>
              <Button
                onClick={showDrawer}
                style={{
                  width: "149px",
                  height: "34px",
                  padding: "0px",
                  backgroundColor: "rgba(74, 173, 146, 1)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={require("../webparts/leavemanagement/Images/UserImage.png")}
                  alt="UserImage"
                  style={{ padding: "5px" }}
                />
                Add User
              </Button>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Search
                placeholder="Search"
                //   onSearch={_onFilter}
                style={{ width: 300 }}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        {isAdded ? (
          <div>
            <Drawer
              title="Add User"
              onClose={onClose}
              open={open}
              footer={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "149px",
                      backgroundColor: "#rgba(74, 173, 146, 1)",
                      color: "white",
                    }}
                    onClick={() => form.submit()} // Trigger the form submit manually
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => onClose()}
                    style={{
                      width: "149px",
                      marginLeft: "5px",
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              }
            >
              <div>
                <Form
                  name="basic"
                  layout="vertical"
                  autoComplete="off"
                  onFinish={() => handleAddUser()}
                  form={form}
                >
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="User Name"
                        name="User Name"
                        style={{
                          maxWidth: 400,
                          marginTop: 10,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Specify User Name"
                          onChange={handleadd_Username}
                          value={add_UserName}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="User MailID"
                        name="User MailID"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please input your user mailId!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Specify User MailID"
                          onChange={handleadd_EmailId}
                          value={add_EmailID}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Department"
                        name="Department"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please select a department!",
                          },
                        ]}
                      >
                        <Select placeholder="Select Department" onChange={handleDepartmentChange}>
                          {departments.map(dept => (
                            <Option key={dept.Id} value={dept.Title}>{dept.Title}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Subdepartment"
                        name="Subdepartment"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please select a subdepartment!",
                          },
                        ]}
                      >
                        <Select placeholder="Select Subdepartment">
                          {subdepartments.map(sub => (
                            <Option key={sub.Id} value={sub.Title}>{sub.Title}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row> */}
                </Form>
              </div>
            </Drawer>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
