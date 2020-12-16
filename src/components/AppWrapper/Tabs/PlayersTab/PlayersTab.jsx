import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, DefaultColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';


export default function PlayersTab() {
  const [players, setPlayers] = useState([]);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Filter: SearchColumnFilter,
      width: '100px'
    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SearchColumnFilter,
      width: '50px'
    },
    {
      Header: 'Pos',
      accessor: 'position',
      Filter: SearchColumnFilter,
      width: '30px',
      sortDescFirst: true
    },
    {
      Header: 'Career GP',
      accessor: 'careerGP',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'G',
      accessor: '1',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'A',
      accessor: '2',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'P',
      accessor: '3',
      Filter: SearchColumnFilter,
      isSorted: true,
      isSortedDesc: true,
      width: '30px'
    },
    {
      Header: 'PIM',
      accessor: '5',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'PPP',
      accessor: '8',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'SOG',
      accessor: '14',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'S%',
      accessor: '15',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'FW',
      accessor: '16',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'HIT',
      accessor: '31',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      Header: 'BLK',
      accessor: '32',
      Filter: SearchColumnFilter,
      width: '30px'
    },
    {
      accessor: 'player_id',
    },
    {
      accessor: 'player_key',
    },
  ]
  const tableState = { 
    hiddenColumns: ['player_id', 'player_key']
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/get_db_players')
    .then(res => res.json())
    .then(data => {
      console.log("data: " + JSON.stringify(data.players, null, 4));
      setPlayers(data.players);
    })
    .then(setIsLoading(false));
  }, [])

  return (
    <React.Fragment>
      <Table
        data={players}
        columns={columns}
        tableState={tableState}
        defaultColumn='name'
        tableType="draft"
      />
    </React.Fragment>
  );
}
