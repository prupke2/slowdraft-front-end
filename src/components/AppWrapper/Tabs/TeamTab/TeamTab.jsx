import React, { useState } from 'react';
import Table from '../../../Table/Table';
import { useEffect } from 'react';
import Loading from '../../../Loading/Loading';


export default function TeamTab() {
  const empty = {"": ""};
  const [players, setPlayers] = useState([empty]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    fetch(`/get_players`)
    .then(res => res.json())
    .then(data => {
      console.log("data: " + JSON.stringify(data.players, null, 4));
      setPlayers(data.players);
    })
    .then(setIsLoading(false));
  }, [])

  if (isLoading) {
    return <Loading text="Loading your team..." />
  }
  if (!isLoading) {
    return (
      <React.Fragment>
      { (typeof(players) !== "undefined") && (
        <Table
          players = { players }
        />
      )}        
    </React.Fragment>
    )
  }
}
