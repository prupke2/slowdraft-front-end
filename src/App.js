import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Table from './components/Table/Table';
import './App.css';
import 'react-tabs/style/react-tabs.css';
// import { getCookie, setCookie } from './assets/Cookies';

export default function App() {
  // const user = getCookie("user") === null ? setCookie("user") : getCookie("user");
  // const [popoverOpen, setPopoverOpen] = useState(false);
  // const toggle = () => setPopoverOpen(!popoverOpen);
  const [loginStatus, setLoggedIn] = useState(false);

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/">
            <Login 
              loginStatus={loginStatus}
              login={setLoggedIn}
            />
          </Route>
          <Route exact path="/navbar">
            <Navbar />
            <Table />
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
}
