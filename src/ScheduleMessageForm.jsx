import React, {useEffect} from "react";
import "./schedule-message-form.css";
import CalendarDatePicker from "./CalendarDatePicker";

export default function ScheduleMessageForm({
  handleChange,
  inputText,
  setDateTimeSelected,
  scheduleMessage,
  setShowScheduleMessageForm,
  onClose,
}) {

  useEffect(() => { 
    var input = document.getElementById("message");
    console.log("inpout=", input);
    input.value = inputText;
    console.log("input text-", inputText);
  },[])

  return (
    <div className="bg-modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div
          className="add_suggested_task_close_btn"
          onClick={() => setShowScheduleMessageForm(false)}
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
          <CalendarDatePicker setDateTimeSelected={setDateTimeSelected} />
          <label htmlFor="messge">Update message:</label>
          <input type="text" id="message" name="message" onChange={handleChange}/>
          <button id="add_suggested_task_save_btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
