import React from "react";
import ReactHtmlParser from 'react-html-parser';
import { useTable, usePagination } from 'react-table'
import './Table.css';

export default function Table({ columns, data, tableState }) {

  function expandPost(id) {
    const bodyId = document.getElementById('body-' + id);
    bodyId.classList.toggle('hidden');
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
      setPageSize,
      state: { pageIndex, pageSize },
  } = useTable(
      {
        columns,
        data,
        initialState: tableState,
      },
      usePagination
  )

  return (
    <div>
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageSize, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                        </strong>⤵
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

      <ul className="pagination">
        <li className="pagination-arrows">
          <div className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              <span className="page-link">First</span>
          </div>
          <div className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
              <span className="page-link">{'<'}</span>
          </div>
          <div className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
              <span className="page-link">{'>'}</span>
          </div>
          <div className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              <span className="page-link">Last</span>
          </div>
        </li>

        <li className="pagination-goto-page">
          <span className="page-link">
            Page&nbsp;
            <div className="page-of-page">
              <strong>
                  {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </div>
          </span>
          <span className="page-link">
            <div>Go&nbsp;to:</div>
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
              }}
              style={{ width: '40px', height: '22px' }}
            />
          </span>
        </li>{' '}
        <select
            className="form-control"
            value={pageSize}
            onChange={e => {
                setPageSize(Number(e.target.value))
            }}
            style={{ maxWidth: '150px', height: '33px' }}
        >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                </option>
            ))}
        </select>
      </ul>
    </div >
  )
}
