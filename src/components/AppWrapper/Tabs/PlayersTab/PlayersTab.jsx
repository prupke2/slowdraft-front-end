import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPositionColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import { getDBPlayers } from '../../../../util/requests';
import Loading from '../../../Loading/Loading';
// import Errors from '../../../Errors/Errors';
import './PlayersTab.css';

export default function PlayersTab({players, setPlayers, draftingNow, setTeams, getLatestData,
    setUserPickingNow, sendChatAnnouncement, user, setPicks, setCurrentPick, setDraftingNow
  }) {
  const [isLoading, setIsLoading] = useState(true);
  const [prospectDropdown, setProspectDropdown] = useState('all');
  const [availabilityDropdown, setAvailabilityDropdown] = useState('available');

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

  const columns = [
    {
      Header: 'Player',
      accessor: 'name',
      Filter: SearchColumnFilter,
      sortType: 'alphanumeric',
      width: '100px',
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
  const tableState = { 
    hiddenColumns: ['player_id', 'player_key', 'careerGP', 'prospect', 'user'],
    sortBy: [
      {
        id: '3',
        desc: true
      }
    ],
    filters: [
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
  ],
  }

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const playerDBData = localStorage.getItem('playerDBData');
    
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
    
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlayers])


  return (
    <>
      { isLoading &&
        <Loading text="Loading goalies..."  />
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
                console.log(`e.target.value: ${e.target.value}`);
                setAvailabilityDropdown(e.target.value || undefined)
              }}
              >
                <option value="available">All available skaters</option>
                <option value="all">All skaters</option>
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
            draftingNow={draftingNow}
            setUserPickingNow={setUserPickingNow}
            sendChatAnnouncement={sendChatAnnouncement}
            setPicks={setPicks}
            setCurrentPick={setCurrentPick}
            setDraftingNow={setDraftingNow}
            setPlayers={setPlayers}
            setTeams={setTeams}
          />
        </> 
      }
    </>
  );
}
