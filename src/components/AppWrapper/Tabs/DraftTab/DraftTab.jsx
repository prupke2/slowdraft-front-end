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
      Cell: row => <div>{
        (row.cell.row.values.draft_pick_timestamp) &&
          <span>
            {(new Date(row.cell.row.values.draft_pick_timestamp).toString()).toLocaleString()}
          </span>
       }</div>,
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
        setCurrentPick(data.current_pick);
      }
      setIsLoading(false);
    }
    else {
      console.log("Getting new draft data");
      fetch('/get_draft')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('draftData', JSON.stringify(data))
        localStorage.setItem('draftDataUpdate', new Date())

        setPicks(data.picks);
        if (typeof(data.current_pick) !== 'undefined') {
          setCurrentPick(data.current_pick);
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
