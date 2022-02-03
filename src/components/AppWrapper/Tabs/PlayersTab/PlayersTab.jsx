import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter, SelectTakenPlayerFilter, SelectPositionColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import { getDBPlayers } from '../../../../util/requests';
import Loading from '../../../Loading/Loading';
// import Errors from '../../../Errors/Errors';


export default function PlayersTab({players, setPlayers, draftingNow, setTeams, getLatestData,
    setUserPickingNow, sendChatAnnouncement, user, setPicks, setCurrentPick, setDraftingNow
  }) {
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
      disableSortBy: true,
    },
    {
      Header: 'Availability',
      accessor: 'user',
      id: 'userColumn',
      Filter: SelectTakenPlayerFilter,
      width: '0px',     
      disableSortBy: true,
    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SelectTeamFilter,
      width: '50px',
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
  ]
  const tableState = { 
    hiddenColumns: ['player_id', 'player_key', 'careerGP'],
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
        <Loading text="Loading players..."  />
      }
      { !isLoading &&
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
      }
    </>
  );
}
