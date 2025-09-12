import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { offsetMilliseconds } from "../../../../util/requests";
import Emoji from "../../Emoji";

export default function DraftExport({ picks }) {
  const csvLinkRef = useRef();

  // Format picks data for CSV export to match UI rendering
  const csvData = picks?.filter(pick => !pick.disabled).map(pick => ({
    'Pick': pick.overall_pick,
    'Round': pick.round,
    'User': pick.username || '',
    'Team': pick.team || '',
    'Player': pick.player_name || '',
    'Position': pick.position || '',
    'Timestamp': pick.draft_pick_timestamp 
      ? new Date(new Date(pick.draft_pick_timestamp) - offsetMilliseconds).toLocaleString()
      : '',
    'Player ID': pick.player_id || '',
    'Link': pick.player_id ? `https://sports.yahoo.com/nhl/players/${pick.player_id}` : '',
  })) || [];

  const csvHeaders = [
    { label: 'Pick', key: 'Pick' },
    { label: 'Round', key: 'Round' },
    { label: 'User', key: 'User' },
    { label: 'Team', key: 'Team' },
    { label: 'Player', key: 'Player' },
    { label: 'Position', key: 'Position' },
    { label: `Timestamp (${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'})`, key: 'Timestamp' },
    { label: 'Player ID', key: 'Player ID' },
    { label: 'Link', key: 'Link' },
  ];

  const handleDownload = () => {
    csvLinkRef.current.link.click();
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="large-button"
        title="Download CSV of draft picks"
      >
        <Emoji emoji="📥" />&nbsp;
        Download Picks
      </button>
      <CSVLink
        data={csvData}
        headers={csvHeaders}
        ref={csvLinkRef}
        filename={"draft-picks.csv"}
        style={{ display: 'none' }}
      />
    </>
  );
}
