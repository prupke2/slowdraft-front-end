import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import PubNub from 'pubnub'; // backend for chat component
import Widget from './Widget/Widget';
import { getDraft, getDBPlayers, getDBGoalies, getTeams } from '../../util/requests';
// import { getTeamSession } from '../../util/requests';

export default function AppWrapper({setLoggedIn, logout, pub, sub,
  user, setUser, teamName, color
}) {

  const [currentPick, setCurrentPick] = useState({user_id: null});
  const [picks, setPicks] = useState([]);
  const [draftingNow, setDraftingNow] = useState([]);
  // const draftingNow = (currentPick.user_id === userId) && (typeof(currentPick) !== 'undefined');
  const channel = "slowdraftChat" // To reset messages, update the channel name to something new
  // const channel = "test" // To reset messages, update the channel name to something new
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [goalies, setGoalies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rules, setRules] = useState([]);

  // const teamSessionData = localStorage.getItem('teamSessionData');
  // const teamJson = teamSessionData ? JSON.parse(teamSessionData) : null;

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
    let user = localStorage.getItem('user');

    if (!user) {
      setLoggedIn(false);
    } else {
      setUser(JSON.parse(user));
    }
    
    // if (user) {
    //   console.log("user: " + user);
    //   console.log("user: " + JSON.stringify(user, null, 4))
    //   // let data = JSON.parse(user);
    //   console.log("Setting user with localStorage: " + JSON.stringify(data, null, 4))

    //   // setUserId(data.user_id);	
    //   // setTeamLogo(data.logo);	
    //   // setTeamName(data.team_name);	
    //   // setRole(data.role);	
    //   // setColor(data.color);
    //   // setLeagueId(data.league_id);
    // }

  }, []);

  useEffect(() => {
    // const localUser = localStorage.getItem('user');
    // const user = localUser ? JSON.parse(localUser) : null;

    if (user) {
      const interval = setInterval(() =>
        fetch(`/check_for_updates/${user.user_id}/${user.league_id}`)
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
            getDraft(user, setPicks, currentPick, setCurrentPick, setDraftingNow);
          }
          if (Date.parse(data.updates.latest_player_db_update) > Date.parse(localStorage.getItem('playerDBUpdate'))) {
            console.log("Update player DB data...");
            getDBPlayers(user, setPlayers);
          } 
          if (Date.parse(data.updates.latest_goalie_db_update) > Date.parse(localStorage.getItem('goalieDBUpdate'))) {
            console.log("Update goalie DB data...");
            getDBGoalies(user, setGoalies);
          }
          if (Date.parse(data.updates.latest_team_update) > Date.parse(localStorage.getItem('teamDataUpdate'))) {
            console.log("Update team data...");
            getTeams(user, setTeams)
          }
          if (Date.parse(data.updates.latest_rules_update) > Date.parse(localStorage.getItem('rulesUpdate'))) {
            console.log("Update rules data...");
            getTeams(user, setRules)
          }
          if (Date.parse(data.updates.latest_forum_update) > Date.parse(localStorage.getItem('forumUpdate'))) {
            console.log("Update forum data...");
            getTeams(user, setPosts);
          }

        })
        , 30000
      );
      return () => {
        clearInterval(interval);
      }
    }
  
  }, [user]);

  return (
    <>      
      <Navbar 
        logout={logout}
        currentPick={currentPick}
        setCurrentPick={setCurrentPick}
        picks={picks}
        setPicks={setPicks}
        // role={role}
        draftingNow={draftingNow}
        setDraftingNow={setDraftingNow}
        // userId={userId}
        // teamName={teamName}
        sendChatAnnouncement={sendChatAnnouncement}
        players={players}
        setPlayers={setPlayers}
        goalies={goalies}
        setGoalies={setGoalies}
        teams={teams}
        setTeams={setTeams}
        posts={posts}
        setPosts={setPosts}
        rules={rules}
        setRules={setRules}
        user={user}
        setUser={setUser}
      />
      <Widget 
        currentPick={currentPick}
        logout={logout}
        user={user}
      />
      <Chat 
        messages={messages}
        setMessages={setMessages}
        pub={pub}
        sub={sub}
        user={user}
        teamName={teamName}
        channel={channel}
      />
    </>
  );
}
