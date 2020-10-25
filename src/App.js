import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login/Login';
import './App.css';
import 'react-tabs/style/react-tabs.css';
import { getCookie, setCookie } from './assets/Cookies';

export default function App() {
  let user = getCookie("user") === null ? setCookie("user") : getCookie("user");

  // const [popoverOpen, setPopoverOpen] = useState(false);
  // const toggle = () => setPopoverOpen(!popoverOpen);
  const [loginStatus, setLoggedIn] = useState(false);

  return (
    <Router>
      <Switch>
        <Route path="/">
          <Login 
            loginStatus={loginStatus}
            login={setLoggedIn}
          />
        </Route>
      </Switch>
    </Router>
  );
}
