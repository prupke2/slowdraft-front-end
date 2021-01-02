import React, { useState} from "react";
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { matchSorter } from 'match-sorter';
import './Table.css';
import Pagination from "./Pagination/Pagination";
import ModalWrapper from "../AppWrapper/ModalWrapper/ModalWrapper";
import Loading from "../Loading/Loading";
import { ToastsStore } from "react-toasts";
import UsernameStyled from "../AppWrapper/UsernameStyled/UsernameStyled";

export default function Table(
    { columns,
      data,
      defaultColumnFilter,
      tableState,
      tableType,
      loading,
      role,
      draftingNow,
      teamName,
      sendChatAnnouncement,
      currentPick
    }
  ) {
  console.log("draftingNow: " + draftingNow);
  const [modalOpen, setModalOpen] = useState(false);
  const [playerDrafted, setPlayerDrafted] = useState("");
  const [forumPostId, setForumPostId] = useState("");

  function draftModal(player) {
    setModalOpen(true);
    setPlayerDrafted(player); 
  }

  function forumModal(id) {
    setForumPostId(id); 
    setModalOpen(true);
  }

  function updatePick(event, overall_pick) {
    const requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_id: event.target.value,
        overall_pick: overall_pick
      })
    };

    fetch('/update_pick', requestParams)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .then(ToastsStore.success("Pick updated."))
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

  if (tableType === 'draftPicks') {
    tableState = {...tableState, pageIndex: currentPick.round - 1, pageSize: 12}
  } else {
    tableState = {...tableState, pageIndex: 0, pageSize: 25}
  }
  // console.log("tableState: " + JSON.stringify(tableState, null, 4))
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
      { tableType !== 'forum' && 
        <Pagination 
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
      { loading && <Loading />}
      { !loading &&
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {/* Add an extra column for the draft button */}
                { ((tableType === 'draft' && draftingNow) || (tableType === 'draftPicks' && role === 'admin')) &&
                  <th className="blank-cell" width="30px"></th>
                }
                {headerGroup.headers.map(column => {
                  return column.Header === 'Player Type' ?
                    <th key={column.accessor} id='prospect-column'>
                      <span {...column.getHeaderProps(column.getSortByToggleProps())} >
                        {column.render('Header')}
                        {/* <span>
                          {column.isSorted
                            ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                          : ''}
                        </span> */}
                      </span>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  :
                  
                    <th key={column.id} width={column.width}>
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
                  
                }
              )}
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
                    // if (cell.column.Header === 'Position') {
                    //   return (
                    //     <td className={cell.column.Header}
                    //     {...cell.getCellProps()}
                    //     >
                    //       {cell.render(({ value }) => String(value + ',').substring(0, (String(value).length)))}
                    //     </td>                    
                    //   )
                    // } else 
                    if (cell.column.Header === 'Pick') {
                      return (
                        <>
                          { (role === 'admin' && cell.row.original.draft_pick_timestamp !== null) &&
                            <td width='50px' />
                          }
                          { (role === 'admin' && cell.row.original.draft_pick_timestamp === null) &&
                          <td width='50px'>
                            <select 
                              value={cell.row.original.user_id} 
                              className='change-user-dropdown'
                              onChange={(event) => updatePick(event, cell.row.original.overall_pick)}
                            >
                              <option value={351}>American Gladiators</option>
                              <option value={411}>Bakersfield Condors</option>
                              <option value={441}>Bowmanville Bisons</option>
                              <option value={301}>GrandRapids Griffins</option>
                              <option value={371}>Nelson Leafs</option>
                              <option value={381}>New Orleans Brass</option>
                              <option value={321}>Ontario Reign</option>
                              <option value={341}>Providence Bruins</option>
                              <option value={331}>Seaforth Generals</option>
                              <option value={391}>St Thomas Stars</option>
                              <option value={431}>Syracuse Crunch!</option>
                              <option value={361}>Terrace River Kings</option>
                              <option value={292}>Syracuse Crunch!</option>
                              <option value={296}>Ontario Reign</option>
                            </select>
                          </td>
                          }
                          <td className={cell.column.Header}
                          {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </td>
                        </>
                      )
                    } else if (cell.column.Header === 'User') {
                      return (
                        <td className={cell.column.Header}
                          {...cell.getCellProps()}
                          >
                          <UsernameStyled
                            username={cell.render('Cell')}
                            color={cell.row.original.color}
                          />
                        </td>
                      )
                    } else if (cell.column.Header === 'Player') {
                      return (
                        <>
                        {
                          (tableType === 'draft' && draftingNow) &&
                          <td className="draft-button-cell">
                            <div>
                              <button onClick={() => draftModal(cell.row.original)}>Draft</button>
                              <ModalWrapper 
                                modalIsOpen={modalOpen}
                                setIsOpen={setModalOpen}
                                data={playerDrafted}
                                modalType="draftPlayer"
                                teamName={teamName}
                                sendChatAnnouncement={sendChatAnnouncement}
                              />
                            </div>
                          </td>
                        } 
                        <td className="player-name"
                        {...cell.getCellProps()}
                        >
                          {cell.row.original.player_id && 
                          <a 
                            href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {cell.row.original.prospect === "1" && 
                              <span>
                                <span className='prospect'>P</span>
                                &nbsp;
                              </span>
                            }
                            {cell.render('Cell')}
                          </a>
                          }
                          { !cell.row.original.player_id && 
                            <>
                              <span>
                              {cell.render('Cell')}
                              </span>
                            </>
                          }
                        </td> 
                        </>
                      )
                    } 
                    else if (cell.column.Header === 'Title' || cell.column.Header === 'Rule') {
                      return (
                        <td width='50vw' className='post-title'
                        {...cell.getCellProps()}
                        >
                          <div onClick={() => forumModal(cell.row.original)}>
                            {cell.render('Cell')}
                          </div>
                          <ModalWrapper 
                            modalIsOpen={modalOpen}
                            setIsOpen={setModalOpen}
                            data={forumPostId}
                            modalType="post"
                            tableType={tableType}
                          />
                          {/* <div id={`body-${cell.row.id}`} className='hidden'>
                            {ReactHtmlParser(cell.row.original.body)}
                          </div> */}
                        </td>                    
                      )
                    } else if (cell.column.Header === 'Player Type') {
                      return (
                        <td className="prospect-column-hidden" />
                      )
                    } else {
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
      }
      <Pagination 
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
    </div >
  )
}
