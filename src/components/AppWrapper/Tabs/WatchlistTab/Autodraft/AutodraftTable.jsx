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
  // const isLiveDraft = JSON.parse(localStorage.getItem("liveDraft")) === "true";

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

  if (!autodraftTableRows.length) {
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

  const renderPlayerRow = useCallback((row, index, takenPlayer) => {
    return (
      <AutodraftRow
        key={row.id}
        index={index}
        id={row.id}
        row={row}
        takenPlayer={takenPlayer}
        moveCard={moveRow}
      />
    )
  }, [moveRow])

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
                <th /> {/* empty header for drag icon */}
                {headerGroup.headers.map((column) => {
                  return (
                    <th key={column.id} width={column.width}>
                      <span>
                        {column.render("Header")}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {autodraftTableRows.map((row, i) => {
              prepareRow(row);
              const takenPlayer = row.cells[0].row.original.user !== null ? "taken-player" : null;
              renderPlayerRow(row, i, takenPlayer);
              return (
                <AutodraftRow
                  key={row.id}
                  index={i}
                  id={row.id}
                  row={row}
                  takenPlayer={takenPlayer}
                  moveCard={moveRow}
                />
              )
              // return (
              //   <tr
              //     key={row.id}
              //     {...row.getRowProps()}
              //     className={takenPlayer}
              //   >
              //     {row.cells.map(
              //       cell => (
              //         <td
              //           className={cell.column.Header}
              //           {...cell.getCellProps()}
              //         >
              //           {cell.render("Cell")}
              //         </td>
              //       )
              //     )}
              //   </tr>
              // );
            })}
          </tbody>
        </table>
      )}
    </DndProvider>
  );
}
