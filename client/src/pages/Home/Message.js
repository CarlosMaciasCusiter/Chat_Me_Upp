import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  console.log(sent);
  return (
    <OverlayTrigger
      placement={sent ? "right" : "left"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classNames("d-flex my-3", {
          "ms-auto": sent,
          "me-auto": received,
        })}
      >
        <div
          className={classNames("py-1 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p>{message.content}</p>
        </div>
      </div>
    </OverlayTrigger>
  );
}
