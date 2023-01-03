import React, { useEffect } from "react";
import "./schedule-message-form.css";
import CalendarDatePicker from "./CalendarDatePicker";

export default function ScheduleMessageForm({
  handleChange,
  inputText,
  setDateTimeSelected,
  scheduleMessage,
  setShowScheduleMessageForm
}) {
  useEffect(() => {
    var input = document.getElementById("message-input");
    input.value = inputText;
  }, []);

  return (
    <div className="bg-modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div
          className="close_btn"
          onClick={() => setShowScheduleMessageForm(false)}
        >
          +
        </div>
        <h3 id="schedule-message-form-title">Schedule Message:</h3>
        <form
          id="schedule-message-form"
          onSubmit={(e) => {
            scheduleMessage(e);
          }}
        >  
          <div className="message-input-wrapper">
            <label htmlFor="messge" id="input-label">Message:</label>
            <input
              type="text"
              id="message-input"
              name="message"
              onChange={handleChange}
            />
          </div>
          <CalendarDatePicker setDateTimeSelected={setDateTimeSelected} />
          <button id="save_btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
