import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import dummyIcon from '../../assets/dummy_icon.png';
import Logo from './Navbar/Logo';
import NextPick from './NextPick/NextPick';

export default function AppWrapper({logout, pub, sub}) {
  const [userId, setUserId] = useState(null);
  const [teamLogo, setTeamLogo] = useState(dummyIcon);
  const [teamName, setTeamName] = useState('');
  const [userPickingNow, setUserPickingNow] = useState('');
  const [pickExpiry, setPickExpiry] = useState(null);
  const draftingNow = (userPickingNow.user_id === userId) && (typeof(userPickingNow) !== 'undefined');

  function getYahooTeam() {
    fetch('/get_team_session')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setUserId(data.user_id);
        setTeamLogo(data.logo);
        setTeamName(data.team_name);
      });
  }
  
  useEffect(() => {
    if (localStorage.getItem( 'yahooSession' ) !== true) {
      if (!userId) {
        console.log("Getting userId")
        getYahooTeam();
      }
    }
  }, []);

  return (
    <>      
      <Navbar 
        logout={logout}
        setUserPickingNow={setUserPickingNow}
        setPickExpiry={setPickExpiry}
        draftingNow={draftingNow}
      />
      <Logo 
        teamLogo={teamLogo}
        teamName={teamName}
      />
      <NextPick 
        userPickingNow={userPickingNow}
        pickExpiry={pickExpiry}
        draftingNow={draftingNow}
      />
      <Chat 
        pub={pub}
        sub={sub}
        teamName={teamName}
      />
    </>
  );
}
