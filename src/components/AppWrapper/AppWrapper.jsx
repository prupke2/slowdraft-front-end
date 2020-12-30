import React, {useState, useEffect} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';
import dummyIcon from '../../assets/dummy_icon.png';
import Logo from './Navbar/Logo';
import NextPick from './NextPick/NextPick';

export default function AppWrapper({logout, pub, sub}) {
  const [yahooTeamId, setYahooTeamId] = useState(null);
  const [teamLogo, setTeamLogo] = useState(dummyIcon);
  const [teamName, setTeamName] = useState('');
  const [userPickingNow, setUserPickingNow] = useState('');
  const [pickExpiry, setPickExpiry] = useState(null);

  function getYahooTeam() {
    fetch('/get_team_session')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setYahooTeamId(data.user_id);
        setTeamLogo(data.logo);
        setTeamName(data.team_name);
      });
  }
  
  useEffect(() => {
    if (localStorage.getItem( 'yahooSession' ) !== true) {
      if (!yahooTeamId) {
        console.log("Getting yahooTeamId")
        getYahooTeam();
      }
    }
  }, []);

  return (
    <>      
      <Navbar 
        logout={logout}
        userPickingNow={userPickingNow}
        setUserPickingNow={setUserPickingNow}
        pickExpiry={pickExpiry}
        setPickExpiry={setPickExpiry}
      />
      <Logo 
        teamLogo={teamLogo}
        teamName={teamName}
      />
      <NextPick 
        userPickingNow={userPickingNow}
        pickExpiry={pickExpiry}
      />
      {/* <Chat 
        pub={pub}
        sub={sub}
        teamName={teamName}
      /> */}
    </>
  );
}
