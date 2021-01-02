import React, {useEffect, useState} from 'react';
import Table from '../../../Table/Table';
// import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';

export default function DraftTab({setUserPickingNow, setPickExpiry, currentPick, setCurrentPick, picks, setPicks, draftingNow, role}) {

  const columns = [
    {
      Header: 'Pick',
      accessor: 'overall_pick',
      disableFilters: true,
      width: '20px',
      sortDescFirst: false
    },
    {
      Header: 'User',
      accessor: 'username',
      disableFilters: true,
    },
    {
      Header: 'Player',
      accessor: 'player_name',
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
      Header: 'Timestamp',
      accessor: 'draft_pick_timestamp',
      disableFilters: true,
      Cell: row => <div>{Date(row.value).toLocaleString()}</div>,
    },
    {
      accessor: 'player_id'
    },
  ]
  const tableState = { 
    hiddenColumns: ["player_id"],
    sortBy: [
      {
        id: 'overall_pick',
        desc: false
      }
    ]
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const localDraftData = localStorage.getItem('draftData');
    
    if (localDraftData) {
      console.log("Using cached data");
      console.log("localDraftData: " + JSON.stringify(localDraftData, null, 4));
      let data = JSON.parse(localDraftData);
      setPicks(data.picks);
      if (typeof(data.current_pick) !== 'undefined') {
        // setUserPickingNow(data.current_pick);
        // setPickExpiry(data.current_pick.pick_expires);
        setCurrentPick(data.current_pick);
      }
      setIsLoading(false);
    }
    else {
      console.log("Getting new draft data");
      fetch('/get_draft')
      .then(res => res.json())
      .then(data => {
        // console.log("data: " + JSON.stringify(data, null, 4))
        localStorage.setItem('draftData', JSON.stringify(data))
        setPicks(data.picks);
        if (typeof(data.current_pick) !== 'undefined') {
          // setUserPickingNow(data.current_pick);
          // setPickExpiry(data.current_pick.pick_expires);
          setCurrentPick(data.current_pick.round);
        }
      })
      .then(setIsLoading(false));
    }
  }, [setUserPickingNow, setPickExpiry])

  return (
    <>
      { isLoading &&
        <Loading />
      }
      { !isLoading &&
        <Table
          data={picks}
          columns={columns}
          tableState={tableState}
          defaultColumn='overall_pick'
          tableType='draftPicks'
          role={role}
          draftingNow={draftingNow}
          currentPick={currentPick}
        />
      }
    </>
  );
}
