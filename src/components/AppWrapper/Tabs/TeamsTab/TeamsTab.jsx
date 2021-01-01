import React, { useState } from 'react';
// import Table from '../../../Table/Table';
import { useEffect } from 'react';
import Loading from '../../../Loading/Loading';
import Table from '../../../Table/Table';
import { SelectFilter } from '../../../Table/FilterTypes/FilterTypes';


export default function TeamTab({draftingNow, teamName}) {
  console.log("teamName: " + teamName);
  const columns = [
    {
      Header: 'User',
      accessor: 'username',
      Filter: SelectFilter,
      filter: teamName,
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
  // const initialFilter = {[
  //   {id: 'username', value: teamName}
  // ]}

  // filtered={[
  //   {id: 'columnID', value: 'myFilterValue'},
  //   {id: 'otherColumnID', value: 'myOtherFilterValue'}
  // ]}

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
        value: teamName
      }
    ]
  }
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/get_teams`)
    .then(res => res.json())
    .then(data => {
      setTeams(data.teams);
    })
    .then(setIsLoading(false));
  }, [])

  if (isLoading) {
    return <Loading text="Loading teams..." />
  }
  if (!isLoading) {
    return (
      <>
      {/* <div>{teams}</div> */}
      <Table
        data={teams}
        columns={columns}
        tableState={tableState}
        defaultColumn='player_id'
        draftingNow={draftingNow} 
        teamName={teamName}
      />
      </>
    )
  }
}
