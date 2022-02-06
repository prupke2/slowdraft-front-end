import React, {useEffect, useState} from 'react';
import Table from '../../../Table/Table';
import Loading from '../../../Loading/Loading';
import { getDraft, getDBGoalies, getDBPlayers, getTeams } from '../../../../util/requests';

export default function DraftTab({user, currentPick, setCurrentPick, picks, setPicks, setTeams,
  setPlayers, setGoalies, draftingNow, setDraftingNow, getLatestData, sendChatAnnouncement
}) {
  const columns = [
    {
      Header: 'Pick',
      accessor: 'overall_pick',
      disableFilters: true,
      width: 10,
      sortDescFirst: false,
      disableSortBy: true,
    },
    {
      Header: 'User',
      accessor: 'username',
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: 'Player',
      accessor: 'player_name',
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: 'Team',
      accessor: 'team',
      width: '30px',
      disableFilters: true,
      disableSortBy: true,
      Cell: row => <div className='team-logo-container'>
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
      width: '30px',
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: <div>{
        <span>
          Timestamp 
          <span className='timezoneInWords'>
            &nbsp;
            ({(Intl.DateTimeFormat().resolvedOptions().timeZone)})
          </span>
        </span>
      }</div>,
      accessor: 'draft_pick_timestamp',
      disableFilters: true,
      width: '50px',
      disableSortBy: true,
      Cell: row => <div>{
        (row.cell.row.values.draft_pick_timestamp) &&
          <span className='draftPickTimestamp'>
            {(new Date(row.cell.row.values.draft_pick_timestamp)).toLocaleString()}
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
    getLatestData();
    let data = {}
    const localDraftData = localStorage.getItem('draftData');
    if (localDraftData && user) {
      console.log("Using cached data");
      data = JSON.parse(localDraftData);
      setPicks(data.picks);
      if (typeof(data.current_pick) !== 'undefined') {
        setCurrentPick(data.current_pick);
        if (currentPick && currentPick.team_key === user.team_key) {
          setDraftingNow(true);
        }
      }
    }
    else {
      console.log("Getting new draft data");
      data = getDraft(setPicks, setCurrentPick, setDraftingNow);
    }
    if (data) {
      setPicks(data.picks);
        if (typeof(data.current_pick) !== 'undefined') {
          setCurrentPick(data.current_pick);
          if (currentPick && currentPick.team_key === user.team_key) {
            setDraftingNow(true);
          }
        }
      }
    setIsLoading(false);

    const localGoalieData = localStorage.getItem('goalieDBData');
    const localPlayerData = localStorage.getItem('playerDBData');
    const playerTeamData = localStorage.getItem('playerTeamData');
    if (!localGoalieData) {
      getDBGoalies(setGoalies);
    } 
    if (!localPlayerData) {
      getDBPlayers(setPlayers);
    } 
    if (!playerTeamData) {
      getTeams(setTeams);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      { isLoading &&
        <Loading text="Loading draft..." />
      }
      { !isLoading &&
        <Table
          data={picks}
          columns={columns}
          tableState={tableState}
          defaultColumn='overall_pick'
          tableType='draftPicks'
          user={user}
          draftingNow={draftingNow}
          currentPick={currentPick}
          setPicks={setPicks}
          setCurrentPick={setCurrentPick}
          setDraftingNow={setDraftingNow}
          sendChatAnnouncement={sendChatAnnouncement}
        />
      }
    </>
  );
}
