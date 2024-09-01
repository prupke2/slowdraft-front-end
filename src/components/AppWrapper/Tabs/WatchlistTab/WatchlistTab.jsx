import React, { useState, useEffect} from "react";
import Table from "../../../Table/Table";
import "./WatchlistTab.css";
import { watchlistTabSkaterColumns, watchlistTabGoalieColumns } from "../PlayersTab/PlayerColumns";
import { getWatchlistIds, removeFromWatchlist } from "../../../../util/requests";
import Loading from "../../../Loading/Loading";

export default function WatchlistTab() {
  const players = JSON.parse(localStorage.getItem("playerDBData"));
  const skaters = players.filter(player => player.position !== "G");
  const goalies = players.filter(player => player.position === "G")
  const watchlistLocalStorage = JSON.parse(localStorage.getItem('watchlist'));
  const [isLoading, setIsLoading] = useState(watchlistLocalStorage === null)
  const [watchlist, setWatchlist] = useState(watchlistLocalStorage || []);

  const watchedSkaters = skaters?.filter(s => watchlist?.includes(s.player_id));
  const watchedGoalies = goalies?.filter(g => watchlist?.includes(g.player_id));

  const takenPlayers = [
    ...watchedSkaters.filter(s => s.user !== null),
    ...watchedGoalies.filter(g => g.user !== null)
  ];
  const untakenPlayers = [
    ...watchedSkaters.filter(s => s.user === null),
    ...watchedGoalies.filter(g => g.user === null)
  ];
  
  const user = JSON.parse(localStorage.getItem("user"));

  function removeAllTakenPlayers() {
    try {
      takenPlayers.forEach(p => removeFromWatchlist(p.player_id))
      const untakenPlayerIdList = untakenPlayers.map(p => p.player_id);
      setWatchlist(untakenPlayerIdList);
		} catch {
			console.log("Error updating watchlist.")
		}
  }

  useEffect(() => {
    async function fetchWatchlist() {
      getWatchlistIds();
      const newWatchlist = JSON.parse(localStorage.getItem('watchlist'));
      setWatchlist(newWatchlist);
      setIsLoading(false);
      return
    }
    if (!watchlistLocalStorage) {
      setIsLoading(true);
    }
    fetchWatchlist();
    // eslint-disable-next-line 
  }, []);

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
    <div className="emptyVerbiage">You have not added any {object} to your watchlist yet.</div>
  );

  if (isLoading) {
    return (
      <Loading text="Getting watchlist..." />
    )
  }

  if (!watchedSkaters?.length && !watchedGoalies?.length) {
    return (
      <div className="watchlistWrapper">
        {EmptyVerbiage('players')}
      </div>
    ) 
  }
  return (
    <div className="watchlistWrapper">
      {takenPlayers?.length > 0 && (
        <button onClick={removeAllTakenPlayers}>
          Remove all taken players
        </button>
      )}
      <h2>Skaters</h2>
      {!watchedSkaters?.length ? EmptyVerbiage('skaters') : (
        <Table
          user={user}
          data={watchedSkaters}
          columns={watchlistTabSkaterColumns}
          tableState={skaterTableState}
          defaultColumn="player_id"
          tableType="watchlist"
        />
      )}
      <h2>Goalies</h2>
      {!watchedGoalies?.length ? EmptyVerbiage('goalies') : (
        <Table
          user={user}
          data={watchedGoalies}
          columns={watchlistTabGoalieColumns}
          tableState={goalieTableState}
          defaultColumn="player_id"
          tableType="watchlist"
        />
      )}
    </div>
  );
}
