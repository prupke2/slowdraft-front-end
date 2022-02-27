import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPositionColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import { getDBPlayers, getDBGoalies } from '../../../../util/requests';
import Loading from '../../../Loading/Loading';
import DraftModal from '../DraftTab/DraftModal';
import UsernameStyled from '../../UsernameStyled/UsernameStyled';
import PlayerCell from './PlayerCell';
import './PlayersTab.css';

export default function PlayersTab({playerType, players, setPlayers, setGoalies, draftingNow, setTeams, 
    getLatestData, sendChatAnnouncement, user, setPicks, setCurrentPick, setDraftingNow, currentPick
  }) {
  const [isLoading, setIsLoading] = useState(true);
  const [prospectDropdown, setProspectDropdown] = useState('all');
  const [availabilityDropdown, setAvailabilityDropdown] = useState('available');
  const [modalOpen, setModalOpen] = useState(false);
  const [playerDrafted, setPlayerDrafted] = useState('');

  function draftModal(player) {
    setModalOpen(true);
    setPlayerDrafted(player); 
  }

  function prospectFilter(rows) {
    if (prospectDropdown === 'all') {
      return rows;
    }
    return rows.filter((row) => row.original.prospect === prospectDropdown);
  }

  function availabilityFilter(rows) {
    if (availabilityDropdown === 'all') {
      return rows;
    }
    return rows.filter((row) => row.original.user === null);
  }

  const goalieStatColumns = [
    {
      Header: 'GS',
      accessor: '18',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'W',
      accessor: '19',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'GAA',
      accessor: '23',      
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    {
      Header: 'SV',
      accessor: '25',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'SV%',
      accessor: '26',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
      sortDescFirst: true
    },
  ]

  const skaterStatColumns = [
    {
      Header: 'Pos',
      accessor: 'position',
      Filter: SelectPositionColumnFilter,
      width: '30px',
    },
    {
      Header: 'GP',
      accessor: '0',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },   
    {
      Header: 'G',
      accessor: '1',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'A',
      accessor: '2',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'P',
      accessor: '3',
      disableFilters: true,
      sortDescFirst: true,
      width: '30px'
    },
    {
      Header: '+/-',
      accessor: '4',
      disableFilters: true,
      sortDescFirst: true,
      width: '30px'
    },
    {
      Header: 'PIM',
      accessor: '5',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'PPP',
      accessor: '8',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'SOG',
      accessor: '14',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'S%',
      accessor: '15',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'FW',
      accessor: '16',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'HIT',
      accessor: '31',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'BLK',
      accessor: '32',
      disableFilters: true,
      width: '30px',
      sortDescFirst: true
    },
  ]

  const statColumns = playerType === 'skaters' ? skaterStatColumns : goalieStatColumns;

  const columns = [
    {
      Header: 'Player',
      accessor: 'name',
      Filter: SearchColumnFilter,
      sortType: 'alphanumeric',
      width: '100px',
      Cell: cell => {
        const takenPlayer = cell.row.original.user !== null ? 'taken-player' : null;
        if (draftingNow) {
          return (
            <div className='player-wrapper'>
              <div className="draft-button-cell">
                { takenPlayer &&
                  <UsernameStyled
                    username={cell.row.original.user}
                    color={cell.row.original.owner_color}
                    teamId={cell.row.original.yahoo_team_id}
                  />
                }
                { !takenPlayer &&
                <div>
                  <button onClick={() => draftModal(cell.row.original)}>Draft</button>
                  <DraftModal 
                    modalIsOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    data={playerDrafted}
                    modalType="draftPlayer"
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
              </div>
              <PlayerCell
                cell={cell}
                draftingNow={draftingNow}
              />
            </div>
          );
        } else {
          return (
            <PlayerCell
              cell={cell}
              draftingNow={draftingNow}
            />
          )
        }
      }
    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SelectTeamFilter,
      width: '50px',
      Cell: row => <div className='team-logo-container'>
      {
        (row.value) &&
          <img 
            className='teamLogo' 
            src={`/teamLogos/${row.value}.png`} 
            alt={row.value} 
            title={row.value} 
          />
      }
      </div>
    },
    ...statColumns,
    {
      accessor: 'careerGP',
    },
    {
      accessor: 'player_id',
    },
    {
      accessor: 'player_key',
    },
    {
      accessor: 'prospect',
      filter: prospectFilter,
    },
    {
      accessor: 'user',
      filter: availabilityFilter,
    },
  ]

  const filters = [
    {
      id: 'userColumn',
      value: 'null',
    },
    {
      id: 'prospect',
    },
    {
      id: 'user',
    }
  ]

  const goalieTableState = {
    hiddenColumns: ['position', 'player_id', 'player_key', 'careerGP', 'prospect', 'user'],
    sortBy: [
      {
        id: '19',
        desc: true
      }
    ],
    filters: filters
  }

  const skaterTableState = { 
    hiddenColumns: ['player_id', 'player_key', 'careerGP', 'prospect', 'user'],
    sortBy: [
      {
        id: '3',
        desc: true
      }
    ],
    filters: filters
  }

  const tableState = playerType === 'skaters' ? skaterTableState : goalieTableState;

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const playerDBData = localStorage.getItem('playerDBData');
    const goalieDBData = localStorage.getItem('goalieDBData');
    
    if (playerType === 'skaters') {
      if (playerDBData) {
        console.log("Using cached data");
        let data = JSON.parse(playerDBData);
        setPlayers(data.players);
        setIsLoading(false);
      }
      else {
        console.log("Getting new player DB data");
        getDBPlayers(setPlayers);
      }
    }
    if (playerType === 'goalies') { 
    if (goalieDBData) {
      console.log("Using cached data");
      let data = JSON.parse(goalieDBData);
      setGoalies(data.players);
      setIsLoading(false);
    }
    else {
      console.log("Getting new player DB data");
      getDBGoalies(setGoalies);
    }
  }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlayers, setGoalies])


  return (
    <>
      { isLoading &&
        <Loading text="Loading players..."  />
      }
      { !isLoading &&
        <>
          <div className='player-tabs-filter-wrapper'>
            <div className='player-type-wrapper'>
              <label>Player type: </label>
              <select
                id='prospect-filter-select'
                value={prospectDropdown} 
                className='change-user-dropdown'
                onChange={e => {
                  setProspectDropdown(e.target.value || undefined)
                }}
              >
                <option value={'all'}>All</option>
                <option value='0'>Non-prospects</option>
                <option value='1'>Prospects</option>
              </select>
            </div>
            <div>
              <label>Availability: </label>
              <select
              value={availabilityDropdown}
              onChange={e => {
                setAvailabilityDropdown(e.target.value || undefined)
              }}
              >
                <option value="available">All available {playerType}</option>
                <option value="all">All {playerType}</option>
              </select>
            </div>
          </div>
          <Table
            user={user}
            data={players}
            columns={columns}
            tableState={tableState}
            defaultColumn='name'
            tableType="draft"
            paginationTop
            paginationBottom
          />
        </> 
      }
    </>
  );
}
