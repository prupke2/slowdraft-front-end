import React, { useState } from 'react';
// import Table from '../../../Table/Table';
import { useEffect } from 'react';
import Loading from '../../../Loading/Loading';
import Table from '../../../Table/Table';
import { SelectFilter } from '../../../Table/FilterTypes/FilterTypes';
import { getTeams } from '../../../../util/requests';


export default function TeamTab({draftingNow, user, teams, setTeams, getLatestData}) {
  const columns = [
    {
      Header: 'Yahoo Team',
      accessor: 'username',
      Filter: SelectFilter,
      filter: user.team_name,
      width: '200px',
    },
    {
      Header: 'Player',
      accessor: 'name',
      disableFilters: true,
    },
    {
      Header: 'Team',
      accessor: 'team',
      width: '50px',
      disableFilters: true,
      Cell: row => <div className='teamLogoContainer'>
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
      width: '30px',
      disableFilters: true,
    },
    {
      accessor: 'player_id'
    },
    {
      accessor: 'is_keeper'
    },
    {
      accessor: 'prospect'
    },
  ]

  const tableState = { 
    hiddenColumns: ['player_id', 'is_keeper', 'prospect'],
    sortBy: [
      {
        id: 'position',
        desc: false
      }
    ],
    filters: [
      { 
        id: 'username', 
        value: user.team_name
      }
    ]
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const teamData = localStorage.getItem('teamData');
    if (teamData && user) {
      console.log("Using cached data");
      let data = JSON.parse(teamData);
      setTeams(data.teams);
    }
    else {
      console.log("Getting new team data");
      if (user) {
        getTeams(user, setTeams);    
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTeams, user])

  if (isLoading) {
    return <Loading text="Loading teams..." />
  }
  if (!isLoading) {
    return (
      <>
      {/* <div>{teams}</div> */}
      <Table
        user={user}
        data={teams}
        columns={columns}
        tableState={tableState}
        defaultColumn='player_id'
        draftingNow={draftingNow} 
        tableType='teams'
      />
      </>
    )
  }
}
