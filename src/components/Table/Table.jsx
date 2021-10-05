import React, { useState } from "react";
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { matchSorter } from 'match-sorter';
import './Table.css';
import Pagination from "./Pagination/Pagination";
import ModalWrapper from "../AppWrapper/ModalWrapper/ModalWrapper";
import Loading from "../Loading/Loading";
import { ToastsStore } from "react-toasts";
import UsernameStyled from "../AppWrapper/UsernameStyled/UsernameStyled";
import { getDraft } from "../../util/requests";

export default function Table(
    { columns, data, defaultColumnFilter, tableState, tableType, loading, draftingNow, setTeams,
      sendChatAnnouncement, currentPick, setPicks, setCurrentPick, setDraftingNow, user, setPlayers, setGoalies
    }
  ) {
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
    let requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      }
    };
    if (event.target.value === '0') {
      requestParams.body = JSON.stringify({ 
        overall_pick: overall_pick,
        league_id: user.league_id,
        draft_id: user.draft_id
      })
      fetch('/update_pick_enablement', requestParams)
        .then(response => {
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return response.json()
      })
      .then( data => {
        if (data.success === true) {
          sendChatAnnouncement(`The ${user.team_name} have updated pick ${overall_pick}.`);
          getDraft(user, setPicks, setCurrentPick, setDraftingNow)
          setTimeout(function () {
            ToastsStore.success(`Pick ${overall_pick} ${data.status}.`)
          }, 1000)
        } else {
          ToastsStore.error(`Error updating pick ${overall_pick}.`)
        }
      });

    } else {
      requestParams.body = JSON.stringify({ 
        user_id: event.target.value,
        overall_pick: overall_pick,
        league_id: user.league_id,
        draft_id: user.draft_id
      })
      fetch('/update_pick', requestParams)
      .then(response => {
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return response.json()
      })
      .then( data => {
        if (data.success === true) {
          sendChatAnnouncement(`The ${user.team_name} have updated pick ${overall_pick}.`);
          getDraft(user, setPicks, setCurrentPick, setDraftingNow)
          setTimeout(function () {
            ToastsStore.success(`Pick ${overall_pick} updated.`)
          }, 1000)
        } else {
          ToastsStore.error(`Error updating pick ${overall_pick}.`)
        }
      })
    }
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
      { tableType !== 'forum' && tableType !== 'teams' && 
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
      { tableType === 'teams' && 
        <p className="player-count">
          <div>
            Total: <span>{page.length}</span>
          </div>
          <div>
            Remaining: <span>{24 - page.length}</span> 
          </div>
        </p>
      }

      { loading && <Loading text="Loading..." />}
      { !loading &&
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {/* Add an extra column for the draft button */}
                { (tableType === 'draft' && draftingNow) &&
                  <th width="30px"></th>
                }
                
                { (tableType === 'draftPicks' && user.role === 'admin') &&
                  <th className="blank-cell" width="30px" />
                }
                {headerGroup.headers.map(column => {
                  return (column.Header === 'Player Type' || column.Header === 'Yahoo Team' || column.Header === 'Availability') ?
                    <th key={column.accessor} id={column.Header === 'Availability' ? 'show-taken-dropdown' : 'prospect-column'}>
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
                          {column.isSorted && tableType !== 'draftPicks'
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
              const pickDisabled = row.cells[0].row.original.disabled === 1 ? 'disabled-pick' : null;
              const takenPlayer = tableType === 'draft' && row.cells[0].row.original.user !== null ? 'taken-player' : null;
              return (
                <tr key={i} {...row.getRowProps()} className={`${pickDisabled} ${takenPlayer}`}>
                  {row.cells.map(
                    cell => {
                    if (cell.column.Header === 'Pick') {
                      return (
                        <>
                          { (user.role === 'admin' && cell.row.original.draft_pick_timestamp !== null) &&
                            <td className="admin-column" width='50px' />
                          }
                          { (user.role === 'admin' && cell.row.original.draft_pick_timestamp === null) &&
                          <td className="admin-column" width='50px'>
                            <select 
                              value={cell.row.original.user_id} 
                              className='change-user-dropdown'
                              onChange={(event) => updatePick(event, cell.row.original.overall_pick)}
                            >
                              <option value={351}>American Gladiators</option>
                              <option value={441}>Fort Wayne Komets</option>
                              <option value={301}>GrandRapids Griffins</option>
                              <option value={371}>Nelson Leafs</option>
                              <option value={381}>New Orleans Brass</option>
                              <option value={321}>Ontario Reign</option>
                              <option value={341}>Providence Bruins</option>
                              <option value={331}>Seaforth Generals</option>
                              <option value={411}>St. Marys Lincolns</option>
                              <option value={391}>St. Thomas Stars</option>
                              <option value={431}>Syracuse Crunch!</option>
                              <option value={361}>Terrace River Kings</option>
                              {/* <option value={292}>LOCAL TESTING ONLY</option> */}
                              {cell.row.original.disabled === 0 && 
                                <option value={0}>DISABLE PICK</option>
                              } 
                              {cell.row.original.disabled === 1 && 
                                <option value={0}>ENABLE PICK</option>
                              } 
                            </select>
                          </td>
                          }
                          <td className={cell.column.Header}
                          {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                            {(tableType === 'draftPicks' && row.original.overall_pick === 13) &&
                              <span className="asterisk">* </span>
                            }
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
                            { takenPlayer &&
                             <div>
                              <UsernameStyled
                                username={cell.row.original.user}
                                color={cell.row.original.ownerColor}
                              />
                             </div>
                            }
                            { !takenPlayer &&
                            <div>
                              <button onClick={() => draftModal(cell.row.original)}>Draft</button>
                              <ModalWrapper 
                                modalIsOpen={modalOpen}
                                setIsOpen={setModalOpen}
                                data={playerDrafted}
                                modalType="draftPlayer"
                                user={user}
                                sendChatAnnouncement={sendChatAnnouncement}
                                setPicks={setPicks}
                                currentPick={currentPick}
                                setCurrentPick={setCurrentPick}
                                setDraftingNow={setDraftingNow}
                                setPlayers={setPlayers}
                                setGoalies={setGoalies}
                                setTeams={setTeams}
                              />
                            </div>
                            }
                          </td>
                        } 
                        <td className="player-name"
                        {...cell.getCellProps()}
                        >
                          {cell.row.original.player_id && 
                          <div className='playerNameAndHeadshot'>
                            <img className='headshot' src={cell.row.original.headshot} alt='' />
                            <span>
                              <a
                                href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {cell.row.original.prospect === "1" && 
                                  <span>
                                    <span className='prospect' title='Prospect'>P</span>
                                    &nbsp;
                                  </span>
                                }
                                {cell.row.original.is_keeper === 1 && 
                                  <span>
                                    <span className='keeper' title='Keeper'>K</span>
                                    &nbsp;
                                  </span>
                                }
                                {cell.render('Cell')}
                              </a>
                              { (takenPlayer && !draftingNow) &&
                                <div className="small-username">
                                  &nbsp;{cell.row.original.user}
                                </div>
                              }
                            </span>
                          </div>
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
                    } else if (cell.column.Header === 'Player Type' || cell.column.Header === 'Yahoo Team') {
                      return (
                        <td className="prospect-column-hidden" />
                      )
                    } else if (cell.column.Header === 'Availability') {
                      return null
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
      { tableType !== 'teams' && 
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
    </div >
  )
}
