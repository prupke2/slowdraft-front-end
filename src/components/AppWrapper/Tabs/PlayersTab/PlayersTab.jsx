import React from 'react';
import { getLeague } from '../../../../api/yahooApi';

export default function PlayersTab() {
  return (
    <React.Fragment>
      <button onClick={getLeague}>test</button>
    </React.Fragment>
  );
}
