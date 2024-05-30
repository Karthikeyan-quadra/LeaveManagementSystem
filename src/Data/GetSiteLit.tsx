import "@pnp/sp/lists";
import { getSp } from "../Services/PnpConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/folders";
import "@pnp/sp/files";

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
