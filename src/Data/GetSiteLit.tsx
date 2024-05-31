import "@pnp/sp/lists";
import { getSp } from "../Services/PnpConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { notification } from "antd";

export async function getLeaveList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("Leave").items();
  return items;
}

export async function getLeaveRequestList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("LeaveRequest").items();
  return items;
}

export async function getHolidayList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("HolidayList").items();
  return items;
}

export async function getApproverList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("ApproverList").items();
  return items;
}

export async function getDepartmentList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("DepartmentList").items();
  return items;
}
export async function getDepartmentUserList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("DepartmentUser").items();
  return items;
}

export async function getCurrentUserEmail() {
  const sp: SPFI = getSp();
  const user = await sp.web.currentUser();
  return user.Email;
}

export async function getTotalLeaveAddedFromDepartmentUser(
  email: string
): Promise<number> {
  const sp: SPFI = getSp();
  try {
    const items = await sp.web.lists
      .getByTitle("DepartmentUser")
      .items.filter(`EmailId eq '${email}'`)();
    if (items.length > 0) {
      return items[0].TotalLeaveAdded;
    } else {
      throw new Error("User not found in DepartmentUser list");
    }
  } catch (error) {
    console.error(
      "Error fetching TotalLeaveAdded from DepartmentUser list:",
      error
    );
    throw error;
  }
}

export async function updateLeaveList(email: string, totalLeaves: number) {
  const sp: SPFI = getSp();
  try {
    // Fetch the current list of leave items
    const existingLeaves = await sp.web.lists
      .getByTitle("Leave")
      .items.filter(`EmailId eq '${email}'`)();

    if (existingLeaves.length > 0) {
      // Update the leave item
      await sp.web.lists
        .getByTitle("Leave")
        .items.getById(existingLeaves[0].ID)
        .update({
          TotalLeaves: totalLeaves,
          LeavesAvailable: totalLeaves,
        });
    } else {
      let initialLeave: number = 0;
      // Add a new leave item
      await sp.web.lists.getByTitle("Leave").items.add({
        EmailId: email,
        TotalLeaves: totalLeaves,
        LeavesAvailable: totalLeaves,
        LeavesTaken: initialLeave,
      });
    }
  } catch (error) {
    console.error("Error updating Leave list:", error);
    notification.error({
      message: "Error",
      description: "Failed to update Leave list",
    });
  }
}

export async function updateLeaveRequestWithDepartment(
  id: number,
  email: string,
  department: string,
  subdepartment: string
): Promise<{ department: string; subdepartment: string }> {
  const sp: SPFI = getSp();
  try {
    // Fetch department and subdepartment information from DepartmentUser list
    const departmentUser = await sp.web.lists
      .getByTitle("DepartmentUser")
      .items.filter(`EmailId eq '${email}'`)();

    if (departmentUser.length > 0) {
      const department = departmentUser[0].Department || "";
      const subdepartment = departmentUser[0].Subdepartment || "";

      // Fetch leave requests for the given email ID
      const leaveRequests = await sp.web.lists
        .getByTitle("LeaveRequest")
        .items.filter(`EmailId eq '${email}'`)();

      await sp.web.lists.getByTitle("LeaveRequest").items.getById(id).update({
        Department: department,
        Subdepartment: subdepartment,
      });

      return { department, subdepartment }; // Return the updated values
    } else {
      throw new Error("User not found in DepartmentUser list");
    }
  } catch (error) {
    console.error("Error updating LeaveRequest list with department:", error);
    notification.error({
      message: "Error",
      description: "Failed to update LeaveRequest list with department",
    });
    throw error;
  }
}

export async function getLeaveeList(email: any) {
  const sp: SPFI = getSp();
  try {
    // Filter leave items based on the current user's email
    const items = await sp.web.lists
      .getByTitle("Leave")
      .items.filter(`EmailId eq '${email}'`)();
    return items;
  } catch (error) {
    console.error("Error fetching leave list:", error);
    notification.error({
      message: "Error",
      description: "Failed to fetch leave list",
    });
    throw error;
  }
}

export async function getApproverDetails(email: string) {
  const sp: SPFI = getSp();
  try {
    // Fetch the details of the approver based on their email
    const approverDetails = await sp.web.lists
      .getByTitle("ApproverList")
      .items.filter(`EmailId eq '${email}'`)();

    if (approverDetails.length > 0) {
      // Return the department and subdepartment details of the approver
      return {
        department: approverDetails[0].Department,
        subdepartment: approverDetails[0].Subdepartment,
      };
    } else {
      throw new Error("Approver not found in ApproverList");
    }
  } catch (error) {
    console.error("Error fetching approver details:", error);
    notification.error({
      message: "Error",
      description: "Failed to fetch approver details",
    });
    throw error;
  }
}

export async function getApproverLeaveRequests(email: string) {
  const sp: SPFI = getSp();
  try {
    // Fetch the details of the approver based on their email
    const approverDetails = await getApproverDetails(email);

    // Fetch leave requests where department and subdepartment match with the approver's details
    const leaveRequests = await sp.web.lists
      .getByTitle("LeaveRequest")
      .items.filter(
        `Department eq '${approverDetails.department}' and Subdepartment eq '${approverDetails.subdepartment}'`
      )();

    return leaveRequests;
  } catch (error) {
    console.error("Error fetching approver leave requests:", error);
    notification.error({
      message: "Error",
      description: "Failed to fetch approver leave requests",
    });
    throw error;
  }
}

export async function getHRList() {
  const sp: SPFI = getSp();
  const items: any[] = await sp.web.lists.getByTitle("HRAdmin").items();
  return items;
}
