import React from "react";
import "./schedule-message-form.css";
import CalendarDatePicker from "./CalendarDatePicker";

export default function ScheduleMessageForm({ scheduleMessage, setShowForm }) {
  return (
    <div className="bg-modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div
          className="add_suggested_task_close_btn"
          onClick={() => setShowForm(false)}
        >
          +
        </div>
        <h3 id="suggestion-task-form-title">Schedule Message:</h3>
        <form
          id="add-poll-form"
          onSubmit={(e) => {
            scheduleMessage(e);
          }}
        >
          <CalendarDatePicker />
          <button id="add_suggested_task_save_btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
