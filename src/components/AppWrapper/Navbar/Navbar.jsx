import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Navbar.css';
import PlayersTab from '../Tabs/PlayersTab/PlayersTab';
import TeamTab from '../Tabs/TeamTab/TeamTab';
import ForumTab from '../Tabs/ForumTab/ForumTab';
import Modal from 'react-modal';

export default function Navbar({logout}) {

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }

  return (
    <>
      <Tabs defaultIndex={1} className="navbar-tabs">
        <TabList>
          <Tab>Players</Tab>
          <Tab>Team</Tab>
          <Tab>Forum</Tab>
        </TabList>
        <TabPanel>
          <button onClick={openModal}>test</button>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
          >
            <button onClick={closeModal}>close</button>
            <div>I am a modal</div>
          </Modal>
          <PlayersTab />
        </TabPanel>
        <TabPanel>
          <TeamTab />
        </TabPanel>
        <TabPanel>
          <ForumTab />
        </TabPanel>
      </Tabs>
      <button id='logout' onClick={logout}>Logout</button>
    </>
  );
}

