import React, { useEffect, useState } from 'react';
import Loading from '../../../Loading/Loading';
import Table from '../../../Table/Table';
import { getTeams } from '../../../../util/requests';
import { teamIdToLogo, teamsMap } from '../../../../util/util';
import './TeamsTab.css';

export default function TeamTab({user, draftingNow, setTeams, getLatestData}) {
  const teams = JSON.parse(localStorage.getItem('playerTeamData'));
  const teamInfo = JSON.parse(localStorage.getItem('teams'));
  const [teamFilter, setTeamFilter] = useState(user.team_name);
  const [teamId, setTeamId] = useState(user.team_id);

  const [teamPlayerCount, setTeamPlayerCount] = useState(
    teams.filter(team => team.username === teamFilter).length
  );

  useEffect(() => {
    const teamPlayerCount = teams.filter(team => team.username === teamFilter).length;
    setTeamPlayerCount(parseInt(teamPlayerCount, 10));
  }, [teamFilter]);

  const playerColumns = [
    {
      Header: 'Overall Pick',
      accessor: 'overall_pick',
      disableFilters: true,
      Cell: cell => cell.value || '-',
      width: '20px',
    },
    {
      Header: 'Player',
      accessor: 'name',
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: 'Team',
      accessor: 'team',
      width: '50px',
      disableFilters: true,
      disableSortBy: true,
      Cell: cell => <div className='team-logo-container'>
      {
        (cell.value) &&
          <img 
            className='teamLogo' 
            src={`/teamLogos/${cell.value}.png`} 
            alt={cell.value} 
            title={cell.value} 
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
      accessor: 'username'
    },
    {
      accessor: 'player_id'
    },
    {
      accessor: 'is_keeper'
    },
    {
      accessor: 'prospect'
    },
  ]

  const playerTableState = { 
    hiddenColumns: ['player_id', 'is_keeper', 'prospect', 'username'],
    sortBy: [
      {
        id: 'overall_pick',
        desc: false
      }
    ],
    filters: [
      { 
        id: 'username', 
        value: teamFilter
      },
      {
        id: 'position',
        value: ('D', 'LW', 'RW', 'C')
      }
    ]
  }

  const goalieColumns = [
    {
      Header: 'Overall Pick',
      accessor: 'overall_pick',
      Cell: cell => cell.value || '-',
      disableFilters: true,
      width: '20px',
    },
    {
      Header: 'Player',
      accessor: 'name',
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: 'Team',
      accessor: 'team',
      width: '50px',
      disableFilters: true,
      disableSortBy: true,
      Cell: cell => <div className='team-logo-container'>
      {
        (cell.value) &&
          <img 
            className='teamLogo' 
            src={`/teamLogos/${cell.value}.png`} 
            alt={cell.value} 
            title={cell.value} 
          />
      }
      </div>
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
    {
      Header: 'GAA',
      accessor: '23',      
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
      accessor: 'username'
    },
    {
      accessor: 'position'
    },
    {
      accessor: 'player_id'
    },
    {
      accessor: 'is_keeper'
    },
    {
      accessor: 'prospect'
    },
  ]

  const goalieTableState = { 
    hiddenColumns: ['player_id', 'position', 'is_keeper', 'prospect', 'username'],
    sortBy: [
      {
        id: 'overall_pick',
        desc: false
      }
    ],
    filters: [
      { 
        id: 'username', 
        value: teamFilter
      },
      {
        id: 'position',
        value: 'G'
      }
    ]
  }

  const [isLoading, setIsLoading] = useState(true);

  function handleTeamFilterChange(e) {
    const teamSelectFilter = document.getElementById('team-filter-select');
    const teamName = teamSelectFilter.options[teamSelectFilter.selectedIndex].text;
    setTeamId(e.target.value);
    setTeamFilter(teamName);
  }

  useEffect(() => {
    setIsLoading(true);
    getLatestData();
    const playerTeamData = localStorage.getItem('playerTeamData');
    if (playerTeamData && user) {
      console.log("Using cached data");
      let data = JSON.parse(playerTeamData);
      setTeams(data.teams);
      // setTeamFilter(teamName);
    }
    else {
      console.log("Getting new team data");
      if (user) {
        getTeams(setTeams);    
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTeams, user])

  if (isLoading) {
    return <Loading text="Loading teams..." />
  }
  if (!isLoading) {
    console.log("rerendering")
    return (
      <>
        {(teams && teams.length > 0) && 
          <>
            <div className='team-and-logo-wrapper'>
              <img 
                className='logo-teams-page'
                src={teamIdToLogo(teamId)} 
              />
              <div className='team-filter-wrapper'>
                <select
                  defaultValue={user.team_id}
                  id='team-filter-select'
                  value={teamId} 
                  className='change-user-dropdown'
                  onChange={e => handleTeamFilterChange(e)}
                >
                  { teamsMap(teamInfo) }
                </select>
              </div>
            </div>
            <div className='team-header-wrapper'>
              <div className="player-count">
                <div>
                  Total: <span>{teamPlayerCount}</span>
                </div>
                <div>
                  Remaining: <span>{24 - teamPlayerCount}</span> 
                </div>
              </div>
            </div>
            { teams && 
              <h2>Skaters</h2>
            }
            <Table
              user={user}
              data={teams}
              columns={playerColumns}
              tableState={playerTableState}
              defaultColumn='player_id'
              draftingNow={draftingNow} 
              tableType='teams'
              setTeamFilter={setTeamFilter}
            />
            { teams && 
              <h2>Goalies</h2>
            }
            <Table
              user={user}
              data={teams}
              columns={goalieColumns}
              tableState={goalieTableState}
              defaultColumn='player_id'
              draftingNow={draftingNow} 
              tableType='teams'
              setTeamFilter={setTeamFilter}
            />
          </>
        }
        </>
    )
  }
}
