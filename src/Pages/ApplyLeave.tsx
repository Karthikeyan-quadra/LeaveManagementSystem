import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Layout,
  Row,
  Select,
  notification,
} from "antd";
// import styles from "../webparts/leavemanagement/components/ApplyLeave/Leavemanagement.module.scss";
import styles from "../Styles/Leavemanagement.module.scss";
import * as React from "react";
import CountUp from "react-countup";
import { useForm } from "antd/es/form/Form";
import { useContext, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import { getSp } from "../Services/PnpConfig";
import { SPFI } from "@pnp/sp";
import {
  getLeaveRequestList,
  getHolidayList,
  updateLeaveRequestWithDepartment,
  getLeaveeList,
  getCurrentUserEmail,
} from "../Data/GetSiteLit";
import { UserContext } from "../webparts/leavemanagement/components/Leavemanagement";
import Calendar from "../Component/Calendar";
import * as dayjs from "dayjs";

export default function ApplyLeave() {
  const [form] = useForm(); // Access the form instance
  const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [leaveType, setLeaveType] = useState<string | null>(null);

  const [reason, setReason] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disablesubmit, setDisableSubmit] = useState(false);
  const { RangePicker } = DatePicker;
  const [holidays, setHolidays] = useState<any>([]);

  const [dateRange, setDateRange] = useState([null, null]);
  const [department, setDepartment] = useState<string>("");
  const [subdepartment, setSubdepartment] = useState<string>("");
  const [leavesAvailable, setLeavesAvailable] = useState(0);
  const [leavesTaken, setLeavesTaken] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [unpaidEnabled, setUnpaidEnabled] = useState(false);

  console.log(setDateRange);
  console.log(setErrorMessage);

  const envContext: any = useContext(UserContext);
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

  const handleRangeChange = (dates: any, dateStrings: any) => {
    if (dates !== null && dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);

      const formattedStartDate = startDate.format("DD-MM-YYYY");
      const formattedEndDate = endDate.format("DD-MM-YYYY");
      const isoStartDate = startDate.toISOString();
      const isoEndDate = endDate.toISOString();

      console.log("Formatted Start Date:", formattedStartDate);
      console.log("Formatted End Date:", formattedEndDate);
      console.log("Formatted Start Date:", isoStartDate);
      console.log("Formatted End Date:", isoEndDate);

      let numberOfDays = endDate.diff(startDate, "days") + 1;

      // Subtract weekends (Saturday and Sunday)
      let currentDate = startDate.clone();
      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, "day")
      ) {
        if (
          currentDate.day() === 0 ||
          currentDate.day() === 6 ||
          holidays.some((holiday: any) => holiday.isSame(currentDate, "day"))
        ) {
          numberOfDays--;
        }
        currentDate = currentDate.add(1, "day");
      }
      setNumberOfDays(numberOfDays);

      console.log("Number of Days (Excluding Weekends):", numberOfDays);

      setDateRange(dates);
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    }
  };

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  // useEffect(() => {
  //   const fetchDepartmentAndSubdepartment = async () => {
  //     try {
  //       const {
  //         department: fetchedDepartment,
  //         subdepartment: fetchedSubdepartment,
  //       } = await updateLeaveRequestWithDepartment(
  //         envContext.userEmail,
  //         department,
  //         subdepartment
  //       );
  //       setDepartment(fetchedDepartment);
  //       setSubdepartment(fetchedSubdepartment);
  //     } catch (error) {
  //       console.error("Error fetching department and subdepartment:", error);
  //     }
  //   };
  //   fetchDepartmentAndSubdepartment();
  // }, [envContext.userEmail, department, subdepartment]);

  const openNotification = () => {
    notification.info({
      message: (
        <span style={{ color: "green", fontWeight: "bold" }}>Submitted</span>
      ),
      description: "Leave request submitted successfully",
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

  useEffect(() => {
    const fetchHolidays = async () => {
      const holidayList = await getHolidayList();
      const holidayDates = holidayList.map((item: any) => dayjs(item.Date));
      setHolidays(holidayDates);
      console.log(holidayDates);
    };
    fetchHolidays();
  }, []);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const currentUserEmail = await getCurrentUserEmail(); // Fetch current user's email
        const leaveListData = await getLeaveeList(currentUserEmail); // Fetch leave data for the current user
        if (leaveListData.length === 0) {
          throw new Error("No leave data found for the user");
        }

        // Assuming the leave data structure contains fields like LeavesAvailable, LeavesTaken, TotalLeaves
        const { LeavesAvailable, LeavesTaken, TotalLeaves } = leaveListData[0];

        setLeavesAvailable(LeavesAvailable || 0);
        setLeavesTaken(LeavesTaken || 0);
        setTotalLeaves(TotalLeaves || 0);
        setUnpaidEnabled(LeavesAvailable === 0);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch leave data",
          placement: "top",
        });
      }
    };

    fetchLeaveData();
  }, []);
  const disableWeekends = (current: any) => {
    // Disable weekends and holidays
    return (
      current &&
      (current.day() === 0 ||
        current.day() === 6 ||
        holidays.some((holiday: any) => holiday.isSame(current, "day")))
    );
  };
  const changeReason = (e: any) => {
    setReason(e.target.value);
    console.log(reason);
  };
  const fetchExistingLeaveRequests = async (email: any) => {
    try {
      const sp = getSp();
      const leaveRequests = await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.filter(`EmailId eq '${email}'`)();
      return leaveRequests;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      return [];
    }
  };
  const checkForOverlappingDates = (
    startDate: any,
    endDate: any,
    existingRequests: any
  ) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return existingRequests.some((request: any) => {
      const requestStart = dayjs(request.From);
      const requestEnd = dayjs(request.To);

      // Check if the ranges overlap
      return (
        ((start.isSame(requestStart, "day") || start.isAfter(requestStart)) &&
          (start.isSame(requestEnd, "day") || start.isBefore(requestEnd))) ||
        ((end.isSame(requestStart, "day") || end.isAfter(requestStart)) &&
          (end.isSame(requestEnd, "day") || end.isBefore(requestEnd)))
      );
    });
  };

  const saveRequest = async () => {
    if (disablesubmit) return; // Prevent multiple submissions
    setDisableSubmit(true);

    try {
      const newRequest = {
        From: startDate,
        To: endDate,
        Numberofdays: numberOfDays,
        LeaveType: leaveType,
        Reason: reason,
        EmailId: envContext.userEmail,
        Username: envContext.userDisplayName,
        Status: "Pending",
        Department: department, // Add department
        Subdepartment: subdepartment, // Add subdepartment
      };
      const existingRequests = await fetchExistingLeaveRequests(
        envContext.userEmail
      );
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      if (checkForOverlappingDates(start, end, existingRequests)) {
        notification.error({
          message: "Error",
          description:
            "You have already applied for leave on the selected dates",
        });
        setDisableSubmit(false); // Enable submit button
        form.resetFields();
        return;
      }

      const sp: SPFI = getSp();
      const datainlist = await getLeaveRequestList();
      console.log(datainlist);

      // Add the new leave request
      const response = await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.add({
          ...newRequest,
        })
        .then(async (res) => {
          console.log(res);
          // Update department and subdepartment
          await updateLeaveRequestWithDepartment(
            res.ID,
            envContext.userEmail,
            department,
            subdepartment
          );
        });
      console.log("Leave request added:", response);

      openNotification();

      // Reset form and state variables
      form.resetFields();
      setNumberOfDays(null);
      setStartDate(null);
      setEndDate(null);
      setLeaveType(null);
      setReason(null);
    } catch (error) {
      console.error("Error adding leave request:", error);
    } finally {
      setDisableSubmit(false); // Enable submit button
    }
  };

  const changeLeaveType = (value: string) => {
    setLeaveType(value);
  };
  const onReset = () => {
    form.resetFields();
    setNumberOfDays(null);
  };

  return (
    <div className={styles.applyLeaveContainer}>
      <style> {styl}</style>
      <Layout>
        <div className={styles.cards}>
          <Card className={styles.card1}>
            <div className={styles.colorBox1}>
              <span className={styles.colorBox1Number}>
                <CountUp start={0} end={leavesAvailable} duration={3} />
              </span>
            </div>

            <span className={styles.cardText}>Leaves Available</span>
          </Card>

          <Card className={styles.card2}>
            <div className={styles.colorBox2}>
              <span className={styles.colorBox2Number}>
                <CountUp start={0} end={leavesTaken} duration={3} />
              </span>
            </div>
            <span className={styles.cardText}>Leaves Taken</span>
          </Card>

          <Card className={styles.card3}>
            <div className={styles.colorBox3}>
              <span className={styles.colorBox3Number}>
                <CountUp start={0} end={totalLeaves} duration={3} />
              </span>
            </div>
            <span className={styles.cardText}>Total Leaves</span>
          </Card>
        </div>
      </Layout>
      <Layout>
        <div className={styles.leaveRequest}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ marginTop: "20px" }}>
              <span className={styles.leaveRequestText}>
                Leave Request Application
              </span>
              <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={saveRequest}
                autoComplete="off"
                style={{
                  maxWidth: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "20px",
                }}
              >
                <Row>
                  <Col>
                    <Form.Item
                      label="Date Range"
                      name="DateRange"
                      rules={[
                        {
                          required: true,
                          message: "Please select date range!",
                        },
                      ]}
                      style={{ maxWidth: 400 }}
                    >
                      <RangePicker
                        disabledDate={disableWeekends}
                        style={{ width: "330px" }}
                        onChange={handleRangeChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Item
                      label="Number of working days selected"
                      name="Range"
                      style={{ maxWidth: 400 }}
                    >
                      <InputNumber
                        disabled
                        value={numberOfDays}
                        style={{ width: "330px" }}
                      />
                      {errorMessage && (
                        <p style={{ color: "red", margin: 0 }}>
                          {errorMessage}
                        </p>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Item
                      label="Leave Type"
                      name="Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select type of leave!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select an option"
                        onChange={changeLeaveType}
                        style={{ width: "330px" }}
                        value={leaveType}
                      >
                        <Select.Option value="Sick">Sick</Select.Option>
                        <Select.Option value="Casual">Casual</Select.Option>
                        <Select.Option value="Personal">Personal</Select.Option>
                        <Select.Option value="Compoff">
                          Compensatory off
                        </Select.Option>
                        <Select.Option value="Unpaid" disabled={!unpaidEnabled}>
                          Unpaid
                        </Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Item
                      label="Reason"
                      name="Reason"
                      style={{ maxWidth: 400 }}
                      rules={[
                        {
                          required: true,
                          message: "Please input you reason for leave!",
                        },
                      ]}
                    >
                      <TextArea
                        showCount
                        maxLength={300}
                        onChange={changeReason}
                        value={reason}
                        style={{ height: 120, resize: "none", width: "330px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        style={{
                          backgroundColor: "#20e87d",
                          color: "white",
                          width: "163px",
                        }}
                        disabled={disablesubmit}
                      >
                        Apply Leave
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button
                      onClick={onReset}
                      style={{
                        marginLeft: "5px",
                        width: "163px",
                        backgroundColor: "#ff6947",
                        color: "white",
                      }}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
            <div style={{ width: "50%" }}>
              <div style={{ marginTop: "20px" }}>
                <span className={styles.leaveRequestText}>
                  Holiday Calendar
                </span>
                <Calendar />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
