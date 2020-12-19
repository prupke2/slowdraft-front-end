import React, { useState } from 'react';
// import Table from '../../../Table/Table';
import { useEffect } from 'react';
import Loading from '../../../Loading/Loading';
import Table from '../../../Table/Table';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';


export default function TeamTab() {
  const columns = [
    {
      Header: 'Name',
      accessor: 'name', 
      Filter: SearchColumnFilter,

    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SearchColumnFilter,
    },
    {
      Header: 'Player ID',
      accessor: 'player_id',
      hidden: true
    },
    {
      Header: 'Position',
      accessor: 'position.position',
      Filter: SearchColumnFilter,
    },
  ]
  const tableState = { 
    hiddenColumns: ["player_id"],
    sortBy: [
      {
        id: 'name',
        desc: false
      }
    ]
  }
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/get_players`)
    .then(res => res.json())
    .then(data => {
      setPlayers(data.players);
    })
    .then(setIsLoading(false));
  }, [])

  if (isLoading) {
    return <Loading text="Loading your team..." />
  }
  if (!isLoading) {
    return (
      <Table
        data={players}
        columns={columns}
        tableState={tableState}
        defaultColumn='player_id'
      />
    )
  }
}
