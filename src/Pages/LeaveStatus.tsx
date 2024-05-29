import * as React from "react";
// import styles from "../webparts/leavemanagement/components/LeaveStatus/Leavestatus.module.scss";
import styles from "../Styles/Leavestatus.module.scss";
import { Card, Col, Layout, Row, Table, Tag } from "antd";
import { getLeaveRequestList } from "../Data/GetSiteLit";
import { useContext, useEffect, useState } from "react";
import * as moment from "moment";
import CountUp from "react-countup";
import { UserContext } from "../webparts/leavemanagement/components/Leavemanagement";
import Search from "antd/es/input/Search";

export default function LeaveStatus() {
  const [leaveData, setLeaveData] = useState([]);
  const envContext: any = useContext(UserContext);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // useEffect(() => {
  //   async function fetchLeaveData() {
  //     try {
  //       const leaveRequests = await getLeaveRequestList();
  //       const processedData: any = leaveRequests.map((request) => ({
  //         key: request.Id,
  //         from: moment(request.From).format("DD-MM-YYYY"), // Format From date
  //         to: moment(request.To).format("DD-MM-YYYY"), // Format To date
  //         numberOfDays: request.Numberofdays,
  //         leaveType: request.LeaveType,
  //         reason: request.Reason, // Include Reason
  //         status: request.Approved ? "Approved" : "Pending",
  //       }));
  //       setLeaveData(processedData);
  //     } catch (error) {
  //       console.error("Error fetching leave data:", error);
  //     }
  //   }

  //   fetchLeaveData();
  // }, []);
  useEffect(() => {
    fetchLeaveData();
    console.log(leaveData);
  }, [envContext.userEmail]);

  const fetchLeaveData = async () => {
    try {
      const leaveRequests = await getLeaveRequestList();
      const userLeaveRequests = leaveRequests.filter(
        (request) => request.EmailId === envContext.userEmail
      );
      const processedData: any = userLeaveRequests.map((request) => ({
        key: request.Id,
        from: moment.utc(request.From).format("DD-MM-YYYY"), // Format From date
        to: moment.utc(request.To).format("DD-MM-YYYY"), // Format To date
        numberOfDays: request.Numberofdays,
        leaveType: request.LeaveType,
        reason: request.Reason, // Include Reason
        status: request.Status,
      }));
      setLeaveData(processedData);

      const approved = processedData.filter(
        (request: any) => request.status === "Approved"
      );
      const rejected = processedData.filter(
        (request: any) => request.status === "Rejected"
      );
      const pending = processedData.filter(
        (request: any) => request.status === "Pending"
      );

      setApprovedCount(approved.length);
      setRejectedCount(rejected.length);
      setPendingCount(pending.length);
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
        item.status.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(text);
    console.log(text);
    console.log(filtered);
  };

  const columns = [
    {
      title: "From Date",
      dataIndex: "from",
    },
    {
      title: "To Date",
      dataIndex: "to",
    },
    {
      title: "No.of working days",
      dataIndex: "numberOfDays",
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      ellipsis: true, // Enable ellipsis for the Reason column
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: any) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "blue"
          }
          style={{ width: "80px", textAlign: "center", fontSize: "12px" }}
        >
          {status}
        </Tag>
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
