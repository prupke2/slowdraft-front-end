import React, { useState, useRef } from "react";
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat/Chat";
import Widget from "./Widget/Widget";
import { checkForUpdates } from "../../util/requests";
import { useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LeagueSelector from "./LeagueSelector/LeagueSelector";
import { useEffect } from "react";

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
	const websocket = useRef(null);
  const ws = websocket.current;
  // function getRegisteredLeagueCount() {
  //   let count = 0;
  //   leagueList.forEach((league) => {
  //     if (league.registered === true) {
  //       count += 1;
  //     }
  //   });
  //   return count;
  // }


  const teamsInLocalStorage = localStorage.getItem("teams");
  const [singleLeagueSelected, setSingleLeagueSelected] = useState(teamsInLocalStorage !== 'null')

  const getLatestData = useCallback(() => {
    checkForUpdates(
      setCurrentPick,
      setDraftingNow,
    );
  }, [
    setCurrentPick,
    setDraftingNow,
  ]);

  function sendChatAnnouncement(message) {
    // const messageObject = {
    //   text: message,
    //   uuid: "***",
    // };
    // const pubnub = new PubNub({
    //   publishKey: pub,
    //   subscribeKey: sub,
    //   uuid: user.team_name,
    // });
    // pubnub.publish({
    //   message: messageObject,
    //   channel: channel,
    // });
  }

  // useEffect(() => {
  //   if (user !== null) {
  //     console.log("getting data");
  //     getLatestData();
  //   }
  // }, [user, getLatestData]);

  useEffect(() => {
    if (isRegisteredLeague) {
      console.log("getting data");
      const data = getLatestData();
      console.log(`data: ${JSON.stringify(data, null, 4)}`);
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
            draftingNow={draftingNow}
            setDraftingNow={setDraftingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            getLatestData={getLatestData}
            ws={ws}
          />
          <Widget
            isRegisteredLeague={isRegisteredLeague}
            draftingNow={draftingNow}
            logout={logout}
          />
          <Chat
            websocket={websocket}
            getLatestData={getLatestData}
          />
        </>
      )}
    </>
  );
}
