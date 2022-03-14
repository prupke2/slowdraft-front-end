import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import PubNub from 'pubnub'; // backend for chat component
import Widget from './Widget/Widget';
import { checkForUpdates } from '../../util/requests';
import { localEnvironment } from '../../util/util';
import { useCallback } from 'react';

export default function AppWrapper({logout, pub, sub, user,
  picks, setPicks, currentPick, setCurrentPick, draftingNow, setDraftingNow
 }) {
  // You can reset the chat by updating the channel name to something new
  const channel = localEnvironment ? "test" : "slowdraftChat" 
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [goalies, setGoalies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rules, setRules] = useState([]);

  const getLatestData = useCallback(() => {
    checkForUpdates(setPicks, setCurrentPick, setDraftingNow, setPlayers, setGoalies, setTeams, setRules, setPosts)
  }, [setPlayers, setGoalies, setTeams, setRules, setPosts, setPicks, setCurrentPick, setDraftingNow]);

  function sendChatAnnouncement(message) {
    const messageObject = {
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
    if (user !== null) {
      console.log('getting data')
      getLatestData();
    }
  }, [user, getLatestData]);

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
        getLatestData={getLatestData}
      />
      <Widget 
        user={user}
        currentPick={currentPick}
        draftingNow={draftingNow}
        logout={logout}
      />
      {!localEnvironment &&      
        <Chat 
          messages={messages}
          setMessages={setMessages}
          pub={pub}
          sub={sub}
          user={user}
          channel={channel}
          getLatestData={getLatestData}
          sendChatAnnouncement={sendChatAnnouncement}
        />
      }
      </>
  );
}
