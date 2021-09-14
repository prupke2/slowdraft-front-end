import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import PubNub from 'pubnub'; // backend for chat component
import Widget from './Widget/Widget';
import { getDraft, getDBPlayers, getDBGoalies, getTeams, getForumPosts, getRules, checkForUpdates } from '../../util/requests';

export default function AppWrapper({setLoggedIn, logout, pub, sub, user, setUser,
  picks, setPicks, currentPick, setCurrentPick, draftingNow, setDraftingNow
 }) {

  const channel = "slowdraftChat" // To reset messages, update the channel name to something new
  // const channel = "test" // To reset messages, update the channel name to something new
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [goalies, setGoalies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rules, setRules] = useState([]);

  function getLatestData(draftOnly = false, optionalUserParam = null) {
    const userToCheck = optionalUserParam === null ? user : optionalUserParam;
    checkForUpdates(draftOnly, userToCheck, setPicks, setCurrentPick, setDraftingNow, setPlayers, setGoalies, 
      setTeams, setRules, setPosts, getDraft, getDBPlayers, getDBGoalies, getTeams, getRules, getForumPosts)
  }

  function sendChatAnnouncement(message) {
    let messageObject = {
      text: message,
      uuid: "***"
    };
    const pubnub = new PubNub({
      publishKey: pub,
      subscribeKey: sub,
      uuid: user.team_name
    });
    pubnub.publish({
      message: messageObject,
      channel: channel
    });
  }
  
  useEffect(() => {
    let user = localStorage.getItem('user');

    if (!user) {
      setLoggedIn(false);
    } else {
      setUser(JSON.parse(user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (user.user_id !== null) {
  //     getLatestData(true);
  //     const interval = setInterval(() => getLatestData(true), 60000); // ping server every minute for updates
  //     return () => {
  //       clearInterval(interval);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  return (
    <>      
      <Navbar 
        logout={logout}
        currentPick={currentPick}
        setCurrentPick={setCurrentPick}
        picks={picks}
        setPicks={setPicks}
        draftingNow={draftingNow}
        setDraftingNow={setDraftingNow}
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
        getLatestData={getLatestData}
      />
      <Widget 
        currentPick={currentPick}
        draftingNow={draftingNow}
        logout={logout}
        user={user}
      />
      <Chat 
        messages={messages}
        setMessages={setMessages}
        pub={pub}
        sub={sub}
        user={user}
        channel={channel}
        getLatestData={getLatestData}
      />
    </>
  );
}
