import * as React from "react";
import styles from "../Styles/Approver.module.scss";
import { Button, Card, Col, Layout, Row, Table, Tag, notification } from "antd";
import { getLeaveRequestList } from "../Data/GetSiteLit";
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
  const [originalLeaveAvailable, setOriginalLeaveAvailable] = useState<any>({});

  useEffect(() => {
    fetchLeaveData();
    console.log(leaveData);
  }, [envContext.userEmail]);

  const fetchLeaveData = async () => {
    try {
      const leaveRequests = await getLeaveRequestList();
      console.log("Fetched leave requests:", leaveRequests);
      const originalLeaveValues = leaveRequests.reduce((acc, request) => {
        acc[request.Id] =
          request.LeaveAvailable == null
            ? request.TotalLeaveAdded
            : request.LeaveAvailable;
        return acc;
      }, {});

      console.log("Original LeaveAvailable:", originalLeaveValues);
      setOriginalLeaveAvailable(originalLeaveValues);

      const processedData: any = leaveRequests.map((request) => {
        return {
          key: request.Id,
          from: moment.utc(request.From).format("DD-MM-YYYY"),
          to: moment.utc(request.To).format("DD-MM-YYYY"),
          numberOfDays: request.Numberofdays,
          leaveType: request.LeaveType,
          reason: request.Reason,
          status: request.Status,
          requester: request.Username,
          LeaveTaken: request.LeaveTaken == null ? 0 : request.LeaveTaken,
          TotalLeave: request.TotalLeaveAdded,
          LeaveAvailable:
            request.LeaveAvailable == null
              ? request.TotalLeaveAdded
              : request.LeaveAvailable,
        };
      });
      console.log("Processed data:", processedData);

      setLeaveData(processedData);
      console.log(processedData);
      console.log(leaveData);

      // const updateCountsAndFilteredData = (processedData: any[]) => {
      //   const pendingRequests = processedData.filter(
      //     (request: any) => request.status === "Pending"
      //   );
      //   const approved = processedData.filter(
      //     (request: any) => request.status === "Approved"
      //   );
      //   const rejected = processedData.filter(
      //     (request: any) => request.status === "Rejected"
      //   );

      //   setApprovedCount(approved.length);
      //   setRejectedCount(rejected.length);
      //   setPendingCount(pendingRequests.length);

      //   // Update filtered data if searchText is not empty
      //   // if (searchText) {
      //   //   const filtered = processedData.filter((item: any) => item.from.toLowerCase().includes(searchText.toLowerCase()) || item.to.toLowerCase().includes(searchText.toLowerCase()) || item.numberOfDays.toString().toLowerCase().includes(searchText.toLowerCase()) || item.leaveType.toLowerCase().includes(searchText.toLowerCase()) || item.reason.toLowerCase().includes(searchText.toLowerCase()) || item.requester.toLowerCase().includes(searchText.toLowerCase()) || item.status.toLowerCase().includes(searchText.toLowerCase()));
      //   //   setFilteredData(filtered);
      //   // }
      // };

      // updateCountsAndFilteredData(processedData);

      // const pendingRequests = processedData.filter(
      //   (request: any) => request.status === "Pending"
      // );
      // console.log(pendingRequests);

      // setLeaveData(pendingRequests);

      // const approved = processedData.filter(
      //   (request: any) => request.status === "Approved"
      // );
      // const rejected = processedData.filter(
      //   (request: any) => request.status === "Rejected"
      // );
      // const pending = processedData.filter(
      //   (request: any) => request.status === "Pending"
      // );

      // setApprovedCount(approved.length);
      // setRejectedCount(rejected.length);
      // setPendingCount(pending.length);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };
  const updateCountsAndFilteredData = (processedData: any[]) => {
    const pendingRequests = processedData.filter(
      (request: any) => request.status === "Pending"
    );
    const approved = processedData.filter(
      (request: any) => request.status === "Approved"
    );
    const rejected = processedData.filter(
      (request: any) => request.status === "Rejected"
    );

    setApprovedCount(approved.length);
    setRejectedCount(rejected.length);
    setPendingCount(pendingRequests.length);

    // Update filtered data if searchText is not empty
    if (searchText) {
      const filtered: any = processedData.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filtered);
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
          // src={require("../../Images/CheckMark.png")}
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
  //   setDisableApproveSubmit(true);
  //   console.log(value);

  //   const sp: SPFI = getSp();

  //   try {
  //     const originalLeave = originalLeaveAvailable[value.key];

  //     const updatedLeaveAvailable = originalLeave - value.numberOfDays;
  //     console.log(updatedLeaveAvailable);

  //     // Calculate new LeaveTaken after approval
  //     const updatedLeaveTaken = value.TotalLeave - updatedLeaveAvailable;
  //     console.log(updatedLeaveTaken);

  //     // Update LeaveAvailable and LeaveTaken in the same item
  //     await sp.web.lists
  //       .getByTitle("LeaveRequest")
  //       .items.getById(value.key)
  //       .update({
  //         Status: "Approved",
  //         LeaveAvailable: updatedLeaveAvailable,
  //         LeaveTaken: updatedLeaveTaken,
  //       });

  //     console.log(fetchLeaveData);
  //   } catch (error) {
  //     console.error("Error approving request:", error);
  //   }
  //   await fetchLeaveData();

  //   setDisableApproveSubmit(false);
  //   openApproveNotification();
  // };

  // const approveRequest = async (value: any) => {
  //   setDisableApproveSubmit(true);
  //   console.log(value);

  //   const sp: SPFI = getSp();

  //   try {
  //     const originalLeave = originalLeaveAvailable[value.key];
  //     const updatedLeaveAvailable = originalLeave - value.numberOfDays;
  //     const updatedLeaveTaken = value.TotalLeave - updatedLeaveAvailable;

  //     await sp.web.lists
  //       .getByTitle("LeaveRequest")
  //       .items.getById(value.key)
  //       .update({
  //         Status: "Approved",
  //         LeaveAvailable: updatedLeaveAvailable,
  //         LeaveTaken: updatedLeaveTaken,
  //       });

  //     await fetchLeaveData(); // Fetch updated data from server

  //     // Filter out the approved request from leaveData state
  //     setLeaveData((prevData) =>
  //       prevData.filter((item: any) => item.key !== value.key)
  //     );

  //     openApproveNotification();
  //   } catch (error) {
  //     console.error("Error approving request:", error);
  //   }
  //   setDisableApproveSubmit(false);
  // };

  // const rejectRequest = async (value: any) => {
  //   setDisableDenySubmit(true);
  //   console.log(value);

  //   const sp: SPFI = getSp();

  //   try {
  //     await sp.web.lists
  //       .getByTitle("LeaveRequest")
  //       .items.getById(value.key)
  //       .update({
  //         Status: "Rejected",
  //       });
  //     fetchLeaveData();
  //   } catch (error) {
  //     console.error("Error approving request:", error);
  //   }
  //   setDisableDenySubmit(false);

  //   openDeneiedNotification();
  // };

  // const rejectRequest = async (value: any) => {
  //   setDisableDenySubmit(true);
  //   console.log(value);

  //   const sp: SPFI = getSp();

  //   try {
  //     await sp.web.lists
  //       .getByTitle("LeaveRequest")
  //       .items.getById(value.key)
  //       .update({
  //         Status: "Rejected",
  //       });

  //     await fetchLeaveData(); // Fetch updated data from server

  //     // Filter out the rejected request from leaveData state
  //     setLeaveData((prevData) =>
  //       prevData.filter((item: any) => item.key !== value.key)
  //     );

  //     openDeneiedNotification();
  //   } catch (error) {
  //     console.error("Error rejecting request:", error);
  //   }
  //   setDisableDenySubmit(false);
  // };
  const approveRequest = async (value: any) => {
    setDisableApproveSubmit(true);

    try {
      const sp: SPFI = getSp();
      const originalLeave = originalLeaveAvailable[value.key];
      const updatedLeaveAvailable = originalLeave - value.numberOfDays;
      const updatedLeaveTaken = value.TotalLeave - updatedLeaveAvailable;

      await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.getById(value.key)
        .update({
          Status: "Approved",
          LeaveAvailable: updatedLeaveAvailable,
          LeaveTaken: updatedLeaveTaken,
        });

      // Fetch updated data from the server after approval
      const updatedLeaveRequests = await getLeaveRequestList();
      const processedData: any =
        updateCountsAndFilteredData(updatedLeaveRequests);

      setLeaveData(processedData);
      openApproveNotification();
    } catch (error) {
      console.error("Error approving request:", error);
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

      // Fetch updated data from the server after rejection
      const updatedLeaveRequests = await getLeaveRequestList();
      const processedData: any =
        updateCountsAndFilteredData(updatedLeaveRequests);

      setLeaveData(processedData);
      openDeneiedNotification();
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
    {
      title: "Leave Taken",
      dataIndex: "LeaveTaken",
      width: "11%",
      ellipsis: true,
    },
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
