import React from "react";
import PlayerCell from "./PlayerCell";

function multiSelectPositionsFilter(rows) {
  return rows.filter((row) => row.original.position !== "G");
}

export const skaterStatColumns = [
	{
		Header: "GP",
		accessor: "0",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "G",
		accessor: "1",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "A",
		accessor: "2",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "P",
		accessor: "3",
		disableFilters: true,
		sortDescFirst: true,
		width: "30px",
	},
	{
		Header: "+/-",
		accessor: "4",
		disableFilters: true,
		sortDescFirst: true,
		width: "30px",
	},
	{
		Header: "PIM",
		accessor: "5",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "PPP",
		accessor: "8",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "SOG",
		accessor: "14",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "S%",
		accessor: "15",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "FW",
		accessor: "16",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "HIT",
		accessor: "31",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "BLK",
		accessor: "32",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
	},
];

export const goalieStatColumns = [
	{
		Header: "GS",
		accessor: "18",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "W",
		accessor: "19",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "GAA",
		accessor: "23",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
	},
	{
		Header: "SV",
		accessor: "25",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "SV%",
		accessor: "26",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
];

const staticTeamColumn = {
	Header: "Team",
	accessor: "team",
	width: "50px",
	disableFilters: true,
	disableSortBy: true,
	Cell: (cell) => (
		<div className="team-logo-container">
			{cell.value && (
				<img
					className="teamLogo"
					src={`/teamLogos/${cell.value}.png`}
					alt={cell.value}
					title={cell.value}
				/>
			)}
		</div>
	),
}

const playerColumnWithWatchlist = {
	Header: "Player",
	accessor: "name",
	disableFilters: true,
	disableSortBy: true,
	Cell: (cell) => <PlayerCell cell={cell} showWatchlist />,
}

const hiddenColumns = ["player_id", "player_key", "careerGP", "prospect", "user"]

const skaterTableState = {
	hiddenColumns: hiddenColumns,
	sortBy: [
		{
			id: "3",
			desc: true,
		},
	],
};

const goalieTableState = {
	hiddenColumns: [...hiddenColumns, "position"],
	sortBy: [
		{
			id: "19",
			desc: true,
		},
	],
};

export const getTableStateWithoutFilters = playerType => playerType === "skaters" ? skaterTableState : goalieTableState;

export const watchlistSkaterColumns = [
	staticTeamColumn,
	playerColumnWithWatchlist,
	{
    Header: "Pos",
    accessor: "position",
    width: "30px",
    filter: multiSelectPositionsFilter,
    disableFilters: true,
    disableSortBy: true,
  },
	...skaterStatColumns,
  {
    accessor: "username",
  },
  {
    accessor: "player_id",
  },
  {
    accessor: "is_keeper",
  },
  {
    accessor: "prospect",
  },
];

export const watchlistGoalieColumns = [
	staticTeamColumn,
	playerColumnWithWatchlist,
	{
		Header: "GS",
		accessor: "18",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "W",
		accessor: "19",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "GAA",
		accessor: "23",
		disableFilters: true,
		width: "30px",
		sortType: "alphanumeric",
	},
	{
		Header: "SV",
		accessor: "25",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		Header: "SV%",
		accessor: "26",
		disableFilters: true,
		sortType: "alphanumeric",
		width: "30px",
		sortDescFirst: true,
	},
	{
		accessor: "username",
	},
	{
		accessor: "position",
	},
	{
		accessor: "player_id",
	},
	{
		accessor: "is_keeper",
	},
	{
		accessor: "prospect",
	},
];

