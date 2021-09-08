import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import Loading from '../../../Loading/Loading';
import { getDBGoalies } from '../../../../util/requests';


export default function GoaliesTab({goalies, setGoalies, draftingNow, setTeams, setUserPickingNow, 
  sendChatAnnouncement, user, setPicks, setCurrentPick, setDraftingNow, getLatestData
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
    },
    {
      Header: 'Team',
      accessor: 'team',
      Filter: SelectTeamFilter,
      sortType: 'alphanumeric',
      width: '100px',
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
    // {
    //   Header: 'GA',
    //   accessor: '22',
    //   disableFilters: true,
    //   sortType: 'alphanumeric',
    //   width: '30px',
    //   sortDescFirst: true
    // },
    {
      Header: 'GAA',
      accessor: '23',      
      disableFilters: true,
      sortType: 'alphanumeric',
      width: '30px',
    },
    // {
    //   Header: 'SA',
    //   accessor: '24',
    //   disableFilters: true,
    //   sortType: 'alphanumeric',
    //   width: '30px',
    //   sortDescFirst: true
    // },
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
      getDBGoalies(user, setGoalies);
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
      }
    </>
  );
}
