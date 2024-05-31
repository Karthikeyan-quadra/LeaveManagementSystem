import * as React from "react";
import styles from "../Styles/Approver.module.scss";
import { Button, Card, Col, Layout, Row, Table, Tag, notification } from "antd";
import {
  getLeaveRequestList,
  getLeaveList,
  getApproverDetails,
} from "../Data/GetSiteLit";
import { useContext, useEffect, useState } from "react";
import * as moment from "moment";
import CountUp from "react-countup";
import { UserContext } from "../webparts/leavemanagement/components/Leavemanagement";
import { SPFI } from "@pnp/sp";
import { getSp } from "../Services/PnpConfig";
import "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import Search from "antd/es/input/Search";

export default function Approver() {
  const [leaveData, setLeaveData] = useState([]);
  const envContext: any = useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [disableApprovesubmit, setDisableApproveSubmit] = useState(false);
  const [disableDenysubmit, setDisableDenySubmit] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaveData();
    console.log(leaveData);
  }, [envContext.userEmail]);

  // const fetchLeaveData = async () => {
  //   try {
  //     const leaveRequests = await getLeaveRequestList();
  //     console.log("Fetched leave requests:", leaveRequests);

  //     const leave = await getLeaveList();
  //     console.log("Leave List:", leave);

  //     const processedData: any = leaveRequests.map((request) => {
  //       // Find the corresponding leave record for the requester
  //       const userLeave = leave.find(
  //         (item) => item.EmailId === request.EmailId
  //       );
  //       const leaveType = request.LeaveType;

  //       const isCompoff = leaveType === "Compoff";
  //       let updatedLeavesAvailable = 0;
  //       let updatedLeavesTaken = 0;

  //       // Subtract from LeavesAvailable only if it's not "Compoff"
  //       if (!isCompoff && userLeave) {
  //         updatedLeavesAvailable =
  //           userLeave.LeavesAvailable - request.Numberofdays;
  //         updatedLeavesTaken = userLeave.TotalLeaves - updatedLeavesAvailable;
  //       }

  //       return {
  //         key: request.Id,
  //         from: moment.utc(request.From).format("DD-MM-YYYY"),
  //         to: moment.utc(request.To).format("DD-MM-YYYY"),
  //         numberOfDays: request.Numberofdays,
  //         leaveType: request.LeaveType,
  //         reason: request.Reason,
  //         status: request.Status,
  //         requester: request.Username,
  //         emailId: request.EmailId,
  //         LeaveAvailable: userLeave ? userLeave.LeavesAvailable : 0,
  //         LeavesTaken: userLeave ? userLeave.LeavesTaken : 0,
  //       };
  //     });

  //     setLeaveData(processedData);
  //     console.log(processedData);

  //     const pendingRequests = processedData.filter(
  //       (request: any) => request.status === "Pending"
  //     );
  //     const approvedRequests = processedData.filter(
  //       (request: any) => request.status === "Approved"
  //     );
  //     const rejectedRequests = processedData.filter(
  //       (request: any) => request.status === "Rejected"
  //     );

  //     setApprovedCount(approvedRequests.length);
  //     setRejectedCount(rejectedRequests.length);
  //     setPendingCount(pendingRequests.length);

  //     setLeaveData(pendingRequests);
  //   } catch (error) {
  //     console.error("Error fetching leave data:", error);
  //   }
  // };

  // const fetchLeaveData = async () => {
  //   try {
  //     // Fetch the details of the logged-in approver
  //     const approverDetails = await getApproverDetails(envContext.userEmail);

  //     const approverDepartment = approverDetails.department;
  //     const approverSubDepartment = approverDetails.subdepartment;
  //     console.log("approverDepartment:", approverDepartment);
  //     console.log("approverSubDepartment:", approverSubDepartment);

  //     const leaveRequests = await getLeaveRequestList();

  //     console.log("Fetched leave requests:", leaveRequests);

  //     const leave = await getLeaveList();
  //     console.log("Leave List:", leave);

  //     // Filter leave requests based on the department and subdepartment of the approver
  //     const filteredLeaveRequests = leaveRequests.filter((request) => {
  //       // Find the corresponding leave record for the requester
  //       const userLeave = leave.find(
  //         (item) => item.EmailId === request.EmailId
  //       );
  //       console.log(userLeave);
  //       if (userLeave) {
  //         return (
  //           userLeave.Department === approverDepartment &&
  //           userLeave.Subdepartment === approverSubDepartment &&
  //           request.Status === "Pending"
  //         );
  //       }
  //       return false;
  //     });
  //     console.log("filteredLeaveRequests:", filteredLeaveRequests);

  //     const processedData: any = filteredLeaveRequests.map((request) => {
  //       // Find the corresponding leave record for the requester
  //       const userLeave = leave.find(
  //         (item) => item.EmailId === request.EmailId
  //       );
  //       // const leaveType = request.LeaveType;

  //       // const isCompoff = leaveType === "Compoff";
  //       // let updatedLeavesAvailable = 0;
  //       // let updatedLeavesTaken = 0;

  //       // // // Subtract from LeavesAvailable only if it's not "Compoff"
  //       // // if (!isCompoff && userLeave) {
  //       // //   updatedLeavesAvailable =
  //       // //     userLeave.LeavesAvailable - request.Numberofdays;
  //       // //   updatedLeavesTaken = userLeave.TotalLeaves - updatedLeavesAvailable;
  //       // // }

  //       return {
  //         key: request.Id,
  //         from: moment.utc(request.From).format("DD-MM-YYYY"),
  //         to: moment.utc(request.To).format("DD-MM-YYYY"),
  //         numberOfDays: request.Numberofdays,
  //         leaveType: request.LeaveType,
  //         reason: request.Reason,
  //         status: request.Status,
  //         requester: request.Username,
  //         emailId: request.EmailId,
  //         LeaveAvailable: userLeave ? userLeave.LeavesAvailable : 0,
  //         LeavesTaken: userLeave ? userLeave.LeavesTaken : 0,
  //       };
  //     });

  //     setLeaveData(processedData);
  //     console.log(processedData);

  //     const pendingRequests = processedData.filter(
  //       (request: any) => request.status === "Pending"
  //     );
  //     const approvedRequests = processedData.filter(
  //       (request: any) => request.status === "Approved"
  //     );
  //     const rejectedRequests = processedData.filter(
  //       (request: any) => request.status === "Rejected"
  //     );

  //     setApprovedCount(approvedRequests.length);
  //     setRejectedCount(rejectedRequests.length);
  //     setPendingCount(pendingRequests.length);

  //     // setLeaveData(pendingRequests);
  //     setLeaveData(processedData);
  //     console.log(processedData);
  //   } catch (error) {
  //     console.error("Error fetching leave data:", error);
  //   }
  // };

  const fetchLeaveData = async () => {
    try {
      // Fetch the details of the logged-in approver
      const approverDetails = await getApproverDetails(envContext.userEmail);
      const approverDepartment = approverDetails.department;
      const approverSubDepartment = approverDetails.subdepartment;
      console.log("approverDepartment:", approverDepartment);
      console.log("approverSubDepartment:", approverSubDepartment);

      const leaveRequests = await getLeaveRequestList();
      console.log("Fetched leave requests:", leaveRequests);

      const leave = await getLeaveList();
      console.log("Leave List:", leave);

      // Filter leave requests based on the department and subdepartment of the approver
      // const filteredLeaveRequests = leaveRequests.filter((request) => {
      //   // Find the corresponding leave record for the requester
      //   const userLeave = leave.find(
      //     (item: any) => item.EmailId === request.EmailId
      //   );
      //   console.log(userLeave);
      //   if (userLeave) {
      //     return (
      //       userLeave.Department === approverDepartment &&
      //       userLeave.Subdepartment === approverSubDepartment &&
      //       request.Status === "Pending"
      //     );
      //   }
      //   return false;
      // });

      const filteredLeaveRequests = leaveRequests.filter((request) => {
        console.log(request);
        // Check if the request department and subdepartment match with the approver's department and subdepartment
        return (
          request.Department === approverDepartment &&
          request.Subdepartment === approverSubDepartment &&
          request.Status === "Pending"
        );
      });
      console.log("filteredLeaveRequests:", filteredLeaveRequests);

      // Debugging: Print out the details of leave requests before processing
      console.log(
        "Filtered Leave Requests Before Processing:",
        filteredLeaveRequests
      );

      const processedData: any = filteredLeaveRequests.map((request) => {
        // Find the corresponding leave record for the requester
        const userLeave = leave.find(
          (item) => item.EmailId === request.EmailId
        );
        console.log(userLeave);
        return {
          key: request.Id,
          from: moment.utc(request.From).format("DD-MM-YYYY"),
          to: moment.utc(request.To).format("DD-MM-YYYY"),
          numberOfDays: request.Numberofdays,
          leaveType: request.LeaveType,
          reason: request.Reason,
          status: request.Status,
          requester: request.Username,
          emailId: request.EmailId,
          LeaveAvailable: userLeave ? userLeave.LeavesAvailable : 0,
          LeavesTaken: userLeave ? userLeave.LeavesTaken : 0,
        };
      });

      setLeaveData(processedData);
      console.log(processedData);

      const pendingRequests = processedData.filter(
        (request: any) => request.status === "Pending"
      );
      const approvedRequests = processedData.filter(
        (request: any) => request.status === "Approved"
      );
      const rejectedRequests = processedData.filter(
        (request: any) => request.status === "Rejected"
      );

      setApprovedCount(approvedRequests.length);
      setRejectedCount(rejectedRequests.length);
      setPendingCount(pendingRequests.length);

      // setLeaveData(pendingRequests);
      setLeaveData(processedData);
      console.log(processedData);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const _onFilter = (text: any) => {
    const filtered: any = leaveData.filter(
      (item: any) =>
        item.from.toLowerCase().includes(text.toLowerCase()) ||
        item.to.toLowerCase().includes(text.toLowerCase()) ||
        item.numberOfDays
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase()) ||
        item.leaveType.toLowerCase().includes(text.toLowerCase()) ||
        item.reason.toLowerCase().includes(text.toLowerCase()) ||
        item.requester.toLowerCase().includes(text.toLowerCase()) ||
        item.status.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(text);
  };

  const openApproveNotification = () => {
    notification.info({
      message: (
        <span style={{ color: "green", fontWeight: "bold" }}>Approved</span>
      ),
      description: "Leave request approved successfully",
      placement: "top",
      icon: (
        <img
          src={require("../webparts/leavemanagement/Images/CheckMark.png")}
          alt="Success"
          style={{ width: "20%" }}
        />
      ),
    });
  };
  const openDeneiedNotification = () => {
    notification.info({
      message: <span style={{ fontWeight: "600", color: "red" }}>Denied</span>,
      description: "You have denied the request successfully",
      placement: "top",
      icon: (
        <img
          // src={require("../../Images/Cancel.png")}
          src={require("../webparts/leavemanagement/Images/Cancel.png")}
          alt="Cancel"
          style={{ width: "20%" }}
        />
      ),
    });
  };

  // const approveRequest = async (value: any) => {
  //   console.log(value);
  //   setDisableApproveSubmit(true);

  //   try {
  //     const sp: SPFI = getSp();

  //     console.log(`Approving request ID: ${value.key}`);

  //     // Fetch the current leave data for the user
  //     const leaveItems = await sp.web.lists
  //       .getByTitle("Leave")
  //       .items.filter(`EmailId eq '${value.emailId}'`)();

  //     if (leaveItems.length === 0) {
  //       throw new Error("Leave item not found for user");
  //     }
  //     console.log(leaveItems);
  //     const leaveItem = leaveItems[0];
  //     const updatedLeavesAvailable =
  //       leaveItem.LeavesAvailable - value.numberOfDays;
  //     const updatedLeavesTaken = leaveItem.TotalLeaves - updatedLeavesAvailable;
  //     console.log(updatedLeavesAvailable);

  //     // Update the LeaveRequest list
  //     await sp.web.lists
  //       .getByTitle("LeaveRequest")
  //       .items.getById(value.key)
  //       .update({
  //         Status: "Approved",
  //       });

  //     // Update the Leave list with the new LeavesAvailable value
  //     await sp.web.lists
  //       .getByTitle("Leave")
  //       .items.getById(leaveItem.ID)
  //       .update({
  //         LeavesAvailable: updatedLeavesAvailable,
  //         LeavesTaken: updatedLeavesTaken,
  //       });

  //     await fetchLeaveData();
  //     openApproveNotification();
  //   } catch (error) {
  //     console.error("Error approving request:", error);
  //     notification.error({
  //       message: "Error",
  //       description: `Failed to approve leave request: ${error.message}`,
  //     });
  //   }

  //   setDisableApproveSubmit(false);
  // };
  const approveRequest = async (value: any) => {
    console.log(value);
    setDisableApproveSubmit(true);

    try {
      const sp: SPFI = getSp();

      console.log(`Approving request ID: ${value.key}`);

      // Fetch the current leave data for the user
      const leaveItems = await sp.web.lists
        .getByTitle("Leave")
        .items.filter(`EmailId eq '${value.emailId}'`)();

      if (leaveItems.length === 0) {
        throw new Error("Leave item not found for user");
      }
      console.log(leaveItems);
      const leaveItem = leaveItems[0];
      console.log(leaveItem);
      const isCompOff = value.leaveType.toLowerCase() === "compoff";
      const isUnpaid = value.leaveType.toLowerCase() === "unpaid";

      let updatedLeavesAvailable = leaveItem.LeavesAvailable;
      let updatedLeavesTaken = leaveItem.TotalLeaves;
      console.log(updatedLeavesAvailable);
      console.log(updatedLeavesTaken);

      // Subtract from LeavesAvailable only if it's not "Compoff" or "Unpaid"
      if (!isCompOff || !isUnpaid) {
        updatedLeavesAvailable = updatedLeavesAvailable - value.numberOfDays;
        updatedLeavesTaken = updatedLeavesTaken - updatedLeavesAvailable;
        console.log(updatedLeavesAvailable);
        console.log(updatedLeavesTaken);
      }
      console.log(updatedLeavesAvailable);
      console.log(updatedLeavesTaken);
      // Update the LeaveRequest list
      await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.getById(value.key)
        .update({
          Status: "Approved",
        });

      // Update the Leave list with the new LeavesAvailable value
      await sp.web.lists
        .getByTitle("Leave")
        .items.getById(leaveItem.ID)
        .update({
          LeavesAvailable: updatedLeavesAvailable,
          LeavesTaken: updatedLeavesTaken,
        });

      await fetchLeaveData();
      openApproveNotification();
    } catch (error) {
      console.error("Error approving request:", error);
      notification.error({
        message: "Error",
        description: `Failed to approve leave request: ${error.message}`,
      });
    }

    setDisableApproveSubmit(false);
  };

  const rejectRequest = async (value: any) => {
    setDisableDenySubmit(true);

    try {
      const sp: SPFI = getSp();

      await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.getById(value.key)
        .update({
          Status: "Rejected",
        });

      await fetchLeaveData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }

    setDisableDenySubmit(false);
  };

  const columns = [
    {
      title: "From Date",
      dataIndex: "from",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "To Date",
      dataIndex: "to",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "No.of working days",
      dataIndex: "numberOfDays",
      width: "11%",
      ellipsis: true,
    },

    {
      title: "Leave Avaliable",
      dataIndex: "LeaveAvailable",
      width: "11%",
      ellipsis: true,
    },
    // {
    //   title: "Leave Taken",
    //   dataIndex: "LeavesTaken",
    //   width: "11%",
    //   ellipsis: true,
    // },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      ellipsis: true, // Enable ellipsis for the Reason column
    },
    {
      title: "Requester Name",
      dataIndex: "requester",
      ellipsis: true, // Enable ellipsis for the Reason column
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",

      render: (status: any) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "Status",
      render: (text: any, record: any) => (
        <div style={{ display: "flex" }}>
          <span>
            <Button
              onClick={() => approveRequest(record)}
              style={{
                color: "rgba(4, 173, 58, 1)",
                border: "1px solid rgba(14, 173, 58, 1)",
              }}
              disabled={disableApprovesubmit}
            >
              Approve
            </Button>
          </span>
          <span style={{ marginLeft: "5px" }}>
            <Button
              onClick={() => rejectRequest(record)}
              style={{
                color: "rgba(203, 68, 68, 1)",
                border: "1px solid rgba(203, 68, 68, 1)",
              }}
              disabled={disableDenysubmit}
            >
              X
            </Button>
          </span>
        </div>
      ),
    },
  ];
  const styl = `
  :where(.css-dev-only-do-not-override-17seli4).ant-card .ant-card-body {
    padding: 24px;
    border-radius: 0 0 8px 8px;
    display: flex;
}
:where(.css-17seli4).ant-card .ant-card-body {
  padding: 24px;
  border-radius: 0 0 8px 8px;
  display: flex;
}`;
  return (
    <div>
      <style> {styl}</style>

      <div className={styles.LeaveStatusContainer}>
        <Layout>
          <div className={styles.ApproverDashboard}>
            <span>Approver Dashboard</span>
          </div>
          <div className={styles.cards}>
            <Card className={styles.card1}>
              <div className={styles.colorBox1}>
                <span className={styles.colorBox1Number}>
                  <CountUp start={0} end={approvedCount} duration={2} />
                </span>
              </div>

              <span className={styles.cardText}>Approved</span>
            </Card>

            <Card className={styles.card2}>
              <div className={styles.colorBox2}>
                <span className={styles.colorBox2Number}>
                  <CountUp start={0} end={rejectedCount} duration={2} />
                </span>
              </div>
              <span className={styles.cardText}>Rejected</span>
            </Card>

            <Card className={styles.card3}>
              <div className={styles.colorBox3}>
                <span className={styles.colorBox3Number}>
                  <CountUp start={0} end={pendingCount} duration={2} />
                </span>
              </div>
              <span className={styles.cardText}>Pending</span>
            </Card>
          </div>
        </Layout>
      </div>
      <div className={styles.LeaveStatusTable}>
        <Layout>
          <div>
            <Row gutter={24}>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Search
                  placeholder="Search"
                  onSearch={_onFilter}
                  style={{ width: 300 }}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Table
              dataSource={searchText ? filteredData : leaveData}
              columns={columns}
            />
          </div>
        </Layout>
      </div>
    </div>
  );
}
