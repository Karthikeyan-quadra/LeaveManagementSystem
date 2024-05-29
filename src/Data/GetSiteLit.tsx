import "@pnp/sp/lists";
import { getSp } from "../Services/PnpConfig";
import { SPFI } from "@pnp/sp";

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
