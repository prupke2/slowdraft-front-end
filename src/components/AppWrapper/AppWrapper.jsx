import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import dummyIcon from '../../assets/dummy_icon.png';
import PubNub from 'pubnub'; // backend for chat component
import Widget from './Widget/Widget';

export default function AppWrapper({logout, pub, sub}) {
  const [userId, setUserId] = useState(null);
  const [teamLogo, setTeamLogo] = useState(dummyIcon);
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('user');
  const [color, setColor] = useState('#ffffff');
  const [currentPick, setCurrentPick] = useState({user_id: null});
  const [picks, setPicks] = useState([]);
  const draftingNow = (currentPick.user_id === userId) && (typeof(currentPick) !== 'undefined');
  const channel = "test" // To reset messages, update the channel name to something new
  const [messages, setMessages] = useState([]);

  console.log("currentPick: " + JSON.stringify(currentPick, null, 4))
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
        setRole(data.role);
        setColor(data.color);
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
      if (!userId || teamName === '') {
        console.log("Getting userId")
        getYahooTeam();
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() =>
      fetch('/check_for_updates')
      .then(async response => {
        const now = new Date()
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        if (Date.parse(data.updates.latest_draft_update) > Date.parse(localStorage.getItem('draftDataUpdate'))) {
          console.log("Update draft data...");
          fetch('/get_draft')
          .then(res => res.json())
          .then(data => {
            // console.log("data: " + JSON.stringify(data, null, 4))
            localStorage.setItem('draftData', JSON.stringify(data))
            localStorage.setItem('draftDataUpdate', new Date())
    
            setPicks(data.picks);
            if (typeof(data.current_pick) !== 'undefined') {
              // setUserPickingNow(data.current_pick);
              // setPickExpiry(data.current_pick.pick_expires);
              setCurrentPick(data.current_pick);
            }
          })
        } 
        
        // if (Date.parse(data.updates.latest_team_update) > Date.parse(localStorage.getItem('teamsDataUpdate'))) {
        //   console.log("Update draft data...");
        //   fetch('/get_draft')
        //   .then(res => res.json())
        //   .then(data => {
        //     // console.log("data: " + JSON.stringify(data, null, 4))
        //     localStorage.setItem('teamsData', JSON.stringify(data))
        //     localStorage.setItem('teamsDataUpdate', new Date())
        //     }
        //   })
        // }

        console.log("data.latest_draft_update: " + data.updates.latest_draft_update);
        console.log("data update: " + data.updates.latest_draft_update + '  ' + Date.parse(data.updates.latest_draft_update));
        console.log("localStorage: " + localStorage.getItem('draftDataUpdate') + Date.parse(localStorage.getItem('draftDataUpdate')));
      })
      , 30000
    );
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <>      
      <Navbar 
        logout={logout}
        currentPick={currentPick}
        setCurrentPick={setCurrentPick}
        picks={picks}
        setPicks={setPicks}
        role={role}
        draftingNow={draftingNow}
        teamName={teamName}
        sendChatAnnouncement={sendChatAnnouncement}
      />
      <Widget 
        teamLogo={teamLogo}
        teamName={teamName}
        currentPick={currentPick}
        draftingNow={draftingNow}
        logout={logout}
      />
      <Chat 
        messages={messages}
        setMessages={setMessages}
        pub={pub}
        sub={sub}
        teamName={teamName}
        channel={channel}
        color={color}
      />
    </>
  );
}
