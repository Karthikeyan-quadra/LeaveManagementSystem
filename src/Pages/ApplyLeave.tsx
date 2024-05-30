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
  getTotalLeaveAddedFromDepartmentUser,
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

      // const formattedStartDate = startDate.format("DD-MM-YYYY");
      // const formattedEndDate = endDate.format("DD-MM-YYYY");
      // console.log("Formatted Start Date:", formattedStartDate);
      // console.log("Formatted End Date:", formattedEndDate);
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
        // if (currentDate.day() === 0 || currentDate.day() === 6) {
        //   numberOfDays--; // Exclude weekends
        // }
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

  const changeReason = (e: any) => {
    setReason(e.target.value);
    console.log(reason);
  };
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
  // const disableWeekends = (current: any) => {
  //   // Disable Saturdays and Sundays
  //   return current && (current.day() === 0 || current.day() === 6);
  // };
  const disableWeekends = (current: any) => {
    // Disable weekends and holidays
    return (
      current &&
      (current.day() === 0 ||
        current.day() === 6 ||
        holidays.some((holiday: any) => holiday.isSame(current, "day")))
    );
  };
  const saveRequest = async () => {
    setDisableSubmit(true);
    const newRequest = {
      From: startDate,
      To: endDate,
      Numberofdays: numberOfDays,
      LeaveType: leaveType,
      Reason: reason,
      EmailId: envContext.userEmail,
      Username: envContext.userDisplayName,

      Status: "Pending",
    };
    const sp: SPFI = getSp();
    try {
      // Add the new leave request to the SharePoint list
      const totalLeaveAdded = await getTotalLeaveAddedFromDepartmentUser(
        envContext.userEmail
      );

      const datainlist = await getLeaveRequestList();
      console.log(datainlist);
      const response = await sp.web.lists.getByTitle("LeaveRequest").items.add({
        ...newRequest,
        TotalLeaveAdded: totalLeaveAdded,
      });
      console.log("Leave request added:", response);
      openNotification();
    } catch (error) {
      console.error("Error adding leave request:", error);
    }
    form.resetFields();
    setNumberOfDays(null);
    setDisableSubmit(false);
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
                <CountUp start={0} duration={3} />
              </span>
            </div>

            <span className={styles.cardText}>Leaves Available</span>
          </Card>

          <Card className={styles.card2}>
            <div className={styles.colorBox2}>
              <span className={styles.colorBox2Number}>
                <CountUp start={0} duration={3} />
              </span>
            </div>
            <span className={styles.cardText}>Leaves Taken</span>
          </Card>

          <Card className={styles.card3}>
            <div className={styles.colorBox3}>
              <span className={styles.colorBox3Number}>
                <CountUp start={0} end={24} duration={3} />
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
