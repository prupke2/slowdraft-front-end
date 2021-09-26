import React, { useState } from 'react';
import './AdminTab.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs';
import AddKeeperTab from './AddKeeperTab';
import AddPlayerToDBTab from './AddPlayerToDBTab';
import MakePickTab from './MakePickTab';

export default function AdminTab() {
  // eslint-disable-next-line no-extend-native
  Object.prototype.isEmpty = function () {
    return Object.keys(this).length === 0;
  }
  const [name, setName] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [team, setTeam] = useState('Anh');
  const [positions, setPositions] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('user'));

  return (
    <Tabs defaultIndex={0} className="navbar-tabs inner-navbar-tabs">
      <TabList>
        <Tab>
          <div className="inner-tab">Add player to DB</div>
        </Tab>
        <Tab>
          <div className="inner-tab">Add keeper</div>
        </Tab>
        <Tab>
          <div className="inner-tab">Make pick</div>
        </Tab>
      </TabList>
      <TabPanel>
        <AddPlayerToDBTab
          name={name}
          setName={setName}
          playerId={playerId} 
          setPlayerId={setPlayerId}
          team={team}
          setTeam={setTeam}
          positions={positions}
          setPositions={setPositions}         
        />      
      </TabPanel>
      <TabPanel>
        <AddKeeperTab 
          userInfo={userInfo}
        />      
      </TabPanel>
      <TabPanel>
        <MakePickTab
          userInfo={userInfo}
        />
      </TabPanel>
    </Tabs>
  );
}

