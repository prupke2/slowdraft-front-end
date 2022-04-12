import React, { useEffect, useState } from "react";
import Table from "../../../Table/Table";
import Loading from "../../../Loading/Loading";
import {
  getDraft,
  getDBGoalies,
  getDBPlayers,
  getTeams,
} from "../../../../util/requests";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
import { teamsMap, getHeaders, teamIdToKey } from "../../../../util/util";
import { ToastsStore } from "react-toasts";
import PlayerCell from "../PlayersTab/PlayerCell";
import NewDraftTab from "../AdminTab/NewDraftTab";

export default function DraftTab({
  user,
  currentPick,
  setCurrentPick,
  picks,
  setPicks,
  setTeams,
  setPlayers,
  setGoalies,
  draftingNow,
  setDraftingNow,
  getLatestData,
  sendChatAnnouncement,
  setUpdateTab,
}) {
  const isAdmin = user.role === "admin";
  const teams = JSON.parse(localStorage.getItem("teams"));

  // set to "=== true" to make it a boolean, since localStorage can only be kept as strings
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";
  const isRegisteredLeague =
    localStorage.getItem("registeredLeague") === "true";
  const [page, setPage] = useState(null);

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
      fetch("/update_pick_enablement", requestParams)
        .then((response) => {
          if (!response.ok) {
            const error = (picks && picks.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === true) {
            sendChatAnnouncement(
              `The ${user.team_name} have updated pick ${overall_pick}.`
            );
            getDraft(setPicks, setCurrentPick, setDraftingNow);
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
      fetch("/update_pick", requestParams)
        .then((response) => {
          if (!response.ok) {
            const error = (picks && picks.message) || response.status;
            return Promise.reject(error);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === true) {
            sendChatAnnouncement(
              `The ${user.team_name} have updated pick ${overall_pick}.`
            );
            getDraft(setPicks, setCurrentPick, setDraftingNow);
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
        const unusedPick = cell.row.original.draft_pick_timestamp === null;
        const disabledPick = cell.row.original.disabled === 1;

        if (!isAdmin || !unusedPick || !isLiveDraft) {
          return cell.value;
        }
        return (
          <div className="admin-column" width="20px">
            <div>{cell.value}</div>
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
          color={cell.row.original.color}
          teamId={cell.row.original.yahoo_team_id}
          setUpdateTab={setUpdateTab}
        />
      ),
    },
    {
      Header: "Player",
      accessor: "player_name",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => {
        return <PlayerCell cell={cell} draftingNow={draftingNow} />;
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
                &nbsp; ({Intl.DateTimeFormat().resolvedOptions().timeZone})
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
              {new Date(
                row.cell.row.values.draft_pick_timestamp
              ).toLocaleString()}
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
    const localDraftData = localStorage.getItem("draftData");
    if (localDraftData && user) {
      console.log("Using cached data");
      data = JSON.parse(localDraftData);
      setPicks(data.picks);
      if (typeof data.current_pick !== "undefined") {
        setCurrentPick(data.current_pick);
        if (currentPick && currentPick.team_key === user.team_key) {
          setDraftingNow(true);
        }
      }
    } else {
      console.log("Getting new draft data");
      data = getDraft(setPicks, setCurrentPick, setDraftingNow);
    }
    if (data) {
      setPicks(data.picks);
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
      getDBGoalies(setGoalies);
    }
    if (!localPlayerData) {
      getDBPlayers(setPlayers);
    }
    if (!playerTeamData) {
      getTeams(setTeams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loading text="Loading draft..." />}
      {!isLiveDraft && <h2>This draft is over</h2>}
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
          defaultPage={page || currentPick?.round - 1}
          pageSize={12}
          isLiveDraft={isLiveDraft}
          paginationTop
          paginationBottom
        />
      )}
    </>
  );
}
