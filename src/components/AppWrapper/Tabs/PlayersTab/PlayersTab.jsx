import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter, SelectPositionColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
// import Errors from '../../../Errors/Errors';


export default function PlayersTab({players, setPlayers, draftingNow, setUserPickingNow, teamName, sendChatAnnouncement}) {
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      Header: 'Player',
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
      Filter: SelectTeamFilter,
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

    const playerDBData = localStorage.getItem('playerDBData');
    
    if (playerDBData) {
      console.log("Using cached data");
      let data = JSON.parse(playerDBData);
      setPlayers(data.players);
      setIsLoading(false);
    }
    else {
      console.log("Getting new player DB data");
      fetch('/get_db_players')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        localStorage.setItem('playerDBData', JSON.stringify(data))
        localStorage.setItem('playerDBUpdate', new Date())
        setPlayers(data.players);
      })
      .then(setIsLoading(false));
    }
  }, [setPlayers])

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
          teamName={teamName}
          sendChatAnnouncement={sendChatAnnouncement}
        />
      }
    </>
  );
}
