import React, { useState, useEffect } from 'react';
import { SearchColumnFilter, SelectPlayerTypeColumnFilter, SelectTeamFilter } from '../../../Table/FilterTypes/FilterTypes';
import Table from '../../../Table/Table';
import Loading from '../../../Loading/Loading';


export default function GoaliesTab({goalies, setGoalies, draftingNow, setUserPickingNow, teamName, sendChatAnnouncement}) {
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

    const goalieDBData = localStorage.getItem('goalieDBData');
    
    if (goalieDBData) {
      console.log("Using cached data");
      let data = JSON.parse(goalieDBData);
      setGoalies(data.players);
      setIsLoading(false);
    }
    else {
      console.log("Getting new goalie DB data");
      fetch('/get_db_players?position=G')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        localStorage.setItem('goalieDBData', JSON.stringify(data))
        localStorage.setItem('goalieDBUpdate', new Date())
        setGoalies(data.players);
      })
      .then(setIsLoading(false));
    }
  }, [setGoalies])


  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('/get_db_players?position=G')
  //   .then(res => res.json())
  //   .then(data => {
  //     // console.log("data: " + JSON.stringify(data.players, null, 4));
  //     setGoalies(data.players);
  //   })
  //   .then(setIsLoading(false));
  // }, [])

  return (
    <>
      { isLoading &&
        <Loading />
      }
      { !isLoading &&
        <Table
          data={goalies}
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
