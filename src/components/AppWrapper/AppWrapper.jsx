import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat/Chat";
import PubNub from "pubnub"; // backend for chat component
import Widget from "./Widget/Widget";
import { checkForUpdates } from "../../util/requests";
import { localEnvironment } from "../../util/util";
import { useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LeagueSelector from "./LeagueSelector/LeagueSelector";

export default function AppWrapper({
  logout,
  setIsLoading,
  pub,
  sub,
  user,
  picks,
  setPicks,
  currentPick,
  setCurrentPick,
  draftingNow,
  setDraftingNow,
}) {
  // You can reset the chat by updating the channel name to something new
  const channel = localEnvironment ? "test" : "slowdraftChat";
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [goalies, setGoalies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rules, setRules] = useState([]);
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  const leagueList = JSON.parse(localStorage.getItem("leagueList"));

  // function getRegisteredLeagueCount() {
  //   let count = 0;
  //   leagueList.forEach((league) => {
  //     if (league.registered === true) {
  //       count += 1;
  //     }
  //   });
  //   return count;
  // }

  // useEffect(() => {
  //   function activeEstateList() {
  //     const localStorageUser = localStorage.getItem('user')
  //     console.log(`localStorageUser: ${localStorageUser}`);

  //     if (localStorageUser !== 'null') {
  //       setSingleLeagueSelected(true);
  //     }
  //   }
  
  //   window.addEventListener('storage', activeEstateList)
  
  //   return () => {
  //     window.removeEventListener('storage', activeEstateList)
  //   }
  // }, [])

  const teamsInLocalStorage = localStorage.getItem("teams");
  const [singleLeagueSelected, setSingleLeagueSelected] = useState(teamsInLocalStorage !== 'null')

  const getLatestData = useCallback(() => {
    checkForUpdates(
      setPicks,
      setCurrentPick,
      setDraftingNow,
      setPlayers,
      setGoalies,
      setTeams,
      setRules,
      setPosts
    );
  }, [
    setPlayers,
    setGoalies,
    setTeams,
    setRules,
    setPosts,
    setPicks,
    setCurrentPick,
    setDraftingNow,
  ]);

  function sendChatAnnouncement(message) {
    const messageObject = {
      text: message,
      uuid: "***",
    };
    const pubnub = new PubNub({
      publishKey: pub,
      subscribeKey: sub,
      uuid: user.team_name,
    });
    pubnub.publish({
      message: messageObject,
      channel: channel,
    });
  }

  useEffect(() => {
    if (user !== null) {
      console.log("getting data");
      getLatestData();
    }
  }, [user, getLatestData]);

  return (
    <>
      {!singleLeagueSelected && (
        <Switch>
          <Route path="/league-select">
            <LeagueSelector
              leagueList={leagueList}
              setSingleLeagueSelected={setSingleLeagueSelected}
              logout={logout}
              setIsLoading={setIsLoading}
              setPicks={setPicks}
              setCurrentPick={setCurrentPick}
              setDraftingNow={setDraftingNow}
            />
          </Route>
          <Redirect to="/league-select" />
        </Switch>
      )}
      {singleLeagueSelected && (
        <>
          <Navbar
            isRegisteredLeague={isRegisteredLeague}
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
            isRegisteredLeague={isRegisteredLeague}
            user={user}
            currentPick={currentPick}
            draftingNow={draftingNow}
            logout={logout}
          />
          {!localEnvironment() && (
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
          )}
        </>
      )}
    </>
  );
}
