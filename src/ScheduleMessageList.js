import React from "react";
import "./schedule-message-form.css";

export default function ScheduleMessageList({ setShowScheduleMessageList, onClose }) {

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
      </div>
    </div>
  );
}
