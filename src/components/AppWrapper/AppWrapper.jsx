import React from 'react';
import Navbar from './Navbar/Navbar';
import Chat from './Chat/Chat';

export default function AppWrapper({logout, pub, sub, setLoadingText}) {
 
  return (
    <React.Fragment>
      <Navbar 
        logout={logout}
      />
      <Chat 
        pub={pub}
        sub={sub}
        setLoadingText={setLoadingText}
      />
    </React.Fragment>
  );
}
