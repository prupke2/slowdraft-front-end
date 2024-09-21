import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Widget from "./Widget/Widget";
import { checkForUpdates, getChatTokenAndSetChatClient, setChatClientWithToken } from "../../util/requests";
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
  const isMobileUser = window.screen.availWidth <= 800;

  const leagueList = JSON.parse(localStorage.getItem("leagueList"));
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState("connecting");
  const [chatClient, setChatClient] = useState(null);
  const [chatOpen, setChatOpen] = useState(!isMobileUser);
  const [channel, setChannel] = useState(null)
  const [picks, setPicks] = useState([])
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (draftingNow) {
      link.href = 'https://slowdraft.vercel.app/hockey_icon_drafting.ico';
    } else {
      link.href = 'https://slowdraft.vercel.app/hockey_icon.ico';
    }
  }, [draftingNow]);

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
      setIsUpdating,
      logout
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let chatToken = localStorage.getItem("chatToken");
    if (!chatClient && chatToken) {
      setChatClientWithToken(chatToken, setChatClient);
    }
    if (!chatToken) {
      getChatTokenAndSetChatClient(setChatClient);
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
            useWideScreen={!chatOpen && !isMobileUser}
            channel={channel}
          />
          { isUpdating && (
            <span className='isUpdatingBanner'>
              Updating...
            </span>
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
                  chatOpen={chatOpen}
                  setChatOpen={setChatOpen}
                />
              </ChannelProvider>
            </AblyProvider>
          )}
        </>
      )}
    </>
  );
}
