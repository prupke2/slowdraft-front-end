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
  const [draftingNow, setDraftingNow] = useState([]);
  // const draftingNow = (currentPick.user_id === userId) && (typeof(currentPick) !== 'undefined');
  const channel = "slowdraftChat" // To reset messages, update the channel name to something new
  const [messages, setMessages] = useState([]);
  const teamSessionData = localStorage.getItem('teamSessionData');
  const [players, setPlayers] = useState([]);
  const [goalies, setGoalies] = useState([]);

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
    // if (teamSessionData && (teamName === '' || !userId)) {
    //     console.log('setting userID')
    //     let data = JSON.parse(teamSessionData);
    //     setUserId(data.user_id);
    //     setTeamLogo(data.logo);
    //     setTeamName(data.team_name);
    //     setRole(data.role);
    //     setColor(data.color);
    //   }
    
    if ((teamName === '' || !userId || !teamLogo)) {
      fetch('/get_team_session')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        if (data) {       
          localStorage.setItem('teamSessionData', JSON.stringify(data))
          setUserId(data.user_id);
          setTeamLogo(data.logo);
          setTeamName(data.team_name);
          setRole(data.role);
          setColor(data.color);
        } else {
          setTeamLogo(dummyIcon);
        }
      });
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
        setDraftingNow(data.drafting_now);
        
        if (Date.parse(data.updates.latest_draft_update) > Date.parse(localStorage.getItem('draftDataUpdate'))) {
          console.log("Update draft data...");
          fetch('/get_draft')
          .then(res => res.json())
          .then(data => {
            localStorage.setItem('draftData', JSON.stringify(data))
            localStorage.setItem('draftDataUpdate', new Date())
    
            setPicks(data.picks);
            if (typeof(data.current_pick) !== 'undefined') {
              setCurrentPick(data.current_pick);
              if (currentPick.user_id === userId) {
                setDraftingNow(true);
              }
            }
          })
        }
        if (Date.parse(data.updates.latest_player_db_update) > Date.parse(localStorage.getItem('playerDBUpdate'))) {
          console.log("Update player DB data...");
          fetch('/get_db_players')
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
            }
            localStorage.setItem('playerDBData', JSON.stringify(data))
            localStorage.setItem('playerDBUpdate', new Date())
            setPlayers(data.players);
          })
        } 
        if (Date.parse(data.updates.latest_goalie_db_update) > Date.parse(localStorage.getItem('goalieDBUpdate'))) {
          console.log("Update goalie DB data...");
          fetch('/get_db_players?position=G')
          .then(res => res.json())
          .then(data => {
            localStorage.setItem('goalieDBData', JSON.stringify(data))
            localStorage.setItem('goalieDBUpdate', new Date())
            setGoalies(data.players);
          })
        } 
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
        setDraftingNow={setDraftingNow}
        userId={userId}
        teamName={teamName}
        sendChatAnnouncement={sendChatAnnouncement}
        players={players}
        setPlayers={setPlayers}
        goalies={goalies}
        setGoalies={setGoalies}
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
