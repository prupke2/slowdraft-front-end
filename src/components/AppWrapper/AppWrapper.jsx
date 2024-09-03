import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Widget from "./Widget/Widget";
import { checkForUpdates, getChatToken } from "../../util/requests";
import { useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LeagueSelector from "./LeagueSelector/LeagueSelector";
import { AblyProvider, ChannelProvider } from 'ably/react';
import Chat from "./Chat/Chat";

export default function AppWrapper({
  logout,
  setIsLoading,
  currentPick,
  setCurrentPick,
  draftingNow,
  setDraftingNow,
}) {
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  const leagueList = JSON.parse(localStorage.getItem("leagueList"));
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState("connecting");
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null)
  const [picks, setPicks] = useState([])
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // function getRegisteredLeagueCount() {
  //   let count = 0;
  //   leagueList.forEach((league) => {
  //     if (league.registered === true) {
  //       count += 1;
  //     }
  //   });
  //   return count;
  // }
  // const safeHealthCheck = useCallback(() => {
  //   healthCheck(setHealthStatus);
  // }, [
  //   setHealthStatus
  // ]);

  const teamsInLocalStorage = localStorage.getItem("teams");
  const [singleLeagueSelected, setSingleLeagueSelected] = useState(teamsInLocalStorage !== 'null')

  const getLatestData = useCallback(() => {
    checkForUpdates(
      setCurrentPick,
      setDraftingNow,
      setPicks,
      logout
    );
  }, [
    setCurrentPick,
    setDraftingNow,
    setPicks,
    logout
  ]);

  useEffect(() => {
    const chatToken = localStorage.getItem("chatToken");
    if (!chatToken || !chatClient) {
      getChatToken(setChatClient);
    }
  }, [chatClient]);

  useEffect(() => {
    if (isRegisteredLeague) {
      getLatestData();
    }
  }, [getLatestData, isRegisteredLeague]);

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
            currentPick={currentPick}
            setCurrentPick={setCurrentPick}
            picks={picks}
            setPicks={setPicks}
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            getLatestData={getLatestData}
            channel={channel}
          />
          { isUpdating && (
            <div className='isUpdatingBanner'>
                Updating...
            </div>
          )}
          <Widget
            isRegisteredLeague={isRegisteredLeague}
            draftingNow={draftingNow}
            logout={logout}
          />
          { chatClient && (
            <AblyProvider client={chatClient}>
              <ChannelProvider channelName={user.yahoo_league_id}>
                <Chat
                  chatStatus={chatStatus}
                  setChatStatus={setChatStatus}
                  setChannel={setChannel}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  getLatestData={getLatestData}
                  setIsUpdating={setIsUpdating}
                />
              </ChannelProvider>
            </AblyProvider>
          )}
        </>
      )}
    </>
  );
}
