import React, { useEffect, useState } from "react";
import Table from "../../../Table/Table";
import Loading from "../../../Loading/Loading";
import {
  getDraft,
  getDBGoalies,
  getDBPlayers,
  getTeams,
  offsetMilliseconds,
} from "../../../../util/requests";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
import { teamsMap, getHeaders, teamIdToKey, API_URL, } from "../../../../util/util";
import { ToastsStore } from "react-toasts";
import PlayerCell from "../PlayersTab/PlayerCell";
import NewDraftTab from "../AdminTab/NewDraftTab";
import CountdownTimer from "../../Widget/CountdownTimer/CountdownTimer";
import { pickUpdatedAnnouncement } from "../../Chat/ChatAnnouncements/ChatAnnouncements";
// import { AddToHomepageModal } from "../../ModalWrapper/ModalWrappers";

export default function DraftTab({
  user,
  currentPick,
  setCurrentPick,
  draftingNow,
  setDraftingNow,
  getLatestData,
  ws,
  sendChatAnnouncement,
}) {
  const isAdmin = user?.role === "admin";
  const teams = JSON.parse(localStorage.getItem("teams"));
  const [picks, setPicks] = useState([]);
  const draft = JSON.parse(localStorage.getItem("draftData"));
  // set to "=== true" to make it a boolean, since localStorage can only be kept as strings
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";
  const draftIsOver = localStorage.getItem("draftIsOver") === "true";
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  const [page, setPage] = useState(null);

  // const isMobile = mobileCheck();
  // console.log(`isMobile: ${isMobile}`);

  useEffect(() => {
    const localStoragePicks = JSON.parse(localStorage.getItem("picks"));
    if (localStoragePicks) {
      setPicks(localStoragePicks);
    } else {
      getDraft(setCurrentPick, setDraftingNow);
    }
  }, [setDraftingNow, setCurrentPick, sendChatAnnouncement])

  function updatePick(event, round, overall_pick) {
    setPage(round - 1);
    const requestParams = {
      method: "POST",
      headers: getHeaders(),
    };
    if (event.target.value === "0") {
      requestParams.body = JSON.stringify({
        overall_pick: overall_pick,
      });
      fetch(`${API_URL}/update_pick_enablement`, requestParams)
        .then((response) => {
          if (!response.ok) {
            const error = (picks && picks.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === true) {
            const msg = pickUpdatedAnnouncement(user.team_name, overall_pick);

            ws.send(msg);
            sendChatAnnouncement(
              `The ${user.team_name} have updated pick ${overall_pick}.`
            );
            getDraft(setCurrentPick, setDraftingNow);
            setTimeout(function () {
              ToastsStore.success(`Pick ${overall_pick} ${data.status}.`);
            }, 200);
          } else {
            ToastsStore.error(`Error updating pick ${overall_pick}.`);
          }
        });
    } else {
      requestParams.body = JSON.stringify({
        overall_pick: overall_pick,
        team_key: teamIdToKey(event.target.value),
      });
      fetch(`${API_URL}/update_pick`, requestParams)
        .then((response) => {
          if (!response.ok) {
            const error = (picks && picks.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === true) {
            getDraft(setCurrentPick, setDraftingNow);
            const msg = pickUpdatedAnnouncement(user.team_name, overall_pick);
            console.log(`msg: ${msg}`);

            ws.send(msg);
            sendChatAnnouncement(
              `The ${user.team_name} have updated pick ${overall_pick}.`
            );
            setTimeout(function () {
              ToastsStore.success(`Pick ${overall_pick} updated.`);
            }, 200);
          } else {
            ToastsStore.error(`Error updating pick ${overall_pick}.`);
          }
        });
    }
  }

  const columns = [
    {
      Header: "Pick",
      accessor: "overall_pick",
      disableFilters: true,
      width: 10,
      sortDescFirst: false,
      disableSortBy: true,
      Cell: (cell) => {
        const usedPick = cell.row.original.draft_pick_timestamp !== null;
        const disabledPick = cell.row.original.disabled === 1;
        const isCurrentPick = cell.value === currentPick.overall_pick ;

        if (!isAdmin || usedPick) {
          return <div className={`pick-number ${isCurrentPick}`}>{cell.value}</div>
        }
        return (
          <div className="admin-column" width="20px">
            <div 
              className={`pick-number ${isCurrentPick && 'current-pick'}`}
              title={isCurrentPick && 'Current pick'}
            >{cell.value}</div>
            <select
              defaultValue={cell.row.original.yahoo_team_id}
              className="change-user-dropdown"
              onChange={(event) =>
                updatePick(
                  event,
                  cell.row.original.round,
                  cell.row.original.overall_pick
                )
              }
            >
              {!disabledPick && (
                <>
                  {teamsMap(teams)}
                  <option value={0}>DISABLE PICK</option>
                </>
              )}
              {disabledPick && (
                <>
                  <option value={null}>(DISABLED)</option>
                  <option value={0}>ENABLE PICK</option>
                </>
              )}
            </select>
          </div>
        );
      },
    },
    {
      Header: "User",
      accessor: "username",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => (
        <UsernameStyled
          username={cell.value}
          teamKey={cell.row.original.team_key}
        />
      ),
    },
    {
      Header: "Player",
      accessor: "player_name",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => {
        return (
          <PlayerCell 
            cell={cell} 
            // timestamp={cell.row.values.draft_pick_timestamp}
          />
        );
      },
    },
    {
      Header: "Team",
      accessor: "team",
      width: "30px",
      disableFilters: true,
      disableSortBy: true,
      Cell: (row) => (
        <div className="team-logo-container">
          {row.value && (
            <img
              className="teamLogo"
              src={`/teamLogos/${row.value}.png`}
              alt={row.value}
              title={row.value}
            />
          )}
        </div>
      ),
    },
    {
      Header: "Pos",
      accessor: "position",
      width: "30px",
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: (
        <div>
          {
            <span>
              Timestamp
              <span className="timezoneInWords">
                &nbsp; ({Intl.DateTimeFormat().resolvedOptions().timeZone || null})
              </span>
            </span>
          }
        </div>
      ),
      accessor: "draft_pick_timestamp",
      disableFilters: true,
      width: "50px",
      disableSortBy: true,
      Cell: (row) => (
        <div>
          {row.cell.row.values.draft_pick_timestamp && (
            <span className="draftPickTimestamp">
              {new Date(new Date(
                (row.cell.row.values.draft_pick_timestamp)
              ) - offsetMilliseconds).toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      accessor: "player_id",
    },
  ];
  const tableState = {
    hiddenColumns: ["player_id"],
    sortBy: [
      {
        id: "overall_pick",
        desc: false,
      },
    ],
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    let data = {};
    const currentPickData = JSON.parse(localStorage.getItem("currentPick"));
    if (currentPickData && user) {
      setCurrentPick(currentPickData);
      console.log("Using cached data");
      if (typeof currentPickData !== "undefined") {
        if (currentPickData.team_key === user.team_key) {
          setDraftingNow(true);
        }
      }
    }
    const localDraftData = JSON.parse(localStorage.getItem("draftData"));
    if (!localDraftData) {
      console.log("Getting new draft data");
      data = getDraft(setCurrentPick, setDraftingNow);
    }
    if (data) {
      if (typeof data.current_pick !== "undefined") {
        setCurrentPick(data.current_pick);
        if (currentPick && currentPick.team_key === user.team_key) {
          setDraftingNow(true);
        }
      }
    }
    setIsLoading(false);

    const localGoalieData = localStorage.getItem("goalieDBData");
    const localPlayerData = localStorage.getItem("playerDBData");
    const playerTeamData = localStorage.getItem("playerTeamData");
    if (!localGoalieData) {
      getDBGoalies();
    }
    if (!localPlayerData) {
      getDBPlayers();
    }
    if (!playerTeamData) {
      setTimeout(() => {
        getTeams();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loading text="Loading draft..." />}
      {/* {isMobile && (
        <AddToHomepageModal />
      )} */}
      {draftIsOver && <h2>This draft is over</h2>}
      {!isLiveDraft && !draftIsOver &&
        <CountdownTimer 
          draftCountdown
          expiryDate={draft?.draft_start_time_utc}
        />
      }
      {!isRegisteredLeague && <NewDraftTab />}
      {!isLoading && isRegisteredLeague && picks && (
        <Table
          data={picks}
          columns={columns}
          tableState={tableState}
          defaultColumn="overall_pick"
          tableType="draftPicks"
          user={user}
          draftingNow={draftingNow}
          currentPick={currentPick}
          setPicks={setPicks}
          setCurrentPick={setCurrentPick}
          setDraftingNow={setDraftingNow}
          sendChatAnnouncement={sendChatAnnouncement}
          defaultPage={page || currentPick?.round - 1 || 0}
          pageSize={12}
          isLiveDraft={isLiveDraft}
          paginationTop
          paginationBottom
        />
      )}
    </>
  );
}
