import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter, SelectPositionColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
// import Errors from '../../../Errors/Errors';


export default function PlayersTab({draftingNow, setUserPickingNow}) {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Filter: SearchColumnFilter,
      sortType: 'alphanumeric',
      width: '100px',
    },
    {
      Header: 'Player Type',
      accessor: 'prospect',
      Filter: SelectPlayerTypeColumnFilter,
      width: '0px',
    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SearchColumnFilter,
      width: '50px',
    },
    {
      Header: 'Pos',
      accessor: 'position',
      Filter: SelectPositionColumnFilter,
      width: '30px',
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
  ]
  const tableState = { 
    hiddenColumns: ['player_id', 'player_key', 'careerGP'],
    sortBy: [
      {
        id: '3',
        desc: true
      }
    ]
  }
  
  useEffect(() => {
    setIsLoading(true);
    fetch('/get_db_players')
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      setPlayers(data.players);
    })
    .then(setIsLoading(false));
  }, [])

  return (
    <>
      {/* { error && <Errors />} */}
      { !isLoading &&
        <Table
          data={players}
          columns={columns}
          tableState={tableState}
          defaultColumn='name'
          tableType="draft"
          draftingNow={draftingNow}
          setUserPickingNow={setUserPickingNow}
        />
      }
    </>
  );
}
