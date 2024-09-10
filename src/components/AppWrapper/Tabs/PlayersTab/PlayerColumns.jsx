import React from "react";
import PlayerCell from "./PlayerCell";
import { SelectPositionColumnFilter } from "../../../Table/FilterTypes/FilterTypes";
import teamLogos from "../../../../util/teamLogos";

function multiSelectPositionsFilter(rows) {
  return rows.filter((row) => row.original.position !== "G");
}

function sortNumbersUndefinedLast(rowA, rowB, id, desc) {
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
	// we want to keep zero values but not nulls
	if (value !== 0 && (!value || isNaN(value))) {
		return '';
	}	
	return parseFloat(value, digits).toFixed(digits);
}

export const skaterStatColumns = [
	{
		Header: "GP",
		accessor: "0",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "G",
		accessor: "1",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "A",
		accessor: "2",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "P",
		accessor: "3",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "P/G",
		accessor: row => row["3"] / row["0"],
		disableFilters: true,
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
		width: "30px",
		Cell: cell => isNaN(cell.value) ? '' : cell?.value.toFixed(3),
	},
	{
		Header: "+/-",
		accessor: "4",
		disableFilters: true,
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
		width: "30px",
	},
	{
		Header: "PIM",
		accessor: "5",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "PPP",
		accessor: "8",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "SOG",
		accessor: "14",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "S%",
		accessor: "15",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
		Cell: cell => formatAsFloat(cell.value, 3),
	},
	{
		Header: "FW",
		accessor: "16",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "HIT",
		accessor: "31",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "BLK",
		accessor: "32",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "Draft %",
		accessor: "percent_drafted",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
		Cell: cell => cell?.value ? parseFloat(cell.value, 2) * 100 : '',
	},
	{
		Header: "Avg. Pick",
		accessor: "average_pick",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
		Cell: cell => cell?.value ? parseInt(cell.value, 10) : '',
	},
];

export const goalieStatColumns = [
	{
		Header: "GS",
		accessor: "18",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "W",
		accessor: "19",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "GAA",
		accessor: "23",
		disableFilters: true,
		sortType: sortNumbersUndefinedLast,
		width: "30px",
		Cell: cell => formatAsFloat(cell.value, 2),
	},
	{
		Header: "SV",
		accessor: "25",
		disableFilters: true,
		width: "30px",
		sortDescFirst: true,
		sortType: sortNumbersUndefinedLast,
	},
	{
		Header: "SV%",
		accessor: "26",
		disableFilters: true,
		sortType: sortNumbersUndefinedLast,
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
