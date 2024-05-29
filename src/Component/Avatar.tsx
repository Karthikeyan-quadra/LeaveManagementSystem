import * as React from "react";
import { Avatar, Tooltip } from "antd";

import { UserContext } from "../webparts/leavemanagement/components/Leavemanagement";

export interface IUserAvatarProps {}

export const UserAvatar: React.FunctionComponent<IUserAvatarProps> = (
  props: React.PropsWithChildren<IUserAvatarProps>
) => {
  const envContext: any = React.useContext(UserContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar
        src={`/_layouts/15/userphoto.aspx?size=S&username=${envContext.userEmail}`}
        size={46}
      />
      <div style={{ marginLeft: "10px" }}>
        <p style={{ marginBottom: "0px", fontSize: "18px", fontWeight: "600" }}>
          {envContext.userDisplayName.length > 15 ? (
            <Tooltip title={envContext.userDisplayName} placement="bottom">
              {envContext.userDisplayName.slice(0, 15) + "..."}
            </Tooltip>
          ) : (
            envContext.userDisplayName
          )}
        </p>
        <p style={{ marginTop: "0px" }}>
          {envContext.userEmail.length > 20 ? (
            <Tooltip title={envContext.userEmail} placement="bottom">
              {envContext.userEmail.slice(0, 20) + "..."}
            </Tooltip>
          ) : (
            envContext.userEmail
          )}
        </p>
      </div>
    </div>
  );
};
