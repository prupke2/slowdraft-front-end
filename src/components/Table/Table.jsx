import React, { useState} from "react";
import ReactHtmlParser from 'react-html-parser';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { matchSorter } from 'match-sorter';
import './Table.css';
import Pagination from "./Pagination/Pagination";
import ModalWrapper from "../AppWrapper/ModalWrapper/ModalWrapper";

export default function Table({ columns, data, defaultColumnFilter, tableState, tableType }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [playerDrafted, setPlayerDrafted] = useState("");

  function draft(player) {
    setIsOpen(true);
    setPlayerDrafted(player); 
  }

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )


  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }

  function expandPost(id) {
    const bodyId = document.getElementById('body-' + id);
    bodyId.classList.toggle('hidden');
  }

  tableState = {...tableState, pageIndex: 0, pageSize: 25}
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      // setPageSize,
      state: { 
        pageIndex, 
        // pageSize 
      },
  } = useTable(
      {
        columns,
        data,
        defaultColumnFilter,
        filterTypes,
        initialState: tableState,
      },
      useFilters,
      useSortBy,
      usePagination,
  )

  let player = {}

  return (
    <div>
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageSize, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <Pagination 
        gotoPage={gotoPage}
        previousPage={previousPage}
        canPreviousPage={canPreviousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
      />
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {/* Add an extra column for the draft button */}
              { tableType=="draft" && (
                <th className="blank-cell" width="30px"></th>
              )}
              {headerGroup.headers.map(column => (
                <th width={column.width}>
                  <span {...column.getHeaderProps(column.getSortByToggleProps())} >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                        ? ' ▼'
                        : ' ▲'
                      : ''}
                    </span>
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(
                  cell => {
                  if (cell.column.Header === 'Position') {
                    return (
                      <td className={cell.column.Header}
                      {...cell.getCellProps()}
                      >
                        {cell.render(({ value }) => String(value + ',').substring(0, (String(value).length)))}
                      </td>                    
                    )
                  } else if (cell.column.Header === 'Name') {
                    return (
                      <>
                      {/* {
                        tableType === "draft" && ( */}
                        <td className="draft-button-cell">
                          <div>
                            <button onClick={() => draft(cell.row.original)}>Draft</button>
                            <ModalWrapper 
                              modalIsOpen={modalIsOpen}
                              setIsOpen={setIsOpen}
                              player={playerDrafted}
                            />
                          </div>
                        </td>
                      {/* )} */}
                      <td className="player-name"
                      {...cell.getCellProps()}
                      >
                        {/* {console.log(cell)} */}
                        <a 
                          href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {cell.render('Cell')}
                        </a>
                      </td> 
                      </>
                    )
                  } else if (cell.column.Header === 'Post Title') {
                    return (
                      <td width="50vw" className="post-title" onClick={() => expandPost(cell.row.id)}
                      {...cell.getCellProps()}
                      >
                        <strong>
                          {cell.render('Cell')} a
                        </strong>
                        <div id={`body-${cell.row.id}`} className='hidden'>
                          {ReactHtmlParser(cell.row.original.body)}
                        </div>
                      </td>                    
                    )
                  } 
                  else {
                    return (
                      <td className={cell.column.Header}
                      {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  }
                  // return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pagination 
        gotoPage={gotoPage}
        previousPage={previousPage}
        canPreviousPage={canPreviousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
      />
    </div >
  )
}
