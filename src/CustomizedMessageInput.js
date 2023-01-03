import React, { useState } from "react";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import { useChannelContext } from "@sendbird/uikit-react/Channel/context";
import ScheduleMessageForm from "./ScheduleMessageForm";
import ScheduleMessageList from "./ScheduleMessageList";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import dayjs from "dayjs";
import ScheduledStatus from "@sendbird/chat/groupChannel";

function CustomizedMessageInput({ appId, sb }) {
  const store = useSendbirdStateContext();
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(store);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(store);
  const channelStore = useChannelContext();
  const channel = channelStore?.currentGroupChannel;
  const disabled = channelStore?.disabled;
  const [inputText, setInputText] = useState("");
  const [showScheduleMessageForm, setShowScheduleMessageForm] = useState(false);
  const [showScheduleMessageList, setShowScheduleMessageList] = useState(false);
  const [scheduledMessagesList, setScheduledMessagesList] = useState([]);
  const [messageToUpdate, setmessageToUpdate] = useState(null);
  const isInputEmpty = inputText.length < 1;
  var today = new Date();
  const [dateTimeSelected, setDateTimeSelected] = React.useState(
    dayjs(`${today}`)
  );

  const checkSendUserMessage_ = (event) => {
    if (showScheduleMessageForm) {
      scheduleMessage();
    } else {
      const params = {};
      params.message = inputText;
      sendUserMessage(channel, params)
        .onSucceeded((message) => {
          console.log(message);
          setInputText("");
        })
        .onFailed((error) => {
          console.log(error.message);
        });
    }
  };

  const handleChange = (event) => {
    //Do we want to trigger scheduled messaging from input bar?
    if (event?.target?.value?.startsWith(`/schedule `)) {
      setInputText("");
      setShowScheduleMessageForm(true);
    } else {
      setInputText(event.target.value);
    }
  };

  const sendFileMessage_ = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      if (event.target.files[0].size > 1 * 1000 * 1000) {
        alert("Image size greater than 1 MB");
        return;
      }
      const params = {};
      params.file = event.target.files[0];
      sendFileMessage(channel, params)
        .onSucceeded((message) => {
          console.log(message);
          event.target.value = "";
        })
        .onFailed((error) => {
          console.log(error.stack);
        });
    }
  };

  async function scheduleMessage(e) {
    e.preventDefault();
    let unixTimestamp = dateTimeSelected.$d.getTime();
    if (messageToUpdate) {
      const params = {
        scheduledAt: unixTimestamp,
      };

      await channel.updateScheduledUserMessage(
        messageToUpdate.scheduledInfo.scheduledMessageId,
        params
      );
    } else {
      const params = {
        message: inputText,
        scheduledAt: unixTimestamp,
      };
      channel
        .createScheduledUserMessage(params)
        .onSucceeded((message) => {
          console.log("Create scheduled message successful");
        })
        .onFailed((err, message) => {
          console.log("Create scheduled message error:", err);
        });
    }
    setmessageToUpdate(null);
    setInputText("");
    setShowScheduleMessageForm(false);
  }

  async function loadScheduledMessages() {
    console.log("1. in loadScheduledMessages");
    setShowScheduleMessageList(true);
    const params = {
      channelUrl: channel.url,
      //only want the ones where the status is still pending
      //scheduledStatus: [ScheduledStatus.PENDING],
    };

    const scheduledMessageListQuery =
      sb.groupChannel.createScheduledMessageListQuery(params);
    const queriedScheduledMessages = await scheduledMessageListQuery.next();

    console.log("scheduled messages=", queriedScheduledMessages);
    setScheduledMessagesList(queriedScheduledMessages);
  }

  //function to update message -> on click of button, render input box? -> on submit, update msg
  async function changeScheduledMessageText(e, selectedMessage) {
    console.log(
      "1. changeScheduledMessageText; scheduled message=",
      selectedMessage
    );

    const params = {
      message: selectedMessage.message,
    };

    // await channel.updateScheduledUserMessage(
    //   selectedMessage.scheduledInfo.scheduledMessageId,
    //   params
    // );
  }

  async function changeScheduledMessageTime(e, selectedMessage) {
    setShowScheduleMessageList(false);
    setShowScheduleMessageForm(true);
    setmessageToUpdate(selectedMessage);
  }

  return (
    <div className="customized-message-input">
      {showScheduleMessageForm && (
        <ScheduleMessageForm
          setDateTimeSelected={setDateTimeSelected}
          scheduleMessage={scheduleMessage}
          setShowScheduleMessageForm={setShowScheduleMessageForm}
          onClose={() => {
            setShowScheduleMessageForm(false);
          }}
        />
      )}

      {showScheduleMessageList && (
        <ScheduleMessageList
          changeScheduledMessageText={changeScheduledMessageText}
          changeScheduledMessageTime={changeScheduledMessageTime}
          setShowScheduleMessageForm={setShowScheduleMessageForm}
          //updateScheduledMessage={updateScheduledMessage}
          scheduledMessagesList={scheduledMessagesList}
          setShowScheduleMessageList={setShowScheduleMessageList}
          onClose={() => {
            setShowScheduleMessageList(false);
          }}
        />
      )}

      <FormControl variant="outlined" disabled={disabled} fullWidth>
        <InputLabel htmlFor="customized-message-input">User Message</InputLabel>
        <OutlinedInput
          id="customized-message-input"
          type="txt"
          value={inputText}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              checkSendUserMessage_();
            }
          }}
          labelwidth={105}
          endAdornment={
            <InputAdornment position="end">
              {isInputEmpty ? (
                <div className="customized-message-input__file-container">
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    className={"display: none"}
                    onChange={sendFileMessage_}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      disabled={disabled}
                    >
                      <AttachFileIcon
                        color={disabled ? "disabled" : "primary"}
                      />
                    </IconButton>
                    <IconButton
                      disabled={disabled}
                      onClick={loadScheduledMessages}
                    >
                      <AccessTimeIcon color={"primary"} />
                    </IconButton>
                  </label>
                </div>
              ) : (
                <div>
                  <IconButton
                    disabled={disabled}
                    onClick={checkSendUserMessage_}
                  >
                    <SendIcon color={disabled ? "disabled" : "primary"} />
                  </IconButton>
                  <IconButton
                    disabled={disabled}
                    onClick={() => setShowScheduleMessageForm(true)}
                  >
                    <ScheduleSendIcon color={"primary"} />
                  </IconButton>
                </div>
              )}
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
}

export default CustomizedMessageInput;
