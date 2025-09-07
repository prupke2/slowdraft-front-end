import React, { useCallback } from "react";
import update from 'immutability-helper';
import { useTable } from "react-table";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import "../../../../Table/Table";
import Loading from "../../../../Loading/Loading";
import { AutodraftRow } from "./AutodraftRow";

export default function AutodraftTable({
  columns,
  data,
  loading,
  autodraftTableRows,
  setAutodraftTableRows,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: true,
      disableSortRemove: true,
      autoResetSortBy: true,
    },
  );
  const rowCount = rows.length;
  console.log('rows in autodraftTable: ', rows);
  console.log('autodraftTableRows: ', autodraftTableRows);

  if (!rowCount) {
    setAutodraftTableRows(rows);
  }

  
  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setAutodraftTableRows((prevRows) =>
      update(prevRows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevRows[dragIndex]],
        ],
      }),
    )
  }, [setAutodraftTableRows]);

  const renderPlayerRow = useCallback((row, index, takenPlayer) => (
    <AutodraftRow
      key={row.id}
      index={index}
      id={row.id}
      row={row}
      takenPlayer={takenPlayer}
      moveCard={moveRow}
      rowCount={rowCount}
    />
  ), [moveRow, rowCount]);

  return (
    <DndProvider backend={HTML5Backend}>
      {loading ? <Loading text="Loading..." /> : (
        <table 
          autoComplete="off" 
          className="table narrow-table"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                { rowCount > 1 && (
                  <th width="60px" className="transparent-table-cell" /> /* set column width for drag icon and index */
                )}
                {headerGroup.headers.map((column) => {
                  return (
                    <th className={column.className} key={column.id} width={column.width}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              const takenPlayer = row.cells[0].row.original.user !== null ? "taken-player" : null;
              return renderPlayerRow(row, i, takenPlayer);
            })}
          </tbody>
        </table>
      )}
    </DndProvider>
  );
}
