import React, {useEffect, useState} from 'react';
import Table from '../../../Table/Table';
import { SearchColumnFilter } from '../../../Table/FilterTypes/FilterTypes';
import Loading from '../../../Loading/Loading';

export default function DraftTab() {
  const [picks, setPicks] = useState([]);

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
      width: '30px',
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
    fetch('/get_draft')
    .then(res => res.json())
    .then(data => {
      // console.log("data: " + JSON.stringify(data.posts, null, 4));
      setPicks(data.picks);
    })
    .then(setIsLoading(false));
  }, [])

  return (
    <>
      { isLoading &&
        <Loading />
      }
      { !isLoading &&
        <>
          <Table
            data={picks}
            columns={columns}
            tableState={tableState}
            defaultColumn='overall_pick'
            tableType='draftPicks'
          />
        </>
      }
    </>
  );
}
