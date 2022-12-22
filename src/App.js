import "./App.css";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import CustomizedApp from "./CustomizedApp";
import "@sendbird/uikit-react/dist/index.css";
import SendbirdChat from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";

function App() {
  const APP_ID = process.env.REACT_APP_APP_ID;
  const USER_ID = process.env.REACT_APP_USER_ID;
  const NICKNAME = process.env.REACT_APP_NICKNAME;
  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
  const dayjs = require('dayjs')
  dayjs().format()
  
  const sb = SendbirdChat.init({
    appId: APP_ID,
    modules: [new GroupChannelModule()],
  });
  sb.connect(USER_ID, ACCESS_TOKEN);

  return (
    <div className="App">
      <SendbirdProvider
        appId={APP_ID}
        userId={USER_ID}
        nickname={NICKNAME}
        accessToken={ACCESS_TOKEN}
      >
        <CustomizedApp appId={APP_ID} userId={USER_ID} sb={sb}/>
      </SendbirdProvider>
    </div>
  );
}

export default App;
