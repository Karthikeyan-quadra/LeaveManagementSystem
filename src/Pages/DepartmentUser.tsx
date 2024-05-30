import * as React from "react";
import { getDepartmentList, getDepartmentUserList } from "../Data/GetSiteLit";
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
  Table,
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

export default function DepartmentUser() {
  const [form] = useForm();
  const [editForm] = useForm();
  const [open, setOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(true);
  const [isEdited, setIsEdited] = useState(true);
  const [disableAddsubmit, setDisableAddSubmit] = useState(false);
  const [disablesEditsubmit, setDisableEditSubmit] = useState(false);

  const [add_UserName, setAddUserName] = useState<any>();
  const [add_EmailID, setAddEmailID] = useState<any>();
  const [add_Leave, setAddLeave] = useState<any>();

  const [departments, setDepartments] = useState<any>([]);
  const [subdepartments, setSubdepartments] = useState<any>([]);
  const [users, setUsers] = useState<any>([]); // New state for approvers list
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedSubdepartment, setSelectedSubdepartment] = useState<
    string | null
  >(null);

  const [edit_UserName, setEditUserName] = useState<any>();
  const [edit_EmailID, setEditEmailID] = useState<any>();
  const [edit_Leave, setEditLeave] = useState<any>();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [edit_Department, setEditDepartment] = useState<any>();
  const [edit_Subdepartment, setEditSubdepartment] = useState<any>();
  const [selecteditem, setSelectedItem] = useState<any>("");
  const [Manageopen, setManageOpen] = useState(false);
  const [onchanged, setOnChanged] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const dept = await getDepartmentList();
      console.log(dept);
      const formattedDepts: any = dept.map((item: any) => ({
        ...item,
        Subdepartments: item.Subdepartment,
      }));
      setDepartments(formattedDepts);
    };
    fetchDepartments();
  }, []);
  useEffect(() => {
    const fetchDepartmentUser = async () => {
      const deparmtnetUserList = await getDepartmentUserList();
      setUsers(deparmtnetUserList);
    };
    fetchDepartmentUser();
  }, []);

  const _onFilter = (text: any) => {
    const filtered: any = users.filter(
      (item: any) =>
        item.UserName.toLowerCase().includes(text.toLowerCase()) ||
        item.EmailId.toLowerCase().includes(text.toLowerCase()) ||
        item.Department.toLowerCase().includes(text.toLowerCase()) ||
        item.TotalLeaveAdded.toString()
          .toLowerCase()
          .includes(text.toLowerCase()) ||
        item.Subdepartment.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(text);
  };

  const showDrawer = () => {
    setOpen(true);
    setIsAdded(true);
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };
  const onManageClose = () => {
    setManageOpen(false);
  };
  const columns = [
    {
      title: "Username",
      dataIndex: "UserName",
      key: "username",
    },
    {
      title: "Email ID",
      dataIndex: "EmailId",
      key: "emailid",
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "department",
    },

    {
      title: "Subdepartment",
      dataIndex: "Subdepartment",
      key: "subdepartment",
    },
    {
      title: "Leave Added",
      dataIndex: "TotalLeaveAdded",
      key: "TotalLeaveAdded",
    },
    {
      title: "",
      dataIndex: "Department",
      key: "Manage",
      render: (text: any, record: any) => (
        <span
          onClick={() => {
            editUser(record);
          }}
          style={{
            color: "rgba(22, 119, 255, 1)",
            textDecoration: "underline",
          }}
        >
          Manage
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "Department",
      key: "Delete",
      render: (text: any, record: any) => (
        <Button
          onClick={() => {
            DeleteUser(record);
          }}
          style={{
            color: "rgba(203, 68, 68, 1)",
            border: "1px solid rgba(203, 68, 68, 1)",
          }}
        >
          X
        </Button>
      ),
    },
  ];
  const editUser = (record: any) => {
    setIsEdited(true);
    setManageOpen(true);

    console.log("Edit user function called");
    console.log("Record:", record);
    setEditUserName(record.UserName);
    setEditEmailID(record.EmailId);
    setEditDepartment(record.Department);
    setEditSubdepartment(record.Subdepartment);
    setSelectedItem(record.ID);

    editForm.setFieldsValue({
      "User Name": record.UserName,
      "User MailID": record.EmailId,
      Department: record.Department,
      "Sub Department": record.Subdepartment,
      "Add Leave Balance": record.TotalLeaveAdded,
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

  const handleadd_Leave = (e: any) => {
    setAddLeave(e.target.value);
    console.log(add_Leave);
  };

  const DeleteUser = async (record: any) => {
    console.log("Delete user function called");
    console.log("Record:", record);

    const sp: SPFI = getSp();

    try {
      // Delete the user from the SharePoint list based on the record ID
      await sp.web.lists
        .getByTitle("DepartmentUser")
        .items.getById(record.ID)
        .delete();
      notification.success({
        message: "Deleted",
        description: "User deleted successfully",
        placement: "top",
      });
      console.log("User deleted successfully");

      // Update the state to reflect the changes (remove the deleted user from the list)
      const updatedApprovers = users.filter(
        (user: any) => user.ID !== record.ID
      );
      setUsers(updatedApprovers);
    } catch (error) {
      console.error("Error deleting user:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete user",
      });
    }
    const userList = await getDepartmentUserList();
    setUsers(userList);
  };

  const handleAddUser = async () => {
    setDisableAddSubmit(true);

    console.log("handleAddUser function called");

    const newRequest = {
      UserName: add_UserName,
      EmailId: add_EmailID,
      Department: selectedDepartment,
      Subdepartment: selectedSubdepartment,
      TotalLeaveAdded: add_Leave,
    };

    const sp: SPFI = getSp();

    try {
      // Fetch the current list of users
      const existingUsers = await getDepartmentUserList();
      console.log(existingUsers);

      // Check if the email ID already exists
      const emailExists = existingUsers.some(
        (user: any) => user.EmailId.toLowerCase() === add_EmailID.toLowerCase()
      );

      if (emailExists) {
        notification.error({
          message: "Error",
          description: "Email ID already exists.",
          placement: "top",
        });
        return; // Exit the function if email ID exists
      }

      // Add the new user to the SharePoint list
      const response = await sp.web.lists
        .getByTitle("DepartmentUser")
        .items.add(newRequest);
      notification.success({
        message: "Added",
        description: "User added successfully",
        placement: "top",
      });
      console.log("User added:", response);
    } catch (error) {
      console.error("Error adding user:", error);
    }

    setIsAdded(false);

    setOpen(false);
    form.resetFields();
    const userList = await getDepartmentUserList();
    setUsers(userList);
    setDisableAddSubmit(false);
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    const selectedDept = departments.find(
      (dept: any) => dept.Department === value
    );
    setSubdepartments(selectedDept ? selectedDept.Subdepartments : []);
    form.setFieldsValue({ Subdepartment: undefined }); // Reset subdepartment when department changes
    setSelectedSubdepartment(null); // Reset the selected subdepartment state
  };

  const handleSubdepartmentChange = (value: string) => {
    setSelectedSubdepartment(value);
    console.log(selectedSubdepartment);
  };

  const handledit_Username = (e: any) => {
    setEditUserName(e.target.value);
    setOnChanged(true);
  };

  const handleedit_Leave = (e: any) => {
    setEditLeave(e.target.value);
    setOnChanged(true);
  };

  const handleedit_UserMailID = (e: any) => {
    setEditEmailID(e.target.value);
    setOnChanged(true);
  };

  const editDepartmentChange = (value: string) => {
    setEditDepartment(value);
    const selectedDept = departments.find(
      (dept: any) => dept.Department === value
    );
    setSubdepartments(selectedDept ? selectedDept.Subdepartments : []);
    editForm.setFieldsValue({ "Sub Department": undefined }); // Reset subdepartment when department changes
    setEditSubdepartment(null); // Reset the selected subdepartment state
    setOnChanged(true);
  };

  const editSubDepartmentChange = (value: string) => {
    setEditSubdepartment(value);
    setOnChanged(true);
  };

  const handleeditUser = async () => {
    setDisableEditSubmit(true);

    console.log("handleeditUser function called");

    const updatedUser = {
      UserName: edit_UserName,
      EmailId: edit_EmailID,
      Department: edit_Department,
      Subdepartment: edit_Subdepartment,
      TotalLeaveAdded: edit_Leave,
    };

    const sp: SPFI = getSp();

    try {
      // Fetch the current list of users
      const existingUsers = await getDepartmentUserList();
      console.log(existingUsers);

      // Check if the email ID already exists and is not the current user's email
      const emailExists = existingUsers.some(
        (user: any) =>
          user.EmailId.toLowerCase() === edit_EmailID.toLowerCase() &&
          user.ID !== selecteditem
      );

      if (emailExists) {
        notification.error({
          message: "Error",
          description: "Email ID already exists.",
          placement: "top",
        });
        return; // Exit the function if email ID exists
      }

      // Update the user in the SharePoint list
      const response = await sp.web.lists
        .getByTitle("DepartmentUser")
        .items.getById(selecteditem)
        .update(updatedUser);
      notification.success({
        message: "Success",
        description: "User updated successfully",
        placement: "top",
      });
      console.log("User updated:", response);
    } catch (error) {
      console.error("Error updating user:", error);
      notification.error({
        message: "Error",
        description: "Failed to update user",
        placement: "top",
      });
    }

    setManageOpen(false);
    editForm.resetFields();

    const userList = await getDepartmentUserList();
    setUsers(userList);
    setDisableEditSubmit(false);
  };

  return (
    <div style={{ width: "99%" }}>
      <div>
        <div className={styles.DepartmentUser}>
          <span>Department User</span>
        </div>
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
                onSearch={_onFilter}
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
                      backgroundColor: "rgba(74, 173, 146, 1)",
                      color: "white",
                    }}
                    disabled={disableAddsubmit}
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

                  <Row gutter={24}>
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
                        <Select
                          placeholder="Select Department"
                          onChange={handleDepartmentChange}
                        >
                          {departments.map((dept: any) => (
                            <Option key={dept.ID} value={dept.Department}>
                              {dept.Department}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Sub Department"
                        name="Sub Department"
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
                        <Select
                          placeholder="Select Subdepartment"
                          disabled={!selectedDepartment}
                          onChange={handleSubdepartmentChange}
                        >
                          {subdepartments.map((sub: any) => (
                            <Option key={sub} value={sub}>
                              {sub}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Add Leave Balance"
                        name="Add Leave Balance"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please add leave balance!",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          onChange={handleadd_Leave}
                          value={add_Leave}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Drawer>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        {isEdited ? (
          <div>
            <Drawer
              title="Manage User"
              onClose={onManageClose}
              open={Manageopen}
              footer={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    htmlType="submit"
                    style={{
                      width: "149px",
                      backgroundColor: "rgba(74, 173, 146, 1)",
                      color: "white",
                    }}
                    disabled={disablesEditsubmit}
                    onClick={() => editForm.submit()} // Trigger the form submit manually
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => onManageClose()}
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
                  onFinish={() => handleeditUser()}
                  form={editForm}
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
                            message: "Please input your userName!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handledit_Username}
                          value={edit_UserName}
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
                            message: "Please input your mailId!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleedit_UserMailID}
                          value={edit_EmailID}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
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
                            message: "Please select your department!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select an option"
                          onChange={editDepartmentChange}
                          value={edit_Department}
                        >
                          {departments.map((dept: any) => (
                            <Option key={dept.ID} value={dept.Department}>
                              {dept.Department}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Sub Department"
                        name="Sub Department"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please select your subdepartment!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select an option"
                          onChange={editSubDepartmentChange}
                          value={edit_Subdepartment}
                          disabled={subdepartments.length == 0 ? true : false}
                        >
                          {subdepartments.map((subdept: any) => (
                            <Option key={subdept} value={subdept}>
                              {subdept}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label="Add Leave Balance"
                        name="Add Leave Balance"
                        style={{
                          maxWidth: 400,
                          marginTop: 17,
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please add leave balance!",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          onChange={handleedit_Leave}
                          value={edit_Leave}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Drawer>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : users}
        />
      </div>
    </div>
  );
}
