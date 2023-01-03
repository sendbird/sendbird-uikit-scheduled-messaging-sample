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
import { ScheduledStatus } from "@sendbird/chat/groupChannel";

function CustomizedMessageInput({ sb }) {
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
  const [scheduledMessagesCount, setScheduledMessagesCount] = useState(0);
  const [messageToUpdate, setMessageToUpdate] = useState(null);
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
    setInputText(event.target.value);
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
      let params;
      if (unixTimestamp) {
        console.log("unix timestamp valid!");
        params = {
          message: inputText,
          scheduledAt: unixTimestamp,
        };
      } else {
        params = {
          message: inputText,
        };
      }
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
    setMessageToUpdate(null);
    setInputText("");
    setShowScheduleMessageForm(false);
  }

  async function loadScheduledMessages() {
    setShowScheduleMessageList(true);
    const params = {
      channelUrl: channel.url,
      scheduledStatus: [ScheduledStatus.PENDING],
    };
    const scheduledMessageListQuery =
      sb.groupChannel.createScheduledMessageListQuery(params);
    const queriedScheduledMessages = await scheduledMessageListQuery.next();
    setScheduledMessagesList(queriedScheduledMessages);
    const countParams = {
      scheduledStatus: [ScheduledStatus.PENDING],
    };
    const totalScheduledMessageCount =
      await sb.groupChannel.getTotalScheduledMessageCount(countParams);
    setScheduledMessagesCount(totalScheduledMessageCount);
  }

  async function updateScheduledMessage(e, selectedMessage) {
    setShowScheduleMessageList(false);
    setShowScheduleMessageForm(true);
    setMessageToUpdate(selectedMessage);
    console.log(messageToUpdate);
    setInputText(selectedMessage.message);
  }

  async function cancelScheduledMessage(scheduledMessage) {
    await channel.cancelScheduledMessage(
      scheduledMessage.scheduledInfo.scheduledMessageId
    );
    loadScheduledMessages();
  }

  return (
    <div className="customized-message-input">
      {showScheduleMessageForm && (
        <ScheduleMessageForm
          handleChange={handleChange}
          inputText={inputText}
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
          scheduledMessagesCount={scheduledMessagesCount}
          updateScheduledMessage={updateScheduledMessage}
          scheduledMessagesList={scheduledMessagesList}
          setShowScheduleMessageList={setShowScheduleMessageList}
          cancelScheduledMessage={cancelScheduledMessage}
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
