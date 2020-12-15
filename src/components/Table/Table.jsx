import React from "react";
import ReactHtmlParser from 'react-html-parser';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { matchSorter } from 'match-sorter';
import './Table.css';
import Pagination from "./Pagination/Pagination";

export default function Table({ columns, data, defaultColumnFilter, tableState }) {

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

  // This is a custom filter UI for selecting
  // a unique option from a list
  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  tableState = {...tableState, pageIndex: 0, pageSize: 10}
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
              {headerGroup.headers.map(column => (
                <th>
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
                {row.cells.map(cell => {
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
