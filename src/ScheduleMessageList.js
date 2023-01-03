import React from "react";
import "./schedule-message-form.css";

export default function ScheduleMessageList({
  changeScheduledMessageText,
  changeScheduledMessageTime,
  setShowScheduleMessageForm,
  updateScheduledMessage,
  scheduledMessagesList,
  setShowScheduleMessageList,
  // onClose,
}) {
  return (
    <div className="bg-modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div
          className="add_suggested_task_close_btn"
          onClick={() => setShowScheduleMessageList(false)}
        >
          +
        </div>
        <h1>List of scheduled messages:</h1>
        <div className="scheduled-messages-wrap">
          <ul>
            {scheduledMessagesList.map((scheduledMessage) => (
              <div className="scheduled-message" key={scheduledMessage.scheduledInfo.scheduledMessageId}>
              <li >
                {scheduledMessage.message}
              </li>
              <button onClick={(e)=>changeScheduledMessageText(e,scheduledMessage)}>Change Message</button>
              <button onClick={(e)=>changeScheduledMessageTime(e,scheduledMessage)}>Change time</button>
              <button>Cancel</button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
