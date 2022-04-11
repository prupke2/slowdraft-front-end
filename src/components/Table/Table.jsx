import React from "react";
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { matchSorter } from 'match-sorter';
import './Table.css';
import Pagination from './Pagination/Pagination';
import Loading from '../Loading/Loading';

export default function Table(
    { columns, data, defaultColumnFilter, tableState, tableType, defaultPage, pageSize,
      loading, currentPick, paginationTop, paginationBottom }
  ) {
  const isLiveDraft = JSON.parse(localStorage.getItem('liveDraft')) === 'true';
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

  tableState = {...tableState, pageIndex: defaultPage || 0, pageSize: pageSize || 25}

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
        disableSortRemove: true,
      },
      useFilters,
      useSortBy,
      usePagination,
  )

  return (
    <div>
      { paginationTop &&
        <Pagination 
          currentRound={currentPick ? currentPick.round - 1 : null}
          tableType={tableType}
          gotoPage={gotoPage}
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
        />
      }

      { loading && <Loading text="Loading..." />}
      { !loading &&
        <table autoComplete="off" className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  return (
                    <th key={column.id} width={column.width}>
                      <span {...column.getHeaderProps(column.getSortByToggleProps())} >
                        {column.render('Header')}
                        <span>
                          {column.isSorted && tableType !== 'draftPicks'
                            ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                          : ''}
                        </span>
                      </span>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  );
                }
              )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              const pickDisabled = row.cells[0].row.original.disabled === 1 ? 'disabled-pick' : null;
              const takenPlayer = tableType === 'draft' && row.cells[0].row.original.user !== null ? 'taken-player' : null;

              const currentPickRow = isLiveDraft && currentPick && currentPick.overall_pick === row.cells[0].row.original.overall_pick 
                ? 'current-pick-row' : null;
              return (
                <tr 
                  key={row.id} 
                  {...row.getRowProps()} 
                  className={`${pickDisabled} ${takenPlayer} ${currentPickRow}`}
                  title={pickDisabled ? 'This pick has been disabled' : null}>
                  {row.cells.map(
                    cell => {
                      return (
                        <td className={cell.column.Header}
                        {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    }
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      }
      { paginationBottom &&
        <Pagination 
          currentRound={currentPick ? currentPick.round - 1 : null}
          tableType={tableType}
          gotoPage={gotoPage}
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
        />
      }
    </div >
  )
}
