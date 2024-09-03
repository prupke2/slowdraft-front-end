import React, { useEffect, useState } from "react";
import Table from "../../../Table/Table";
import Loading from "../../../Loading/Loading";
import {
  getDraft,
  getDBPlayers,
  getTeams,
  offsetMilliseconds,
} from "../../../../util/requests";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
import { teamsMap, getHeaders, teamIdToKey, API_URL, } from "../../../../util/util";
import toast from "react-hot-toast";
import PlayerCell from "../PlayersTab/PlayerCell";
import NewDraftTab from "../AdminTab/NewDraftTab";
import CountdownTimer from "../../Widget/CountdownTimer/CountdownTimer";
import { pickUpdatedAnnouncement, publishToChat } from "../../Chat/ChatAnnouncements/ChatAnnouncements";
import teamLogos from "../../../../util/teamLogos";
// import { AddToHomepageModal } from "../../ModalWrapper/ModalWrappers";

export default function DraftTab({
  user,
  currentPick,
  setCurrentPick,
  picks,
  setPicks,
  draftingNow,
  setDraftingNow,
  getLatestData,
  channel,
}) {
  const isAdmin = user?.role === "admin";
  const teams = JSON.parse(localStorage.getItem("teams"));
  const draft = JSON.parse(localStorage.getItem("draftData"));
  // set to "=== true" to make it a boolean, since localStorage can only be kept as strings
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";
  const draftIsOver = localStorage.getItem("draftIsOver") === "true";
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  const [page, setPage] = useState(null);

  useEffect(() => {
    const localStoragePicks = JSON.parse(localStorage.getItem("picks"));
    if (localStoragePicks) {
      setPicks(localStoragePicks);
    } else {
      getDraft(setCurrentPick, setDraftingNow, setPicks);
    }
  }, [setDraftingNow, setCurrentPick, setPicks])

  // function updatePickLocalStorage(overallPick, newPickStatus) {
  //   const revisedPicks = picks;
  //   revisedPicks[[overallPick - 1]].disabled = newPickStatus === "disabled";
  //   setPicks(revisedPicks);
  //   localStorage.setItem("picks", JSON.stringify(revisedPicks));
  // }

  function updatePick(event, round, overallPick) {
    setPage(round - 1);
    const requestParams = {
      method: "POST",
      headers: getHeaders(),
    };
    if (event.target.value === "0") {
      requestParams.body = JSON.stringify({
        overall_pick: overallPick,
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
            const message = pickUpdatedAnnouncement(user.team_name, overallPick);
            publishToChat(channel, user, message);
            toast(`Pick ${overallPick} ${data.status}.`);
            getDraft(setCurrentPick, setDraftingNow, setPicks);
          } else {
            toast(`Error updating pick ${overallPick}.`);
          }
        });
    } else {
      requestParams.body = JSON.stringify({
        overall_pick: overallPick,
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
            const message = pickUpdatedAnnouncement(user.team_name, overallPick);
            publishToChat(channel, user, message);
            toast(`Pick ${overallPick} updated.`);
            getDraft(setCurrentPick, setDraftingNow, setPicks);
          } else {
            toast(`Error updating pick ${overallPick}.`);
          }
        }
      );
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
        const disabledPick = cell.row.original.disabled === true;
        const isCurrentPick = cell.value === currentPick.overall_pick;
        const showAdminFeatures = isAdmin && !usedPick;

        return (
          <div className='pick-column-wrapper'>
            <div 
              className={`pick-number ${isCurrentPick && 'current-pick'}`}
              title={isCurrentPick ? 'Current pick' : null}
            >{cell.value}</div>
            {showAdminFeatures && (
              <div className="admin-column" width="20px">
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
              )}
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
              src={`${teamLogos[row.value]}`}
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

    const localPlayerData = localStorage.getItem("playerDBData");
    const playerTeamData = localStorage.getItem("playerTeamData");
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
      {!isLoading && isRegisteredLeague && (
        <Table
          data={picks}
          columns={columns}
          tableState={tableState}
          defaultColumn="overall_pick"
          tableType="draftPicks"
          user={user}
          draftingNow={draftingNow}
          currentPick={currentPick}
          setCurrentPick={setCurrentPick}
          setDraftingNow={setDraftingNow}
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
