import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import Loading from '../../../Loading/Loading';
import { getDBGoalies } from '../../../../util/requests';
import '.././PlayersTab/PlayersTab.css';

export default function GoaliesTab({goalies, setGoalies, draftingNow, setTeams, setUserPickingNow, 
  sendChatAnnouncement, user, setPicks, setCurrentPick, setDraftingNow, getLatestData
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
    // {
    //   Header: 'Player Type',
    //   accessor: 'prospect',
    //   Filter: SelectPlayerTypeColumnFilter,
    //   width: '0px',
    //   disableSortBy: true,
    // },
    // {
    //   Header: 'Availability',
    //   accessor: 'user',
    //   id: 'userColumn',
    //   Filter: SelectTakenPlayerFilter,
    //   width: '0px',     
    //   disableSortBy: true,
    // },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SelectTeamFilter,
      sortType: 'alphanumeric',
      width: '100px',
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
    {
      accessor: 'position'
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
    hiddenColumns: ['position', 'player_id', 'player_key', 'careerGP', 'prospect', 'user'],
    sortBy: [
      {
        id: '19',
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
    ]
  }

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const goalieDBData = localStorage.getItem('goalieDBData');
    
    if (goalieDBData) {
      console.log("Using cached data");
      let data = JSON.parse(goalieDBData);
      setGoalies(data.players);
      setIsLoading(false);
    }
    else {
      console.log("Getting new goalie DB data");
      getDBGoalies(setGoalies);
    }

    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setGoalies])

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
                <option value="available">All available goalies</option>
                <option value="all">All goalies</option>
              </select>
            </div>
          </div>

          <Table
            user={user}
            data={goalies}
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
            setGoalies={setGoalies}
            setTeams={setTeams}
          />
        </>
      }
    </>
  );
}
