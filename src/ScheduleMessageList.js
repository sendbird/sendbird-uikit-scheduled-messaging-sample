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
          className="close_btn"
          onClick={() => setShowScheduleMessageList(false)}
        >
          +
        </div>
        <h1 className="scheduled-messages-list-title">List of scheduled messages:</h1>
        <div className="scheduled-messages-container">
          <ul className="scheduled-messages-list">
            {scheduledMessagesList.map((scheduledMessage) => (
              <div
                className="scheduled-message-wrapper"
                key={scheduledMessage.scheduledInfo.scheduledMessageId}
              >
                <li id="scheduled-message">{scheduledMessage.message}</li>
                <button
                id="update_button"
                  onClick={(e) => updateScheduledMessage(e, scheduledMessage)}
                >
                  Update
                </button>
                <button
                id="cancel_button"
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
