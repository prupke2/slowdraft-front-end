import React, { useState, useEffect} from "react";
import Table from "../../../Table/Table";
import "./WatchlistTab.css";
import {
  watchlistTabSkaterColumns,
  watchlistTabGoalieColumns,
  staticTeamColumn,
  positionColumn,
} from "../PlayersTab/PlayerColumns";
import { getWatchlistIds, removeFromWatchlist } from "../../../../util/requests";
import Loading from "../../../Loading/Loading";
import { SearchColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import DraftModal from "../DraftTab/DraftModal";
import PlayerCell from "../PlayersTab/PlayerCell";
import toast from "react-hot-toast";
import AutodraftTable from "./Autodraft/AutodraftTable";

export default function WatchlistTab({ 
  draftingNow,
  channel,
}) {
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";
  const players = JSON.parse(localStorage.getItem("playerDBData"));
  const skaters = players.filter(player => player.position !== "G");
  const goalies = players.filter(player => player.position === "G");
  const watchlistLocalStorage = JSON.parse(localStorage.getItem('watchlist'));
  const [isLoading, setIsLoading] = useState(watchlistLocalStorage === null)
  const [watchlist, setWatchlist] = useState(watchlistLocalStorage || []);

  const autodraftIds = watchlistLocalStorage?.autodraft || [];
  const [autodraftTableRows, setAutodraftTableRows] = useState([]);

  // const [watchedSkaters, setWatchedSkaters] = useState(skaters?.filter(s => watchlist?.players?.includes(s.player_id)));

  const watchedSkaters = skaters.filter(s => watchlist.players?.includes(s.player_id));
  const watchedGoalies = goalies.filter(g => watchlist.players?.includes(g.player_id));

  const autodraftPlayers = players.filter(p => autodraftIds.includes(p.player_id));

  const fullList = [...watchlist?.players, ...watchlist?.autodraft];
  const takenPlayers = [fullList.filter(p => p.user !== null)];
  const untakenPlayers = [fullList.filter(p => p.user === null)];
  
  const user = JSON.parse(localStorage.getItem("user"));

  function removeAllTakenPlayers() {
    try {
      takenPlayers.forEach(p => removeFromWatchlist(p.player_id))
      const untakenPlayerIdList = untakenPlayers.map(p => p.player_id);
      setWatchlist(untakenPlayerIdList);
		} catch {
      toast.error("Error updating watchlist.");
		}
  }

  useEffect(() => {
    async function fetchWatchlist() {
      getWatchlistIds(setWatchlist);
      setIsLoading(false);
      return
    }
    if (!watchlistLocalStorage) {
      setIsLoading(true);
    }
    fetchWatchlist();
    // eslint-disable-next-line 
  }, []);

  // useEffect(() => {
  //   console.log('watchedSkaters: ', watchedSkaters);
  //   console.log('watchlist: ', watchlist);
    
  //   setWatchedSkaters(skaters?.filter(s => watchlist?.players?.includes(s.player_id)))
  // }, [setWatchlist])

  const skaterTableState = {
    hiddenColumns: [
      "player_id", 
      "is_keeper", 
      "prospect", 
      "username",
      "overall_pick",
    ],
    sortBy: [
      {
        id: "overall_pick",
        desc: true,
      },
    ],
    filters: [
      {
        id: "position",
        // no value needed here - this filtering is done in the column definition (filter: multiSelectPositionsFilter)
      },
    ],
  };

  const goalieTableState = {
    hiddenColumns: [
      "player_id",
      "position",
      "is_keeper",
      "prospect",
      "username",
      "overall_pick",
    ],
    sortBy: [
      {
        id: "overall_pick",
        desc: false,
      },
    ],
    filters: [
      {
        id: "position",
        value: "G",
      },
    ],
  };

  const EmptyVerbiage = object => (
    <div className="emptyVerbiage alignLeft">You have not added any {object} to your watchlist yet.</div>
  );

  if (isLoading) {
    return (
      <Loading text="Getting watchlist..." />
    )
  }

  if (!watchlist?.players?.length && !watchlist?.autodraft?.length) {
    return (
      <div className="watchlistWrapper">
        {EmptyVerbiage('players')}
      </div>
    )
  }

  const watchedPlayerColumn = {
    Header: "Player",
    accessor: "name",
    Filter: SearchColumnFilter,
    sortType: "alphanumeric",
    width: "100px",
    Cell: (cell) => {
      const takenPlayer = cell.row.original.user !== null ? "taken-player" : null;
      if (draftingNow === true) {
        return (
          <div className="player-wrapper">
            <div className="draft-button-cell">
              {!takenPlayer && isLiveDraft && (
                <DraftModal
                  player={cell.row.original}
                  channel={channel}
                />
              )}
            </div>
            <PlayerCell
              cell={cell} 
              showWatchlist
            />
          </div>
        );
      }
      return (
        <PlayerCell 
          cell={cell} 
          showWatchlist
          showAutodraft
          setWatchlist={setWatchlist}
          setAutodraftTableRows={setAutodraftTableRows}
        />
      );
    },
  }


  const autodraftPlayerColumn = {
    Header: "Player",
    accessor: "name",
    disableSort: true,
    disableFilters: true,
    width: "100px",
    Cell: (cell) => {
      return (
        <PlayerCell 
          cell={cell}
          showAutodraft
          setWatchlist={setWatchlist}
          setAutodraftTableRows={setAutodraftTableRows}
        />
      )
    },
  };


  const autodraftColumns = [
    autodraftPlayerColumn,
    staticTeamColumn,
    positionColumn,
  ];


  return (
    <div className="watchlistWrapper">
      {takenPlayers?.length > 0 && (
        <button onClick={removeAllTakenPlayers}>
          Remove all taken players
        </button>
      )}
      {!autodraftIds?.length ? null : (
        <>
          <h2>Autodraft list</h2>
          <AutodraftTable
            data={autodraftPlayers}
            columns={autodraftColumns}
            defaultColumn="player_id"
            autodraftTableRows={autodraftTableRows}
            setAutodraftTableRows={setAutodraftTableRows}
          />
        </>
      )}
      <h2 className="alignLeft">Skaters</h2>
      {!watchedSkaters?.length ? EmptyVerbiage('skaters') : (
        <Table
          user={user}
          data={watchedSkaters}
          columns={[watchedPlayerColumn, ...watchlistTabSkaterColumns]}
          tableState={skaterTableState}
          defaultColumn="player_id"
          tableType="watchlist"
        />
      )}
      <h2 className="alignLeft">Goalies</h2>
      {!watchedGoalies?.length ? EmptyVerbiage('goalies') : (
        <Table
          user={user}
          data={watchedGoalies}
          columns={[watchedPlayerColumn, ...watchlistTabGoalieColumns]}
          tableState={goalieTableState}
          defaultColumn="player_id"
          tableType="watchlist"
        />
      )}
    </div>
  );
}
