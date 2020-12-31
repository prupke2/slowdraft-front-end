import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import dummyIcon from '../../assets/dummy_icon.png';
import Logo from './Navbar/Logo';
import NextPick from './NextPick/NextPick';
import PubNub from 'pubnub'; // backend for chat component

export default function AppWrapper({logout, pub, sub}) {
  const [userId, setUserId] = useState(null);
  const [teamLogo, setTeamLogo] = useState(dummyIcon);
  const [teamName, setTeamName] = useState('');
  const [userPickingNow, setUserPickingNow] = useState({user_id: null});
  const [pickExpiry, setPickExpiry] = useState(null);
  const draftingNow = (userPickingNow.user_id === userId) && (typeof(userPickingNow) !== 'undefined');
  const channel = "test" // To reset messages, update the channel name to something new
  const [messages, setMessages] = useState([]);

  function getYahooTeam() {
    fetch('/get_team_session')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setUserId(data.user_id);
        setTeamLogo(data.logo);
        setTeamName(data.team_name);
      });
  }

  function sendChatAnnouncement(message) {
    let messageObject = {
      text: message,
      uuid: "***"
    };
    const pubnub = new PubNub({
      publishKey: pub,
      subscribeKey: sub,
      uuid: teamName
    });
    pubnub.publish({
      message: messageObject,
      channel: channel
    });
  }
  
  useEffect(() => {
    if (localStorage.getItem( 'yahooSession' ) !== true) {
      if (!userId) {
        console.log("Getting userId")
        getYahooTeam();
      }
    }
  }, []);

  return (
    <>      
      <Navbar 
        logout={logout}
        setUserPickingNow={setUserPickingNow}
        setPickExpiry={setPickExpiry}
        draftingNow={draftingNow}
        teamName={teamName}
        sendChatAnnouncement={sendChatAnnouncement}
      />
      <Logo 
        teamLogo={teamLogo}
        teamName={teamName}
      />
      <NextPick 
        userPickingNow={userPickingNow}
        pickExpiry={pickExpiry}
        draftingNow={draftingNow}
      />
      <Chat 
        messages={messages}
        setMessages={setMessages}
        pub={pub}
        sub={sub}
        teamName={teamName}
        channel={channel}
      />
    </>
  );
}
