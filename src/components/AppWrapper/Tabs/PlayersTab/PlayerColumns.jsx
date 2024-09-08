import React from "react";
import PlayerCell from "./PlayerCell";
import { SelectPositionColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import teamLogos from "../../../../util/teamLogos";

function multiSelectPositionsFilter(rows) {
  return rows.filter((row) => row.original.position !== "G");
}

function sortPointsPerGame(rowA, rowB, id, desc) {
	let a = Number.parseFloat(rowA.values[id]);
	let b = Number.parseFloat(rowB.values[id]);
	if (Number.isNaN(a)) {
			a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
	}
	if (Number.isNaN(b)) {
			b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
	}
	if (a > b) return 1; 
	if (a < b) return -1;
	return 0;
}

function formatAsFloat(value, digits) {
	if (!value || isNaN(value)) {
		return '';
	}
	console.log('value: ', value);
	
	return parseFloat(value, digits).toFixed(digits);
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
		Header: "P/G",
		accessor: row => row["3"] / row["0"],
		disableFilters: true,
		sortDescFirst: true,
		sortType: sortPointsPerGame,
		width: "30px",
		Cell: cell => isNaN(cell.value) ? '' : cell?.value.toFixed(3),
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
		Cell: cell => formatAsFloat(cell.value, 3),
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
		Cell: cell => formatAsFloat(cell.value, 3),
	},
];

const overallPickColumn = {
	Header: "Overall Pick",
	accessor: "overall_pick",
	disableFilters: true,
	Cell: (cell) => cell.value || "-",
	width: "20px",
}

const playerColumn = {
	Header: "Player",
	accessor: "name",
	disableFilters: true,
	disableSortBy: true,
	Cell: (cell) => <PlayerCell cell={cell} />,
}

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
					src={teamLogos[cell.value]}
					alt={cell.value}
					title={cell.value}
				/>
			)}
		</div>
	),
}

const positionColumn = {
	Header: "Pos",
	accessor: "position",
	width: "30px",
	filter: multiSelectPositionsFilter,
	disableFilters: true,
	disableSortBy: true,
}

const skaterAccessors = [
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

const goalieAccessors = [
	...skaterAccessors, 
	{
		accessor: "position",
	},
];

export const teamsTabSkaterColumns = [
	overallPickColumn,
	playerColumn,
	staticTeamColumn,
	positionColumn,
	...skaterStatColumns,
  ...skaterAccessors
];

export const teamsTabGoalieColumns = [
	overallPickColumn,
	playerColumn,
	staticTeamColumn,
	...goalieStatColumns,
	...goalieAccessors
];

export const watchlistTabSkaterColumns = [
	staticTeamColumn,
	positionColumn,
	...skaterStatColumns,
  ...skaterAccessors
];

export const watchlistTabGoalieColumns = [
	staticTeamColumn,
	...goalieStatColumns,
	...goalieAccessors
];

export const playersTabSkaterColumns = [
	{
		Header: "Pos",
		accessor: "position",
		Filter: SelectPositionColumnFilter,
		width: "30px",
	},
	...skaterStatColumns,
];

export const playersTabGoalieColumns = [
	...goalieStatColumns,
	{
		Header: "Pos",
		accessor: "position",
		Filter: SelectPositionColumnFilter,
		width: "30px",
	},
];
