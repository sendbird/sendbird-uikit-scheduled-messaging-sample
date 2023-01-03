import React from "react";
import "./schedule-message-form.css";

export default function ScheduleMessageList({
  updateScheduledMessage,
  scheduledMessagesList,
  setShowScheduleMessageList,
  cancelScheduledMessage
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
              <div
                className="scheduled-message"
                key={scheduledMessage.scheduledInfo.scheduledMessageId}
              >
                <li>{scheduledMessage.message}</li>
                <button
                  onClick={(e) => updateScheduledMessage(e, scheduledMessage)}
                >
                  Update
                </button>
                <button
                  onClick={() => cancelScheduledMessage(scheduledMessage)}
                >
                  Cancel
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
