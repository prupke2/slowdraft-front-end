import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import './App.css';
// import { getCookie, setCookie } from './assets/Cookies';

export default function App() {
  // const user = getCookie("user") === null ? setCookie("user") : getCookie("user");
  const [loginStatus, setLoginStatus] = useState(true);

  return (
    <React.Fragment>
      { !loginStatus && (
        <Login 
          loginStatus={loginStatus}
          login={setLoginStatus}
        />
      )}
      { loginStatus && (
        <Navbar />
      )}
    </React.Fragment>
  );
}
