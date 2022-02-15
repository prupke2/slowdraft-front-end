import React, { useEffect } from 'react';
import './AdminTab.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs';
import AddKeeperTab from './AddKeeperTab';
import AddPlayerToDBTab from './AddPlayerToDBTab';
import MakePickTab from './MakePickTab';
import AddDraftPickTab from './AddDraftPickTab';
import { updateRoute } from '../../../../util/util';

export default function AdminTab() {

  const userInfo = JSON.parse(localStorage.getItem('user'));
  const currentAdminTab = localStorage.getItem('adminTab');

  useEffect(() => {
    updateRoute('admin');
  }, []);

  const tabNameToIndexMap = {
    'add_player': 0,
    'add_keeper': 1,
    'make_pick': 2,
    'add_pick': 3,
  }
  const defaultAdminTab = tabNameToIndexMap[currentAdminTab] || 0;

  return (
    <Tabs defaultIndex={defaultAdminTab} className="navbar-tabs inner-navbar-tabs">
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
        <Tab>
          <div className="inner-tab">Add draft pick</div>
        </Tab>
      </TabList>
      <TabPanel>
        <AddPlayerToDBTab />      
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
      <TabPanel>
        <AddDraftPickTab
          userInfo={userInfo}
        />
      </TabPanel>
    </Tabs>
  );
}

