import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import Loading from '../../../Loading/Loading';


export default function GoaliesTab({draftingNow, setUserPickingNow}) {
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
      sortType: 'alphanumeric',
      width: '100px',
    },
    {
      Header: 'GS',
      accessor: '18',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    {
      Header: 'W',
      accessor: '19',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    {
      Header: 'GA',
      accessor: '22',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    {
      Header: 'GAA',
      accessor: '23',      
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    {
      Header: 'SA',
      accessor: '24',
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
    },
    {
      Header: 'SV%',
      accessor: '26',
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
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
  ]

  const tableState = { 
    hiddenColumns: ['position', 'player_id', 'player_key', 'careerGP'],
    sortBy: [
      {
        id: '19',
        desc: true
      }
    ]
  }

  useEffect(() => {
    setIsLoading(true);
    fetch('/get_db_players?position=G')
    .then(res => res.json())
    .then(data => {
      // console.log("data: " + JSON.stringify(data.players, null, 4));
      setPlayers(data.players);
    })
    .then(setIsLoading(false));
  }, [])

  return (
    <>
      { isLoading &&
        <Loading />
      }
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
